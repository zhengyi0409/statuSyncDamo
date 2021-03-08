
/**
 *
 * 代表客户端与服务端的传输模型，代表客户端的属性，服务端更新后将该对象返回客户端。
 * 客户端对象数据
 * 数据和显示是分离的
 */

var DIRECTION =
{
    LEFT: -1,
    RIGHT: 1
};


cc.Class({
    properties: {

    },

    ctor(){
        this.direction = DIRECTION.RIGHT     // 方向
        this.status = "stop"                 // 状态
        this.entity_id = 0                   // id
        this.x = 0;　                        // x 坐标
        this.speed = 100;                    // 速度
        this.position_buffer = [];           // 做帧插值用
    },

    // Apply user's input to this entity.
    applyInput(input) {
        this.x += input.press_time * this.speed

        if(input.press_time == 0){
            this.status = "stop"
        }else{
            this.status = "run"
            if(input.press_time > 0){
                this.direction = DIRECTION.RIGHT
            }else{
                this.direction = DIRECTION.LEFT
            }
        }
    },

});






