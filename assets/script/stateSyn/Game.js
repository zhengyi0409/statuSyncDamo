
cc.Class({
    extends: cc.Component,

    properties: {
        clientItem:cc.Prefab,
        serverItem:cc.Prefab, // 客户端本地模拟服务端
        bg:cc.Node,

    },


    onLoad () {
        var clientItem1 = cc.instantiate(this.clientItem);
        clientItem1.parent = this.bg
        clientItem1.position = cc.v2(-this.bg.width / 4,this.bg.height / 4 + 50)
        this.client1 = clientItem1.getComponent("Client");
        this.client1.setTitle("client1")


        var clientItem2 = cc.instantiate(this.clientItem);
        clientItem2.parent = this.bg
        clientItem2.position = cc.v2(-this.bg.width / 4,-this.bg.height / 4 + 50)
        this.client2 = clientItem2.getComponent("Client");
        this.client2.setTitle("client2")


        var serverItem = cc.instantiate(this.serverItem);
        serverItem.parent = this.bg
        serverItem.position = cc.v2(-this.bg.width / 4,50)
        this.server = serverItem.getComponent("Server")
        this.server.connect(this.client1)
        this.server.connect(this.client2)

    },

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                //console.log('Press a key');
                this.client2.key_left = true
                break;
            case cc.macro.KEY.d:
                //console.log('Press d key');
                this.client2.key_right = true
                break;
            case cc.macro.KEY.left:
                //console.log('Press left key');
                this.client1.key_left = true
                break;
            case cc.macro.KEY.right:
                //console.log('Press right key');
                this.client1.key_right = true
                break;
        }
    },

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                //console.log('release a key');
                this.client2.key_left = false
                this.client2.key_right = false
                break;
            case cc.macro.KEY.d:
                //console.log('release d key');
                this.client2.key_left = false
                this.client2.key_right = false
                break;
            case cc.macro.KEY.left:
                //console.log('release left key');
                this.client1.key_left = false
                this.client1.key_right = false
                break;
            case cc.macro.KEY.right:
                //console.log('release right key');
                this.client1.key_left = false
                this.client1.key_right = false
                break;
        }
    }

    //update (dt) {},
});
