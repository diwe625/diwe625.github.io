/**
 * Created by shuang on 15. 12. 16..
 */

var Utility = cc.Class.extend({});

Utility.isFromLandscape = 0;//检测是否从横屏进入 0:正常  1:横屏进入  2: 游戏中
Utility.checkRfresh = false;//检测是否重新定义屏幕高度
Utility.siLoadingFile = false;//读取图片，显示Loading界面
/*
* 横屏游戏
* state:
*       0，不是横屏游戏
*       1，不可以游戏
*       2，可以游戏
*       3，退出横屏
* sW1:竖屏宽度
* sH1:竖屏高度
* sW2:横屏宽度
* sH2:横屏高度
* */
Utility.isPortrait = {state:0,sW1:null,sH1:null,sW2:null,sH2:null,isFixedH:false};

Utility.getRandom = function getRandom(min, max) {
    return Math.random() * (max - min) + min;
};

// @return {integer} a random int between min and max
Utility.getRandomInt = function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

Utility.getPlusOrMinus = function getPlusOrMinus() {
    return Math.random() > 0.5 ? 1 : -1;
};

Utility.setMainUrl = function () {

    if(1){
        if(!this.check){
            this.check = true;
            var currentUrl = window.location.href;
            if(currentUrl.indexOf("alpha-") != -1){
                window.location.href = "http://alpha-game.touch.hangame.co.jp/benriya/index.nhn";
            }else if(currentUrl.indexOf("beta-") != -1){
                window.location.href = "http://beta-game.touch.hangame.co.jp/benriya/index.nhn";
            }else if(currentUrl.indexOf("Bennriya") != -1){
                window.location.href = "http://alpha-game.touch.hangame.co.jp/benriya/index.nhn";
            }else{
                window.location.href = "http://game.touch.hangame.co.jp/benriya/index.nhn";
            }
        }else{
            location.reload();
        }
    }else{
        if(!this.check){
            this.check = true;
            History.back(2);
            context.scheduleOnce(function(){
                location.reload();
            },0.1);
        }
    }

};

Utility.addCommas = function (nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

Utility.setPlusRotation = function (sprite, plus) {
    sprite.setRotation(sprite.getRotation() - plus);
};

Utility.setPlusPositionX = function (sprite, plus) {
    var pos = sprite.getPosition();
    sprite.setPosition(cc.p(pos.x + plus, pos.y));
};

Utility.setPlusPositionY = function (sprite, plus) {
    var pos = sprite.getPosition();
    sprite.setPosition(cc.p(pos.x, pos.y + plus));
};

Utility.convertFromARToNode = function (pos, node) {
    var contentSize = node.getContentSize();
    var anchPos = node.getAnchorPoint();
    var x = pos.x + contentSize.width * anchPos.x;
    var y = pos.y + contentSize.height * anchPos.y;

    return cc.p(x, y);
};

Utility.setDesignSize = function (type) {
    if (MGGame.g.winSize.width != cc.winSize.width ||
        MGGame.g.winSize.height != cc.winSize.height) {
        MGGame.g.winSize.width = cc.winSize.width;
        MGGame.g.winSize.height = cc.winSize.height;
        ///resize all layer
        cc.eventManager.dispatchCustomEvent(MGGame.e.SCREEN_RESIZE, null);
    }
};

Utility.setDesignSizeLandscape = function(){
    if (cc.sys.isMobile) {
        if (window.innerWidth >= window.innerHeight) {
            var dRate = 1334 / 750;
            var winRate = window.innerWidth / window.innerHeight;
            var dWidth = null;
            var dHeight = null;

            if (winRate > dRate) {
                dWidth = 750 * winRate;
                dHeight = 750;
            } else {
                dWidth = 1334;
                dHeight = 1334 / winRate;
            }
        } else {
            dWidth = window.innerWidth;
            dHeight = window.innerHeight;
        }

        cc.view.setDesignResolutionSize(dWidth, dHeight, cc.ResolutionPolicy.SHOW_ALL);
    } else {
        cc.view.setDesignResolutionSize(1334, 750, cc.ResolutionPolicy.SHOW_ALL);
    }
    Utility.setDesignSize();
};

Utility.setDesignSizePortrait = function(){
    if (cc.sys.isMobile) {
        if (window.innerWidth <= window.innerHeight) {
            var dRate = 750 / 1118;
            var winRate = window.innerWidth / window.innerHeight;
            var dWidth = null;
            var dHeight = null;

            if (winRate >= dRate) {
                dWidth = 1118 * winRate;
                dHeight = 1118;
            } else {
                dWidth = 750;
                dHeight = 750 / winRate;
            }
        } else {
            dWidth = window.innerWidth;
            dHeight = window.innerHeight;
        }

        cc.view.setDesignResolutionSize(dWidth, dHeight, cc.ResolutionPolicy.SHOW_ALL);
    } else {
        cc.view.setDesignResolutionSize(750, 1118, cc.ResolutionPolicy.SHOW_ALL);
    }
    //Utility.setDesignSize();
};


Utility.swapToGame = function () {
    var canvas = document.getElementById("Cocos2dGameContainer");
    var add = "";
    if(!Utility.isIOS9() && cc.sys.os == cc.sys.OS_IOS)add = "s";
    var orietation_img = document.getElementById("orietation_img" + add);
    orietation_img.style.display = "none";
    canvas.style.display = "block";
};

Utility.swapToRotationImg = function () {
    var canvas = document.getElementById("Cocos2dGameContainer");
    var add = "";
    if(!Utility.isIOS9() && cc.sys.os == cc.sys.OS_IOS)add = "s";
    var orietation_img = document.getElementById("orietation_img" + add);
    orietation_img.style.display = "block";
    if(Utility.isIphone6p() || cc.sys.os == cc.sys.OS_ANDROID){
        orietation_img.style.height = window.innerHeight+"px";
        orietation_img.style.width = window.innerWidth+"px";
        orietation_img.style.lineHeight = window.innerHeight+"px";
        orietation_img.style.verticalAlign = "middle";
    }
    canvas.style.display = "none";
};

Utility.isIOS9 = function () {
    if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
        // 判断系统版本号是否大于 9
            return Boolean(navigator.userAgent.match(/OS [9,10,11,12]_\d[_\d]* like Mac OS X/i));
    } else {
        return false;
    }
};

Utility.isIphone6p = function () {//iphone6+
    if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
        if(window.innerWidth == 375 || window.innerWidth == 667 || window.innerWidth == 414 || window.innerWidth == 736){
            return true;
        }else {
            return false;
        }
    }else {
        return false;
    }
};

Utility.getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

Utility.returnTopPage = function() {
    var soundFlagQuery = "&soundflag=" + MGGame.g.userData.getSoundFlag();
    window.location.href = cc.game.config["topPage"]  + soundFlagQuery;
};

Utility.base64_encode = function(str){
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var i = 0, len= str.length, string = '';

    while (i < len){
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len){
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt((c1 & 0x3) << 4);
            string += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len){
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            string += base64EncodeChars.charAt((c2 & 0xF) << 2);
            string += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        string += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return string
};

Utility.buttonBackColorText = function(bTxt,x,y,size,color,backView,selector){
    var btn = new ccui.Button();
    btn.setContentSize(size);
    btn.setAnchorPoint(0.5, 0);
    btn.setPosition(x, y);
    btn.setScale9Enabled(true);
    btn.setTouchEnabled(true);
    btn.addClickEventListener(selector);
    backView.addChild(btn);

    var btnBack = new cc.LayerColor(color, btn.getContentSize().width,btn.getContentSize().height);
    btnBack.setPosition(0, 0);
    btn.addChild(btnBack);

    var btnText = new cc.LabelTTF(bTxt);
    btnText.setFontName(GAME_FONT.PRO_W6);
    btnText.setFontSize(26);
    btnText.setFontFillColor(cc.color.WHITE);
    btnText.setAnchorPoint(0.5, 0.5);
    btnText.setPosition(btn.getContentSize().width/2, btn.getContentSize().height/2);
    btn.addChild(btnText);

    return btn;
};

Utility.sendXhr = function(gameid){
    var url = "";
    var currentUrl = window.location.href;
    if(currentUrl.indexOf("alpha-") != -1){
        url =  "alpha-";
    }else if(currentUrl.indexOf("beta-") != -1){
        url =  "beta-";
    }else if(currentUrl.indexOf("Bennriya") != -1){
        return;
    }else{
        url =  "";
    }

    var os = "pc";
    var user = navigator.userAgent;

    if(user.indexOf("iPhone") > 0){
        os = "ios";
    }else if(user.indexOf("Android") > 0){
        os = "aos";
    }

    var xhr = cc.loader.getXMLHttpRequest();

    var sedgameid = "?gameid="+gameid;//

    var value = Utility.base64_encode(gameid+",0,"+os);

    xhr.open("GET", "http://"+url+"minigame.hangame.co.jp/api/gameStartHistory.nhn"+sedgameid+"&para="+value, true);

    //cc.log("http://"+url+"minigame.hangame.co.jp/api/gameStartHistory.nhn"+sedgameid+"&para="+value);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            var httpStatus = xhr.statusText;
            var response = xhr.responseText.substring(0, 100) + "...";
            //cc.log(":::"+"GET" + " Response (100 chars):\n");
            //cc.log("::"+response);
            //cc.log(":::::"+"\nStatus: Got " + "GET" + " response! " + httpStatus);
        }
    };

    xhr.send();
};

Utility.setTitle_thumbnails = function(index){
    document.title = index.description;

    var baseUrl = History.getBaseUrl();

    var path = cc.game.config["resPath"];

    var precomposedElements = document.querySelectorAll("link[rel='apple-touch-icon-precomposed']");

    var normalTouchIconLength = precomposedElements.length;
    var currentElement;

    for (var i =0; i < normalTouchIconLength;i++) {
        currentElement = precomposedElements[i];
        var outer;//180x180, 57x57, 72x72, 114x114, 144x144
        if (currentElement.hasAttribute('sizes')) {
            var outer =  currentElement.outerHTML;
            if(outer.indexOf("57x57") > 0){
                currentElement.href = baseUrl + path + "res/icons/"+index.icon+"57.png";
            }else if(outer.indexOf("72x72") > 0){
                currentElement.href = baseUrl + path + "res/icons/"+index.icon+"72.png";
            }else if(outer.indexOf("114x114") > 0){
                currentElement.href = baseUrl + path + "res/icons/"+index.icon+"114.png";
            }else if(outer.indexOf("144x144") > 0){
                currentElement.href = baseUrl + path + "res/icons/"+index.icon+"144.png";
            }
        } else {
            currentElement.href = baseUrl + path + "res/icons/"+index.icon+"180.png";
        }

        //var info = {'sizes':size, 'rel': currentElement.rel, 'href': currentElement.href};
        //cc.log(currentElement);
    }

};

