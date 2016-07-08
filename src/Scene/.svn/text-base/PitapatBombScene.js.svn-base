/**
 * Created by nhnst on 5/6/16.
 */
var PitapatBombLayer = cc.LayerColor.extend({
    tempselectedPernum:null,
    selectPer:null,
    bombTime:null,

    gameStage:0,
    TAG_MAIN:0,
    TAG_SETTING:200,
    TAG_READY:201,
    TAG_PLAY:202,
    TAG_ANIM:202,
    TAG_MASK:205,
    TAG_RESULT:206,

    ORDER_Z_MAIN:10,
    ORDER_Z_SETTING:20,
    ORDER_Z_TUTORIAL:50,
    ORDER_Z_EFFECT:60,

    minSelectedTime:[5,5,5,10,10,10,15,15,15],
    maxSelectedTime:[20,30,40,40,50,60,70,80,90],

    ctor:function () {
        this._super(cc.color(111,205,192,255));

        mainView = this;

        this.initMain();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.PitapatBomb);

        Utility.sendXhr(GAME_TYPE.PitapatBomb.gameid);

        return true;
    },

    onExit:function(){
        SoundManager.instance().stopMusic();
    },

    update:function(){
        var context = this;
        if(Utility.checkRfresh){
            switch (context.gameStage){
                case context.TAG_MAIN:
                    context.getChildByName("toolBar").setPosition(cc.p(0,cc.winSize.height));
                    context.mainAnimation();
                    break;
                case context.TAG_RESULT:
                    break;
            }
            Utility.checkRfresh = false;
        }


        if(context.gameStage == context.TAG_MAIN && context.tempselectedPernum != context.selectPer.selectNum){
            context.tempselectedPernum = context.selectPer.selectNum;
            context.getChildByName("mainBack").getChildByName("textTip").setString(context.minSelectedTime[context.tempselectedPernum - 2] + "~" + context.maxSelectedTime[context.tempselectedPernum - 2] + "秒間のランダムで爆発します");
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
            case context.TAG_PLAY:
                SoundManager.instance().stopMusic();
                context.removeAllChildren();
                context.initMain();
                break;
        }
    },

    initMain:function() {
        this.gameStage = this.TAG_MAIN;
        this.initData();
        var toolbar = new Toolbar(GAME_TYPE.PitapatBomb);
        toolbar.setAnchorPoint(cc.p(0,1));
        toolbar.setName("toolBar");
        toolbar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolbar,this.ORDER_Z_MAIN);

        var aeBack = new cc.LayerColor(cc.color(111,205,192,255), cc.winSize.width,cc.winSize.height + 400);
        aeBack.setPosition(0, 0);
        aeBack.setName("mainBack");
        this.addChild(aeBack);

        this.mainAnimation();

        var _h = cc.winSize.height - 500 - 200;

        this.selectPer = new ScrollNum(2,11,4,1);
        this.selectPer.setPosition(cc.winSize.width>>1, 200 + _h/2);
        aeBack.addChild(this.selectPer);

        var textUp = new ccui.Text("参加人数",GAME_FONT.PRO_W3,34);
        textUp.setAnchorPoint(cc.p(0.5,0.5));
        textUp.setColor(cc.color("#dbf2ef"));
        textUp.setPosition(cc.winSize.width>>1, this.selectPer.getPositionY() + _h/4);
        aeBack.addChild(textUp);

        var textDown = new ccui.Text(this.minSelectedTime[this.selectPer.selectNum - 2] + "~" + this.maxSelectedTime[this.selectPer.selectNum - 2] + "秒間のランダムで爆発します",GAME_FONT.PRO_W3,30);
        textDown.setName("textTip");
        textDown.setAnchorPoint(cc.p(0.5,0.5));
        textDown.setColor(cc.color("#dbf2ef"));
        textDown.setPosition(cc.winSize.width>>1, this.selectPer.getPositionY() - _h/4);
        aeBack.addChild(textDown);

        Utility.buttonBackColorText("開始" ,cc.winSize.width/2, 100,cc.size(280, 100),cc.color("#448f94"),aeBack,
            function(note){
                mainView.gameMode();
            });

    },

    initData:function(){

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
        frames.push(new cc.SpriteFrame(PitapatBombRes.top_1, new cc.Rect(0, 0, 750, 450)));
        var animate1 = cc.animate(new cc.Animation(frames, 1.4));

        var frames = [];
        for(var i = 2 ; i <= 13; i++){
            if(i < 10)
                frames.push(new cc.SpriteFrame("res/Scene/PitapatBomb/main/top_00" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
            else
                frames.push(new cc.SpriteFrame("res/Scene/PitapatBomb/main/top_0" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
        }
        var animate2 = cc.animate(new cc.Animation(frames, 0.1));

        var frames = [];
        frames.push(new cc.SpriteFrame(PitapatBombRes.top_14, new cc.Rect(0, 0, 750, 450)));
        var animate3 = cc.animate(new cc.Animation(frames, 0.2));

        var frames = [];
        for(var i = 15 ; i <= 18; i++){
            if(i < 10)
                frames.push(new cc.SpriteFrame("res/Scene/PitapatBomb/main/top_00" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
            else
                frames.push(new cc.SpriteFrame("res/Scene/PitapatBomb/main/top_0" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
        }
        var animate4 = cc.animate(new cc.Animation(frames, 0.1));

        vote.runAction(new cc.Sequence(animate1,animate2,animate3,animate4).repeatForever());

        this.addChild(vote);
    },

    gameMode:function(){
        this.removeAllChildren();
        this.gameStage = this.TAG_PLAY;
        var aeBack = new cc.LayerColor(cc.color(111,205,192,255), cc.winSize.width,cc.winSize.height + 400);
        aeBack.setPosition(0, 0);
        this.addChild(aeBack);
        this.gameAnimation1();
    },

    gameAnimation1:function(){
        SoundManager.instance().playMusic(PitapatBombRes.sound_201_ticktock1,true);
        var _this = this;
        var frameTime = 0.2;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0, 0);
        anim.setPosition(0, 0);
        var frames = [];
        frames.push(new cc.SpriteFrame(PitapatBombRes.anim_101, new cc.Rect(0, 0, 750, 1334)));
        frames.push(new cc.SpriteFrame(PitapatBombRes.anim_102, new cc.Rect(0, 0, 750, 1334)));
        frames.push(new cc.SpriteFrame(PitapatBombRes.anim_103, new cc.Rect(0, 0, 750, 1334)));
        frames.push(new cc.SpriteFrame(PitapatBombRes.anim_104, new cc.Rect(0, 0, 750, 1334)));

        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate).repeatForever());
        animback.addChild(anim);

        _this.bombTime = _this.getRandomTime();
        var randFrame = 0;
        animback.schedule(function(){
            randFrame++;
            if(randFrame >= parseInt(_this.bombTime/2)){
                animback.removeFromParent();
                _this.gameAnimation2();
            }
            //cc.log("Anim1:::"+parseInt(_this.bombTime/2)+"randFrame:::"+randFrame);
        },1.0);
    },

    gameAnimation2:function(){
        SoundManager.instance().stopMusic();
        SoundManager.instance().playMusic(PitapatBombRes.sound_202_ticktock2,true);
        var _this = this;
        var frameTime = 0.1;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0, 0);
        anim.setPosition(0, 0);
        var frames = [];
        frames.push(new cc.SpriteFrame(PitapatBombRes.anim_201, new cc.Rect(0, 0, 750, 1334)));
        frames.push(new cc.SpriteFrame(PitapatBombRes.anim_202, new cc.Rect(0, 0, 750, 1334)));
        frames.push(new cc.SpriteFrame(PitapatBombRes.anim_203, new cc.Rect(0, 0, 750, 1334)));
        frames.push(new cc.SpriteFrame(PitapatBombRes.anim_204, new cc.Rect(0, 0, 750, 1334)));

        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate).repeatForever());
        animback.addChild(anim);

        var randFrame = parseInt(_this.bombTime/2);

        animback.schedule(function(){
            randFrame++;
            if(randFrame >= _this.bombTime){
                animback.removeFromParent();
                _this.gameAnimation3();
            }
            //cc.log("Anim2:::"+_this.bombTime+"randFrame:::"+randFrame);
        },1.0);
    },

    gameAnimation3:function(){
        SoundManager.instance().stopMusic();
        SoundManager.instance().playMusic(PitapatBombRes.sound_203_explosion_stereo,false);
        var _this = this;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback);

        var animate1 = this.setAnimFrame(1,7,0.1);
        var animate2 = this.setAnimFrame(8,8,0.5);
        var animate3 = this.setAnimFrame(9,11,0.1);
        var animate4 = this.setAnimFrame(12,12,0.5);
        var animate5 = this.setAnimFrame(13,13,0.2);

        var frameTime = 0.1*7 + 0.5 + 0.1*3 + 0.5 + 0.2;

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0, 0);
        anim.setPosition(0, 0);
        anim.runAction(new cc.Sequence(animate1,animate2,animate3,animate4,animate5));
        animback.addChild(anim);

        animback.scheduleOnce(function(){
            _this.gameAnimation4();
        },frameTime);

        animback.scheduleOnce(function(){//为了修改暂时闪烁的BUG，延迟消失。
            animback.removeFromParent();
        },frameTime + 0.1);
    },

    gameAnimation4:function(){
        var _this = this;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback);

        var animate6 = this.setAnimFrame(14,17,0.1);
        var animate7 = this.setAnimFrame(18,18,0.2);
        var animate8 = this.setAnimFrame(19,19,0.1);

        var frameTime = 0.1*4 + 0.1 + 0.2;

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0, 0);
        anim.setPosition(0, 0);
        anim.runAction(new cc.Sequence(animate6,animate7,animate8).repeatForever());
        animback.addChild(anim);

        animback.scheduleOnce(function(){
            _this.setReplayButton();
        },frameTime);
    },

    setAnimFrame:function(sf,ef,frameTime){
        var frames = [];
        for(var i = sf ; i <= ef; i++){
            if(i < 10)
                frames.push(new cc.SpriteFrame("res/Scene/PitapatBomb/animation/3-0" + (i) + ".png", new cc.Rect(0, 0, 750, 1334)));
            else
                frames.push(new cc.SpriteFrame("res/Scene/PitapatBomb/animation/3-" + (i) + ".png", new cc.Rect(0, 0, 750, 1334)));
        }
        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        return animate;
    },

    setReplayButton:function(){
        var _this = this;
        var homeBtn = Utility.buttonBackColorText("ホーム" ,cc.winSize.width/2 + 150, 100,cc.size(280, 100),cc.color("#448f94"),this,
            function(note){
                _this.removeAllChildren();
                _this.initMain();
            });

        Utility.buttonBackColorText("やり直す" ,cc.winSize.width/2 - 150, 100,cc.size(280, 100),cc.color("#448f94"),this,
            function(note){
                if(_this.getChildByTag(_this.TAG_ANIM))
                    _this.getChildByTag(_this.TAG_ANIM).removeFromParent();
                homeBtn.removeFromParent();
                this.removeFromParent();
                _this.gameAnimation1();
            });
    },

    getRandomTime:function(){
        var min = this.minSelectedTime[this.selectPer.selectNum - 2];
        var max = this.maxSelectedTime[this.selectPer.selectNum - 2];

        var rand = Utility.getRandomInt(1,11);

        if(rand > 3){//30%
            return Utility.getRandomInt(min,max/2);
        }else{//70%
            return Utility.getRandomInt(max/2,max + 1);
        }

    }

});

var PitapatBombScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PitapatBombLayer();
        this.addChild(layer);
    }
});