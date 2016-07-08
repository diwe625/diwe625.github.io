/**
 * Created by nhnst on 10/16/15.
 * 러시안 룰렛（俄罗斯轮盘）
 */
var RussianRouletteLayer = cc.LayerColor.extend({
    toolBar:null,
    mainGun:null,
    startBtn:null,
    selectNumScroll:null,
    settingMagazineBg:null,
    bulletNum:null,//选择的总弹夹数
    bulletNumTemp:null,//目前还能开几发
    bulletNumSel:null,//目前剩下的子弹
    gameState:0, //0 nomal  1 clear 2 out  3: magazineAnim  4: Gun null bullet

    TAG_SETTING:200,
    TAG_READY:201,
    TAG_GAME:202,
    TAG_MAIN_BULLET:204,
    TAG_ANIM:205,

    ORDER_Z_MAIN:10,
    ORDER_Z_SETTING:20,
    ORDER_Z_TUTORIAL:50,
    ORDER_Z_EFFECT:60,

    ctor:function () {
        this._super(cc.color(111,205,192,255));

        mainView = this;

        this.init();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.RussianRoulette);

        Utility.sendXhr(GAME_TYPE.RussianRoulette.gameid);

        return true;
    },

    stateBack: function(context){
        if(context.gameState == 0){
            Utility.setMainUrl();
        }else{
            History.go(1);
        }
    },

    update:function(){
        var context = this;
        if(Utility.checkRfresh){
            //switch (context.gameState){
            //    case 0:
                    this.toolBar.setPosition(cc.p(0, cc.winSize.height));
            //if(!context.getChildByTag(context.TAG_SETTING))
                    context.getChildByName("tutorial_info").setPosition(cc.winSize.width - 20, cc.winSize.height - 20);
                    context.getChildByName("mainBack").setContentSize(cc.winSize);//大小修改
                    var height = 200;
                    context.mainGun.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height - height));
                    //break;
            //}
            Utility.checkRfresh = false;
        }
    },

    init:function(){
        this.gameState = 0;

        var aeBack = new cc.LayerColor(cc.color(111,205,192,255), cc.winSize.width,cc.winSize.height);
        aeBack.setName("mainBack");
        this.addChild(aeBack);

        var height = 200;
        this.mainGun = new cc.Sprite(RussianRouletteRes.animation_shot_gun4);
        this.mainGun.setAnchorPoint(cc.p(0.5,1));
        this.mainGun.setPosition(cc.winSize.width/2, cc.winSize.height - height);
        this.addChild(this.mainGun);

        this.startBtn = new ccui.Button(RussianRouletteRes.main_start_btn,RussianRouletteRes.main_start_btn);
        //Start_Btn.setTouchEnabled(true);
        this.startBtn.setAnchorPoint(cc.p(1,0));
        this.startBtn.setPosition(cc.winSize.width - 22, 50);
        this.startBtn.setName("setting_start");
        this.startBtn.addTouchEventListener(this.touchEvent, this);
        this.addChild(this.startBtn,this.ORDER_Z_MAIN);

        this.toolBar = new Toolbar(GAME_TYPE.RussianRoulette);
        this.toolBar.setAnchorPoint(cc.p(0,1));
        this.toolBar.setName("toolBar");
        this.toolBar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(this.toolBar,this.ORDER_Z_MAIN);

        var tutorialInfo = new ccui.Button(RussianRouletteRes.main_info);
        tutorialInfo.setAnchorPoint(1, 1);
        tutorialInfo.setPosition(cc.winSize.width - 20, cc.winSize.height - 20);
        tutorialInfo.setName("tutorial_info");
        tutorialInfo.addTouchEventListener(this.touchEvent, this);
        this.addChild(tutorialInfo,this.ORDER_Z_SETTING + 1);

        this.setTutorialView(true,"main_Tutorial",RussianRouletteRes.main_tutorial_top,height/2,RussianRouletteRes.main_tutorial_bottom);

    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.log("touchEvent " + sender.getName());
                if(sender.getName() == "setting_start"){
                    if(mainView.gameState > 0)
                        break;
                    if(mainView.getChildByTag(mainView.TAG_READY));
                        mainView.removeChildByTag(mainView.TAG_READY,true);
                    if(mainView.getChildByTag(mainView.TAG_GAME));
                        mainView.removeChildByTag(mainView.TAG_GAME,true);
                    mainView.bulletNumTemp = mainView.bulletNum = 6;
                    mainView.bulletNumSel = 1;
                    mainView.startBtn.setTouchEnabled(false);
                    mainView.toolBar.setToolbarTouchEnable(false);
                    mainView.settingView();
                    this.schedule(this.setBulletNumbr,0);
                }else if(sender.getName() == "setting_confirm"){
                    mainView.startBtn.setTouchEnabled(true);
                    mainView.toolBar.setToolbarTouchEnable(true);
                    this.unschedule(this.setBulletNumbr);
                    mainView.removeChildByTag(mainView.TAG_SETTING,true);
                    mainView.readyGame();
                }else if(sender.getName() == "tutorial_info"){
                    if(mainView.getChildByTag(mainView.TAG_SETTING)){
                        var height = 820;
                        var _h = 150;
                        if(cc.winSize.height - height - _h < 0)
                            _h = 0;
                        this.setTutorialView(false,"setting_Tutorial",RussianRouletteRes.setting_tutorial_top,_h + 50);
                    }else{
                        var height = 200;
                        this.setTutorialView(false,"main_Tutorial",RussianRouletteRes.main_tutorial_top,height/2,RussianRouletteRes.main_tutorial_bottom);
                    }

                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    settingView:function(){
        var settingBg = new ccui.Layout();
        settingBg.setContentSize(cc.winSize.width, cc.winSize.height + 400);
        settingBg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        settingBg.setBackGroundColor(cc.color(0,0,0,180));
        settingBg.setBackGroundColorOpacity(180);
        settingBg.setAnchorPoint(0, 0);
        settingBg.setTouchEnabled(true);
        settingBg.setTag(this.TAG_SETTING);
        settingBg.addTouchEventListener(function(){
            this.removeFromParent();
            mainView.startBtn.setTouchEnabled(true);
            mainView.toolBar.setToolbarTouchEnable(true);
        });
        this.addChild(settingBg,this.ORDER_Z_SETTING);

        var width = 640;
        var height = 820;
        var _h = 150;

        if(cc.winSize.height - height - _h < 0)
            _h = 0;

        var settingBack = new RoundRect(width,height);
        settingBack.setPosition((cc.winSize.width - width)/2, cc.winSize.height - height - _h);
        settingBg.addChild(settingBack);

        var bottom_btn_back = new cc.LayerColor(cc.color(111, 205, 192, 255), width,100);
        bottom_btn_back.setPosition(0, 0);
        settingBack.addChild(bottom_btn_back);
        var bottom_btn = new ccui.Button();
        bottom_btn.setContentSize(width, 100);
        bottom_btn.setPosition(width/2, 50);
        bottom_btn.setTouchEnabled(true);
        bottom_btn.setScale9Enabled(true);
        bottom_btn.setName("setting_confirm");
        bottom_btn.setTitleText("確認");
        bottom_btn.setTitleColor(cc.color.WHITE);
        bottom_btn.setTitleFontName(GAME_FONT.PRO_W6);
        bottom_btn.setTitleFontSize(30);
        bottom_btn._titleRenderer.setScanPhixelRGB();
        bottom_btn.addTouchEventListener(this.touchEvent, this);
        bottom_btn_back.addChild(bottom_btn);

        this.selectNumScroll = new ScrollNum(2,13,this.bulletNum);
        this.selectNumScroll.setPosition(width/2, height/2 - 250);
        settingBack.addChild(this.selectNumScroll);

        this.settingMagazineBg = new cc.Sprite(RussianRouletteRes.setting_magazine_bg);
        this.settingMagazineBg.setPosition(width/2, height/2 + 80);
        settingBack.addChild(this.settingMagazineBg);

        this.setSettingBullet(this.settingMagazineBg);

        this.setTutorialView(true,"setting_Tutorial",RussianRouletteRes.setting_tutorial_top,_h + 50);

    },

    setTutorialView:function(isCheckStore,TagName,resTagT,ty,resTagB){
        var saveTag = GAME_TYPE.RussianRoulette.name +"_"+TagName;
        if((isCheckStore && DataManager.instance().getData(saveTag) != 1)|| !isCheckStore)
        {
            var tutorialBg = new cc.LayerColor(cc.color(0, 0, 0, 255), cc.winSize.width, cc.winSize.height);
            tutorialBg.setOpacity(180);
            this.addChild(tutorialBg,this.ORDER_Z_TUTORIAL);

            var top = new cc.Sprite(resTagT);
            top.setAnchorPoint(cc.p(0,1));
            top.setPosition(0,cc.winSize.height - ty);
            tutorialBg.addChild(top);

            if(resTagB){
                var bottom = new cc.Sprite(resTagB);
                bottom.setAnchorPoint(cc.p(0,0));
                bottom.setPosition(0,-6);
                tutorialBg.addChild(bottom);
            }

            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true;
                    }
                    return false;
                },
                onTouchEnded: function (touch, event) {
                    var target = event.getCurrentTarget();
                    if(isCheckStore)
                        DataManager.instance().saveData(saveTag, 1);
                    mainView.removeChild(target,true);
                }
            }), tutorialBg);
        }

    },

    setSettingBullet:function(sBack){
        var arry = [
            [//2
                -230,   0, //0.63
                230,    0
            ],
            [//3
                0,      230,
                -200,   -130,
                200,    -130
            ],
            [//4
                0,      230,
                -230,   0,
                0,      -230,
                230,    0
            ],
            [//5
                0,      240,
                -220,   80,
                -150,   -180,
                150,    -180,
                220,    80
            ],
            [//6
                0,      -230,

                0,      230,
                -210,   110,
                -210,   -110,
                210,    -110,
                210,    110
            ],
            [//7
                0,      235,
                -190,   140,
                -230,   -60,
                -100,   -210,
                100,    -210,
                230,    -60,
                190,    140
            ],
            [//8
                -90,    220,
                -220,   90,
                -220,   -90,
                -90,    -220,
                90,     -220,
                220,    -90,
                220,    90,
                90,     220
            ],
            [//9
                0,      240,
                -150,   175,
                -230,   24,
                -205,   -130,
                -80,    -220,
                80,     -220,
                205,    -130,
                230,    24,
                150,    175
            ],
            [//10
                -80,    230,
                -200,   140,
                -240,   0,
                -200,   -140,
                -80,    -230,
                80,     -230,
                200,    -140,
                240,    0,
                200,    140,
                80,     230
            ],
            [//11
                0,      250,
                -140,   200,
                -230,   100,
                -250,   -40,
                -190,   -170,
                -70,    -250,
                70,     -250,
                190,    -170,
                250,    -40,
                230,    100,
                140,    200
            ],
            [//12
                -70,    245,
                -180,   180,
                -240,   60,
                -240,   -60,
                -180,   -180,
                -70,    -245,
                70,     -245,
                180,    -180,
                240,    -60,
                240,    60,
                180,    180,
                70,     245
            ]
        ];
        if(sBack.getChildrenCount() > 0)//clear All bullet empty
            sBack.removeAllChildren(true);

        var bullet_empty;
        var tempSelBulletNum = this.bulletNumSel = 1;
        for(var num = 0; num < arry[this.bulletNum - 2].length/2; num++){

            bullet_empty = new cc.Sprite(RussianRouletteRes.setting_bullet_empty);
            if(this.bulletNum >= 8){
                var iScale = Math.pow(0.9,this.bulletNum - 7);
                bullet_empty.setScale(iScale,iScale);
            }
            bullet_empty.setPosition(sBack.getTextureRect().width/2 - arry[this.bulletNum - 2][2*num]*0.63,
                                     sBack.getTextureRect().height/2 + 10 + arry[this.bulletNum - 2][2*num + 1]*0.63);
            sBack.addChild(bullet_empty);

            if(tempSelBulletNum > 0){
                tempSelBulletNum--;
                var bullet = new cc.Sprite(RussianRouletteRes.setting_bullet);
                bullet.setPosition(bullet_empty.getContentSize().width/2,bullet_empty.getContentSize().height/2);
                bullet_empty.addChild(bullet);
            }

            var listenerMagazine = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {

                        cc.log("sprite began... x = " + target.getContentSize().width/2 + ", y = " + target.getContentSize().height/2);
                        if(target.getChildrenCount() == 0){
                            mainView.bulletNumSel++;
                            var bullet = new cc.Sprite(RussianRouletteRes.setting_bullet);
                            bullet.setPosition(target.getContentSize().width/2,target.getContentSize().height/2);
                            target.addChild(bullet);
                            SoundManager.instance().playEffect(RussianRouletteRes.sound_magazine_on_off);
                        }else {
                            if(mainView.bulletNumSel == 1)return false;
                            mainView.bulletNumSel--;
                            target.removeAllChildren(true);
                            SoundManager.instance().playEffect(RussianRouletteRes.sound_magazine_on_off);
                        }
                        return true;
                    }
                    return false;
                }
            });
            cc.eventManager.addListener(listenerMagazine, bullet_empty);
        }



    },

    setBulletNumbr:function(){
        if(this.selectNumScroll.getNumber() != this.bulletNum){
            this.bulletNumTemp = this.bulletNum = this.selectNumScroll.getNumber();
            this.setSettingBullet(this.settingMagazineBg);
        }
    },

    setBulletView:function(){
       var mbulletBg = this.getChildByTag(this.TAG_MAIN_BULLET);
        if(!mbulletBg){
            mbulletBg = new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
            mbulletBg.setTag(this.TAG_MAIN_BULLET);
            this.addChild(mbulletBg);
        }

        if(mbulletBg.getChildrenCount()>0)
            mbulletBg.removeAllChildren(true);

        for(var num = 0; num < this.bulletNum; num++){
            var mBullet = new cc.Sprite(RussianRouletteRes.main_bullet_marking);
            mBullet.setAnchorPoint(cc.p(0.5,0));
            mBullet.setPosition(cc.winSize.width/2 - 28 - 5*56 + 56*num,300);
            mbulletBg.addChild(mBullet);
        }

        for(var num = 0; num < this.bulletNumSel; num++){
            var mBullet = new cc.Sprite(RussianRouletteRes.main_bullet);
            mBullet.setAnchorPoint(cc.p(0.5,0));
            mBullet.setPosition(cc.winSize.width/2 - 28 - 5*56 + 56*num,300);
            mbulletBg.addChild(mBullet);
        }
    },

    readyGame:function(){
        this.setBulletView();
        // Make sprite1 touchable
        var slideBack= new cc.LayerColor(cc.color(255, 255, 0, 0), 175, 175);
        slideBack.setTag(this.TAG_READY);
        slideBack.setAnchorPoint(cc.p(0.5,1));
        slideBack.setPosition(cc.winSize.width/2 - 110, cc.winSize.height - 500);
        this.addChild(slideBack);

        var prePos;

        var listenerMagazine = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    prePos = touch.getLocation();
                    //cc.log("onTouchBegan at: " + prePos.x + " " + prePos.y);
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                var pos = touch.getLocation();
                var id = touch.getID();
                //cc.log("onTouchMoved at: " + pos.x + " " + pos.y);
            },
            onTouchEnded: function (touch, event) {
                if(mainView.gameState > 0)
                    return false;
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                var id = touch.getID();
                cc.log("onTouchEnded at: " + pos.x + " " + pos.y);
                var moveDistance = 30;
                var sub = cc.p(pos.x - prePos.x,pos.y - prePos.y);
                if (Math.abs(sub.x) > Math.abs(sub.y))
                {
                    //右滑
                    if (sub.x > moveDistance){
                        cc.log("right");
                    }
                    else
                    //左滑
                    if (sub.x < -moveDistance)
                        cc.log("left");
                }
                else
                {
                    //上滑
                    if (sub.y > moveDistance){
                        cc.log("up");
                        //mainView.removeChildByTag(mainView.TAG_READY,true);
                        mainView.magazineAnimation("up");
                        //cc.eventManager.removeListener(listenerMagazine,slideBack);
                        //mainView.removeChild(slideBack);
                    }
                    else
                    //下滑
                    if (sub.y < -moveDistance){
                        cc.log("down");
                        //mainView.removeChildByTag(mainView.TAG_READY,true);
                        mainView.magazineAnimation("down");
                    }
                }
            },
            onTouchCancelled: function(touch, event) {
                var pos = touch.getLocation();
                var id = touch.getID();
                cc.log("onTouchCancelled at: " + pos.x + " " + pos.y);

            }
        });

        cc.eventManager.addListener(listenerMagazine, slideBack);

    },

    startGame:function() {

        var fireBack= new cc.LayerColor(cc.color(255, 255, 0, 0), 70, 74);
        fireBack.setTag(this.TAG_GAME);
        fireBack.setAnchorPoint(cc.p(0.5,1));
        fireBack.setPosition(cc.winSize.width/2 + 75, cc.winSize.height - 600);
        this.addChild(fireBack);

        var listenerMagazine = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {

                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                if(mainView.gameState > 0 || mainView.getChildByTag(mainView.TAG_ANIM))
                    return false;
                if(mainView.bulletNumSel <= 0){//没子弹了
                    mainView.gameState = 4;
                    mainView.scheduleOnce(function(){
                        mainView.shotFailGunAnimation();
                        SoundManager.instance().playEffect(RussianRouletteRes.sound_empty_gun);
                    },0.2);

                    return false;
                }
                var rand = Utility.getRandomInt(1,mainView.bulletNumTemp);
                cc.log(": " + mainView.bulletNumTemp+"::"+mainView.bulletNumSel+"::"+mainView.bulletNum);
                if(rand <= mainView.bulletNumSel || mainView.bulletNumSel == mainView.bulletNum){
                    mainView.bulletNumSel--;
                    mainView.gameState = 2;
                    mainView.scheduleOnce(function(){
                        mainView.shotGunAnimation();
                    },0.2);
                }else{
                    mainView.gameState = 1;
                    mainView.scheduleOnce(function(){
                        mainView.shotFailGunAnimation();
                        SoundManager.instance().playEffect(RussianRouletteRes.sound_no_bang);
                    },0.2);
                }
                mainView.bulletNumTemp--;
                mainView.startBtn.setTouchEnabled(false);
                mainView.toolBar.setToolbarTouchEnable(false);
            }
        });
        cc.eventManager.addListener(listenerMagazine, fireBack);

    },

    magazineAnimation:function(typeStr){//up, down
        SoundManager.instance().playEffect(RussianRouletteRes.sound_revolver_shuffle);
        this.gameState = 3;
        var frameTime = 0.02;
        var animGun = new cc.Sprite();
        animGun.setAnchorPoint(0, 1);
        animGun.setPosition(0.5, cc.winSize.height - 200 - 3);
        var frames = [];
        for(var i = 1 ; i <= 15; i++){
            var _num = "_00";
            if(i >= 10) _num = "_0";
            var str = "res/Scene/RussianRoulette/animation/" + (typeStr) + (_num) + (i) + ".png";
            frames.push(new cc.SpriteFrame(str,new cc.Rect(0, 0, 750, 560)));
        }
        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        animGun.runAction(new cc.Sequence(animate));
        this.addChild(animGun);
        animGun.scheduleOnce(function(){
            //mainView.removeChild(animGun,true);
            animGun.removeFromParent(true);
            if(mainView.getChildByTag(mainView.TAG_GAME) == null)
                mainView.startGame();
            mainView.gameState = 0;
        },animation.getTotalDelayUnits()*frameTime);

    },

    shotFailGunAnimation:function(){
        this.mainGun.setVisible(false);
        var frameTime = 0.2;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback);

        anim = new cc.Sprite();
        anim.setAnchorPoint(0, 1);
        anim.setPosition(0.5, cc.winSize.height - 200);
        var frames = [];
        frames.push(new cc.SpriteFrame(RussianRouletteRes.animation_shot_gun4_1, new cc.Rect(0, 0, 750, 560)));
        frames.push(new cc.SpriteFrame(RussianRouletteRes.animation_shot_gun4, new cc.Rect(0, 0, 750, 560)));
        frames.push(new cc.SpriteFrame(RussianRouletteRes.animation_shot_gun4, new cc.Rect(0, 0, 750, 560)));
        frames.push(new cc.SpriteFrame(RussianRouletteRes.animation_shot_gun4, new cc.Rect(0, 0, 750, 560)));
        frames.push(new cc.SpriteFrame(RussianRouletteRes.animation_shot_gun4, new cc.Rect(0, 0, 750, 560)));

        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate));
        animback.addChild(anim);


        animback.scheduleOnce(function(){
            mainView.mainGun.setVisible(true);
            animback.removeFromParent(true);
            if(mainView.gameState == 4){
                mainView.gameState = 0;
            }else
                mainView.clearAnimation();
        },0.6);
    },

    shotGunAnimation:function(){
        SoundManager.instance().playEffect(RussianRouletteRes.sound_bang);
        this.mainGun.setVisible(false);
        var frameTime = 0.1;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback);

        for(var k = 0 ; k <= 1; k++) {
            anim = new cc.Sprite();
            if(k == 0){
                anim.setAnchorPoint(0, 1);
                anim.setPosition(0.5, cc.winSize.height - 200);
            }else{
                anim.setAnchorPoint(0.5, 0.5);
                anim.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            }
            var frames = [];
            for (var i = 1; i <= 4; i++) {
                var _h = 560;
                var str = "res/Scene/RussianRoulette/animation/shot_gun_" + (i) + ".png";
                if(k == 1) {
                    str = "res/Scene/RussianRoulette/animation/shot_dim_" + (i) + ".png";
                    _h = 1334;
                }
                frames.push(new cc.SpriteFrame(str, new cc.Rect(0, 0, 750, _h)));
                if (i == 1)
                    frames.push(new cc.SpriteFrame(str, new cc.Rect(0, 0, 750, _h)));
            }
            var animation = new cc.Animation(frames, frameTime);
            var animate = cc.animate(animation);
            anim.runAction(new cc.Sequence(animate));
            animback.addChild(anim);
        }

        animback.scheduleOnce(function(){
            mainView.mainGun.setVisible(true);
            animback.removeFromParent(true);
            //mainView.removeChild(animback,true);
            mainView.scheduleOnce(function(){
                mainView.outAnimation();
            },0.2);
        },animation.getTotalDelayUnits()*frameTime);
    },

    clearAnimation:function(){
        SoundManager.instance().playEffect(RussianRouletteRes.sound_clear);
        var frameTime = 0.1;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 180), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback,this.ORDER_Z_EFFECT);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        var frames = [];
        for(var i = 1 ; i <= 21; i++){
            var _num = "0";
            if(i >= 10) _num = "";
            var str = "res/Scene/RussianRoulette/animation/clear" + (_num) + (i) + ".png";
            frames.push(new cc.SpriteFrame(str,new cc.Rect(0, 0, 750, 1334)));
        }
        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate).repeatForever());
        animback.addChild(anim);
        animback.scheduleOnce(function(){
            mainView.resetGameState(animback);
        },3);

        var listenerMagazine = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    //cc.log("onTouchBegan at: " + locationInNode.x + " " + locationInNode.y);
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                mainView.resetGameState(animback);
            }
        });
        cc.eventManager.addListener(listenerMagazine, animback);
    },

    outAnimation:function(){
        SoundManager.instance().playEffect(RussianRouletteRes.sound_sorry);
        var frameTime = 0.1;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 180), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback,this.ORDER_Z_EFFECT);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        var frames = [];
        for(var i = 1 ; i <= 13; i++){
            var str = "res/Scene/RussianRoulette/animation/out01.png";
            if(i == 10)
                str = "res/Scene/RussianRoulette/animation/out02.png";
            else if(i == 11)
                str = "res/Scene/RussianRoulette/animation/out03.png";
            frames.push(new cc.SpriteFrame(str,new cc.Rect(0, 0, 750, 1334)));
        }
        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate).repeatForever());
        animback.addChild(anim);


        animback.scheduleOnce(function(){
            mainView.resetGameState(animback);
        },3);

        var listenerMagazine = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    //cc.log("onTouchBegan at: " + locationInNode.x + " " + locationInNode.y);
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                mainView.resetGameState(animback);
            }
        });
        cc.eventManager.addListener(listenerMagazine, animback);

    },

    resetGameState:function(animback){
        if(this.getChildByTag(this.TAG_ANIM)){
            SoundManager.instance().stopAllEffects();
            this.removeChildByTag(this.TAG_ANIM,true);
            this.gameState = 0;
            this.startBtn.setTouchEnabled(true);
            this.toolBar.setToolbarTouchEnable(true);
            this.setBulletView();
            //if(this.bulletNumSel == 0){
            //    this.removeChildByTag(this.TAG_READY,true);
            //    this.removeChildByTag(this.TAG_GAME,true);
            //}
        }

    }

});

var RussianRouletteScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new RussianRouletteLayer();
        this.addChild(layer);
    }
});