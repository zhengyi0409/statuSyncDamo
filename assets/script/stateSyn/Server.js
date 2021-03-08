
/** =============================================================================
    The Server. 主要持有客户端以及客户端的状态
    =============================================================================
**/
var Network = require("Network")
var Entity = require("Entity")


cc.Class({
    extends: cc.Component,

    properties: {
        play:cc.Prefab,
        view:cc.Node,
    },

    onLoad(){
        // Connected clients and their entities.
        this.clients = [];
        this.entities = [];

        // Last processed input for each client
        this.last_processed_input = [];

        // Simulated network connection.
        this.network = new Network()

        // Default update rate.
        this.setUpdateRate(10)
    },


    // 即为将自己与各个客户端绑定，同时初始化各个玩家的相关数据。
    connect(client) {
        // Give the Client enough data to identify itself.
        client.server = this;
        client.entity_id = this.clients.length          // 实体的唯一ID。由服务器在连接时分配
        this.clients.push(client);


        // Create a new Entity for this Client
        var entity = new Entity()
        this.entities.push(entity)
        entity.entity_id = client.entity_id;

        // Set the initial state of the Entity (e.g. spawn point)
        var spawn_points = [0,50] // 初始坐标
        entity.x = spawn_points[client.entity_id]
    },


    // 处理客户端的输入,而非键盘事件,然后将更新结果返回给各个客户端。
    setUpdateRate(hz) {
        this.update_rate = hz;
        clearInterval(this.update_interval)
        this.update_interval = setInterval(
            (function(self) { return function() { self.serveUupdate(); }; })(this),
            1000 / this.update_rate);
    },


    serveUupdate() {
        this.processInputs();
        this.sendWorldState();
        //renderWorld(this.canvas, this.entities);
    },


    validateInput(input) {
        if (Math.abs(input.press_time) > 1/40) {
            return false;
        }
        return true;
    },


    // 更新服务端的客户端状态模型，更新最后一次确认号。并在空余时间更新UI显示。
    processInputs() {
        // Process all pending messages from clients.
        while (true) {
            var message = this.network.receive();
            if (!message) {
                break;
            }

            // Update the state of the entity, based on its input.
            // We just ignore inputs that don't look valid; this is what prevents clients from cheating.
            if (this.validateInput(message)) {
                var id = message.entity_id;
                this.entities[id].applyInput(message);
                this.last_processed_input[id] = message.input_sequence_number;
            }
        }

    },


    // 将广播客户端状态模型更新给各个客户端。根据服务端的更新频率广播
    sendWorldState() {
        // Gather the state of the world. In a real app, state could be filtered to avoid leaking data
        // (e.g. position of invisible enemies).
        var world_state = [];
        var num_clients = this.clients.length;
        for (var i = 0; i < num_clients; i++) {
            var entity = this.entities[i];
            world_state.push({entity_id: entity.entity_id,
                position: entity.x,
                status:entity.status,
                direction:entity.direction,
                last_processed_input: this.last_processed_input[i]});
        }

        // Broadcast the state to all the clients.
        for (var i = 0; i < num_clients; i++) {
            var client = this.clients[i];
            client.network.send(client.lag, world_state);
        }
    }


});







