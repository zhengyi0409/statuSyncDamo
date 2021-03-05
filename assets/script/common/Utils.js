/**
 * 工具类
 */

'use strict';

Array.prototype.unique = function () {
    let o = {},
        i, l = this.length,
        r = [];
    for (i = 0; i < l; i++) o[this[i]] = this[i];
    for (i in o) r.push(o[i]);
    return r;
};

window.Utils = {};
Utils.uuid = 0;

//保留几位小数
Utils.fixedFloat = function (num, fixed) {
    let param = fixed ? Math.pow(10, fixed) : 100;
    return Math.floor(num * param) / param;
};

//前面补0格式化format
//num数字int，length长度
//例如传入(7,3) 得到007
//传入(0,3) 得到000
Utils.PrefixInteger = function (num, length) {
    return (Array(length).join('0') + num).slice(-length);
};

//获取当前时间戳(毫秒)
Utils.getTime = function () {
    let now = new Date().getTime();
    return parseInt(now);
};

//得到时间戳（精确到秒）
Utils.getTimeSec = function () {
    let now = new Date().getTime() / 1000;
    return parseInt(now);
};


// 本地计算获取服务器时间，几秒的误差
Utils.getTrueTime = function () {
    var time = Utils.getTimeSec() + window.sevClientDif
    return time
};

Utils.toTime = function (time, type) {
    // let data = new Date(time * 1000);
    // let times;
    // let Year = data.getFullYear();
    // let Mon = Utils.doubleDigit(data.getMonth() + 1);
    // let Dat = Utils.doubleDigit(data.getDate());
    // let Hour = Utils.doubleDigit(data.getHours());
    // let Min = Utils.doubleDigit(data.getMinutes());
    // let Sec = Utils.doubleDigit(data.getSeconds());
    //
    // if (type == 1) {
    //     times = Year + "-" + Mon + "-" + Dat;
    // } else if (type == 2) {
    //     times = Year + "年" + Mon + "月" + Dat + "日";
    // } else if (type == 3) {
    //     times = Year + "-" + Mon + "-" + Dat + " " + Hour + ":" + Min;
    // } else if (type == 4) {
    //     times = Year + "-" + Mon + "-" + Dat + " " + Hour + ":" + Min + ":" + Sec;
    // } else if (type == 5) {
    //     times = Hour + ":" + Min;
    // } else if (type == 6) {
    //     times = Mon + "-" + Dat + " " + Hour + ":" + Min + ":" + Sec;
    // } else if (type == 7) {
    //     times = Year + "/" + Mon + "/" + Dat + " " + Hour + ":" + Min;
    // } else if (type == 8) {
    //     times = Hour + ":" + Min + ":" + Sec;
    // } else if (type == 9) {
    //     times = Dat + "天" + Hour + "小时"
    // }
    // return times;

    var s = time
    var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;

    if (type == "wishPool") {
        if (day != 0) {
            return day + "天" + hour + "小时"
        } else if (hour != 0) {
            return hour + "小时"
        } else if (minute != 0) {
            return minute + "分钟"
        } else if (second != 0) {
            return second + "秒"
        } else {
            return 0;
        }
    } else {
        if (day != 0) {
            return day + "天" + hour + "时" + minute + "分" + second + "秒";
        } else if (hour != 0) {
            return hour + "时" + minute + "分" + second + "秒";
        } else if (minute != 0) {
            return minute + "分" + second + "秒";
        } else if (second != 0) {
            return second + "秒";
        } else {
            return 0;
        }
    }

};



Utils.showTime = function (val) {
    if (val < 60) {
        return "00:" + Utils.doubleDigit(val);
    } else {
        var min_total = Math.floor(val / 60); // 分钟
        var sec = Math.floor(val % 60); // 余秒
        if (min_total < 60) {
            return Utils.doubleDigit(min_total) + ":" + Utils.doubleDigit(sec);
        } else {
            var hour_total = Math.floor(min_total / 60); // 小时数
            var min = Math.floor(min_total % 60); // 余分钟
            return Utils.doubleDigit(hour_total) + ":" + Utils.doubleDigit(min) + ":" + Utils.doubleDigit(sec);
        }
    }
}

Utils.doubleDigit = function (num) {
    let n = parseInt(num);
    if (n < 10) {
        n = "0" + n;
    }
    return n;
};

/*
 * param str 要截取的字符串
 * param len 要截取的字节长度，注意是字节不是字符，一个汉字两个字节
 * return 截取后的字符串
 */

Utils.setString = function (str, len) {
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            strlen += 1.5;
        } else {
            strlen++;
        }
        s += str.charAt(i);
        if (strlen >= len) {
            return s + "...";
        }
    }
    return s;
}

Utils.getStrLength = function (str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        let a = str.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 4;
        } else {
            len += 1;
        }
    }
    return len;
};

Utils.parseName = function (maxLength, text) {
    let count = 0;
    let curL = 0;

    if (text == null) {
        text = "";
    }

    for (let i = 0; i < text.length; i++) {
        if ((text[i] >= '0' && text[i] < '9') || (text[i] >= 'a' && text[i] <= 'z')) {
            count += 1;
            // curL += 1;
            curL += 2;
            if (curL <= maxLength * 2) {
                continue;
            } else {
                if (curL > maxLength * 2) {
                    count -= 1;
                }

                break;
            }
        } else if (text[i] >= 'A' && text[i] <= 'Z') {
            count += 1;
            // curL += 1.5;
            curL += 2;
            if (curL <= maxLength * 2) {
                continue;
            } else {
                if (curL > maxLength * 2) {
                    count -= 1;
                }
                break;
            }
        } else if (text[i] >= 0 && text[i] <= 127) {
            count += 1;
            // curL += 1;
            curL += 2;
            if (curL < maxLength * 2) {
                continue;
            } else {
                if (curL > maxLength * 2) {
                    count -= 1;
                }
                break;
            }
        } else {
            count += 1;
            curL += 2;
            if (curL <= maxLength * 2) {
                continue;
            } else {
                if (curL > maxLength * 2) {
                    count -= 1;
                }
                break;
            }
        }
    }

    let tBuf = "";
    for (let j = 0; j < count; j++) {
        tBuf += text[j];
    }

    if (curL >= maxLength * 2) {
        if (tBuf == text) {
            return text;
        }
        return tBuf + "...";
    } else {
        return text;
    }
};

// 判断变量是否为字符串
Utils.isString = function (obj) {
    return typeof obj === 'string';
}


Utils.isEmptyObject = function (obj) {
    if (obj == null || obj.length == 0) {
        return true
    } else {
        for (var name in obj) {
            return false;
        }
        return true;
    }
};

//判断字符串是否全为数字
Utils.isInteger = function (str) {
    return str % 1 === 0;
};

//隐藏手机号码中间4位
Utils.hideMobilePhone = function (str) {
    let s1 = str.substr(0, 3);
    let s2 = str.substr(7, 4);
    return s1 + "****" + s2;
};

// 用来遍历指定对象所有的属性名称和值
Utils.scanArray = function (obj) {
    let props = "";
    for (let p in obj) {
        if (typeof (obj[p]) == 'array' || typeof (obj[p]) == 'object') {
            Utils.scanArray(obj[p]);
        } else {
            props += p + " = " + obj[p] + " \n ";
        }
    }
    AU.log(props);
};

//随机 返回 min（包含）～ max（包含）之间的数字
Utils.random = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//打乱数组顺序
Utils.shuffleArray = function (arr) {
    arr.sort(function () {
        return (0.5 - Math.random());
    });
};

//阿拉伯数字转换为罗马数字string
Utils.toRomeNum = function (num) {
    var ans = "";
    var k = Math.floor(num / 1000);
    var h = Math.floor((num % 1000) / 100);
    var t = Math.floor((num % 100) / 10);
    var o = num % 10;
    var one = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    var ten = ['X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
    var hundred = ['C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM']
    var thousand = 'M';
    for (var i = 0; i < k; i++) {
        ans += thousand;
    }
    if (h)
        ans += hundred[h - 1];
    if (t)
        ans += ten[t - 1];
    if (o)
        ans += one[o - 1];
    return ans;
}

//阿拉伯数字转中文数字
Utils.NoToChinese = function (num) {
    if (!/^\d*(\.\d*)?$/.test(num)) {
        alert("Number is wrong!");
        return "Number is wrong!";
    }
    var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
    var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
    var a = ("" + num).replace(/(^0*)/g, "").split("."),
        k = 0,
        re = "";
    for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
            case 0:
                re = BB[7] + re;
                break;
            case 4:
                if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                    re = BB[4] + re;
                break;
            case 8:
                re = BB[5] + re;
                BB[7] = BB[5];
                k = 0;
                break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        k++;
    }
    if (a.length > 1) //加上小数部分(如果有小数部分)
    {
        re += BB[6];
        for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
    }
    return re;
};

//是否为整数
Utils.isInt = function (str) {
    return Math.floor(str) == str;
};

//加密
Utils.encryption = function (str, key) {
    let str1 = '';
    for (let i = 0; i < str.length; i++) {
        let s = str.charCodeAt(i) ^ key;
        str1 += String.fromCharCode(s);
    }
    return str1;
};

Utils.filterEmoji = function (str) {
    if (typeof str != "string") return;
    let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;

    let ret_str = str.replace(regStr, "*");
    return ret_str;
};

//去空格
Utils.trim = function (str) {
    str = str.replace(/^(\s|\u00A0)+/, '');
    for (let i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
};

//对象长度(获取对象的成员个数)
Utils.arrayCount = function (o) {
    let t = typeof o;
    if (t == 'string') {
        return o.length;
    } else if (t == 'object') {
        let n = 0;
        for (let i in o) {
            n++;
        }
        return n;
    }
    return 0;
};

//数组删除指定元素
Utils.removeByValue = function (arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
};

//数组去重
Utils.repeatArray = function (array) {
    let hash = [],
        arr = [];
    for (let i = 0; i < array.length; i++) {
        hash[array[i]] != null;
        if (!hash[array[i]]) {
            arr.push(array[i]);
            hash[array[i]] = true;
        }
    }
    return arr;
};

//在一个数组随机取几个不重复的值
Utils.getArrayItems = function (arr, num) {
    let temp_array = new Array();
    for (let index in arr) {
        temp_array.push(arr[index]);
    }
    let return_array = new Array();
    for (let i = 0; i < num; i++) {
        if (temp_array.length > 0) {
            let arrIndex = Math.floor(Math.random() * temp_array.length);
            return_array[i] = temp_array[arrIndex];
            temp_array.splice(arrIndex, 1);
        } else {
            break;
        }
    }
    return return_array;
};

//随机种子
Utils.seededRandom = function (seed, _min, _max) {
    Math.seed = seed;
    Math.seededRandom = function (min, max) {
        max = max || 1;
        min = min || 0;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        let rnd = Math.seed / 233280.0;
        return min + rnd * (max - min);
    };
    return Math.seededRandom(_min, _max);
};

//指定位置替换字符串 //allstr:原始字符串，start,开始位置,end：结束位置，changeStr:改变后的字
Utils.changeStr = function (allstr, start, end, changeStr) {
    return allstr.substring(0, start - 1) + changeStr + allstr.substring(end, allstr.length);
}



// 通用唯一识别码
Utils.generateUUID = function () {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
Utils.base64encode = function (str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

// type 0=系统头像，1=网络头像
Utils.creatHeadImg = function (type, image, function_call) {
    //AU.clog("Utils.creatHeadImg type:" + type + " image:" + image)
    if (type == null || Number.isNaN(type) || image == null || Number.isNaN(image)) {
        var color = "loading/img/dt_tx_" + Utils.PrefixInteger(1, 2)
        cc.loader.loadRes(color, cc.SpriteFrame, (err, sp) => {
            if (!err) {
                function_call(sp)
            }
        })
    } else if (type == 0) {
        var color = "loading/img/dt_tx_" + Utils.PrefixInteger(image, 2)
        cc.loader.loadRes(color, cc.SpriteFrame, (err, sp) => {
            if (!err) {
                function_call(sp)
            }
        })
    } else {
        cc.loader.load({
            url: image,
            type: 'jpg'
        }, (error, texture) => {
            if (error) {
                AU.clog("图片下载失败");
                //Utils.creatHeadImg(type, image, function_call);
            } else {
                AU.clog("图片下载成功");
                // AU.log(texture)
                if (function_call) {
                    var frame = new cc.SpriteFrame(texture)
                    function_call(frame);
                }
            }
        });
    }
}

// 游戏坐标转换为广告坐标
Utils.switchPositionToAds = function (x, y, w, h) {
    var frameSize = cc.view.getFrameSize();
    console.log("----------------------------------  游戏屏幕 frameSize width = " + frameSize.width + ",height = " + frameSize.height);
    console.log("----------------------------------  游戏屏幕 winSize width = " + cc.winSize.width + ",height = " + cc.winSize.height);

    // 左上角坐标
    var left_x = cc.winSize.width / 2 - w / 2
    var left_y = cc.winSize.height / 2 - y - h / 2

    // 比率
    var coe_w = frameSize.width / cc.view.getDesignResolutionSize().width;
    var coe_h = frameSize.height / cc.view.getDesignResolutionSize().height;

    var coe_w1 = frameSize.width / cc.winSize.width;
    var coe_h1 = frameSize.height / cc.winSize.height;

    var pos = {}
    pos.x = left_x * coe_w1
    pos.y = left_y * coe_h1
    pos.w = w * coe_w
    pos.h = h * coe_h

    return pos
}

/**
 * 对比 a.a.a和b.b.b谁大
 * 1:ver1>ver2
 * -1:ver1<ver2
 * 0:ver1==ver2
 */
Utils.compareVer = function (ver1, ver2) {
    console.log("compareVer")
    console.log(ver1);
    console.log(ver2)
    if (!ver2) {
        return 1;
    }
    var arr1 = ver1.split(".");
    var arr2 = ver2.split(".");
    if (arr1[0] == arr2[0]) {
        if (arr1[1] == arr2[1]) {
            if (arr1[2] == arr2[2]) {
                return 0;
            } else {
                return arr1[2] - arr2[2] > 0 ? 1 : -1;
            }
        } else {
            return arr1[1] - arr2[1] > 0 ? 1 : -1;
        }
    } else {
        return arr1[0] - arr2[0] > 0 ? 1 : -1;
    }
}

Utils.getUUid = function () {
    return ++Utils.uuid;
}

Utils.secondToDate = (second) => {
    var h = Math.floor(second / 3600) < 10 ? '0' + Math.floor(second / 3600) : Math.floor(second / 3600);
    var m = Math.floor((second / 60 % 60)) < 10 ? '0' + Math.floor((second / 60 % 60)) : Math.floor((second / 60 % 60));
    var s = Math.floor((second % 60)) < 10 ? '0' + Math.floor((second % 60)) : Math.floor((second % 60));

    if (second > 3600) {
        return h + ":" + m + ":" + s;
    } else {
        return m + ":" + s;
    }
}

Utils.clone = function (arr1) {
    var arr2 = [];
    for (var i = 0; i < arr1.length; i++) {
        arr2.push(arr1[i]);
    }
    return arr2
}

/**
 * 权重处理
 * @param {*} weights 权重数组
 */
Utils.getWeight = (weights) => {
    let temp = Utils.clone(weights);
    let weightSum = 0;

    for (let i = 0; i < temp.length; i++) {
        weightSum += temp[i];
        temp[i] = weightSum;
    }

    let random = Utils.random(1, weightSum);
    let id = 0;
    for (let i = 0; i < temp.length; i++) {
        if (random <= temp[i]) {
            id = i;
            break;
        }
    }
    return id;
}

/*********** amongus ************/
//获取方位信息
Utils.getFwInfo = (data) => {
    let CurrentDire = 'K'
    let currentAngle = Utils.getCalculaAngle(data);

    AU.log("currentAngle", currentAngle)

    if (currentAngle <= 22.5 && currentAngle >= 0 || currentAngle <= 360 && currentAngle >= 337.5) //0;左
        CurrentDire = "A";
    else if (currentAngle <= 67.5 && currentAngle >= 22.5) //45;左上
        CurrentDire = "WA";
    else if (currentAngle <= 112.5 && currentAngle >= 67.5) //90;上
        CurrentDire = "W";
    else if (currentAngle <= 157.5 && currentAngle >= 112.5) //135;右上
        CurrentDire = "WD";
    else if (currentAngle <= 202.5 && currentAngle >= 157.5) //180;右
        CurrentDire = "D";
    else if (currentAngle <= 247.5 && currentAngle >= 202.5) //225;右下
        CurrentDire = "SD";
    else if (currentAngle <= 292.5 && currentAngle >= 247.5) //270;下
        CurrentDire = "S";
    else if (currentAngle <= 337.5 && currentAngle >= 292.5) //315;左下
        CurrentDire = "SA";
    return CurrentDire

}
//角度转换180
Utils.getCalculaAngle = (data) => {
    let currentAngleX = data.x * 90 + 90; //X轴 当前角度
    let currentAngleY = data.y * 90 + 90; //Y轴 当前角度
    if (currentAngleY < 90) {
        if (currentAngleX < 90) {
            return 270 + currentAngleY;
        } else if (currentAngleX > 90) {
            return 180 + (90 - currentAngleY);
        }
    }
    return currentAngleX;
}

//根据两点位置判断方位
Utils.getDir = (pos, pos1) => {
    let dir = "";
    if (pos.x > pos1.x && pos.y > pos1.y) {
        dir = "WD";
    } else if (pos.x > pos1.x && pos.y < pos1.y) {
        dir = "SD";
    } else if (pos.x == pos1.x && pos.y > pos1.y) {
        dir = "W";
    } else if (pos.x < pos1.x && pos.y == pos1.y) {
        dir = "A";
    } else if (pos.x == pos1.x && pos.y < pos1.y) {
        dir = "S";
    } else if (pos.x > pos1.x && pos.y == pos1.y) {
        dir = "D";
    } else if (pos.x < pos1.x && pos.y > pos1.y) {
        dir = "WA";
    } else if (pos.x < pos1.x && pos.y < pos1.y) {
        dir = "SA";
    }

    return dir;
}

Utils.getAngle = (start, end) => {
    let len_y = end.y - start.y;
    let len_x = end.x - start.x;

    let tan_yx = tan_yx = Math.abs(len_y) / Math.abs(len_x);
    let angle = 0;
    if (len_y > 0 && len_x < 0) {
        angle = Math.atan(tan_yx) * 180 / Math.PI - 90;
    } else if (len_y > 0 && len_x > 0) {
        angle = 90 - Math.atan(tan_yx) * 180 / Math.PI;
    } else if (len_y < 0 && len_x < 0) {
        angle = -Math.atan(tan_yx) * 180 / Math.PI - 90;
    } else if (len_y < 0 && len_x > 0) {
        angle = Math.atan(tan_yx) * 180 / Math.PI + 90;
    }
    return -Math.round(angle);
}

//两点距离
Utils.getDistance = (pos1, pos2) => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

// 取文件名
Utils.getFileName = (str) => {
    if (str) {
        var pos = str.lastIndexOf("/");
        return str.substring(pos + 1);
    } else {
        return ""
    }
}


/**
 * 参数 diffValue  时间戳
 *
 */
Utils.getDate = function (diffValue) {
    var minute = 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;

    var nowTime = Utils.getTimeSec(); //获取当前时间戳

    var ShiJianCha = nowTime - diffValue;

    var monthC = ShiJianCha / month;
    var weekC = ShiJianCha / (7 * day);
    var dayC = ShiJianCha / day;
    var hourC = ShiJianCha / hour;
    var minC = ShiJianCha / minute;
    var res = '';

    if (monthC >= 12) {
        var oldTime = nowTime - diffValue      // 获取记录的时间戳
        var date = new Date(oldTime);
        res = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    } else if (monthC >= 1) {
        res = parseInt(monthC) + "个月前";
    }
    else if (weekC >= 1) {
        res = parseInt(weekC) + "周前"
    }
    else if (dayC >= 1) {
        res = parseInt(dayC) + "天前"
    }
    else if (hourC >= 1) {
        res = parseInt(hourC) + "小时前"
    }
    else if (minC >= 1) {
        res = parseInt(minC) + "分钟前"
    } else {
        res = "刚刚"
    }
    return res;
}



//节点点击缩放的动作
Utils.nodePressScaleAni = function (node) {
    if (node) {
        node.runAction(cc.sequence(
            cc.scaleTo(0.1, 0.9),
            cc.scaleTo(0, 1)
        ));
    }
}


//刘海屏判断
//包括原生、H5
Utils.isIPhoneX = function () {
    if (cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.platform == cc.sys.QQ_PLAY) {
        if (PLATFORM === "qq") {
            // let screenHeight = qq.getSystemInfoSync().screenHeight
            // let bottom = qq.getSystemInfoSync().safeArea && qq.getSystemInfoSync().safeArea.bottom//编辑器上拿不到safeArea，手机上可以
            // console.log("qqliuhai", screenHeight !== bottom);
            // return screenHeight !== bottom

            //改为安全区域top判断(注：safeArea:qq上用top，wx上用left)
            let left = wx.getSystemInfoSync().safeArea && wx.getSystemInfoSync().safeArea.top;
            if (!left) left = 0;
            console.log("qqliuhai left", left);
            if (left > 10) {
                return true
            }

        } else {
            // let screenHeight = wx.getSystemInfoSync().screenHeight
            // let bottom = wx.getSystemInfoSync().safeArea && wx.getSystemInfoSync().safeArea.bottom
            // console.log("wxliuhai", screenHeight !== bottom);
            // return screenHeight !== bottom

            //改为安全区域left判断
            let left = wx.getSystemInfoSync().safeArea && wx.getSystemInfoSync().safeArea.left;
            if (!left) left = 0;
            console.log("wxliuhai left", left);
            if (left > 10) {
                return true
            }
        }
    } else {
        //原生
        if (cc.sys.isNative) {
            return GameCallPlatform.HasBangs();
        }
    }

    return false;
}

//等比缩放，适配背景
Utils.fitBgUniformScale = function (bg) {
    if (bg) {
        let winSize = cc.winSize;
        let scaX = winSize.width / bg.width;
        let scaY = winSize.height / bg.height;
        // AU.log("scaX",scaX);
        // AU.log("scaY",scaY);

        if (scaX > scaY) {
            bg.setScale(scaX);
        } else {
            bg.setScale(scaY);
        }
    }
}

Utils.trackEvent = function (id) {
    if (PLATFORM == "qq" || PLATFORM == "wx") {
        try {
            wx.uma.trackEvent(id);
        } catch (error) {

        }
    } else if (PLATFORM == "android") {
        GameCallPlatform.youmengEvent(id);
    }
}

//随机字符串
Utils.randomString = function (e) {
    e = e || 16;
    let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) {
        n += t.charAt(Math.floor(Math.random() * a));
    }
    return n
}

//获取多语言配置的文字，传id
Utils.getLanguageStr = function (id) {
    // for (let i = 0; i < AU.languageConfig.length; i++) {
    //     const element = AU.languageConfig[i];
    //     if (element.id == id) {
    //         if (0 === AU.LANGUAGE_TYPE) {
    //             return element.chinese;
    //         } else if (1 === AU.LANGUAGE_TYPE) {
    //             return element.english;
    //         }
    //     }
    // }

    var id = Number(id) - 10001
    const element = AU.languageConfig[id]
    if (element) {
        if (0 === AU.LANGUAGE_TYPE) {
            return element.chinese;
        } else if (1 === AU.LANGUAGE_TYPE) {
            return element.english;
        }
    } else {
        return "";
    }
}

//根据id获取道具配置
Utils.getItemConfig = function (id) {
    for (let i = 0; i < AU.itemConfig.length; i++) {
        const element = AU.itemConfig[i];
        if (element.id == id) {
            return element;
        }
    }

    return null;
}

//根据id获取道具名字
Utils.getItemName = function (id) {
    id = Number(id);
    let name = "";
    let itemConfig = this.getItemConfig(id);
    if (!itemConfig) {
        return name;
    } else {
        return this.getLanguageStr(itemConfig.itemName);
    }
}

//传入id，返回角色系列
Utils.getSeriesById = function (id) {
    id = Number(id);
    if (id == 5054 || id == 5055 || id == 5056 || id == 5003 || id == 5043 || id == 5044) {
        return 1;//魔法生物系列
    } else if (id == 5057 || id == 5058 || id == 5059 || id == 5060 || id == 5045 || id == 5049) {
        return 2;//新春限定系列
    }

    return 0;//城堡守卫系列
},

    //根据道具id获取角色spine配置
    Utils.getRoleSpineConfig = function (id, star) {
        star = star || 1;
        let config = AU.dressConfig[id] || AU.dressConfig[5001];
        if (config[star]) {
            return config[star];
        } else {
            return config[1];//星级错误了，返回1星配置，避免报错啦 
        }
    }

//根据道具id获宠物动画名字
Utils.getPetSkinName = function (id) {
    let name = AU.petConfig[id] || AU.petConfig[5004];
    return name;
}

//根据角色id和星级获取角色属性配置
Utils.getRoleAttrCfg = function (id, star) {
    for (let i = 0; i < AU.roleConfig.length; i++) {
        if (id == AU.roleConfig[i].itemID && star == AU.roleConfig[i].star) {
            return AU.roleConfig[i];
        }

    }
    return AU.roleConfig[0];//查不到就返回1星默认角色配置
}

//根据角色id、星级、属性类型 返回 属性值百分比加成
//skill:0：无技能 1：移动速度加成 2：视野范围加成
Utils.getRoleAttrBySkill = function (id, star, skill) {
    let config = this.getRoleAttrCfg(id, star);
    if (skill == config.skill) {
        //有该属性加成
        return config.skillAdd;
    } else {
        //无该属性加成，返回加成0
        return 0;
    }
}

// 置灰
Utils.set_grey = function (node) {
    var s = node.getComponentsInChildren(cc.Sprite);
    for (var i = 0; i < s.length; i++) {
        var newMaterial = cc.Material.createWithBuiltin(cc.Material.BUILTIN_NAME.GRAY_SPRITE, 0);
        s[i].setMaterial(0, newMaterial); //给精灵添加新材质
    }
}


// 字符串分割，s 分割符
Utils.splitStr = function (str, s) {
    var string;
    string = str.split(s);
    return (string);
}

//判断是否是h5平台,包括rpk
Utils.isMiniGame = function () {
    let ret = PLATFORM == "wx" || PLATFORM == "qq" || PLATFORM == "oppo_mini" || PLATFORM == "vivo_mini" || PLATFORM == "huawei_mini";
    return ret;
}

Utils.genNum = function (num) {
    if (num < 1000000) {
        return num;
    } else {
        return (num / 1000000).toFixed(0) + "M";
    }
}

//展示类
Utils.syncADEvent = function (id) {
    HttpRequest.getInstance().httpRequest(AU.php_cmd.CMD_SYNC_AD_EVENT, "/au-record/record", { scene: id }, (respone) => {
        if (respone.code == 200) {
        }
    }, true);
}

//视频类
Utils.syncStatisticsData = function () {
    if (PLATFORM != "wx") {
        return;
    }
    let Ukey2 = require("../util/Ukey2");
    let data = JSON.stringify(Ukey2);
    HttpRequest.getInstance().httpRequest(AU.php_cmd.CMD_SYNC_STATISTICS_DATA, "/au-record/rvideo", { scene: data }, (respone) => {
        if (respone.code == 200) {
            AU.log("上报成功")
            //重置数据
            for (let k in Ukey2) {
                let v = Ukey2[k];
                for (let m in v) {
                    v[m] = 0;
                }
            }
        }
    }, true);
}

//添加打点统计
Utils.addEventCount = function (id, type) {
    if (PLATFORM != "wx") {
        return;
    }
    let Ukey = require("../util/Ukey2");
    let data1 = Ukey[id];
    if (!data1) return;

    if (!data1.hasOwnProperty(type.toString())) return;
    data1[type]++;
}
