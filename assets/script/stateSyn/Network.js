
/**
 *
 * 模拟网络连接，其中message数组用于装客户端或者服务端的消息，初始化时，
 * 模拟建立连接时就是客户端与服务端互相持有对方的Network 引用，
 * 从而实现数据的模拟传输。这里服务端发送数据时加上数据的延迟，
 * 并在客户端判断其时间小于当前时间时才能处理，从而实现模拟延迟的效果。
 *
 */

cc.Class({
    properties: {

    },

    ctor(){
        this.messages = [];
    },

    // "Send" a message. Store each message with the timestamp when it should be received, to simulate lag.
    send(lag_ms,message) {
        this.messages.push({recv_ts:+ new Date() + lag_ms,payload:message});
    },

    // Returns a "received" message, or undefined if there are no messages availabl yet
    receive(){
        var now = + new Date();
        for(var i = 0; i < this.messages.length; i++){
            var message = this.messages[i];
            if(message.recv_ts <= now){
                this.messages.splice(i,1);
                return message.payload;
            }
        }
    }

});


