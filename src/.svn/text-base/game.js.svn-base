/**
 * Created by shuang on 15. 12. 23..
 */

(function detectRotation(global) {

    var previousWidth = global.innerWidth;
    var previousHeight = global.innerHeight;
    var onResize = function () {
        //console.log("sW1H1=="+Utility.isPortrait.sW1+"::"+Utility.isPortrait.sH1);
        //console.log("::"+global.innerWidth+"::"+global.innerHeight+"::"+Utility.isPortrait.sW2+"::"+Utility.isPortrait.sH2+"::"+Utility.isPortrait.state);
        if(Utility.isPortrait.state > 0 && Utility.isPortrait.state != 3){
            if (global.innerWidth > global.innerHeight) {
                Utility.isPortrait.state = 2;
            }else
                Utility.isPortrait.state = 1;
        }else{
            if (cc.sys.isMobile) {
                //if(previousHeight != global.innerHeight){
                //    previousWidth = global.innerWidth;
                //    previousHeight = global.innerHeight;
                    if(Utility.isFromLandscape == 1){//restart
                        Utility.isFromLandscape = 0;
                        setTimeout(function () {
                            location.reload();
                        }, 150);
                    }else {
                        if (global.innerWidth < global.innerHeight) {
                            // portrait
                            cc.director.setNextDeltaTimeZero(true);
                            if(Utility){
                                Utility.swapToGame();
                                setTimeout(function () {
                                    //cc.view.setDesignResolutionSize(750, 1334 - 108, cc.ResolutionPolicy.FIXED_WIDTH);//1294
                                }, 150);
                            }
                        } else {
                            //landscape
                            if(Utility){
                                Utility.swapToRotationImg();
                            }

                        }

                    }
                //}
            }
        }





        //setTimeout(function () {
        //    if(Utility.isPortrait.state > 0 && Utility.isPortrait.state != 3){
        //        if(Utility.isPortrait.sW2 == null){
        //            if (global.innerWidth < global.innerHeight) {
        //                console.log("11");
        //                Utility.isPortrait.state = 1;
        //            } else {
        //                console.log("22");
        //                Utility.isPortrait.state = 2;
        //            }
        //        }else{
        //            if((Math.abs(Utility.isPortrait.sH1 - global.innerWidth)<= 100) && (Math.abs(Utility.isPortrait.sH2 - global.innerHeight)<= 54*2)/*bar é«åº¦*/){
        //                console.log("33");
        //                Utility.isPortrait.state = 2;
        //            }else{
        //                console.log("44");
        //                Utility.isPortrait.state = 1;
        //            }
        //
        //        }
        //        console.log("：："+global.innerWidth+"::"+global.innerHeight+"::"+Utility.isPortrait.sW2+"::"+Utility.isPortrait.sH2+"::"+Utility.isPortrait.state);
        //    }else{
        //        if (global.innerWidth < global.innerHeight) {
        //            // portrait
        //            cc.director.setNextDeltaTimeZero(true);
        //            if(Utility){
        //                Utility.swapToGame();
        //                setTimeout(function () {
        //                    //cc.view.setDesignResolutionSize(750, 1334 - 108, cc.ResolutionPolicy.FIXED_WIDTH);//1294
        //                }, 150);
        //            }
        //        } else {
        //            //landscape
        //            if(Utility){
        //                //Utility.swapToRotationImg();
        //            }
        //
        //        }
        //    }
        //}, 150);




        //if (cc.sys.isMobile) {
        //    if ((cc.sys.os == cc.sys.OS_ANDROID && previousHeight != global.innerHeight) ||
        //        (cc.sys.os == cc.sys.OS_IOS && previousHeight != global.innerHeight)) {
        //        previousWidth = global.innerWidth;
        //        previousHeight = global.innerHeight;
        //        if(Utility.isFromLandscape == 1){//æ¸¸ææ¨ªå±è¿å¥æ¶ï¼éæ°å è½½
        //            Utility.isFromLandscape = 0;
        //            setTimeout(function () {
        //                location.reload();
        //            }, 150);
        //        }else {
        //            console.log("Utility.isPortrait.state="+Utility.isPortrait.state);
        //            if(Utility.isPortrait.state > 0 && Utility.isPortrait.state != 3){
        //                if(Utility.isPortrait.sW2 == null){
        //                    if (global.innerWidth < global.innerHeight) {
        //                        console.log("11");
        //                        Utility.isPortrait.state = 1;
        //                    } else {
        //                        console.log("22");
        //                        Utility.isPortrait.state = 2;
        //                    }
        //                }else{
        //                    if((Math.abs(Utility.isPortrait.sW2 - global.innerWidth)<= 1) && (Math.abs(Utility.isPortrait.sH2 - global.innerHeight)<= 54*2)/*bar é«åº¦*/){
        //                        console.log("33");
        //                        Utility.isPortrait.state = 2;
        //                    }else{
        //                        console.log("44");
        //                        Utility.isPortrait.state = 1;
        //                    }
        //                    console.log("：："+global.innerWidth+"::"+global.innerHeight+"::"+Utility.isPortrait.sW2+"::"+Utility.isPortrait.sH2);
        //                }
        //
        //            }else{
        //                if (global.innerWidth < global.innerHeight) {
        //                    // portrait
        //                    cc.director.setNextDeltaTimeZero(true);
        //                    if(Utility){
        //                        Utility.swapToGame();
        //                        setTimeout(function () {
        //                            //cc.view.setDesignResolutionSize(750, 1334 - 108, cc.ResolutionPolicy.FIXED_WIDTH);//1294
        //                        }, 150);
        //                    }
        //                } else {
        //                    //landscape
        //                    if(Utility){
        //                        setTimeout(function () {
        //                            Utility.swapToRotationImg();
        //                        }, 300);
        //                    }
        //
        //                }
        //            }
        //        }
        //
        //    }
        //}
    };

    global.addEventListener("resize", onResize, false);
    //global.addEventListener('orientationchange', onResize);

    //(optional) Android doesn't always fire orientationChange on 180 degree turns
    //   setInterval(onOrientationChange, 2000);

})(window);