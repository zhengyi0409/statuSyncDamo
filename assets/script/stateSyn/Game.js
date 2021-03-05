
cc.Class({
    extends: cc.Component,

    properties: {
        client:cc.Prefab,
        server:cc.Prefab, // 客户端本地模拟服务端
        bg:cc.Node,

    },


    onLoad () {
        let client1 = cc.instantiate(this.client);
        client1.parent = this.bg
        client1.position = cc.v2(-this.bg.width / 4,this.bg.height / 4 + 50)
        let script1 = client1.getComponent("Client");
        script1.setTitle("client1")


        let client2 = cc.instantiate(this.client);
        client2.parent = this.bg
        client2.position = cc.v2(-this.bg.width / 4,-this.bg.height / 4 + 50)
        let script2 = client2.getComponent("Client");
        script2.setTitle("client2")


        let server = cc.instantiate(this.server);
        server.parent = this.bg
        server.position = cc.v2(-this.bg.width / 4,50)
        server.getComponent("Server").connect(script1)
        server.getComponent("Server").connect(script2)

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
                console.log('Press a key');
                break;
            case cc.macro.KEY.d:
                console.log('Press d key');
                break;
            case cc.macro.KEY.left:
                console.log('Press left key');
                break;
            case cc.macro.KEY.right:
                console.log('Press right key');
                break;
        }
    },

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                console.log('release a key');
                break;
            case cc.macro.KEY.d:
                console.log('release d key');
                break;
            case cc.macro.KEY.left:
                console.log('release left key');
                break;
            case cc.macro.KEY.right:
                console.log('release right key');
                break;
        }
    }
    //update (dt) {},
});
