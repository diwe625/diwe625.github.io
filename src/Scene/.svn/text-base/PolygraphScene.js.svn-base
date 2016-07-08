/**
 * Created by nhnst on 11/4/15.
 * 거짓말 탐지기（测谎仪）
 */
var PolygraphLayer = cc.LayerColor.extend({

    m_state : -1,
    STATE_MAIN:0,
    STATE_RESULT:1,

    ctor:function () {
        this._super(cc.color(111,205,193,255));

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.loadMainView();

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.Polygraph);

        Utility.sendXhr(GAME_TYPE.Polygraph.gameid);

        return true;
    },

    update:function(){
        var context = this;
        if(Utility.checkRfresh){
            switch (context.m_state){
                case context.STATE_MAIN:
                    context.getChildByName("toolBar").setPosition(cc.p(0, cc.winSize.height));
                    break;
            }
            Utility.checkRfresh = false;
        }
    },

    loadMainView : function(){
        this.m_state = this.STATE_MAIN;
        var _this = this;
        this.removeAllChildren();
        var toolbar = new Toolbar(GAME_TYPE.Polygraph);
        toolbar.setTag(4);
        toolbar.setName("toolBar");
        toolbar.setAnchorPoint(cc.p(0,1));
        toolbar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolbar, 9999);

        var process = new cc.ProgressTimer(new cc.Sprite(PolygraphRes.prossece));
        process.setAnchorPoint(0.5, 0.5);
        process.setPosition(cc.winSize.width/2, cc.winSize.height/2+120);
        process.setType(cc.ProgressTimer.TYPE_RADIAL);
        process.setPercentage(0);
        this.addChild(process);

        var thumbPrint = new ccui.ImageView(PolygraphRes.thumbprint);
        thumbPrint.setAnchorPoint(0.5, 0);
        thumbPrint.setPosition(cc.winSize.width/2, process.getPosition().y - process.getContentSize().height/2+70);
        this.addChild(thumbPrint);
        var listener1 = function(sender, event){
            switch (event){
                case ccui.Widget.TOUCH_BEGAN:
                    SoundManager.instance().playMusic(PolygraphRes.process, true);
                    label1.setVisible(true);
                    label2.setVisible(true);
                    label3.setVisible(true);
                    process.runAction(new cc.Sequence(new cc.ProgressTo(0.4, 10), new cc.ProgressTo(0.3, 20), new cc.ProgressTo(0.2, 30), new cc.ProgressTo(0.4, 70), new cc.ProgressTo(0.2, 80), new cc.ProgressTo(0.3, 90), new cc.ProgressTo(0.4, 100), new cc.CallFunc(_this.loadResultView, _this)));
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                case ccui.Widget.TOUCH_CANCELED:
                    SoundManager.instance().stopMusic(false);
                    label1.setVisible(false);
                    label2.setVisible(false);
                    label3.setVisible(false);
                    label1.setString("0");
                    process.stopAllActions();
                    process.setPercentage(0);
                    break;
            }
        };
        thumbPrint.setTouchEnabled(true);
        thumbPrint.addTouchEventListener(listener1);

        var label1 = new cc.LabelTTF("0");
        label1.setFontName(GAME_FONT.PRO_W3);
        label1.setFontSize(110);
        label1.setAnchorPoint(1, 0);
        label1.setPosition(cc.winSize.width/2+75, process.getPosition().y - process.getContentSize().height/2+70+thumbPrint.getContentSize().height+10);
        label1.setVisible(false);
        this.addChild(label1);

        var label2 = new cc.LabelTTF("%");
        label2.setFontName(GAME_FONT.PRO_W3);
        label2.setFontSize(40);
        label2.setAnchorPoint(0, 0);
        label2.setPosition(label1.getPosition().x, process.getPosition().y - process.getContentSize().height/2+70+thumbPrint.getContentSize().height+15);
        label2.setVisible(false);
        this.addChild(label2);

        var label3 = new cc.LabelTTF("判定中...");
        label3.setFontName(GAME_FONT.PRO_W3);
        label3.setFontSize(18);
        label3.setAnchorPoint(0.5, 0);
        label3.setPosition(cc.winSize.width/2, label1.getPosition().y + label1.getContentSize().height + 10 );
        label3.setVisible(false);
        this.addChild(label3);

        label1.schedule(function(){
            var count = Math.floor(process.getPercentage());
            if(count<10){
                label1.setString(PAD(count, 2));
            }else{
                label1.setString(count);
            }
        }, 0 ,cc.REPEAT_FOREVER);

        var main_info_sprite = new cc.Sprite(PolygraphRes.maininfo);
        main_info_sprite.setAnchorPoint(0.5, 0);
        main_info_sprite.setPosition(cc.winSize.width>>1, 30);
        this.addChild(main_info_sprite);

        var main_info_text = new cc.LabelTTF("指紋マークをタッチすると測定がはじまるっち");
        main_info_text.setFontName(GAME_FONT.PRO_W3);
        main_info_text.setFontSize(28);
        main_info_text.setFontFillColor(cc.color(200, 200, 200, 255));
        main_info_text.setDimensions(cc.size(360, 133));
        main_info_text.setAnchorPoint(0, 0);
        main_info_text.setPosition(100, 220);
        main_info_text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        main_info_text.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
        main_info_sprite.addChild(main_info_text);

    },

    loadResultView : function(){
        var _this = this;
        this.m_state = this.STATE_RESULT;
        this.removeAllChildren();

        var type = Math.floor(Math.random()*3);
        var rand = Math.floor(Math.random() * results[type].length);
        var data = results[type][rand];
        SoundManager.instance().stopMusic(false);
        SoundManager.instance().playEffect(data.effect);

        var text = new cc.LabelTTF(data.text);
        text.setFontName(GAME_FONT.AZUSA);
        text.setFontSize(42);
        text.setDimensions(cc.size(cc.winSize.width-160, 300));
        text.setAnchorPoint(0.5, 0);
        text.setPosition(cc.winSize.width>>1, cc.winSize.height-300);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
        this.addChild(text);

        var image = new cc.Sprite(data.image);
        image.setAnchorPoint(0.5, 1);
        image.setPosition(cc.winSize.width>>1, cc.winSize.height - 340);
        this.addChild(image);

        image.scheduleOnce(function(){
            _this.fadeOut(_this.loadMainView);
        }, 3);

        var cb = function(){
            _this.loadMainView();
            _this.getParent().removeChildByTag(1);
        };
        var layout = new ccui.Layout();
        layout.setContentSize(cc.winSize.width, cc.winSize.height);
        layout.setTouchEnabled(true);
        layout.addClickEventListener(cb);
        this.addChild(layout);
    },

    fadeOut : function(target){
        var mask = new ccui.Layout();
        mask.setContentSize(cc.winSize.width, cc.winSize.height);
        mask.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        mask.setBackGroundColor(cc.color("#000000"));
        mask.setOpacity(0);
        mask.setTag(1);
        this.getParent().addChild(mask, 9999);
        var cb = function(){
            mask.removeFromParent();
        };
        mask.runAction(new cc.Sequence(new cc.FadeIn(0.5), new cc.CallFunc(target, this), new cc.FadeOut(0.5), new cc.CallFunc(cb)));
    },

    stateBack: function(context){
        if(context.m_state == context.STATE_MAIN){
            Utility.setMainUrl();
        }else{
            History.go(1);
        }
        switch (context.m_state){
            //case context.STATE_MAIN:
            //    SceneController.instance().gotoScene(-1);
            //    break;
            case context.STATE_RESULT:
                context.loadMainView();
                break;
        }
    }


});

var results = [
    [// 0 撒谎
        {text:"この大ウソつき！田舎のお母さんも泣いてるぞ！", image:PolygraphRes.lie_result01, effect:PolygraphRes.lie_1},
        {text:"だまされないぞ！今の話はウソだな！", image:PolygraphRes.lie_result01, effect:PolygraphRes.lie_1},
        {text:"プロ詐欺師級！もうキミの全てが信じられないっち！", image:PolygraphRes.lie_result01, effect:PolygraphRes.lie_1},
        {text:"アイムアングリー！", image:PolygraphRes.lie_result02, effect:PolygraphRes.lie_2},
        {text:"だまされないぞ！今の話はウソだな！", image:PolygraphRes.lie_result02, effect:PolygraphRes.lie_2},
        {text:"君はぼくっちを騙せると思っているのかい？", image:PolygraphRes.lie_result03, effect:PolygraphRes.lie_1},
        {text:"ぼくっちも舐められたものだね！", image:PolygraphRes.lie_result03, effect:PolygraphRes.lie_1},
        {text:"嘘が暴かれるうちは、キミはまだ正しい心を持っている証拠だよ…と一応フォローしてみるっち！", image:PolygraphRes.lie_result03, effect:PolygraphRes.lie_1},
        {text:"ぼくっち、悲しいよ・・・そんな仲じゃないっち！？", image:PolygraphRes.lie_result04, effect:PolygraphRes.normal_1},
        {text:"ぼくっちの目を見て、もう一回言ってみて？", image:PolygraphRes.lie_result04, effect:PolygraphRes.normal_1},
        {text:"ウソはいけないよ！ぼくっちのキレイな目を見て！", image:PolygraphRes.lie_result04, effect:PolygraphRes.normal_1},
        {text:"嘘つきにはツナ缶を分けてあげないっち！", image:PolygraphRes.lie_result05, effect:PolygraphRes.lie_1},
        {text:"あれ？今日ってエイプリルフールだったっけ？", image:PolygraphRes.lie_result07, effect:PolygraphRes.normal_1}
    ],
    [// 1 不知道
        {text:"ツナ缶もいいけどサバ缶もいいよね。", image:PolygraphRes.lie_result05, effect:PolygraphRes.lie_1},
        {text:"ぼくっちにはわからない！なんてこったい！", image:PolygraphRes.lie_result06, effect:PolygraphRes.lie_2},
        {text:"君の心に迷いが見える！もっとぼくっちのことを信じて！", image:PolygraphRes.lie_result06, effect:PolygraphRes.lie_2},
        {text:"キミの言葉が分からないぼくっちがいけないの？！", image:PolygraphRes.lie_result06, effect:PolygraphRes.lie_2},
        {text:"ごめん……、君の気持ちが分からないや。　心のシャッター、開いてますかー！？", image:PolygraphRes.lie_result07, effect:PolygraphRes.normal_1},
        {text:"今回のことは、なかったことにするっち！", image:PolygraphRes.lie_result07, effect:PolygraphRes.normal_1},
        {text:"解析不能（＜◎＞ω＜◎＞）出直してくるがいいっち！", image:PolygraphRes.lie_result07, effect:PolygraphRes.normal_1},
        {text:"きみの心がちっとも分からないよ！", image:PolygraphRes.lie_result08, effect:PolygraphRes.normal_3},
        {text:"むむむ、まるで謎かけのようだね。", image:PolygraphRes.lie_result08, effect:PolygraphRes.normal_3},
        {text:"イミガワカリマセーーン！", image:PolygraphRes.lie_result08, effect:PolygraphRes.normal_3},
        {text:"・・・・（遠い目）", image:PolygraphRes.lie_result09, effect:PolygraphRes.lie_3},
        {text:"なかなかやるの、おぬし。", image:PolygraphRes.lie_result09, effect:PolygraphRes.lie_3}
    ],
    [// 2 实话
        {text:"嘘をつかない人間もいるっちね！", image:PolygraphRes.lie_result04, effect:PolygraphRes.normal_1},
        {text:"きみの心は、大空のように澄み切っているよ！", image:PolygraphRes.lie_result10, effect:PolygraphRes.true_1},
        {text:"正直者は救われるっていうっち。", image:PolygraphRes.lie_result10, effect:PolygraphRes.true_1},
        {text:"キミもぼくっちと同じキレイな目をしているね！", image:PolygraphRes.lie_result10, effect:PolygraphRes.true_1},
        {text:"心が美しすぎて眩しいっちーーー！！", image:PolygraphRes.lie_result10, effect:PolygraphRes.true_1},
        {text:"ぼくっちは素直なキミが一番好きだよ！", image:PolygraphRes.lie_result11, effect:PolygraphRes.true_2},
        {text:"キミは素晴らしい人だ！ぼくっちとトモダチになろう！", image:PolygraphRes.lie_result11, effect:PolygraphRes.true_2},
        {text:"真実に勝るものはないっち。", image:PolygraphRes.lie_result11, effect:PolygraphRes.true_2},
        {text:"やっぱり、正直が一番だよね！", image:PolygraphRes.lie_result12, effect:PolygraphRes.true_3},
        {text:"本当のことを話してくれるって信じてたよ！", image:PolygraphRes.lie_result12, effect:PolygraphRes.true_3},
        {text:"君って、いい人だっち。ぼくっち、嬉しい！", image:PolygraphRes.lie_result12, effect:PolygraphRes.true_3},
        {text:"正直なキミにはツナ缶×１００００００を分けてあげるっち！", image:PolygraphRes.lie_result13, effect:PolygraphRes.true_1}
    ]
];

var PolygraphScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PolygraphLayer();
        this.addChild(layer);
    }
});