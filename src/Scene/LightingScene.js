/**
 * Created by nhnst on 5/6/16.
 */
////http://punchdrunker.github.io/iOSEmoji/table_html/ios6/
var emojiList= [169, 174, 8482, 8598, 8599, 8600, 8601, 9193, 9194, 9654, 9664, 9728, 9729, 9742, 9748, 9749, 9757, 9786, 9800, 9801, 9802, 9803, 9804, 9805, 9806, 9807, 9808, 9809, 9810, 9811, 9824, 9827, 9829, 9830, 9832, 9855, 9888, 9889, 9917, 9918, 9924, 9934, 9962, 9970, 9971, 9973, 9978, 9981, 9986, 9992, 9994, 9995, 9996, 10024, 10035, 10036, 10060, 10068, 10069, 10084, 10145, 10175, 11013, 11014, 11015, 11093, 12349, 12951, 12953, 8419, 8419, 8419, 8419, 8419, 8419, 8419, 8419, 8419, 8419, 8419];

var LightingLayer = cc.LayerColor.extend({
    cMode:null,
    cSubModeSelected:null,
    mode2Info:{color:null,bright:null,blink:null,swich:true,fullScreen:false},//mode2
    mode1Info:{swich:true},
    mode0Info:{size:null,color:null,effect1:null,effect2:null,blink:null,direct:null},//mode0
    gameStage:0,
    isFromLoad:null,
    TAG_MAIN:0,
    TAG_ANIM:100,
    TAG_ANIM1:101,
    TAG_SETTING:200,
    TAG_MASK:205,
    TAG_RESULT:206,

    ORDER_Z_MAIN:10,
    ORDER_Z_SETTING:20,
    ORDER_Z_TUTORIAL:50,
    ORDER_Z_EFFECT:60,
    ORDER_Z_TOP:99,

    mode1Anim:{
        candle_start:0,
        candle_loop:1,
        candle_end:2,
        candle_ended:3,

        zippo_start:4,
        zippo_loop:5,
        zippo_end:6,
        zippo_ended:7,

        torch_start:8,
        torch_loop:9,
        torch_end:10,
        torch_ended:11
    },
    mode2imageRes_off:[
        LightingRes.set_penlight_white_off,
        LightingRes.set_penlight_Blue_off,
        LightingRes.set_penlight_RED_off,
        LightingRes.set_penlight_green_off,
        LightingRes.set_penlight_yellow_off,
        LightingRes.set_penlight_Purple_off,
        LightingRes.set_penlight_white_off
    ],
    mode2imageRes_on:[
        LightingRes.set_penlight_white_on,
        LightingRes.set_penlight_Blue_on,
        LightingRes.set_penlight_RED_on,
        LightingRes.set_penlight_green_on,
        LightingRes.set_penlight_yellow_on,
        LightingRes.set_penlight_Purple_on,
        LightingRes.set_penlight_white_on
    ],

    mode2FullScreenRes:[
        LightingRes.set_fullscreen_w,
        LightingRes.set_fullscreen_b,
        LightingRes.set_fullscreen_r,
        LightingRes.set_fullscreen_g,
        LightingRes.set_fullscreen_y,
        LightingRes.set_fullscreen_m,
        LightingRes.set_fullscreen_w
    ],

    textSizeArray:[300, 350, 400, 450, 500],
    textColorArray : [
        cc.color.WHITE,
        cc.color.BLUE,
        cc.color.RED,
        cc.color("#00ff00"),
        cc.color.YELLOW,
        cc.color("#ff56ff"),
        cc.color.WHITE],
    ctor:function () {
        this._super(cc.color(111,205,192,255));

        mainView = this;

        this.initMain();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.scheduleUpdate();
        //cc.log("main::"+window.innerWidth+"::"+window.innerHeight+"::"+Utility.isPortrait.sW2+"::"+Utility.isPortrait.sH2);

        Utility.setTitle_thumbnails(GAME_TYPE.Lighting);

        Utility.sendXhr(GAME_TYPE.Lighting.gameid);

        return true;
    },

    update:function(){
        var context = this;
        if(Utility.checkRfresh){
            switch (context.gameStage){
                case context.TAG_MAIN:
                    context.removeAllChildren();
                    context.initMain();
                    break;
                case context.TAG_SETTING:
                    context.setMode0backPosY();
                    break;
                case context.TAG_RESULT:
                    break;
            }
            Utility.checkRfresh = false;
        }
        if(Utility.isPortrait.state == 1 ||Utility.isPortrait.state == 2){
            context.setScreenRotateA((Utility.isPortrait.state == 2)?false:true);
        }
    },

    stateBack: function(context){
        if(context.gameStage == context.TAG_MAIN){
            Utility.setMainUrl();
        }else{
            History.go(1);
        }
        switch (context.gameStage){
            case context.TAG_MAIN:
                break;
            case context.TAG_SETTING:
                context.gotoMain();
                break;
            case context.TAG_RESULT:
                break;
        }
    },

    initMain:function() {

        this.gameStage = this.TAG_MAIN;

        this.initData();

        var back = new cc.LayerColor(cc.color(111,205,192,255), cc.winSize.width,cc.winSize.height + 300);
        back.setPosition(0, 0);
        this.addChild(back);

        var bg = new cc.Sprite(LightingRes.bg);
        bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(bg);

        var toolBar = new Toolbar(GAME_TYPE.Lighting);
        toolBar.setName("toolBar");
        toolBar.setAnchorPoint(cc.p(0,1));
        toolBar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolBar,this.ORDER_Z_MAIN);

        this.mainAnimation();

        var histtoryLW = new HistorysListView(cc.winSize.height - 550,GAME_TYPE.Lighting,
            LightingRes.signl_list_btn,
            LightingRes.signl_list_btn,
            this.gotoReplayView,
            this.gotoResultView);
        histtoryLW.setName("history");
        this.addChild(histtoryLW);

        this.addChild(new MainModeBtn(
            LightingRes.common_start_btn,
            {selector:this.startButton1, img:LightingRes.board_play_btn,str:"ネオンサイン",subStr:""},
            //{selector:this.startButton2, img:LightingRes.light_play_btn,str:"キャンドル",subStr:""},
            {selector:this.startButton3, img:LightingRes.fenlight_play_btn,str:"ペンライト",subStr:""}
        ));
        //
        //
        //var delegate = {};
        //
        //delegate.editBoxEditingDidBegin = function (editBox) {
        //    cc.log("1111");
        //    if(Utility.isPortrait.state != 1){
        //        name_random_field.removeFromParent();
        //        this.showKeybord();
        //    }
        //};
        //
        //delegate.editBoxEditingDidEnd = function (editBox) {
        //    //name_random_field.setPosition(resX[0], back.getContentSize().height>>1);
        //};
        //
        //delegate.editBoxTextChanged = function (editBox, text) {
        //
        //};
        //var name_random_field = new cc.EditBox(cc.size(cc.winSize.width, cc.winSize.height), new cc.Scale9Sprite());
        //name_random_field.setBodyStyle(1);
        //name_random_field.setAnchorPoint(0, 0);
        //name_random_field.setPosition(0, 0);
        //name_random_field.setDelegate(delegate);
        //this.addChild(name_random_field);

        //var label = new ccui.Text();
        //label.setString("show");
        //label.setAnchorPoint(cc.p(0.5, 0.5));
        //label.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
        //label.setFontSize(300);
        //label.setFontName(GAME_FONT.PRO_W6);
        //label.setColor(cc.color("#ffffff"));
        //
        ////label.enableGlow(cc.color("#000000"));
        //label.enableShadow(cc.color("#000000"),cc.size(0, 0),45);
        ////label.enableShadow(cc.color("#ffffff"),cc.size(4, -4),10);
        ////label.disableShadow();
        //
        //this.addChild(label,this.ORDER_Z_SETTING - 2);

    },

    initData:function(){
        Utility.isPortrait.sW2 = null;
        Utility.isPortrait.sH2 = null;

        this.mode2Info.color = 0;
        this.mode2Info.bright = 100;
        this.mode2Info.blink = 0;
        this.mode2Info.swich = true;
        this.mode2Info.fullScreen = false;

        this.mode0Info.size = 0;
        this.mode0Info.color = null;
        this.mode0Info.effect1 = 0;
        this.mode0Info.effect2 = 2;
        this.mode0Info.blink = null;
        this.mode0Info.direct = 2;

        this.Popinput = null;

        this.tempText = null;

        this.isFromLoad = false;

        this.cSubModeSelected = 1;

        if(cc.sys.os == cc.sys.OS_IOS){
            if(!Utility.isIOS9()){
                this.textSizeArray = [200, 250, 270, 280, 300];
                this.mode0Info.size = 4;
            }
        }
    },

    mainAnimation:function(){
        if(this.getChildByName("bgAnimation")){
            this.getChildByName("bgAnimation").setPosition(0, cc.winSize.height-100);
            return;
        }
        var vote = new cc.Sprite();
        vote.setName("bgAnimation");
        vote.setAnchorPoint(0, 1);
        vote.setPosition(0, cc.winSize.height-100);

        var frames = [];
        frames.push(new cc.SpriteFrame(LightingRes.top_1, new cc.Rect(0, 0, 750, 450)));
        var animate1 = cc.animate(new cc.Animation(frames, 0.4));

        var frames = [];
        for(var i = 1 ; i < 13; i++){
            if(i < 10)
                frames.push(new cc.SpriteFrame("res/Scene/Lighting/main/top_00" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
            else
                frames.push(new cc.SpriteFrame("res/Scene/Lighting/main/top_0" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
        }
        var animate = cc.animate(new cc.Animation(frames, 0.1));

        vote.runAction(new cc.Sequence(animate1,animate).repeatForever());

        this.addChild(vote);
    },

    gotoReplayView:function(groups,mode){
        mainView.isFromLoad = true;
        mainView.getHistory(groups);
        mainView.startButton1();
    },

    gotoResultView:function(groups, title, mode){
        mainView.isFromLoad = true;
        mainView.getHistory(groups);
        mainView.startButton1();
    },

    startButton1:function(node){
        mainView.setScreenRotateA(true);
        mainView.intoMode(0);
    },

    startButton2:function(node){
        mainView.intoMode(1);
        mainView.setTutorialView(1);
    },

    startButton3:function(node){
        mainView.intoMode(2);
        mainView.setTutorialView(2);
    },

    setTutorialView:function(mode){
        var saveTag = GAME_TYPE.Lighting.name +"_"+"mode"+mode;
        if(DataManager.instance().getData(saveTag) != 1)
        {
            var tutorialBg = new ccui.Layout();
            tutorialBg.setContentSize(cc.winSize.width, cc.winSize.height + 400);
            tutorialBg.setAnchorPoint(0, 0);
            tutorialBg.setPosition(0, 0);
            tutorialBg.setTouchEnabled(true);
            tutorialBg.addTouchEventListener(function(sender, event){
                switch (event){
                    case ccui.Widget.TOUCH_BEGAN:
                        break;
                    case ccui.Widget.TOUCH_MOVED:
                        break;
                    case ccui.Widget.TOUCH_ENDED:
                        this.removeFromParent();
                        DataManager.instance().saveData(saveTag, 1);
                        break;
                }
            });
            this.addChild(tutorialBg,this.ORDER_Z_TUTORIAL);

            var sprite = new cc.Sprite(LightingRes.set_coaching);
            sprite.setAnchorPoint(0, 0);
            sprite.setPosition(0, 0);
            tutorialBg.addChild(sprite);
        }
    },

    intoMode:function(mode){
        var _this = this;
        _this.removeAllChildren();
        _this.gameStage = _this.TAG_SETTING;
        _this.cMode = mode;
        var back = new cc.LayerColor(cc.color("#000000"), cc.winSize.width + 200,cc.winSize.height + 200);
        back.setName("backColor");
        back.setPosition(0, 0);
        _this.addChild(back);

        if(_this.getChildByName("sprite"))
            _this.getChildByName("sprite").removeFromParent();

        if(mode == 0){

        }else if(mode == 1){
            _this.mode1Animation(_this.mode1Anim.candle_loop);
        }else if(mode == 2){
            var sprite = new cc.Sprite(this.mode2imageRes_off[this.mode2Info.color]);
            sprite.setName("sprite");
            sprite.setAnchorPoint(cc.p(0.5, 0));
            sprite.setPosition(cc.winSize.width>>1, 0);
            _this.addChild(sprite);

            var spriteLight = new cc.Sprite(this.mode2imageRes_on[this.mode2Info.color]);
            spriteLight.setName("spriteLight");
            spriteLight.setAnchorPoint(cc.p(0.5, 0));
            spriteLight.setPosition(cc.winSize.width>>1, 0);
            sprite.addChild(spriteLight);

            var topButton = new ccui.Button(LightingRes.set_fullscreen_on,LightingRes.set_fullscreen_on);
            topButton.setName("topButton");
            topButton.setVisible(false);
            topButton.setAnchorPoint(1.0,1.0);
            topButton.setPosition(cc.winSize.width - 20, cc.winSize.height - 20);
            topButton.addClickEventListener(function(){
                if(_this.mode2Info.fullScreen){
                    topButton.loadTextures(LightingRes.set_fullscreen_on,LightingRes.set_fullscreen_on);
                    topButton.setPosition(cc.winSize.width - 20, cc.winSize.height - 20);
                    spriteLight.setVisible(true);
                    _this.mode2Info.fullScreen = false;
                }else{
                    topButton.loadTextures(LightingRes.set_fullscreen_off,LightingRes.set_fullscreen_off);
                    topButton.setPosition(cc.winSize.width - 20, cc.winSize.height - 20 - 2);
                    spriteLight.setVisible(false);
                    _this.mode2Info.fullScreen = true;
                }
                _this.setMode2Color();
                if(!_this.mode2Info.swich)
                    _this.setMode2Obcity(0);
                else
                    _this.setMode2Obcity(_this.mode2Info.bright);
            });
            _this.addChild(topButton,_this.ORDER_Z_TOP);
        }

        _this.hideModeSettingBar();
    },

    showModeSettingBar:function(){
        var _this = this;
        var layoutBg = new ccui.Layout()
        layoutBg.setName("showlayoutBg");
        layoutBg.setAnchorPoint(0, 0);
        layoutBg.setPosition(0, 0);
        layoutBg.setContentSize(cc.winSize.width, cc.winSize.height);
        layoutBg.setTouchEnabled(true);
        layoutBg.addClickEventListener(function(){
            _this.hideModeSettingBar(back,this);
            if(_this.cMode == 2 && _this.getChildByName("topButton"))
                _this.getChildByName("topButton").setVisible(false);
        });
        _this.addChild(layoutBg);


        if(_this.cMode == 0){
            var back = _this.setMode0SettingBar(layoutBg);
            _this.setMode0SettingBarInfo(back);
        }else if(_this.cMode == 1){
            var back = _this.setMode1SettingBar(layoutBg);
            //_this.setMode1SettingBarInfo(back);
        }else if(_this.cMode == 2){
            var back = _this.setMode2SettingBar(layoutBg);
            this.setMode2SettingBarInfo(back);
        }

    },

    hideModeSettingBar:function(barBack,rmLayout){
        var _this = this;
        if(barBack)
            barBack.removeFromParent();
        if(rmLayout)
            rmLayout.removeFromParent();
        if(cc.sys.os == cc.sys.OS_ANDROID){//对应安卓有的机器不自动弹出键盘问题
            if(_this.cMode == 0 && !_this.isFromLoad) {
                setTimeout(function () {
                    var delegate = {};
                    delegate.editBoxEditingDidBegin = function (editBox) {
                        if(Utility.isPortrait.state != 1){
                            name_random_field.removeFromParent();
                            _this.showKeybord();
                        }else{
                            name_random_field.setInputblur();
                        }
                    };
                    var name_random_field = new cc.EditBox(cc.size(cc.winSize.width, cc.winSize.height), new cc.Scale9Sprite());
                    //name_random_field.setBodyStyle(1);
                    name_random_field.setAnchorPoint(0, 0);
                    name_random_field.setPosition(0, 0);
                    name_random_field.setDelegate(delegate);
                    _this.addChild(name_random_field);
                }, 150);
                _this.isFromLoad = true;
            }else {
                var layoutBg = new ccui.Layout();
                layoutBg.setName("hidelayoutBg");
                layoutBg.setAnchorPoint(0, 0);
                layoutBg.setPosition(0, 0);
                layoutBg.setContentSize(cc.winSize.width, cc.winSize.height);
                layoutBg.setTouchEnabled(true);
                layoutBg.addClickEventListener(function(){
                    this.removeFromParent();
                    if(_this.cMode == 2 && _this.getChildByName("topButton"))
                        _this.getChildByName("topButton").setVisible(true);
                    _this.showModeSettingBar();
                });
                _this.addChild(layoutBg);
            }
        }else{
            var layoutBg = new ccui.Layout();
            layoutBg.setName("hidelayoutBg");
            layoutBg.setAnchorPoint(0, 0);
            layoutBg.setPosition(0, 0);
            layoutBg.setContentSize(cc.winSize.width, cc.winSize.height);
            layoutBg.setTouchEnabled(true);
            layoutBg.addClickEventListener(function(){
                this.removeFromParent();
                if(_this.cMode == 0 && !_this.isFromLoad){
                    if(_this.isKeybord != true){
                        if(_this.getChildByName("settingback"))
                            _this.getChildByName("settingback").removeFromParent();
                        if(_this.getChildByName("showlayoutBg"))
                            _this.getChildByName("showlayoutBg").removeFromParent();
                        _this.showKeybord();
                        _this.isFromLoad = true;
                    }

                }else{
                    if(_this.cMode == 2 && _this.getChildByName("topButton"))
                        _this.getChildByName("topButton").setVisible(true);
                    _this.showModeSettingBar();
                }


            });
            _this.addChild(layoutBg);
        }
        if(　　_this.cMode == 0)
            _this.setTextPosition(2);
    },

    setMode2SettingBar:function(rmLayout){
        var _this = this;
        var back = new ccui.Layout();
        back.setPosition(0, 0);
        back.setTouchEnabled(true);
        back.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        back.setBackGroundColor(cc.color("#6fcdc1"));
        back.setContentSize(cc.winSize.width, 180);
        this.addChild(back,this.ORDER_Z_SETTING);

        var resOff = [LightingRes.set_light_off,LightingRes.set_lng_color_off,LightingRes.set_lnb_brightness_off,LightingRes.set_lnb_blink_off,LightingRes.set_b_close];
        var resOn = [LightingRes.set_light_on,LightingRes.set_lng_color_on,LightingRes.set_lnb_brightness_on,LightingRes.set_lnb_blink_on,LightingRes.set_b_close];
        var imageWidth1 = 130, imageWidth2 = 100;  var w = (cc.winSize.width - (imageWidth1*2 + imageWidth2*3))/9;
        var resX = [w + imageWidth1/2,  cc.winSize.width/2 - (imageWidth2 + 1.5*w),cc.winSize.width/2,cc.winSize.width/2 + (imageWidth2 + 1.5*w), cc.winSize.width - (w + imageWidth1/2)];
        var sprite = _this.getChildByName("sprite");
        var spriteLight = sprite.getChildByName("spriteLight");
        for(var i = 0; i < resOff.length; i++){
            var Buttom = new ccui.CheckBox(resOff[i],resOn[i]);
            if(i == 0)this.lightOffOnBtn = Buttom;//记一下开关按钮
            Buttom.setTag(i);
            Buttom.setAnchorPoint(0.5,0.5);
            Buttom.setPosition(resX[i], back.getContentSize().height>>1);
            //Buttom.setBright(false);
            if((i == 0  && _this.mode2Info.swich )|| i == _this.cSubModeSelected)
                Buttom.setSelected(true);
            Buttom.addEventListener(function (sender, type) {
                if(sender.getTag() == resOff.length - 1){
                    _this.hideModeSettingBar(back,rmLayout);
                    return;
                }
                switch (type) {
                    case  ccui.CheckBox.EVENT_UNSELECTED:
                        if(sender.getTag() != 0)
                            sender.setSelected(true);
                        else{
                            _this.mode2Info.swich = false;
                            //if(_this.mode2Info.fullScreen){
                            //    sprite.setOpacity(255*0.15);
                            //}else{
                            //    sprite.setOpacity(255);
                            //    spriteLight.setOpacity(0);
                            //}
                            _this.setMode2Obcity(0);
                        }
                        break;
                    case ccui.CheckBox.EVENT_SELECTED:
                        if(sender.getTag() != 0){
                            sender.getParent().getChildByTag(_this.cSubModeSelected).setSelected(false);
                            _this.cSubModeSelected = sender.getTag();
                            _this.setMode2SettingBarInfo(back);
                            direction.setPositionX(resX[sender.getTag()]);
                        }else{
                            _this.mode2Info.swich = true;
                            //if(_this.mode2Info.fullScreen){
                            //    sprite.setOpacity(255*_this.mode2Info.bright/100);
                            //}else{
                            //    sprite.setOpacity(255);
                            //    spriteLight.setOpacity(255*_this.mode2Info.bright/100);
                            //}
                            _this.setMode2Obcity(_this.mode2Info.bright,true);
                        }

                        break;

                    default:
                        break;
                }
            }, this);
            back.addChild(Buttom);
        }

            var  direction = new cc.Sprite(LightingRes.set_lnb_point);
            direction.setAnchorPoint(cc.p(0.5, 1));
            direction.setPosition(resX[1], back.getContentSize().height);
            back.addChild( direction);

        return back;
    },

    setMode2SettingBarInfo:function(parent){
        var _this = this;
        if(parent.getChildByTag(10))
            parent.removeChildByTag(10);
        var back = new ccui.Layout();
        back.setTag(10);
        back.setPosition(0, parent.getContentSize().height - 1);
        back.setTouchEnabled(true);
        back.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        back.setBackGroundColor(cc.color("#568f96"));
        back.setContentSize(cc.winSize.width, 180);
        parent.addChild(back);
        _this.mode2slider = null;
        var sprite = _this.getChildByName("sprite");
        var spriteLight = sprite.getChildByName("spriteLight");
        if(_this.cSubModeSelected == 1){
            var resOff = [LightingRes.set_color_w,LightingRes.set_color_b,LightingRes.set_color_r,
                          LightingRes.set_color_g,LightingRes.set_color_y,LightingRes.set_color_m,LightingRes.set_color_rb];
            //var resOn = [LightingRes.set_light_on,LightingRes.set_lng_color_on,LightingRes.set_lnb_brightness_on,LightingRes.set_lnb_blink_on,LightingRes.set_b_close];
            var imageWidth1 = 80;  var w = (cc.winSize.width - (imageWidth1*7))/10;
            //var resX = [w + imageWidth1/2,  cc.winSize.width/2 - (imageWidth2 + 1.5*w),cc.winSize.width/2,cc.winSize.width/2 + (imageWidth2 + 1.5*w), cc.winSize.width - (w + imageWidth1/2)];
            for(var i = 0; i < resOff.length; i++){
                var Buttom = new ccui.CheckBox(resOff[i],resOff[i]);
                Buttom.setTag(i);
                Buttom.setAnchorPoint(0.5,0.5);
                Buttom.setPosition(2*w + imageWidth1/2 +(imageWidth1 + w)*i, back.getContentSize().height>>1);
                Buttom.addEventListener(function (sender, type) {
                    _this.mode2Info.color = sender.getTag();
                    _this.setMode2Color();
                }, this);
                back.addChild(Buttom);
            }
        }else if(_this.cSubModeSelected == 2){
            var aw = 100;

            var textLeft = new ccui.Text("0",GAME_FONT.PRO_W3,32);
            textLeft.setAnchorPoint(cc.p(1,0.5));
            textLeft.setColor(cc.color("#fffbe0"));
            textLeft.setPosition(aw - 25, (back.getContentSize().height>>1) - 2);
            back.addChild(textLeft);

            var textRight = new ccui.Text("100",GAME_FONT.PRO_W3,32);
            textRight.setAnchorPoint(cc.p(0,0.5));
            textRight.setColor(cc.color("#ffffff"));
            textRight.setPosition(cc.winSize.width - aw + 25, (back.getContentSize().height>>1) - 2);
            back.addChild(textRight);

            var slider = _this.mode2slider = new ccui.Slider();
            slider.setTouchEnabled(true);
            slider.setScale9Enabled(true);
            slider.loadBarTexture(LightingRes.set_b_bar);
            slider.loadSlidBallTextures(LightingRes.set_b_bar_btn,LightingRes.set_b_bar_btn);
            slider.loadProgressBarTexture(LightingRes.set_b_bar_progress);
            slider.setCapInsets(cc.rect(7, 0, 6, 10));
            slider.setContentSize(cc.size(cc.winSize.width - 2*aw, 10));
            slider.setAnchorPoint(0.5,0.5);
            slider.setPosition(back.getContentSize().width>>1, back.getContentSize().height>>1);
            if(!_this.mode2Info.swich)
                slider.setPercent(0);
            else
                slider.setPercent(_this.mode2Info.bright);

            // var progressBarS = slider.getVirtualRenderer();
            // progressBarS.addClickEventListener(function () {
            //         cc.log("addClickEventListener   %d", 1111);
            // });

            slider.addEventListener(function (sender, type) {
                switch (type) {
                    case ccui.Slider.EVENT_PERCENT_CHANGED:
                        var slider = sender;
                        var percent = slider.getPercent().toFixed(0);
                        //textLeft.setString(percent);
                        //textRight.setString(100 - percent);
                        _this.mode2Info.bright = percent;
                        _this.setMode2Obcity(percent);

                        break;
                    default:
                        break;
                }
            }, this);

            back.addChild(slider);

            var progressBarLayer = new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width - 2*aw, 80);
            progressBarLayer.setAnchorPoint(0.5,0.5);
            progressBarLayer.setPosition(back.getContentSize().width>>1, back.getContentSize().height>>1);
            var barSize = progressBarLayer.getContentSize();
            var barPos = progressBarLayer.getPosition();

            // progressBarLayer.getContentSize();

            back.addChild(progressBarLayer);

            var listener1 = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: function(touch, event){
                    var target = event.getCurrentTarget();
                    var locationInNode = touch.getLocation();
                    var s = target.getContentSize();
                    var p = target.getPosition();
                    var rect = cc.rect(aw, p.y-5 - s.height/2, s.width, s.height+5);

                    locationInNode.y = locationInNode.y - 176;
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        var perc = ((locationInNode.x-aw)/s.width)*100;
                        slider.setPercent(perc);
                        _this.mode2Info.bright = perc;
                        _this.setMode2Obcity(perc);
                        return true;
                    }

                    return false;
                }
            });
            cc.eventManager.addListener(listener1, progressBarLayer);

        }else if(_this.cSubModeSelected == 3){

            var resOff = [LightingRes.set_b_none_off,LightingRes.set_b_1_off,LightingRes.set_b_2_off,LightingRes.set_b_3_off];
            var resOn = [LightingRes.set_b_none_on,LightingRes.set_b_1_on,LightingRes.set_b_2_on,LightingRes.set_b_3_on];
            var imageWidth1 = 100;  var w = (cc.winSize.width - (imageWidth1*4))/7;
            var resX = [cc.winSize.width/2 - 3*(w + imageWidth1)/2,  cc.winSize.width/2 - w/2 - imageWidth1/2,cc.winSize.width/2 + w/2 + imageWidth1/2, cc.winSize.width/2 + 3*(w + imageWidth1)/2];

            for(var i = 0; i < resOff.length; i++) {
                var Buttom = new ccui.CheckBox(resOff[i], resOn[i]);
                Buttom.setTag(i);
                Buttom.setAnchorPoint(0.5, 0.5);
                Buttom.setPosition(resX[i], back.getContentSize().height >> 1);
                if(i == _this.mode2Info.blink)
                    Buttom.setSelected(true);

                Buttom.addEventListener(function (sender, type) {
                    switch (type) {
                        case  ccui.CheckBox.EVENT_UNSELECTED:
                                sender.setSelected(true);
                            break;
                        case ccui.CheckBox.EVENT_SELECTED:
                                sender.getParent().getChildByTag(_this.mode2Info.blink).setSelected(false);
                                _this.mode2Info.blink = sender.getTag();
                                _this.setMode2Blink(_this.mode2Info.bright);
                            break;

                        default:
                            break;
                    }
                }, this);
                back.addChild(Buttom);
            }
        }

        return back;
    },

    setMode2Color:function() {
        var _this = this;
        var sprite = _this.getChildByName("sprite");
        var spriteLight = sprite.getChildByName("spriteLight");

        if(this.mode2Info.color == null)
            this.mode2Info.color = 0;
        var res = [];
        if(_this.mode2Info.fullScreen){
            res = _this.mode2FullScreenRes;
        }else{
            res = _this.mode2imageRes_off;
        }
        sprite.initWithFile(res[_this.mode2Info.color]);
        sprite.setAnchorPoint(cc.p(0.5, 0));
        if(!_this.mode2Info.fullScreen){
            spriteLight.initWithFile(_this.mode2imageRes_on[_this.mode2Info.color]);
            spriteLight.setAnchorPoint(cc.p(0.5, 0));
        }
        sprite.unschedule("color");
        if (_this.mode2Info.color == _this.textColorArray.length - 1) {
            var changeColor = 1;
            sprite.schedule(function () {
                sprite.initWithFile(res[changeColor]);
                sprite.setAnchorPoint(cc.p(0.5, 0));
                if(!_this.mode2Info.fullScreen){
                    spriteLight.initWithFile(_this.mode2imageRes_on[changeColor]);
                    spriteLight.setAnchorPoint(cc.p(0.5, 0));
                }
                if (changeColor < _this.textColorArray.length - 1)
                    changeColor++;
                else
                    changeColor = 1;
            }, 0.5, "color");
        }

    },

    setMode2Blink:function(bright) {
        var _this = this;
        var sprite = _this.getChildByName("sprite");
        var spriteLight = sprite.getChildByName("spriteLight");
        var obcity = 255*bright/100;
        sprite.stopAllActions();
        spriteLight.stopAllActions();
        var array = [1.0,0.5, 0.5,0.2, 0.1,0.1];
        if(_this.mode2Info.fullScreen){
            sprite.setOpacity(obcity);
            if(_this.mode2Info.blink != 0){

                sprite.runAction(cc.sequence(
                    cc.delayTime(array[2*(_this.mode2Info.blink - 1)]),
                    cc.fadeTo(0.1,255*15/100),
                    cc.delayTime(array[2*(_this.mode2Info.blink - 1) + 1]),
                    cc.fadeTo(0.1,obcity)
                ).repeatForever());
            }
        }else{
            sprite.setOpacity(255);
            //if(_this.mode2Info.blink != 0){
            //    sprite.runAction(cc.sequence(
            //        cc.delayTime(array[2*(_this.mode2Info.blink - 1)]),
            //        cc.fadeTo(0.1,0),
            //        cc.delayTime(array[2*(_this.mode2Info.blink - 1) + 1]),
            //        cc.fadeTo(0.1,255)
            //    ).repeatForever());
            //}

            spriteLight.setOpacity(obcity);
            if(_this.mode2Info.blink != 0){
                spriteLight.runAction(cc.sequence(
                    cc.delayTime(array[2*(_this.mode2Info.blink - 1)]),
                    cc.fadeTo(0.1,0),
                    cc.delayTime(array[2*(_this.mode2Info.blink - 1) + 1]),
                    cc.fadeTo(0.1,obcity)
                ).repeatForever());
            }
        }
    },

    setMode2Obcity:function(percent,onoff) {
        var _this = this;
        var sprite = _this.getChildByName("sprite");
        var spriteLight = sprite.getChildByName("spriteLight");
        if(!percent && percent != 0)
            percent = _this.mode2Info.bright;
        if(_this.mode2Info.fullScreen){
            if(percent < 15)percent = 15;
            if(onoff && percent == 15)//强制变亮
                percent = 100;
            sprite.setOpacity(255*percent/100);
            if(percent == 15)
                _this.mode2Info.swich = false;
            else
                _this.mode2Info.swich = true;

            //if(percent <= 15)
            //    _this.mode2Info.swich = false;
            //else
            //    _this.mode2Info.swich = true;
        }else{
            if(onoff && percent == 0)//强制变亮
                percent = 100;
            spriteLight.setOpacity(255*percent/100);
            if(percent == 0)
                _this.mode2Info.swich = false;
            else
                _this.mode2Info.swich = true;

            //if(percent == 0)
            //    _this.mode2Info.swich = false;
            //else
            //    _this.mode2Info.swich = true;
        }

        if(this.lightOffOnBtn){
            if(_this.mode2Info.swich)
                this.lightOffOnBtn.setSelected(true);
            else
                this.lightOffOnBtn.setSelected(false);
        }

        if(_this.mode2slider)
            _this.mode2slider.setPercent(percent);

        _this.setMode2Blink(percent);
    },

    setMode1SettingBar:function(rmLayout){
        var _this = this;
        var back = new ccui.Layout();
        back.setPosition(0, 0);
        back.setTouchEnabled(true);
        back.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        back.setBackGroundColor(cc.color("#6fcdc1"));
        back.setContentSize(cc.winSize.width, 180);
        this.addChild(back,this.ORDER_Z_SETTING);

        var resOff = [LightingRes.set_light_off,LightingRes.set_lnb_candle_off,LightingRes.set_lnb_lighter_off,LightingRes.set_lng_torch_off,LightingRes.set_b_close];
        var resOn = [LightingRes.set_light_on,LightingRes.set_lnb_candle_on,LightingRes.set_lnb_lighter_on,LightingRes.set_lng_torch_on,LightingRes.set_b_close];
        var imageWidth1 = 130, imageWidth2 = 100;  var w = (cc.winSize.width - (imageWidth1*2 + imageWidth2*3))/9;
        var resX = [w + imageWidth1/2,  cc.winSize.width/2 - (imageWidth2 + 1.5*w),cc.winSize.width/2,cc.winSize.width/2 + (imageWidth2 + 1.5*w), cc.winSize.width - (w + imageWidth1/2)];

        for(var i = 0; i < resOff.length; i++){
            var Buttom = new ccui.CheckBox(resOff[i],resOn[i]);
            if(i == 0)Buttom.setVisible(false);//delete on/off
            Buttom.setTag(i);
            Buttom.setAnchorPoint(0.5,0.5);
            Buttom.setPosition(resX[i], back.getContentSize().height>>1);
            //Buttom.setBright(false);
            if((i == 0 &&_this.mode1Info.swich) || i == _this.cSubModeSelected)
                Buttom.setSelected(true);
            Buttom.addEventListener(function (sender, type) {
                if(sender.getTag() == resOff.length - 1){
                    _this.hideModeSettingBar(rmLayout,back);
                    return;
                }
                switch (type) {
                    case  ccui.CheckBox.EVENT_UNSELECTED:
                        if(sender.getTag() != 0)
                            sender.setSelected(true);
                        else{
                            if(_this.cSubModeSelected == 1){
                                _this.mode1Animation(_this.mode1Anim.candle_end);
                            }else if(_this.cSubModeSelected == 2){
                                _this.mode1Animation(_this.mode1Anim.zippo_end);
                            }else if(_this.cSubModeSelected == 3){
                                _this.mode1Animation(_this.mode1Anim.torch_end);
                            }
                            _this.mode1Info.swich = false;
                        }
                        break;
                    case ccui.CheckBox.EVENT_SELECTED:
                        if(sender.getTag() != 0){
                            sender.getParent().getChildByTag(_this.cSubModeSelected).setSelected(false);

                            if(sender.getTag() == 1 && _this.cSubModeSelected != 1){
                                if(_this.mode1Info.swich)
                                    _this.mode1Animation(_this.mode1Anim.candle_loop);
                                else
                                    _this.mode1Animation(_this.mode1Anim.candle_ended);
                            }else if(sender.getTag() == 2 && _this.cSubModeSelected != 2){
                                if(_this.mode1Info.swich)
                                    _this.mode1Animation(_this.mode1Anim.zippo_loop);
                                else
                                    _this.mode1Animation(_this.mode1Anim.zippo_ended);
                            }else if(sender.getTag() == 3 && _this.cSubModeSelected != 3){
                                if(_this.mode1Info.swich)
                                    _this.mode1Animation(_this.mode1Anim.torch_loop);
                                else
                                    _this.mode1Animation(_this.mode1Anim.torch_ended);
                            }

                            _this.cSubModeSelected = sender.getTag();

                        }else{
                            if(_this.cSubModeSelected == 1){
                                _this.mode1Animation(_this.mode1Anim.candle_start);
                            }else if(_this.cSubModeSelected == 2){
                                _this.mode1Animation(_this.mode1Anim.zippo_start);
                            }else if(_this.cSubModeSelected == 3){
                                _this.mode1Animation(_this.mode1Anim.torch_start);
                            }
                            _this.mode1Info.swich = true;
                        }


                        break;

                    default:
                        break;
                }
            }, this);
            back.addChild(Buttom);
        }
        return back;
    },

    setMode1SettingBarInfo:function(back){

    },

    mode1Animation:function(type){
        var _this = this;
        if(this.getChildByTag(this.TAG_ANIM))
            this.getChildByTag(this.TAG_ANIM).removeFromParent();

        var vote = new cc.Sprite();
        vote.setTag(this.TAG_ANIM);
        vote.setAnchorPoint(0.5, 0);
        vote.setPosition(cc.winSize.width>>1, 0);

        var sIndex,eIndex,resPath,frametime,isNextAnim = -1;
        switch (type){
            case _this.mode1Anim.candle_loop:
                sIndex = 84; eIndex = 113; resPath = "candle/candle_loop";frametime = 0.05;
                break;
            case _this.mode1Anim.zippo_loop:
                sIndex = 1; eIndex = 36; resPath = "zippo/zippo_loop";frametime = 0.05;
                break;
            case _this.mode1Anim.torch_loop:
                sIndex = 77; eIndex = 103; resPath = "torch/torch_loop";frametime = 0.05;
                break;
        }
        //switch (type){
        //    case _this.mode1Anim.candle_start:
        //        sIndex = 1; eIndex = 60; resPath = "candle_start/candle_start";frametime = 0.02; isNextAnim = _this.mode1Anim.candle_loop;
        //        break;
        //    case _this.mode1Anim.candle_loop:
        //        sIndex = 1; eIndex = 120; resPath = "candle_loop/candle_loop";frametime = 0.02;
        //        break;
        //    case _this.mode1Anim.candle_end:
        //        sIndex = 1; eIndex = 60; resPath = "candle_end/candle_end";frametime = 0.01;isNextAnim = _this.mode1Anim.candle_ended;
        //        break;
        //    case _this.mode1Anim.candle_ended:
        //        sIndex = 60; eIndex = 60; resPath = "candle_end/candle_end";frametime = 0.10;
        //        break;
        //    case _this.mode1Anim.zippo_start:
        //        sIndex = 1; eIndex = 60; resPath = "zippo_start/zippo_start";frametime = 0.02; isNextAnim = _this.mode1Anim.zippo_loop;
        //        break;
        //    case _this.mode1Anim.zippo_loop:
        //        sIndex = 1; eIndex = 120; resPath = "zippo_loop/zippo_loop";frametime = 0.02;
        //        break;
        //    case _this.mode1Anim.zippo_end:
        //        sIndex = 1; eIndex = 60; resPath = "zippo_end/zippo_end";frametime = 0.01;isNextAnim = _this.mode1Anim.zippo_ended;
        //        break;
        //    case _this.mode1Anim.zippo_ended:
        //        sIndex = 60; eIndex = 60; resPath = "zippo_end/zippo_end";frametime = 0.10;
        //        break;
        //    case _this.mode1Anim.torch_start:
        //        sIndex = 1; eIndex = 60; resPath = "torch_start/torch_start";frametime = 0.02; isNextAnim = _this.mode1Anim.torch_loop;
        //        break;
        //    case _this.mode1Anim.torch_loop:
        //        sIndex = 1; eIndex = 120; resPath = "torch_loop/torch_loop";frametime = 0.02;
        //        break;
        //    case _this.mode1Anim.torch_end:
        //        sIndex = 1; eIndex = 60; resPath = "torch_end/torch_end";frametime = 0.01;isNextAnim = _this.mode1Anim.torch_ended;
        //        break;
        //    case _this.mode1Anim.torch_ended:
        //        sIndex = 60; eIndex = 60; resPath = "torch_end/torch_end";frametime = 0.10;
        //        break;
        //}

        var frames = [];
        for(var i = sIndex ; i <= eIndex; i++){
            if(i < 10)
                frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode1/"+resPath+"_0000" + (i) + ".png", new cc.Rect(0, 0, 750, 1226)));
            else if(i < 100)
                frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode1/"+resPath+"_000" + (i) + ".png", new cc.Rect(0, 0, 750, 1226)));
            else
                frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode1/"+resPath+"_00" + (i) + ".png", new cc.Rect(0, 0, 750, 1226)));
        }
        var animate = cc.animate(new cc.Animation(frames, frametime));
        if(isNextAnim == -1){
            vote.runAction(new cc.Sequence(animate).repeatForever());
        }else{
            vote.runAction(new cc.Sequence(animate,new cc.callFunc(function(){
                _this.mode1Animation(isNextAnim);
            }, this)));
        }

        this.addChild(vote);
    },

    setMode0backPosY:function(){
        var setBack = this.getChildByName("settingback");
        if(setBack){//修改转回横屏后不计算STATUS BAR 高度的BUG
            if(cc.sys.os == cc.sys.OS_IOS){
                if(Utility.isPortrait.sH2 != null && window.innerHeight < Utility.isPortrait.sH2){
                        if(Utility.isPortrait.sH2 - window.innerHeight > 44/*barHeight*/){//iphone5s ios9
                            if(this.isshowkeybord)
                                setBack.setPositionY((Utility.isPortrait.sH2 - window.innerHeight)*5/4);
                            else
                                setBack.setPositionY((Utility.isPortrait.sH2 - window.innerHeight)/2);
                        }else{
                            setBack.setPositionY(Utility.isPortrait.sH2 - window.innerHeight);
                        }
                }else
                    setBack.setPositionY(0);
            }else{
                setBack.setPositionY(0);
            }
        }
        var anim;
        if(this.getChildByTag(this.TAG_ANIM))
            anim = this.getChildByTag(this.TAG_ANIM).getChildByName("animbot");
        if(anim) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                if (Utility.isPortrait.sH2 != null && window.innerHeight < Utility.isPortrait.sH2){
                    if(Utility.isPortrait.sH2 - window.innerHeight > 44/*barHeight*/){//iphone5s ios9
                        if(this.isshowkeybord)
                            anim.setPositionY((Utility.isPortrait.sH2 - window.innerHeight)*5/4);
                        else
                            anim.setPositionY((Utility.isPortrait.sH2 - window.innerHeight)/2);
                    }else{
                        anim.setPositionY(Utility.isPortrait.sH2 - window.innerHeight);
                    }
                }else
                    anim.setPositionY(0);
            } else {
                anim.setPositionY(0);
            }
        }

        anim = null;
        if(this.getChildByTag(this.TAG_ANIM))
            anim = this.getChildByTag(this.TAG_ANIM).getChildByName("animtop");
        if(anim) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                if (Utility.isPortrait.sH2 != null && window.innerHeight < Utility.isPortrait.sH2){
                    if(Utility.isPortrait.sH2 - window.innerHeight > 44/*barHeight*/){//iphone5s ios9
                        if(this.isshowkeybord)
                            anim.setPositionY(cc.winSize.height);
                        else
                            anim.setPositionY(cc.winSize.height - (Utility.isPortrait.sH2 - window.innerHeight)/2);
                    }
                    //else{
                    //    anim.setPositionY(Utility.isPortrait.sH2 - window.innerHeight);
                    //}
                }
                //else
                //    anim.setPositionY(0);
            //} else {
            //    anim.setPositionY(0);
            }
        }
    },

    setMode0SettingBar:function(rmLayout){
        var _this = this;
        if(_this.getChildByName("settingback"))
            _this.getChildByName("settingback").removeFromParent();
        _this.setTextPosition(1);
        var scale = this.setmode0Scale();

        var sWidth = cc.winSize.width;
        var back = new ccui.Layout();
        back.setName("settingback");
        back.setPosition(0,0);
        back.setTouchEnabled(true);
        back.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        back.setBackGroundColor(cc.color("#6fcdc1"));
        back.setContentSize(sWidth, 180*scale);
        _this.addChild(back,_this.ORDER_Z_SETTING);
        _this.setMode0backPosY();
        var resOff = [
            LightingRes.set_lnb_text_off,
            LightingRes.set_lnb_direction_off,
            LightingRes.set_lnb_size_off,
            LightingRes.set_lng_color_off,
            LightingRes.set_lnb_effect_off,
            LightingRes.set_lnb_blink_off,

            LightingRes.set_b_close
        ];
        var resOn = [
            LightingRes.set_lnb_text_on,
            LightingRes.set_lnb_direction_on,
            LightingRes.set_lnb_size_on,
            LightingRes.set_lng_color_on,
            LightingRes.set_lnb_effect_on,
            LightingRes.set_lnb_blink_on,
            LightingRes.set_b_close
        ];
        var imageWidth1 = 130*scale, imageWidth2 = 100*scale;
        var w = 20*scale;
        if(sWidth/scale < (imageWidth2*6 + w*5 + 2*(imageWidth1 + w))){
            w = (sWidth/scale - (imageWidth1*2 + imageWidth2*6))/9;
            if(w < 0) w = 0;
        }
        //cc.log("w="+w+":scale:"+scale+"::"+(sWidth/scale)+"::"+(imageWidth2*6 + w*5 + 2*(imageWidth1 + w)));
        var resX = [
            sWidth/2 - 5*w/2 - 5*imageWidth2/2,
            sWidth/2 - 3*w/2 - 3*imageWidth2/2,
            sWidth/2 - w/2 - imageWidth2/2,
            sWidth/2 + w/2 + imageWidth2/2,
            sWidth/2 + 3*w/2 + 3*imageWidth2/2,
            sWidth/2 + 5*w/2 + 5*imageWidth2/2,
            sWidth - w - imageWidth1/2
        ];

        for(var i = 0; i < resOff.length; i++){
            if(i == 0){
                if(cc.sys.os == cc.sys.OS_ANDROID){//对应安卓有的机器不自动弹出键盘问题
                    var delegate = {};

                    delegate.editBoxEditingDidBegin = function(editBox){
                        name_random_field.removeFromParent();
                        _this.showKeybord();
                    };

                    delegate.editBoxEditingDidEnd = function(editBox){

                    };

                    delegate.editBoxTextChanged = function(editBox, text) {

                    };

                    var name_random_field = new cc.EditBox(cc.size(100, 100), new cc.Scale9Sprite(), null, null);
                    name_random_field.setBodyStyle(1);
                    name_random_field.setScale(scale,scale);
                    name_random_field.setAnchorPoint(0.5,0.5);
                    name_random_field.setPosition(resX[i], back.getContentSize().height>>1);
                    name_random_field.setDelegate(delegate);
                    back.addChild(name_random_field);

                    var openKeybord = new ccui.Button(resOff[i],resOn[i]);
                    openKeybord.setScale(scale,scale);
                    openKeybord.setAnchorPoint(0.5,0.5);
                    openKeybord.setPosition(resX[i], back.getContentSize().height>>1);
                    //openKeybord.addClickEventListener(function(){
                    //    back.removeFromParent();
                    //    rmLayout.removeFromParent();
                    //    //_this.hideModeSettingBar(rmLayout,back);
                    //    _this.showKeybord();
                    //});
                    back.addChild(openKeybord);
                }else{
                    var openKeybord = new ccui.Button(resOff[i],resOn[i]);
                    openKeybord.setScale(scale,scale);
                    openKeybord.setAnchorPoint(0.5,0.5);
                    openKeybord.setPosition(resX[i], back.getContentSize().height>>1);
                    openKeybord.addClickEventListener(function(){
                        back.removeFromParent();
                        rmLayout.removeFromParent();
                        //_this.hideModeSettingBar(rmLayout,back);
                        _this.showKeybord();
                    });
                    back.addChild(openKeybord);
                }

            }else{
                var Buttom = new ccui.CheckBox(resOff[i],resOn[i]);
                Buttom.setScale(scale,scale);
                Buttom.setTag(i);
                Buttom.setAnchorPoint(0.5,0.5);
                if(i == resOff.length - 2)
                    Buttom.setPosition(resX[i], (back.getContentSize().height>>1) - 5*scale);
                else
                    Buttom.setPosition(resX[i], back.getContentSize().height>>1);
                if(i == _this.cSubModeSelected)Buttom.setSelected(true);
                Buttom.addEventListener(function (sender, type) {
                    if(sender.getTag() == resOff.length - 1){
                        _this.savePopup(rmLayout,back);
                        //_this.hideModeSettingBar(rmLayout,back);
                        return;
                    }
                    switch (type) {
                        case  ccui.CheckBox.EVENT_UNSELECTED:
                            if(sender.getTag() != 0)
                                sender.setSelected(true);
                            break;
                        case ccui.CheckBox.EVENT_SELECTED:
                            if(sender.getTag() != 0){
                                sender.getParent().getChildByTag(_this.cSubModeSelected).setSelected(false);
                                _this.cSubModeSelected = sender.getTag();
                                _this.setMode0SettingBarInfo(back);
                                direction.setPositionX(resX[sender.getTag()]);
                            }
                            break;
                        default:
                            break;
                    }
                }, this);
                back.addChild(Buttom);
            }

        }

        var  direction = new cc.Sprite(LightingRes.set_lnb_point);
        direction.setScale(scale,scale);
        direction.setAnchorPoint(cc.p(0.5, 1));
        direction.setPosition(resX[1], back.getContentSize().height);
        back.addChild( direction);

        return back;
    },

    setMode0SettingBarInfo:function(parent){
        var _this = this;
        if(parent.getChildByTag(10))
            parent.removeChildByTag(10);
        var scale = this.setmode0Scale();
        var back = new ccui.Layout();
        back.setTag(10);
        back.setPosition(0, parent.getContentSize().height - 1);
        back.setTouchEnabled(true);
        back.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        back.setBackGroundColor(cc.color("#568f96"));
        back.setContentSize(cc.winSize.width, 180*scale);
        parent.addChild(back);

        var sprite = _this.getChildByName("text");

        if(_this.cSubModeSelected == 1){//左右移动
            var resOff = [LightingRes.set_direction_left_off,LightingRes.set_direction_right_off,LightingRes.set_direction_stop_off];
            var resOn = [LightingRes.set_direction_left_on,LightingRes.set_direction_right_on,LightingRes.set_direction_stop_on];
            var imageWidth1 = 94*scale;  var w = (cc.winSize.width - (imageWidth1*4))/14;
            var resX = [
                cc.winSize.width/2 - (w + imageWidth1),
                cc.winSize.width/2,
                cc.winSize.width/2 + (w + imageWidth1)
            ];

            for(var i = 0; i < resOff.length; i++) {
                var Buttom = new ccui.CheckBox(resOff[i], resOn[i]);
                Buttom.setTag(i);
                Buttom.setAnchorPoint(0.5, 0.5);
                Buttom.setPosition(resX[i], back.getContentSize().height >> 1);
                Buttom.setScale(scale,scale);
                if(i == _this.mode0Info.direct)
                    Buttom.setSelected(true);
                Buttom.addEventListener(function (sender, type) {
                    switch (type) {
                        case  ccui.CheckBox.EVENT_UNSELECTED:
                            sender.setSelected(true);
                            break;
                        case ccui.CheckBox.EVENT_SELECTED:
                            sender.getParent().getChildByTag(_this.mode0Info.direct).setSelected(false);
                            this.mode0Info.direct = sender.getTag();
                            _this.moveAnimation();
                            break;

                        default:
                            break;
                    }
                }, this);
                back.addChild(Buttom);
            }
        }else if(_this.cSubModeSelected == 2){//文字大小
            var resOff = [LightingRes.set_fontsize_1_off,LightingRes.set_fontsize_2_off,LightingRes.set_fontsize_3_off, LightingRes.set_fontsize_4_off,LightingRes.set_fontsize_5_off];
            var resOn = [LightingRes.set_fontsize_1_on,LightingRes.set_fontsize_2_on,LightingRes.set_fontsize_3_on,LightingRes.set_fontsize_4_on,LightingRes.set_fontsize_5_on];
            var imageWidth1 = 100*scale;  var w = (cc.winSize.width - (imageWidth1*5))/14;
            var resX = [
                cc.winSize.width/2 - 2*(imageWidth1 + w),
                cc.winSize.width/2 - (imageWidth1 + w),
                cc.winSize.width/2,
                cc.winSize.width/2 + (imageWidth1 + w),
                cc.winSize.width/2 + 2*(imageWidth1 + w)
            ];
            sprite.setFontSize(_this.textSizeArray[_this.mode0Info.size]);
            for(var i = 0; i < resOff.length; i++){
                var Buttom = new ccui.CheckBox(resOff[i],resOn[i]);
                Buttom.setTag(i);
                Buttom.setScale(scale,scale);
                Buttom.setAnchorPoint(0.5,0.5);
                if(i == _this.mode0Info.size)
                    Buttom.setSelected(true);
                Buttom.setPosition(resX[i], back.getContentSize().height>>1);
                Buttom.addEventListener(function (sender, type) {
                    switch (type) {
                        case  ccui.CheckBox.EVENT_UNSELECTED:
                            sender.setSelected(true);
                            break;
                        case ccui.CheckBox.EVENT_SELECTED:
                            sender.getParent().getChildByTag(_this.mode0Info.size).setSelected(false);
                            _this.mode0Info.size = sender.getTag();
                            _this.setTextFontSize();
                            _this.moveAnimation();
                            break;
                        default:
                            break;
                    }

                }, this);
                back.addChild(Buttom);
            }

        }else if(_this.cSubModeSelected == 3){//颜色

            var resOff = [LightingRes.set_color_w,LightingRes.set_color_b,LightingRes.set_color_r,
                LightingRes.set_color_g,LightingRes.set_color_y,LightingRes.set_color_m,LightingRes.set_color_rb];
            //var resOn = [LightingRes.set_light_on,LightingRes.set_lng_color_on,LightingRes.set_lnb_brightness_on,LightingRes.set_lnb_blink_on,LightingRes.set_b_close];
            var imageWidth1 = 80*scale;  var w = (cc.winSize.width - (imageWidth1*7))/14;
            var resX = [
                cc.winSize.width/2 - 3*(imageWidth1 + w),
                cc.winSize.width/2 - 2*(imageWidth1 + w),
                cc.winSize.width/2 - (imageWidth1 + w),
                cc.winSize.width/2,
                cc.winSize.width/2 + (imageWidth1 + w),
                cc.winSize.width/2 + 2*(imageWidth1 + w),
                cc.winSize.width/2 + 3*(imageWidth1 + w)
            ];

            if(_this.mode0Info.color != null)
                sprite.color = _this.textColorArray[_this.mode0Info.color];
            for(var i = 0; i < resOff.length; i++){
                var Buttom = new ccui.CheckBox(resOff[i],resOff[i]);
                Buttom.setTag(i);
                Buttom.setScale(scale,scale);
                Buttom.setAnchorPoint(0.5,0.5);
                Buttom.setPosition(resX[i], back.getContentSize().height>>1);
                Buttom.addEventListener(function (sender, type) {
                    //sprite.color = cc.color(0, 0, 255);
                    _this.mode0Info.color = sender.getTag();
                    _this.setTextColor();
                    _this.mode0backAnimation();
                }, this);
                back.addChild(Buttom);
            }
        }else if(_this.cSubModeSelected == 4){//布置背景
            var resOff = [
                LightingRes.set_effect_led_off,
                LightingRes.set_effect_neon_off,
                LightingRes.set_effect_none_off,
                LightingRes.set_effect_star_off,
                LightingRes.set_effect_twinkle_off,
                LightingRes.set_effect_line_1_off,
                LightingRes.set_effect_line_2_off
            ];
            var resOn = [
                LightingRes.set_effect_led_on,
                LightingRes.set_effect_neon_on,
                LightingRes.set_effect_none_on,
                LightingRes.set_effect_star_on,
                LightingRes.set_effect_twinkle_on,
                LightingRes.set_effect_line_1_on,
                LightingRes.set_effect_line_2_on
            ];
            var imageWidth1 = 94*scale;  var w = (cc.winSize.width - (imageWidth1*7))/20;
            var resX = [
                (cc.winSize.width/2 + w) - 3*(w + imageWidth1) - 2*w,
                (cc.winSize.width/2 + w) - 2*(w + imageWidth1) - 2*w,
                (cc.winSize.width/2 + w) - 1*(w + imageWidth1),
                (cc.winSize.width/2 + w),
                (cc.winSize.width/2 + w) + 1*(w + imageWidth1),
                (cc.winSize.width/2 + w) + 2*(w + imageWidth1),
                (cc.winSize.width/2 + w) + 3*(w + imageWidth1)
            ];

            var draw = new cc.DrawNode();
            var vertices = [
                cc.p((cc.winSize.width/2 + w) - (5*w + 3*imageWidth1)/2, (back.getContentSize().height >> 1) - 29),
                cc.p((cc.winSize.width/2 + w) - (5*w + 3*imageWidth1)/2, (back.getContentSize().height >> 1) + 29)
            ];
            draw.drawPoly(vertices, null, 2, cc.color("#76a5aa"));
            back.addChild(draw);


            for(var i = 0; i < resOff.length; i++) {
                var Buttom = new ccui.CheckBox(resOff[i], resOn[i]);
                Buttom.setTag(i);
                Buttom.setAnchorPoint(0.5, 0.5);
                Buttom.setPosition(resX[i], back.getContentSize().height >> 1);
                Buttom.setScale(scale,scale);
                if(i == _this.mode0Info.effect1 || i == _this.mode0Info.effect2)
                    Buttom.setSelected(true);
                Buttom.addEventListener(function (sender, type) {
                    switch (type) {
                        case  ccui.CheckBox.EVENT_UNSELECTED:
                            sender.setSelected(true);
                            break;
                        case ccui.CheckBox.EVENT_SELECTED:
                            var tag = sender.getTag();
                            if(tag < 2){
                                sender.getParent().getChildByTag(_this.mode0Info.effect1).setSelected(false);
                                _this.mode0Info.effect1 = tag;
                            }else{
                                sender.getParent().getChildByTag(_this.mode0Info.effect2).setSelected(false);
                                _this.mode0Info.effect2 = tag;
                            }
                            _this.mode0backAnimation();
                            break;
                        default:
                            break;
                    }
                }, this);
                back.addChild(Buttom);
            }
        } else if(_this.cSubModeSelected == 5){//闪烁

            var resOff = [LightingRes.set_b_none_off,LightingRes.set_b_1_off,LightingRes.set_b_2_off,LightingRes.set_b_3_off];
            var resOn = [LightingRes.set_b_none_on,LightingRes.set_b_1_on,LightingRes.set_b_2_on,LightingRes.set_b_3_on];
            var imageWidth1 = 100*scale;  var w = (cc.winSize.width - (imageWidth1*4))/15;
            var resX = [cc.winSize.width/2 - 3*(w + imageWidth1)/2,  cc.winSize.width/2 - w/2 - imageWidth1/2,cc.winSize.width/2 + w/2 + imageWidth1/2, cc.winSize.width/2 + 3*(w + imageWidth1)/2];

            for(var i = 0; i < resOff.length; i++) {
                var Buttom = new ccui.CheckBox(resOff[i], resOn[i]);
                Buttom.setTag(i);
                Buttom.setAnchorPoint(0.5, 0.5);
                Buttom.setPosition(resX[i], back.getContentSize().height >> 1);
                Buttom.setScale(scale,scale);
                if(_this.mode0Info.blink == null){
                    if(i == 0){
                        Buttom.setSelected(true);
                        _this.mode0Info.blink = i;
                    }
                }else{
                    if(i == _this.mode0Info.blink)
                        Buttom.setSelected(true);
                }
                Buttom.addEventListener(function (sender, type) {
                    switch (type) {
                        case  ccui.CheckBox.EVENT_UNSELECTED:
                            sender.setSelected(true);
                            break;
                        case ccui.CheckBox.EVENT_SELECTED:
                            sender.getParent().getChildByTag(_this.mode0Info.blink).setSelected(false);
                            _this.mode0Info.blink = sender.getTag();
                            _this.moveAnimation();
                            break;

                        default:
                            break;
                    }
                }, this);
                back.addChild(Buttom);
            }
        }

        return back;
    },

    setScreenRotateA:function(isShow){
        if(isShow){
            if(this.getChildByName("screenRotateA")) return;
            var back = new ccui.Layout();
            back.setName("screenRotateA");
            back.setPosition(0, 0);
            back.setTouchEnabled(true);
            back.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            back.setBackGroundColor(cc.color("#000000"));
            back.setContentSize(cc.winSize.width,cc.winSize.height);
            this.addChild(back,this.ORDER_Z_TOP);

            var sprite = new cc.Sprite(LightingRes.Screen_rotation_A);
            sprite.setAnchorPoint(cc.p(0.5, 0.5));
            sprite.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            back.addChild(sprite);

            if(this.Popinput)
                this.Popinput.setVisible(false);

            Utility.isPortrait.state = 1;
            if(this.getChildByName("keybord")){
                this.getChildByName("keybord").setInputblur();
            }
        }else{
            if(!this.getChildByName("screenRotateA")) return;
            this.getChildByName("screenRotateA").removeFromParent();
            if(Utility.isPortrait.sW2 == null){//就进入一次
                Utility.isPortrait.sW2 = window.innerWidth;
                Utility.isPortrait.sH2 = window.innerHeight;
                this.createText();
                this.initText();
            }else{
                this.setMode0backPosY();
            }
            if(this.Popinput)
                this.Popinput.setVisible(true);

        }

        //cc.log(
        //    ":cc.winSize.width=" + cc.winSize.width +
        //    ":cc.winSize.height=" + cc.winSize.height +
        //    ":window.innerWidth=" + window.innerWidth +
        //    ":window.innerHeight=" + window.innerHeight
        //);

    },

    setScreenRotateB:function(){
            var back = new ccui.Layout();
            var scale = this.setmode0Scale();
            back.setScale(scale,scale);
            back.setName("screenRotateB");
            back.setPosition(0, 0);
            back.setTouchEnabled(true);
            back.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            back.setBackGroundColor(cc.color("#000000"));
            back.setContentSize(cc.winSize.width,cc.winSize.height);
            this.addChild(back,this.ORDER_Z_TOP);

            var sprite = new cc.Sprite(LightingRes.Screen_rotation_B);
            sprite.setAnchorPoint(cc.p(0.5, 0.5));
            sprite.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            back.addChild(sprite);

    },

    showKeybord:function(){
        var _this = this;
        _this.isKeybord = true;
        _this.isshowkeybord = true;
        if(this.getChildByName("keybord"))
            this.getChildByName("keybord").removeFromParent();

        if(this.getChildByName("keybordBack"))
            this.getChildByName("keybordBack").removeFromParent();

        var scale = this.setmode0Scale();

        var delegate = {};
        delegate.editBoxEditingDidEnd = function(editBox){
            var delaytime = 400;
            if(cc.sys.os == cc.sys.OS_IOS) delaytime = 10;
            setTimeout(function () {
                if(_this.gameStage == _this.TAG_SETTING){
                    editBox.removeFromParent();
                    if(_this.getChildByName("keybordBack"))
                        _this.getChildByName("keybordBack").removeFromParent();
                    _this.isKeybord = false;
                    _this.showModeSettingBar();
                }
            }, delaytime);
        };
        _this.tempText = "";
        delegate.editBoxTextChanged = function(editBox, text) {
            var eStr;//最终字符
            var beStr = _this.getChildByName("text").getString();
            var beStrLeng = beStr.length;
            var cuStr = editBox.getString();
            var cuStrLeng = cuStr.length;
            var dist = cuStrLeng - beStrLeng;
            ////
            //cc.log(beStr+"::::"+cuStr+":::"+text);
            //cc.log(beStrLeng+"::"+cuStrLeng+":::"+dist);

            //if(dist > 1){
                var state = 0;//判断是不是表情符号
                var unicode = 0;
                var s = cuStr.substr(cuStrLeng - 1, 1);
                for (var i = 0; i < s.length; i++) {
                    unicode = s.charCodeAt(i);
                    if ((unicode > 50000 && unicode < 65296/*FF10*/) ||  emojiList.indexOf(unicode) > 0) {
                        state = 1;
                        break;
                    }
                }
                if(state == 1){
                    eStr = beStr;
                    editBox.setString(eStr);
                }else{
                    eStr = text;
                }
            //}else{
            //    eStr = text;
            //}
            _this.getChildByName("text").setString(eStr);
            _this.initText();

        };
        var name_random_field = new cc.EditBox(cc.size((cc.winSize.width - 100 - 20), 62), new cc.Scale9Sprite(), null, null, true);//new cc.Scale9Sprite("res/Scene/Lighting/setting/mode0/editBox.png")
        name_random_field.setScale(scale,scale);
        name_random_field.setBodyStyle(1);
        name_random_field.setName("keybord");
        name_random_field.setAnchorPoint(cc.p(0.5, 0));
        //name_random_field.setPlaceholderFontColor(cc.color("#c8c8c8"));
        //name_random_field.setPlaceholderFontSize(22);
        //name_random_field.setPlaceHolder("テキストを入力してください");
        var _y = cc.winSize.height - 150 + 50;
        if(cc.sys.os == cc.sys.OS_IOS) _y = cc.winSize.height - 70 - 150 + 26;
        name_random_field.setPosition(cc.winSize.width/2, _y);
        name_random_field.setDelegate(delegate);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(28);
        name_random_field.setMaxLength(16);
        name_random_field.setString(_this.getChildByName("text").getString());
        _this.addChild(name_random_field,_this.TAG_SETTING - 1);
        name_random_field.setInputfocus();

        var back = new ccui.Layout();
        back.setScale(scale,scale);
        back.setName("keybordBack");
        back.setAnchorPoint(cc.p(0.5, 0));
        back.setPosition(cc.winSize.width/2, name_random_field.getPositionY() - 26 + 8);
        back.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        back.setBackGroundColor(cc.color("#6fcdc1"));
        back.setContentSize(cc.winSize.width - 50,150);
        _this.addChild(back,_this.TAG_SETTING - 2);

        var label = new cc.LabelTTF("テキストを入力してください");
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(28);
        label.setFontFillColor(new cc.Color(255,255,255,255));
        label.setAnchorPoint(0.5, 1);
        label.setPosition(back.getContentSize().width/2, back.getContentSize().height - 15);
        back.addChild(label);

        var wback = new ccui.Layout();
        wback.setPosition(25, 26 + 15 - 10);
        wback.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        wback.setBackGroundColor(cc.color("#ffffff"));
        wback.setContentSize(cc.winSize.width - 100,62);
        back.addChild(wback);

    },

    createText:function(){

        var label = new ccui.Text();
        label.setTextShowHeight(true);
        var scale = this.setmode0Scale();
        label.setScale(scale,scale);
        if(this.tempText != null)
            label.setString(this.tempText);
        else
            label.setString("HELLO");
        label.setName("text");
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(cc.winSize.width>>1, (cc.winSize.height>>1));
        label.setFontName(GAME_FONT.PRO_W6);
        label.setColor(cc.color("#ffffff"));
        this.addChild(label,this.ORDER_Z_SETTING - 2);
    },

    setTextPosition:function(pos){
        var label = this.getChildByName("text");
        if(label){
            if (cc.sys.os == cc.sys.OS_IOS) {
                if (Utility.isPortrait.sH2 != null && window.innerHeight < Utility.isPortrait.sH2)
                {
                    if(Utility.isPortrait.sH2 - window.innerHeight > 44/*barHeight*/){//iphone5s ios9
                        if(this.isshowkeybord)
                            label.setPositionY((cc.winSize.height>>1) - (cc.sys.os == cc.sys.OS_IOS?(label.getFontSize()/2):(label.getFontSize()/3)) + (Utility.isPortrait.sH2 - window.innerHeight)*5/8);
                        else
                            label.setPositionY((cc.winSize.height>>1) - (cc.sys.os == cc.sys.OS_IOS?(label.getFontSize()/2):(label.getFontSize()/3)) + (Utility.isPortrait.sH2 - window.innerHeight)/8);
                    }else{
                        label.setPositionY((cc.winSize.height>>1) - (cc.sys.os == cc.sys.OS_IOS?(label.getFontSize()/2):(label.getFontSize()/3)) + (Utility.isPortrait.sH2 - window.innerHeight)/2);
                    }
                }else
                    label.setPositionY((cc.winSize.height>>1) - (cc.sys.os == cc.sys.OS_IOS?(label.getFontSize()/2):(label.getFontSize()/3)));
            } else {
                label.setPositionY((cc.winSize.height>>1) - (cc.sys.os == cc.sys.OS_IOS?(label.getFontSize()/2):(label.getFontSize()/3)));
            }

        }
    },

    initText:function(){
        var label = this.getChildByName("text");
        if(label){
            //size
            this.setTextFontSize();
            //color
            this.setTextColor();
            //effect
            this.mode0backAnimation();
            //blink,direct
            this.moveAnimation(true);
        }

    },

    setmode0Scale:function(){
        if(Utility.isPortrait.sW2 == null){
            cc.log("error  not scale for mode0");
            return 1;
        }else{
            var scale = parseFloat(Utility.isPortrait.sW1/Utility.isPortrait.sH1);
            var num = Math.round(scale*100)/100;
            return num;
        }

    },

    setTextFontSize:function() {
        var sprite = this.getChildByName("text");
        var size = this.textSizeArray[this.mode0Info.size];
        sprite.setFontSize(size);
        this.setTextPosition();
    },

    setTextColor:function() {
        var _this = this;
        var sprite = _this.getChildByName("text");
        if(this.mode0Info.color == null)
            this.mode0Info.color = 0;

        sprite.color = _this.textColorArray[this.mode0Info.color];
        sprite.unschedule("color");
        if (this.mode0Info.color == this.textColorArray.length - 1) {
            var changeColor = 1;
            sprite.schedule(function () {
                sprite.color = _this.textColorArray[changeColor];
                if (changeColor < _this.textColorArray.length - 1)
                    changeColor++;
                else
                    changeColor = 1;
            }, 0.5, "color");
        }
    },

    moveAnimation:function(isinitPos){
        var sprite = this.getChildByName("text");
        var scale = this.setmode0Scale();

        sprite.unschedule("moveAnim");
        sprite.stopAllActions();
        sprite.setOpacity(255);
        //sprite.setPositionX(cc.winSize.width>>1);
        if(this.mode0Info.direct == 0 || this.mode0Info.direct == 1){
            var direct = this.mode0Info.direct;

            var GetLength = function(str)
            {
                var realLength = 0;
                for (var i = 0; i < str.length; i++)
                {
                    charCode = str.charCodeAt(i);
                    if (charCode >= 0 && charCode <= 128)
                        realLength += 1;
                    else
                        realLength += 1.4;
                }
                return realLength;
            };

            var len = GetLength(sprite.getString());
            var size = sprite.getFontSize();
            var maxMove = size*(len - (len/4))*scale;

            //if(direct == 0) {//left
            //    sprite.schedule(function () {
            //        var cuPos = sprite.getPositionX();
            //        if(cuPos > - maxMove/2)
            //            sprite.setPositionX(cuPos - 6);
            //        else
            //            sprite.setPositionX(cc.winSize.width + maxMove/2);
            //    }, 0.01, "moveAnim");
            //}else if(direct == 1){//right
            //    sprite.schedule(function () {
            //        var cuPos = sprite.getPositionX();
            //        if(cuPos < cc.winSize.width + maxMove/2)
            //            sprite.setPositionX(cuPos + 6);
            //        else
            //            sprite.setPositionX(-maxMove/2);
            //    }, 0.01, "moveAnim");
            //}

            var maxDist = cc.winSize.width/2 + maxMove/2;
            var cuPos = sprite.getPositionX();
            var curDist;

            var time = parseInt(len/4);
            var time = 2.0 + time;
            var maxtime = time;
            if(direct == 0) {//left
                if(cuPos > 0)
                    curDist =  cuPos + maxMove/2;
                else
                    curDist =  maxMove/2 - Math.abs(cuPos);
                time =  time*curDist/maxDist;
                if(time < 0 )time = 0.1;//有时获得负数
                sprite.runAction(cc.sequence(
                    cc.moveTo(time, cc.p(-maxMove/2, sprite.getPositionY())),
                    cc.moveTo(0.001, cc.p(maxMove/2 + (cc.winSize.width), sprite.getPositionY())),
                    new cc.callFunc(function(node){
                        sprite.runAction(cc.sequence(
                            cc.moveTo(2*maxtime, cc.p(-maxMove/2, sprite.getPositionY())),
                            cc.moveTo(0.001, cc.p(maxMove/2 + cc.winSize.width, sprite.getPositionY()))
                        ).repeatForever());
                    }, this)
                ));
            }else if(direct == 1) {//right
                if(cuPos > 0)
                    curDist =  cc.winSize.width - cuPos + maxMove/2;
                else
                    curDist =  maxMove/2 + cc.winSize.width  - cuPos;
                time =  time*curDist/maxDist;
                if(time < 0 )time = 0.1;//有时获得负数
                sprite.runAction(cc.sequence(
                    cc.moveTo(time, cc.p(maxMove/2 + (cc.winSize.width), sprite.getPositionY())),
                    cc.moveTo(0.001, cc.p(-maxMove/2, sprite.getPositionY())),
                    new cc.callFunc(function(node){
                        sprite.runAction(cc.sequence(
                            cc.moveTo(2*maxtime, cc.p(maxMove/2 + cc.winSize.width, sprite.getPositionY())),
                            cc.moveTo(0.001, cc.p(-maxMove/2, sprite.getPositionY()))
                        ).repeatForever());
                    }, this)
                ));
            }
        }

        if(this.mode0Info.blink > 0){
                var array = [1.0,0.5, 0.5,0.2, 0.1,0.1];
                sprite.runAction(cc.sequence(
                    cc.delayTime(array[2*(this.mode0Info.blink - 1)]),
                    cc.fadeTo(0.1,0),
                    cc.delayTime(array[2*(this.mode0Info.blink - 1) + 1]),
                    cc.fadeTo(0.1,255)
                ).repeatForever());
        }

    },

    mode0backAnimation:function(){

        var label = this.getChildByName("text");

        var res, sIndex,eIndex,frame,imgH;
        if(this.mode0Info.effect1 == 0){
            if(this.getChildByTag(this.TAG_ANIM1)){
                this.getChildByTag(this.TAG_ANIM1).removeFromParent();
            }
            label.disableShadow();

            var scale = this.setmode0Scale();
            var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
            animback.setPosition(0, 0);
            animback.setTag(this.TAG_ANIM1);
            this.addChild(animback,this.ORDER_Z_SETTING - 1);

            var sprite = new cc.Sprite(LightingRes.set_pattern);
            sprite.setScale(scale,scale);
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(0, 0);
            animback.addChild(sprite);

            //var height = cc.winSize.height;//label.getFontSize();
            //for(var j = 0; j < height; j+=8*scale){
            //    var sprite = new cc.Sprite(LightingRes.set_pattern);
            //    sprite.setScale(scale,scale);
            //    sprite.setAnchorPoint(cc.p(0, 1.0));
            //    sprite.setPosition(0, 0 + j);//label.getPositionY() - height/2
            //    animback.addChild(sprite);
            //}
        }else if(this.mode0Info.effect1 == 1){
            if(this.getChildByTag(this.TAG_ANIM1)){
                this.getChildByTag(this.TAG_ANIM1).removeFromParent();
            }
            label.disableShadow();
            label.enableShadow(this.textColorArray[this.mode0Info.color],cc.size(0, 0),20);
        }

        if(this.mode0Info.effect2 == 2){
            if(this.getChildByTag(this.TAG_ANIM)){
                this.getChildByTag(this.TAG_ANIM).removeFromParent();
            }
            //if(this.getChildByTag(this.TAG_ANIM1)){
            //    this.getChildByTag(this.TAG_ANIM1).removeFromParent();
            //}
            //label.disableShadow();
            return;
        }else if(this.mode0Info.effect2 == 3){
            frame = 0.12;
            sIndex = 1;
            eIndex = 10;
            res = "neon_star_";
        }else if(this.mode0Info.effect2 == 4){
            frame = 0.14;
            sIndex = 1;
            eIndex = 10;
            res = "neon_kirakira/neon_kirakira_";
            imgH = 300;
        }else if(this.mode0Info.effect2 == 5){
            frame = 0.1;
            sIndex = 1;
            eIndex = 9;
            res = "neon_line1/neon_line01_";
            imgH = 260;
        }else if(this.mode0Info.effect2 == 6){
            frame = 0.1;
            sIndex = 1;
            eIndex = 2;
            res = "neon_line2/neon_line02_";
            imgH = 130;
        }else {
            return;
        }

        if(this.getChildByTag(this.TAG_ANIM)){
            this.getChildByTag(this.TAG_ANIM).removeFromParent();
        }

        var scale = this.setmode0Scale();
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback,this.ORDER_Z_MAIN);

        if(this.mode0Info.effect2 == 4 || this.mode0Info.effect2 == 5 || this.mode0Info.effect2 == 6){
            var anim = new cc.Sprite();
            anim.setAnchorPoint(0.5, 1);
            anim.setPosition(cc.winSize.width>>1, cc.winSize.height);
            anim.setScale(scale*1126/1334,scale*1126/1334);
            anim.setName("animtop");
            var frames = [];
            for(var i = sIndex ; i <= eIndex; i++){
                if(i < 10)
                    frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode0/backAnimation/"+res+"0" + (i) + "_top" + ".png", new cc.Rect(0, 0, 1334, imgH)));
                else
                    frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode0/backAnimation/"+res + (i) + "_top" + ".png", new cc.Rect(0, 0, 1334, imgH)));
            }
            var animate = cc.animate(new cc.Animation(frames, frame));
            anim.runAction(new cc.Sequence(animate).repeatForever());
            animback.addChild(anim);


            var anim = new cc.Sprite();
            anim.setName("animbot");
            anim.setAnchorPoint(0.5, 0);
            anim.setPosition(cc.winSize.width>>1, 0);
            anim.setScale(scale*1126/1334,scale*1126/1334);
            var frames = [];
            for(var i = sIndex ; i <= eIndex; i++){
                if(i < 10)
                    frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode0/backAnimation/"+res+"0" + (i) + "_bot" + ".png", new cc.Rect(0, 0, 1334, imgH)));
                else
                    frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode0/backAnimation/"+res + (i) + "_bot" + ".png", new cc.Rect(0, 0, 1334, imgH)));
            }
            var animate = cc.animate(new cc.Animation(frames, frame));
            anim.runAction(new cc.Sequence(animate).repeatForever());
            animback.addChild(anim);
            this.setMode0backPosY();
        }else{
            var anim = new cc.Sprite();
            anim.setAnchorPoint(0.5, 0.5);
            anim.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            anim.setScale(scale*1126/1334,scale*1126/1334);
            var frames = [];
            for(var i = sIndex ; i <= eIndex; i++){
                if(i < 10)
                    frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode0/backAnimation/"+res+"0" + (i) + ".png", new cc.Rect(0, 0, 1334, 750)));
                else
                    frames.push(new cc.SpriteFrame("res/Scene/Lighting/setting/mode0/backAnimation/"+res + (i) + ".png", new cc.Rect(0, 0, 1334, 750)));
            }
            var animate = cc.animate(new cc.Animation(frames, frame));
            anim.runAction(new cc.Sequence(animate).repeatForever());
            animback.addChild(anim);
        }


    },

    savePopup:function(barBack,rmLayout){
        this.isshowkeybord = true;
        Utility.isPortrait.isFixedH = true;
        var _this = this;
        var mask = new Mask();
        this.addChild(mask,this.ORDER_Z_TOP - 2);
        mask.open();

        var scale = this.setmode0Scale();
        var pop_layout = new RoundRect(570, 40+30+60+40+100+30);
        pop_layout.setName("pop_layout");
        pop_layout.setScale(scale,scale);
        pop_layout.setAnchorPoint(0.5, 0.5);
        pop_layout.setPosition(cc.winSize.width>>1, (cc.winSize.height>>1) + 50);
        this.addChild(pop_layout,this.ORDER_Z_TOP - 1);

        var label = new cc.LabelTTF("結果を保存しますか？");
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(30);
        label.setFontFillColor(new cc.Color(111,205,193,255));
        label.setAnchorPoint(0, 1);
        label.setPosition(35, pop_layout.getContentSize().height - 40);
        pop_layout.addChild(label);

        var line2 = new cc.Sprite(GlobalRes.color_eeeeee);
        line2.setAnchorPoint(0, 0);
        line2.setPosition(35,label.getPosition().y - label.getContentSize().height - 30 - 58);
        line2.setScale(498,2);
        pop_layout.addChild(line2);

        var input = this.Popinput = new cc.EditBox(cc.size(498, 58),new cc.Scale9Sprite());
        input.setBodyStyle(1);
        input.setName("input");
        input.setFontSize(34);
        input.setFontColor(cc.color("#6fcdc1"));
        input.setString(_this.getChildByName("text").getString());
        input.setFontName(GAME_FONT.PRO_W3);
        input.setAnchorPoint(0, 1);
        input.setPosition(35+1, label.getPosition().y - label.getContentSize().height - 30-1);
        pop_layout.addChild(input);

        var save_btn = new ccui.Button(GlobalRes.color_b0e2cf, GlobalRes.color_b0e2cf);
        save_btn.setScale(285, 100);
        save_btn.setAnchorPoint(0, 0);
        save_btn.setPosition(285, 0);
        pop_layout.addChild(save_btn);
        var _this = this;
        var save_callback = function(){
            if(input.getString() === ""){
                alert("タイトルを入力してください");
                return;
            }
            input.setVisible(false);
            //input.removeFromParent();
            mainView.setHistory(input.getString());
            pop_layout.removeFromParent();
            mask.removeFromParent();
            _this.hideModeSettingBar(barBack,rmLayout);
            Utility.isPortrait.isFixedH = false;
            //mainView.gotoMain();
        };
        save_btn.addClickEventListener(save_callback);

        var cancel_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
        cancel_btn.setScale(285, 100);
        cancel_btn.setAnchorPoint(0, 0);
        cancel_btn.setPosition(0, 0);
        pop_layout.addChild(cancel_btn);

        var cancel_callback = function(){
            //mainView.gotoMain();
            pop_layout.removeFromParent();
            mask.removeFromParent();
            _this.hideModeSettingBar(barBack,rmLayout);
            Utility.isPortrait.isFixedH = false;
        };
        cancel_btn.addClickEventListener(cancel_callback);

        var save_text = new cc.LabelTTF("保存");
        save_text.setFontName(GAME_FONT.PRO_W6);
        save_text.setFontSize(30);
        save_text.setFontFillColor(cc.color(255,255,255,255));
        save_text.setAnchorPoint(0.5, 0.5);
        save_text.setPosition(285 + 285/2, 50);
        pop_layout.addChild(save_text);

        var cancel_text = new cc.LabelTTF("キャンセル");
        cancel_text.setFontName(GAME_FONT.PRO_W6);
        cancel_text.setFontSize(30);
        cancel_text.setFontFillColor(cc.color(255,255,255,255));
        cancel_text.setAnchorPoint(0.5, 0.5);
        cancel_text.setPosition(285/2, 50);
        pop_layout.addChild(cancel_text);
        //修改iphones弹出pop的时候 尺寸不对问题
        this.setMode0backPosY();
        this.setTextPosition();
    },

    gotoMain:function(){

        if(this.getChildByName("keybord")){//修改 iOS 键盘弹出状态下，点击后腿按钮 再不弹出键盘 BUG
            this.isKeybord = false;
            this.getChildByName("keybord").setInputblur();
        }

        if(Utility.isPortrait.state > 0){
            if(Utility.isPortrait.state == 2){
                Utility.swapToRotationImg();
                Utility.isPortrait.state = 3;
            }else{
                //context.setScreenRotateA(false);
                Utility.isPortrait.state = 0;
            }
        }

        this.removeAllChildren();
        this.initMain();
    },

    getHistory:function(groups){
        if(groups){
            for(var j = 0; j < groups.length; j++){
                for(var k = 0; k < groups[j].members.length; k++){
                    this.tempText = groups[j].members[k].name;
                    this.mode0Info = groups[j].members[k].info;
                }
            }
        }
    },

    setHistory:function(title){
        var _this = this;

        var group = new ArrayList();
        for(var i = 0 ; i < 1; i++){
            var result = {};
            result.name = "title";
            result.icon = "icon";
            result.members = [];
            for(var j = 0 ; j < 1; j++){
                var data = {};
                data.name = _this.getChildByName("text").getString();
                data.info = _this.mode0Info;
                result.members.push(data);
            }
            group.add(result);
        }

        var history = {};
        history.mode = 0;
        history.groups = group.arr;
        history.title = title;
        DataManager.instance().createHistory(GAME_TYPE.Lighting, history);
    }


});

var LightingScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LightingLayer();
        this.addChild(layer);
    }
});