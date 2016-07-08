/**
 * Created by dyfox on 15-10-16.
 */
(function (){

    function Platforms(){

    }

    Platforms.prototype.rockCallbacks = {};
    Platforms.prototype.sensorValue = { x : 0, y : 0, z : 0};

    Platforms.instance = function(){
        if(!window.platforms){
            window.platforms = new Platforms();
        }
        return window.platforms;
    };

    /**
     * 震动
     * @param duration [关闭时间，持续时间, ...]
     * 例  Platforms.instance().vibrate([200, 500, 200, 500]);   震动 停顿200ms 震动500ms 停顿200ms 震动500ms
     * 为适配android设备 参数最少为两个  且第一个是停顿时间   例如单纯震动一秒  参数为 [0， 1000]
     */
    Platforms.prototype.vibrate = function(duration){
       if(cc.sys.os == cc.sys.OS_ANDROID){
            window.bridge.vibrate(duration);
       }else if(cc.sys.os == cc.sys.OS_IOS){
           ios.instance().sendMessageToObjectC(DEFINE.VIBRATION,false);
       }
    };

    Platforms.prototype.log = function(info){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            window.bridge.log(info);
        }
    };

    /**
     * 摇动  供摇手机触发事件时native调用 所触发事件需要事先通过 addRockCallback 注册回调函数
     */
    Platforms.prototype.rock = function(){
        for(var i in this.rockCallbacks){
            var callback = this.rockCallbacks[i];
            if(callback){
                callback();
            }
        }
    };

    /**
     * 加速传感器 供native调用 周期性频繁调用  xyz三轴
     * @param x
     * @param y
     * @param z
     */
    Platforms.prototype.sensor = function(x, y, z){
        this.sensorValue.x = x;
        this.sensorValue.y = y;
        this.sensorValue.z = z;
    };

    Platforms.prototype.openCamera = function(){
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            window.bridge.openCamera();
        }else if(cc.sys.os == cc.sys.OS_IOS){
            ios.instance().sendMessageToObjectC(DEFINE.CAMERA,false);
        }
    };

    /**
     * led闪光灯
     * @param open true=开灯 false=关灯
     */
    Platforms.prototype.flashLight = function(open){
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            if(open){
                window.bridge.processOnFlash();
            }else{
                window.bridge.processOffFlash();
            }
        }else if(cc.sys.os == cc.sys.OS_IOS){
            if(open){
                ios.instance().sendMessageToObjectC(DEFINE.FIASHLIGHTON,false);
            }else{
                ios.instance().sendMessageToObjectC(DEFINE.FIASHLIGHTOFF,false);
            }

        }
    };

    /**
     * 为摇一摇注册触发回调函数
     * @param name
     * @param callback
     */
    Platforms.prototype.addRockCallback = function (name, callback){
        this.rockCallbacks[name] = callback;
    };

    /**
     * 如果不需要某个已注册的回调 务必remove
     * @param name
     */
    Platforms.prototype.removeRockCallback = function (name){
        this.rockCallbacks[name] = null;
    };

    window.Platforms = Platforms;

})();