/**
 * Created by nhnst on 10/12/15.
 */

if(typeof DEFINE == "undefined"){
    var DEFINE = {
        CAMERA:         "CAMERA",
        PHOTO_ALBUM:    "PHOTO_ALBUM",
        VIBRATION:      "VIBRATION",
        FIASHLIGHT:     "FIASHLIGHT",
        FIASHLIGHTON:   "FIASHLIGHTON",
        FIASHLIGHTOFF:  "FIASHLIGHTOFF",
        PROXIMITY:      "PROXIMITY"
    }
};

var Get_responseData;

var Get_PhotoData;
var Get_PhotoMaxCount = -1;
var Get_PhotoCurrentCount;

(function (){

    function ios(){}

    var JS_HANDLER          = 'HandlerJSAndObject';
    var OC_HANDLER          = 'ObjcCallback';
    window.ios  = ios;
    ios.instance = function(){
        if(!window.ios){
            window.ios = new ios();
        }
        return window.ios;
    };

    ios.sendMessageToObjectC = function(dNode,isHandler){
        connectWebViewJavascriptBridge(function (bridge) {
            if(isHandler == false){
                bridge.send(dNode, function (responseData) {
                    //var json = JSON.parse(responseData);
                    //Get_responseData = json.Type + "...." + json.Type1;
                    Get_responseData = responseData;
                    switch (dNode){
                        case DEFINE_CAMERA:
                            break;
                        case DEFINE_PHOTO_ALBUM:
                            break;
                        case DEFINE_VIB:
                            break;
                        case DEFINE_FIASHLIGHT:
                            break;
                        case DEFINE_PROXIMITY:
                            break;
                    }

                });
            }else{
                bridge.callHandler(isHandler, dNode, function(response) {
                    Get_responseData = response;
                })

            }

        });
    };

    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback(WebViewJavascriptBridge);
            }, false)
        }
    }

    connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
            var isjson = typeof(message) == "object" && Object.prototype.toString.call(message).toLowerCase() == "[object object]" && !message.length;

            var json = JSON.parse(message);

            if(json.Type == "rock"){
                Get_responseData = "time:"+json.time +"  strength:"+ json.strength;
                Platforms.instance().rock();
            }else if(json.Type == "image"){
                Get_PhotoMaxCount = json.data;
                Get_PhotoCurrentCount = 0;
                Get_PhotoData = new Array(Get_PhotoMaxCount);
            }

            responseCallback("get Object C data Success::"+Get_PhotoMaxCount+"::"+Get_PhotoCurrentCount);

        });

        bridge.registerHandler(JS_HANDLER, function(data, responseCallback) {

            cc.loader.loadImg(data, {isCrossOrigin : false }, function(err, img){

                if(Get_PhotoMaxCount == -1){
                    Get_PhotoData = new Array(1);
                    Get_PhotoData[0] = img;
                    Get_PhotoMaxCount = Get_PhotoCurrentCount = 1;
                }else{
                    Get_PhotoData[Get_PhotoCurrentCount] = img;
                    Get_PhotoCurrentCount++;
                }
            });

            responseCallback("send JS_HANDLER Success:");
        });

    });

})();