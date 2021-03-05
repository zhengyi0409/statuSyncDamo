
cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Node,

    },


    onLoad () {
        this.curState = ""
    },

    start () {

    },


    setSkin(color) {
        console.log("setSkin:" + color)
        var ske_com = this.anim.getComponent(sp.Skeleton)
        //ske_com.premultipliedAlpha = false
        color = Utils.PrefixInteger(color, 2)
        ske_com.setSkin(color)
    },

    // 更改状态
    toState(state, cb) {
        if (state == this.curState) return
        this.curState = state
        this.changeState(state, cb)
    },

    changeState(state, cb) {
        console.log("player changeState:" + state)
        var ske_com = this.anim.getComponent(sp.Skeleton)
        ske_com.paused = false
        if (state == "appear") {
            this.appear = true
            ske_com.setAnimation(14, "appear", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "attack") {
            this.appear = true
            ske_com.setAnimation(14, "attack", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "controversy") {
            this.appear = true
            ske_com.setAnimation(14, "controversy", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "corpse") {
            this.appear = true
            ske_com.setAnimation(14, "corpse", false)
            ske_com.setCompleteListener(() => {
                ske_com.clearTrack(13)
                ske_com.paused = true
                if (cb) cb();
            });
        } else if (state == "exile") {
            this.appear = true
            ske_com.setAnimation(14, "exile", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "fall") {
            this.appear = true
            ske_com.setAnimation(14, "fall", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "jump-3") {
            this.appear = true
            ske_com.setAnimation(14, "jump-3", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "jump-4") {
            this.appear = true
            ske_com.setAnimation(14, "jump-4", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "jump-anticipation") {
            this.appear = true
            ske_com.setAnimation(14, "jump-anticipation", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "jump-buffer") {
            this.appear = true
            ske_com.setAnimation(14, "jump-buffer", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "rise") {
            this.appear = true
            ske_com.setAnimation(14, "rise", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "run") {
            ske_com.setAnimation(14, "run", true)
            console.log("player run")
        } else if (state == "stun") {
            this.appear = true
            ske_com.setAnimation(14, "stun", false)
            ske_com.setCompleteListener(() => {
                this.appear = false
                if (cb) cb();
            });
        } else if (state == "walk") {
            ske_com.setAnimation(14, "run", true)
            console.log("player walk")
        } else if (state == "stop") {
            // ske_com.setToSetupPose()
            // ske_com.clearTrack(14)
            ske_com.setAnimation(14, "stay", true)
        }
    },

});
