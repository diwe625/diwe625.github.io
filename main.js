/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

cc.game.onStart = function(){
    //cc.loader.resPath = cc.game.config["resPath"];//设置资源路径
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    // Pass true to enable retina display, disabled by default to improve performance
    if(cc.sys.os == cc.sys.OS_IOS)
        cc.view.enableRetina(true);
    else
        cc.view.enableRetina(false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    if(cc.sys.isMobile && window.innerWidth  >= window.innerHeight ){
        Utility.isFromLandscape = 1;
        Utility.swapToRotationImg();
    }

    // Setup the resolution policy and design resolution size
    cc.view.setDesignResolutionSize(750, 1334 - 108, cc.ResolutionPolicy.FIXED_WIDTH);//1294

    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    if(contentNumber)
        SceneController.instance().gotoScene(contentNumber);
    else
        SceneController.instance().gotoScene(GAME_TYPE.MajorityVote);

    if(window.sessionStorage.getItem("firstStart") != 1){//已push过的就不再push
        window.sessionStorage.setItem("firstStart", 1);
        History.pushState({state:1}, "便利屋", "?state=benriya");
    }else{//已经push过的就不用再push
        var benriyaStr = "?state=benriya";
        var pageStr = History.getPageUrl();
        var allLength = pageStr.length;
        if(pageStr.substr(allLength - 1,1) === "/"){//去掉最后带的斜杠的服务器名字
            pageStr = pageStr.substr(0,allLength - 1);
            allLength = pageStr.length;
        }
        var bLength = benriyaStr.length;
        var subStr = pageStr.substr(allLength - bLength,bLength);
        if(subStr != benriyaStr)
            History.pushState({state:1}, "便利屋", benriyaStr);
    }

    Utility.isPortrait.sW1 = window.innerWidth;
    Utility.isPortrait.sH1 = window.innerHeight;

    //var xhr = cc.loader.getXMLHttpRequest();
    //// Simple events
    //['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
    //    xhr["on" + eventname] = function () {
    //        cc.log("::::"+"\nEvent : " + eventname);
    //        //label.string += "\nEvent : " + eventname
    //    }
    //});

    if(0){//点击back按钮事件
        History.Adapter.bind(window,'statechange',function(){//添加到主屏幕时，无效
            var State = History.getState();
            if(State.title === ""){
                History.go(1);
                if(window.changeState_cb)
                    window.changeState_cb(window.changeState_context);
                }
        });
    }else{
        window.addEventListener('popstate', function(e){
            if(e.state == null){
                //History.go(1);
                if(window.changeState_cb)
                    window.changeState_cb(window.changeState_context);
            }
        }, false);
    }

};
cc.game.run();