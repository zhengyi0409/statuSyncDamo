
/**
 *
 * 矩形投影
 *
 * 前置技能：三角函数，向量
 * light光源点
 * cube是矩形,draw用来绘制投影
 * 移动光源
 *
 *
 */

cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.beginMove, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.lightPointMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.cancleMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.cancleMove, this);
    },

    start () {
        this.drawLightPoint()
    },


    //绘制光点
    drawLightPoint: function(){
        let graphics = this.node.getComponent(cc.Graphics);
        graphics.fillColor = new cc.Color().fromHEX('#FFF300');   // 设置或返回笔触的颜色
        graphics.strokeColor = new cc.Color().fromHEX('#FFF300'); // 设置或返回填充绘画的颜色
        graphics.circle (0, 0, 10);
        graphics.fill();
        graphics.stroke();
    },

    beginMove: function(){
        this._isMove = true;
    },


    lightPointMove: function(e){
        let touchX = e.getLocationX();
        let touchY = e.getLocationY();

        let windowSize=cc.winSize;

        // let moveX = touchX - (this.node.x + 0.5 * canvasX);
        // let moveY = touchY - (this.node.y + 0.5 * canvasY);

        let worldOriginPosition = this.node.parent.convertToWorldSpaceAR(cc.v2(touchX, touchY));
        let nodePosition = this.node.parent.convertToNodeSpaceAR(worldOriginPosition);

        this.node.x = nodePosition.x-0.5*windowSize.width;
        this.node.y = nodePosition.y-0.5*windowSize.height;
    },

    cancleMove: function(){
        this._isMove = false;
    }


    // update (dt) {},
});
