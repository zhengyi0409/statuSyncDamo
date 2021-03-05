
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        //先拿到光点和矩形上的graphics  这个脚本是挂在draw节点上的
        let scene = cc.director.getScene()
        this.lightPoint = scene.getChildByName('Canvas').getChildByName('light')
        this.graphics = this.node.getComponent(cc.Graphics)

        this.drawShadow()
    },

    start () {

    },

    //绘制阴影
    drawShadow(){
        let graphics = this.graphics
        graphics.clear()                            //每次绘制前都要先清除，这样才能动态绘制
        graphics.fillColor.fromHEX('#00000096');
        let cube = this.node.parent                //拿到矩形的节点

        //将光源点的坐标转换成在同一层上的相对坐标，先转世界坐标再转相对坐标
        let lightPosition = cc.v2(this.lightPoint.x, this.lightPoint.y)
        let worldPosition = this.lightPoint.parent.convertToWorldSpaceAR(lightPosition)
        let lightPositionInLayer = this.node.convertToNodeSpaceAR(worldPosition)

        //计算出矩形四个角的坐标
        let corner1 = cc.v2(-cube.anchorX * cube.width, -cube.anchorY * cube.height)
        let corner2 = cc.v2(-cube.anchorX * cube.width, cube.anchorY * cube.height)
        let corner3 = cc.v2(cube.anchorX * cube.width, cube.anchorY * cube.height)
        let corner4 = cc.v2(cube.anchorX * cube.width, -cube.anchorY * cube.height)

        //计算两个点的向量(方法)
        let getVector = (p1, p2) => cc.v2(p2.x - p1.x, p2.y - p1.y);

        //计算出光源点到矩形四个点的向量
        let vector1 = getVector(lightPositionInLayer, corner1);
        let vector2 = getVector(lightPositionInLayer, corner2);
        let vector3 = getVector(lightPositionInLayer, corner3);
        let vector4 = getVector(lightPositionInLayer, corner4);

        //求向量的模
        let getLong = (p) => Math.sqrt(p.x * p.x + p.y * p.y)
        //求向量的余弦
        let getCosValue = (v1, v2) => {
            let numUp = v1.x * v2.x + v1.y * v2.y  //分子，不会拼
            let numDown = getLong(v1) * getLong(v2) //分母， 不会拼
            return numUp / numDown
        }

        //用数组把上面的东西存起来，后面可能会用到
        let pointArr = []
        let vectorArr = []
        let cosValueArr = []

        pointArr.push(corner1, corner2, corner3, corner4)
        vectorArr.push(vector1, vector2, vector3, vector4)

        //我们已经拿到四个向量了，下面要做的就是两两求出向量的夹角
        //为什么要求余弦函数在0-pi 是单调递减的，只要求出余弦，就能比较向量间夹角的大小
        //这里两两求向量的余弦，然后把两个向量的下标都存起来
        for(let i=0; i<vectorArr.length; i++){
            for(let j=i+1; j<vectorArr.length; j++){
                let cosValue = getCosValue(vectorArr[i], vectorArr[j])
                let item = {
                    index1:i,
                    index2:j,
                    cosValue:cosValue
                }
                cosValueArr.push(item)
            }
        }

        //对求出的余弦值进行排序
        cosValueArr = cosValueArr.sort((a, b) => a.cosValue - b.cosValue);

        //先填充一个矩形
        // graphics.moveTo(corner1.x, corner1.y);
        // graphics.lineTo(corner2.x, corner2.y);
        // graphics.lineTo(corner3.x, corner3.y);
        // graphics.lineTo(corner4.x, corner4.y);
        // graphics.fill()

        //上面我们进行向量余弦求值的时候，把数组下标也存起来了，现在可以很方便地拿出来用
        let index1 = cosValueArr[0].index1
        let index2 = cosValueArr[0].index2

        //这里是画了一个梯形，把夹角最大的两个向量，延长10倍画出来
        graphics.moveTo(pointArr[index1].x, pointArr[index1].y)
        graphics.lineTo(vectorArr[index1].mul(10).x, vectorArr[index1].mul(10).y)
        graphics.lineTo(vectorArr[index2].mul(10).x, vectorArr[index2].mul(10).y)
        graphics.lineTo(pointArr[index2].x, pointArr[index2].y)
        graphics.close()
        graphics.fill()

    },

    update (dt) {
        this.drawShadow()
    },

});
