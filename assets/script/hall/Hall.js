
cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {
        cc.debug.setDisplayStats(false);
    },

    start () {

    },

    changeScene(){
        cc.director.loadScene("game");
    },

});
