/**
 *
 * The Client. 持有相关启用功能的bool值等，以及持有的本地关于各个客户端的状态信息this.entities = {};
 * 客户端
 *
 */

var Network = require("Network")
var Entity = require("Entity")

cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        play:cc.Prefab,
        view:cc.Node,
    },

    onLoad(){
        console.log("client onLoad")
        // Local representation of the data entities. 本地数据对象
        this.entities = {};

        // 本地实体对象(用来显示UI)
        this.plays = {}


        this.clientName = ""

        // input state
        this.key_left = false;
        this.key_right = false;

        // Simulated network connection. 模拟网络连接
        this.network = new Network();
        this.server = null;
        this.lag = 0; // 单向发送数据延迟时长

        // Unique ID of our entity. Assigned by Server on connection.
        // 我们实体的唯一ID。由服务器在连接时分配
        this.entity_id = null;

        // Data needed for reconciliation 协调
        this.client_side_prediction = false;  // 客户端预测
        this.server_reconciliation = false;   // 服务端协调
        this.input_sequence_number = 0;        // input序列号
        this.pending_inputs = [];              // 将所有未收到回复但已经发送给服务器的输入用于预测(待服务端确认队列)

        // Entity interpolation toggle. 插值开关
        this.entity_interpolation = false;


        // Update rate 设置频率
        this.setUpdateRate(50);
    },

    setTitle(str){
        this.clientName = str
        this.title.string = str
    },

    // setInterval用来保证隔一定的间隔调用Client的Update
    setUpdateRate(hz) {
        this.update_rate = hz;
        clearInterval(this.update_interval);
        this.update_interval = setInterval( (function (self) {
            return function () {
                self.clientUpdate();
            };
        })(this),1000 / this.update_rate);
    },



    // Update Clinet state.
    clientUpdate() {
        // Listen to the server.
        this.processServerMessages();

        // Not connected yet
        if(this.entity_id == null){
            return
        }

        // Process inputs
        this.processInputs();

        // Interpolate other entitise.  Entity 插值
        if(this.entity_interpolation){
            this.interpolateEntities();
        }

        // Render the World.
        this.renderWorld(this.entities);
    },


    renderWorld(entities){
        for (var i in entities) {
            var entity = entities[i];
            if(!this.plays[entity.entity_id]){
                console.log(this.clientName + " create " + entity.entity_id)
                let node = cc.instantiate(this.play);
                node.parent = this.view
                if(entity.entity_id == 0){
                    node.getComponent("Play").setSkin(1)
                }else{
                    node.getComponent("Play").setSkin(6)
                }
                this.plays[entity.entity_id] = node
            }
            var play = this.plays[entity.entity_id]
            play.getComponent("Play").toState(entity.status)
            play.x = entity.x
        }
    },

    // Get inputs and send them to the server.
    // If enabled, do client-side prediction.
    // 将输入的信息封装后发送给服务端，若启用客户端预测则直接移动。并将当前输入放到待服务端确认的队列中。
    processInputs() {
        // Compute delta time since last update
        var now_ts = + new Date()
        var last_ts = this.last_ts || now_ts;
        var dt_sec = (now_ts - last_ts) / 1000.0; // 两帧之间的时间差
        this.last_ts = now_ts

        // Package player's input
        var input;
        if(this.key_right){
            input = {press_time:dt_sec}
        }else if(this.key_left){
            input = {press_time:-dt_sec}
        }else{
            // Nothing interesting happened.
            return
        }

        // Send the input to the server.
        input.input_sequence_number = this.input_sequence_number ++;
        input.entity_id = this.entity_id
        this.server.network.send(this.lag,input)  // 模拟网络，客户端使用this.server.network.send 发送数据，服务端使用this.server.network.receive()接受数据

        // Do client-side prediction
        // 执行客户端预测
        if(this.client_side_prediction){
            this.entities[this.entity_id].applyInput(input)
        }

        // Save this input for later reconciliation
        this.pending_inputs.push(input);
    },

    // 存储或者更新服务端发送过来的状态
    // 如果是本客户端自身的状态，若启用服务端协调,则删除服务端确认前的操作，客户端预测后面未确认的操作。
    // 若是其他客户端，则看是否启用插值，启用插值则将当前时间与位置添加到 entity.position_buffer中，方便后面插值操作
    processServerMessages() {
        while (true){
            var message = this.network.receive() // 模拟网络，服务端使用this.network.send 发送数据，客户端使用this.network.receive()接受数据
            if(!message){
                break;
            }

            // world state is a list of entity states.
            for(var i = 0; i < message.length; i++){
                var state = message[i];

                // If this is the first time we see this entity, create a local representation.
                if(!this.entities[state.entity_id]){
                    var entity = new Entity()
                    entity.entity_id = state.entity_id
                    this.entities[state.entity_id] = entity
                }

                var entity = this.entities[state.entity_id]
                if(state.entity_id == this.entity_id){
                    // Received the authoritative position of this client's entity.
                    entity.x = state.position;

                    if(this.server_reconciliation) {
                        // Server Reconciliation. Re-apply all the inputs not yet processed by the server
                        // 将所有未收到回复但已经发送给服务器的输入用于预测
                        // 当更新的服务器状态到达时，预测的客户端状态将从更新的状态和客户端发送的输入但服务器尚未确认的位置重新计算
                        var j = 0;
                        while (j < this.pending_inputs.length) {
                            var input = this.pending_inputs[j]
                            if (input.input_sequence_number <= state.last_processed_input) {
                                // Already processed. Its effect is already taken into account into the world update
                                // we just got, so we can drop it.
                                this.pending_inputs.splice(j, 1)
                            } else {
                                // Not processed by the server yet. Re-apply it.
                                entity.applyInput(input)
                                j++;
                            }
                        }
                    }else{
                        // Reconciliation is disabled, so drop all the saved inputs.
                        this.pending_inputs = [];
                    }
                }else{
                    // Received the position of an entity other than this client's.
                    if(!this.entity_interpolation){
                        // Entity interpolation is disabled - just accept the server's position.
                        entity.x = state.position;
                    }else{
                        // Add it to the position buffer
                        // 当前时间与位置添加到 entity.position_buffer中，方便后面插值操作
                        var timestamp = + new Date();
                        entity.position_buffer.push([timestamp,state.position]);
                    }
                }
            }
        }
    },


    // 对于不是本玩家则插值，这也就是为什么-玩家看到的是现在的自己，看到的是过去的其他玩家。
    // 插值的实现为，将当前时间调到一个服务器周期前 var render_timestamp = now - (1000.0 / server.update_rate);然后在这个时刻找到，前一个和后一个状态。然后在这两个状态间进行线性插值。
    // 服务端发送数据有一定频率，在没有数据过来时，客户端继续将当前时间调到一个服务器周期前，然后在这个时刻找到前一个和后一个状态，然后在这两个状态间进行线性插值。
    interpolateEntities() {
        // Compute render timestamp
        var now = +new Date();
        // 将当前时间调到一个服务器周期前
        var render_timestamp = now - (1000.0 / this.server.update_rate);

        // 然后在这个时刻找到，前一个和后一个状态。然后在这两个状态间进行线性插值
        for(var i in this.entities){
            var entity = this.entities[i]

            // no point in interpolating this client's entity
            if(entity.entity_id == this.entity_id){
                continue
            }

            var buffer = entity.position_buffer

            // Drop older positions(删掉最前面的点)
            while(buffer.length >= 2 && buffer[1][0] <= render_timestamp){
                buffer.shift()
            }

            // Interpolate between the two surrounding authoritative positions（线性插值）
            if(buffer.length >= 2 && buffer[0][0] <= render_timestamp && render_timestamp <= buffer[1][0]){
                var x0 = buffer[0][1]
                var x1 = buffer[1][1]

                var t0 = buffer[0][0]
                var t1 = buffer[1][0]

                entity.x = x0 + (x1 - x0) * (render_timestamp - t0) / (t1 - t0);
            }
        }
    }

});










