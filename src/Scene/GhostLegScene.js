/**
 * Created by nhnst on 11/2/15.
 * 사다리타기（阶梯游戏）
 */
var GhostLegLayer = cc.LayerColor.extend({
    gameStage:0,
    endAnimCount:null,//已完成动画的user
    currentMaxPer:null,//当前参加的最大人数
    lineHeightX:null,//当前线的X坐标
    lineHeightY:null,//当前线的Y坐标
    lineWidthStart:null,//横线开始坐标
    lineWidthEnd:null,//横线结束坐标
    lineHeight:16,
    scrollView:null,
    textFiledAddVIew:null,
    mode:null,
    reusltStr:null,//规则数组
    rStrIndex:null,//最终结果文字的索引
    drawLineIndex:null,//保存最终结果线的索引
    cuDrawLineIndex:null,//当前线的索引
    selectedEditItem:null,
    isChaMoving:false,
    TAG_MAIN:0,
    TAG_ENTRY:100,
    TAG_SETTING:200,
    TAG_READY:201,
    TAG_GAME:202,
    TAG_RESULT:203,
    TAG_MASK:205,

    ORDER_Z_MAIN:10,
    ORDER_Z_SETTING:20,
    ORDER_Z_GAME:30,
    ORDER_Z_TUTORIAL:50,
    ORDER_Z_LINE:100,
    ORDER_Z_MAX:500,
    ctor:function () {
        "use strict";
        this._super(cc.color(111,205,192,255));

        mainView = this;

        this.init();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.GhostLeg);

        Utility.sendXhr(GAME_TYPE.GhostLeg.gameid);

        return true;
    },

    update:function(){
        var context = this;
        if(Utility.checkRfresh){
            switch (context.gameStage){
                case context.TAG_MAIN:
                    context.getChildByName("toolBar").setPosition(cc.p(0, cc.winSize.height));
                    context.getChildByName("history").listView.setPosition(cc.p(0, cc.winSize.height - 550));
                    context.mainAnimation();
                    break;
            }
            Utility.checkRfresh = false;
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
            case context.TAG_ENTRY:
                mainView.removeAllChildren();
                mainView.init();
                break;
            case context.TAG_SETTING:
                mainView.initLineData();
                mainView.removeAllChildren();
                mainView.additionEntry();
                break;
            case context.TAG_READY:
                mainView.initLineData();
                mainView.removeAllChildren();
                mainView.settingMode();
                break;
            case context.TAG_GAME:
                mainView.removeAllChildren();
                mainView.readyGame();
                break;
        }
    },

    initLineData:function(){
        this.selectedEditItem = -1;
        this.currentMaxPer = 0;
        this.lineHeightX = [];
        this.lineHeightY = [];
        this.lineWidthStart = [];
        this.lineWidthEnd = [];
        this.drawLineIndex = new Array()
        this.cuDrawLineIndex = null;
    },

    initData:function(){
        this.initLineData();
        this.mode = 0;
        this.reusltStr = [];
        this.rStrIndex = [];
        if(this.scrollView){
            this.scrollView.removeAllChildren();
            this.scrollView = null;
        }
        if(this.textFiledAddVIew){
            this.textFiledAddVIew.listView.removeAllItems();
            this.textFiledAddVIew.removeFromParent();
            this.textFiledAddVIew = null;
        }
    },

    init:function(){
        this.gameStage = this.TAG_MAIN;

        this.initData();

        var bg = new cc.Sprite(GhostLegRes.main_bg);
        bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(bg);

        var toolBar = new Toolbar(GAME_TYPE.GhostLeg);
        toolBar.setName("toolBar");
        toolBar.setAnchorPoint(cc.p(0,1));
        toolBar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolBar,this.ORDER_Z_MAIN);

        this.mainAnimation();

        var histtoryLW = new HistorysListView(cc.winSize.height - 550,GAME_TYPE.GhostLeg,
            GhostLegRes.main_setting_list_btn,
            GhostLegRes.main_simple_list_btn,
            this.gotoReplayView,
            this.gotoResultView);
        histtoryLW.setName("history");
        this.addChild(histtoryLW);

        this.addChild(new MainModeBtn(
            MajorityVoteRes.common_start_btn,
            {selector:this.startSettingMode, img:GhostLegRes.main_setting_play_btn,str:"結果設定",subStr:"結果を自分で登録"},
            {selector:this.startSimpleMode, img:GhostLegRes.main_simple_play_btn,str:"すぐに開始",subStr:"結果をあたりとはずれから選択"}
        ));

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
        frames.push(new cc.SpriteFrame("res/Scene/GhostLeg/main/001.png", new cc.Rect(0, 0, 750, 450)));
        var animate1 = cc.animate(new cc.Animation(frames, 0.8));

        frames = [];
        for(var i = 2 ; i < 9; i++){
            frames.push(new cc.SpriteFrame("res/Scene/GhostLeg/main/00" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
        }
        var animate2 = cc.animate(new cc.Animation(frames, 0.2));

        frames = [];
        frames.push(new cc.SpriteFrame("res/Scene/GhostLeg/main/010.png", new cc.Rect(0, 0, 750, 450)));
        var animate3 = cc.animate(new cc.Animation(frames, 0.15));

        frames = [];
        frames.push(new cc.SpriteFrame("res/Scene/GhostLeg/main/011.png", new cc.Rect(0, 0, 750, 450)));
        var animate4 = cc.animate(new cc.Animation(frames, 0.8));

        vote.runAction(new cc.Sequence(animate1,animate2,animate3,animate4).repeatForever());
        this.addChild(vote);
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.log("touchEvent " + sender.getName());
                switch(sender.getName()){
                    case "addEntry":
                        if(mainView.textFiledAddVIew.listView.getItems().length > 1) {
                            mainView.reusltStr = [];
                            mainView.removeAllChildren();
                            mainView.settingMode();
                        }
                        break;
                    case "scrollView":
                        break;
                    case "toSetting":
                        if((mainView.mode == 0)||(mainView.mode == 1 && !mainView.isInputHavNull())) {
                            mainView.removeAllChildren();
                            mainView.readyGame();
                        }
                        break;
                    case "toGame":
                        mainView.removeAllChildren();
                        mainView.drawGame();
                        break;
                    case "toResult":
                        if(mainView.endAnimCount == mainView.currentMaxPer)
                            mainView.drawResultView();
                        break;
                    case "toHome":
                        mainView.savPopup();
                        break;


                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    startSimpleMode:function(note){
        mainView.initData();
        mainView.mode = 0;
        mainView.removeAllChildren(true);
        mainView.additionEntry();
    },

    startSettingMode:function(note){
        mainView.initData();
        mainView.mode = 1;
        mainView.removeAllChildren(true);
        mainView.additionEntry();
    },

    additionEntry:function(){
        this.gameStage = this.TAG_ENTRY;

        var aeBack = new cc.LayerColor(cc.color("#ffffff"), cc.winSize.width,cc.winSize.height);
        aeBack.setPosition(0, 0);
        this.addChild(aeBack);

        var _H = 20;

        var line8 = new cc.Sprite(GlobalRes.line_8);
        line8.setAnchorPoint(cc.p(0,0));
        line8.setPosition(0,10 + 80 + 34 + 2*_H);
        line8.setScaleX(cc.winSize.width);
        aeBack.addChild(line8);

        var label1 = new cc.LabelTTF(" 人が参加登録されています");
        label1.setFontName(GAME_FONT.PRO_W3);
        label1.setFontSize(26);
        label1.setFontFillColor(cc.color("#999999"));
        label1.setAnchorPoint(cc.p(0.5, 0.5));
        label1.setPosition(cc.p(cc.winSize.width>>1, 10 + 80 + 17 + _H));
        aeBack.addChild(label1);

        var label = new cc.LabelTTF();
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(26);
        label.setFontFillColor(cc.color("#6fcdc1"));
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(cc.p(label1.getPosition().x - label1.getContentSize().width/2 - 2, 10 + 80 + 17 + _H));
        label.setString("0");
        aeBack.addChild(label);


        if(this.textFiledAddVIew){
            this.textFiledAddVIew.removeFromParent();
            this.textFiledAddVIew.setInputListener();
            var button = this.buttonBackColorText("addEntry","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#6fcdc1"),aeBack);
            var num = mainView.textFiledAddVIew.listView.getItems().length;
            if(num > 9)
                label.setString(num);
            else
                label.setString("0" + num);
        }else{
            this.textFiledAddVIew = new TextFiledAddList(15,10 + 80 + 34 + 2*_H + 8,0);
            var button = this.buttonBackColorText("addEntry","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#c8c8c8"),aeBack);
        }

        aeBack.addChild(this.textFiledAddVIew,this.ORDER_Z_MAX);

        label.schedule(function(){
            if(mainView.textFiledAddVIew.isAddChanged){
                var num = mainView.textFiledAddVIew.listView.getItems().length;
                if(num > 9)
                    label.setString(num);
                else
                    label.setString("0" + num);

                if(num > 1){
                    button.removeFromParent();
                    button = mainView.buttonBackColorText("addEntry","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#6fcdc1"),aeBack);
                }else{
                    button.removeFromParent();
                    button = mainView.buttonBackColorText("addEntry","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#c8c8c8"),aeBack);
                }
                mainView.textFiledAddVIew.isAddChanged = false;
            }
        });

    },

    settingMode:function(){
        this.gameStage = this.TAG_SETTING;

        var aBack = new cc.LayerColor(cc.color("#ffffff"), cc.winSize.width,cc.winSize.height);
        aBack.setPosition(0, 0);
        this.addChild(aBack);

        var titleH = 100;
        var bottomH = 80 + 60 + 8;
        var itemH = 138;
        var maxNum = this.textFiledAddVIew.listView.getItems().length;
//Title
        var titleBack = new cc.LayerColor(cc.color("#6fcdc1"), aBack.getContentSize().width, titleH);
        titleBack.setPosition(0, aBack.getContentSize().height - titleBack.getContentSize().height);
        aBack.addChild(titleBack);
        //标题
        var titleName = new cc.LabelTTF("結果登録",GAME_FONT.PRO_W3);
        titleName.setFontSize(32);
        titleName.setFontFillColor(cc.color("#fff3bf"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);
//listView
        var scrollView = new ccui.ScrollView();
        scrollView.setAnchorPoint(0, 0);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setContentSize(cc.size(aBack.getContentSize().width, aBack.getContentSize().height - titleH - bottomH));
        scrollView.setBounceEnabled(false);
        var scrollViewRect = scrollView.getContentSize();
        scrollView.setInnerContainerSize(cc.size(scrollViewRect.width,itemH*(maxNum)));
        scrollView.setPosition(0,bottomH);
        aBack.addChild(scrollView);

        if(this.mode == 0)
            this.itemSimpleMode(scrollView,itemH,maxNum);
        else
            this.itemEditMode(scrollView,itemH,maxNum);
//Bottom
        var line8 = new cc.Sprite(GlobalRes.line_8);
        line8.setAnchorPoint(cc.p(0,1));
        line8.setPosition(0,bottomH);
        line8.setScaleX(cc.winSize.width);
        aBack.addChild(line8);

        if(this.mode == 0) {
             this.buttonBackColorText("toSetting", "登録完了", cc.winSize.width / 2, 30, cc.size(200, 80), cc.color("#6fcdc1"), aBack);
        }else{
            if(this.isInputHavNull())
                this.buttonBackColorText("toSetting", "登録完了", cc.winSize.width / 2, 30, cc.size(200, 80), cc.color("#c8c8c8"));
            else
                this.buttonBackColorText("toSetting", "登録完了", cc.winSize.width / 2, 30, cc.size(200, 80), cc.color("#6fcdc1"));
        }


    },

    isInputHavNull:function(){
        var isHave = false;
        for(var i = 0; i < this.reusltStr.length; i++){
            if(this.reusltStr[i] == ""){
                isHave = true;
                break;
            }
        }
        return isHave;
    },

    itemSimpleMode:function(scrollView,itemH,maxNum){
        for(var i = 0; i < maxNum; i++){
            var itemBack = new cc.LayerColor(cc.color("#ffffff"), scrollView.getContentSize().width, itemH);
            itemBack.setAnchorPoint(cc.p(0,0));
            itemBack.setPosition(0, scrollView.getInnerContainerSize().height - (i + 1)*itemH);
            scrollView.addChild(itemBack);

            var line2 = new cc.Sprite(GlobalRes.color_eeeeee);
            line2.setAnchorPoint(0, 0);
            line2.setPosition(0,0);
            line2.setScale(itemBack.getContentSize().width,2);
            itemBack.addChild(line2);

            var titleName = new cc.LabelTTF((i+1)+"番目の結果",GAME_FONT.PRO_W6);
            titleName.setFontSize(36);
            titleName.setFontFillColor(cc.color("#6fcdc1"));
            titleName.setAnchorPoint(cc.p(0, 0.5));
            titleName.setPosition(cc.p(30, itemBack.getContentSize().height/2));
            itemBack.addChild(titleName);

            var btnText = ["はずれ","当たり"];
            var pY = function(k){
                return itemBack.getContentSize().width - (30 + 160*(1 - k));
            };
            if(this.reusltStr.length == maxNum){

            }
            for(var k = 0; k < 2; k++) {
                if(k == 1){
                        var selected = new cc.Sprite(GhostLegRes.setting_atari_160);
                        selected.setAnchorPoint(cc.p(1, 0.5));
                        selected.setName(i.toString());
                        selected.setTag(10);
                        selected.setPosition(cc.p(pY(k), itemBack.getContentSize().height/2));
                        itemBack.addChild(selected);
                    if(this.reusltStr.length == maxNum){//backKey
                        selected.setPosition(cc.p(pY(this.reusltStr[i] === btnText[0]? 0:1), itemBack.getContentSize().height/2));
                    }else
                        this.reusltStr.push(btnText[k]);
                }
                var selectBtn = new ccui.Button();
                selectBtn.setContentSize(cc.size(160, 80));
                selectBtn.setScale9Enabled(true);
                selectBtn.setTag(k);
                selectBtn.setAnchorPoint(cc.p(1, 0.5));
                selectBtn.setPosition(cc.p(pY(k), itemBack.getContentSize().height/2));
                selectBtn.setTitleText(btnText[k]);
                selectBtn.setTitleColor(cc.color("#6fcdc1"));
                selectBtn.setTitleFontName(GAME_FONT.PRO_W3);
                selectBtn.setTitleFontSize(36);
                selectBtn.addClickEventListener(function(node){
                    var sel = node.getParent().getChildByTag(10);
                    var index1 = Number(sel.getName());
                    var index = node.getTag();
                    sel.setPositionX(pY(index));
                    mainView.reusltStr.splice(index1,1,btnText[index]);
                });
                itemBack.addChild(selectBtn,this.ORDER_Z_MAX);
            }

        }
    },

    itemEditMode:function(scrollView,itemH,maxNum){

        var scHeight = scrollView.getContentSize().height;
        var scInnerHeight = scrollView.getInnerContainerSize().height;
        var textFiledH = 60;
        var iscanTouchH = (itemH - textFiledH)/2 + 15;

        for(var i = 0; i < maxNum; i++){
            var itemBack = new cc.LayerColor(cc.color("#ffffff"), scrollView.getContentSize().width, itemH);
            itemBack.setTag(i);
            itemBack.setAnchorPoint(cc.p(0,0));
            itemBack.setPosition(0, scrollView.getInnerContainerSize().height - (i + 1)*itemH);
            scrollView.addChild(itemBack);

            var line2 = new cc.Sprite(GlobalRes.color_eeeeee);
            line2.setAnchorPoint(0, 0);
            line2.setPosition(0,0);
            line2.setScale(itemBack.getContentSize().width,2);
            itemBack.addChild(line2);

            var aSprite = new cc.Sprite(GlobalRes.addition_d);
            aSprite.setAnchorPoint(0, 0.5);
            aSprite.setName("defalutTxt");
            aSprite.setPosition(30,itemBack.getContentSize().height/2);
            itemBack.addChild(aSprite);
            aSprite.setVisible(false);

            var textString = "番目の結果を入力してください";

            var aSpriteLavel = new cc.LabelTTF(cc.sys.os == cc.sys.OS_IOS?"       "+textString:"          "+textString,GAME_FONT.PRO_W3);
            //var aSpriteLavel = new cc.LabelTTF("       "+"番目の結果を入力してください",GAME_FONT.PRO_W3);
            aSpriteLavel.setFontSize(36);
            aSpriteLavel.setFontFillColor(cc.color("#c8c8c8"));
            aSpriteLavel.setAnchorPoint(cc.p(0, 0.5));
            aSpriteLavel.setPosition(cc.p(0, aSprite.getContentSize().height/2 - 2));
            aSprite.addChild(aSpriteLavel);

            var num = new cc.LabelTTF((i+1),GAME_FONT.PRO_W6);
            num.setFontSize(36);
            num.setFontFillColor(cc.color("#c8c8c8"));
            num.setAnchorPoint(cc.p(1, 0.5));
            num.setPosition(cc.p(aSprite.getPositionX() + aSprite.getContentSize().width + 15, aSprite.getContentSize().height/2 - 2));
            aSprite.addChild(num);

            var text = new cc.LabelTTF();
            text.setName("text");
            text.setFontName(GAME_FONT.PRO_W3);
            text.setFontSize(36);
            text.setFontFillColor(cc.color("#6fcdc1"));
            text.setAnchorPoint(cc.p(0, 0.5));
            text.setPosition(cc.p(30 + 2, itemBack.getContentSize().height/2 - 3));
            itemBack.addChild(text);

            var textField = new cc.EditBox(cc.size(itemBack.getContentSize().width - 200, 80),new cc.Scale9Sprite());
            textField.setPlaceholderFontColor(cc.color("#c8c8c8"));
            textField.setPlaceholderFontSize(36);
            textField.setPlaceholderFontName(GAME_FONT.PRO_W3);
            textField.setPlaceHolder(cc.sys.os == cc.sys.OS_IOS?"       "+textString:"          "+textString);
            //textField.setPlaceHolder("       "+"番目の結果を入力してください");
            textField.setAnchorPoint(cc.p(0,0.5));
            textField.setPosition(30, itemBack.getContentSize().height/2);
            textField.setDelegate(this);
            textField.setFontName(GAME_FONT.PRO_W3);
            textField.setFontColor(cc.color("#6fcdc1"));
            textField.setFontSize(36);
            textField.setMaxLength(12);
            textField.setName("textField");
            textField.setAdd(true,i+1);
            itemBack.addChild(textField);
            if(this.reusltStr.length == maxNum){
                textField.setString(this.reusltStr[i]);
            }else
                this.reusltStr.push("");
        }

        scrollView.schedule(function(){
            var sMaxH = scInnerHeight - scHeight;
            if(sMaxH > 0){
                var seUpDownFiledVis = function(isup){
                    var currentScrolledH = Math.abs(parseInt(scrollView.getContainerPosition().y));
                    if(isup) currentScrolledH = Math.abs(sMaxH - currentScrolledH);
                    var hidFiledNum = parseInt(currentScrolledH/itemH);
                    var isPlusOneNum = (parseInt(currentScrolledH%itemH) > iscanTouchH)?1:0;
                    var setVis = function (num,visible) {
                        var tag = maxNum - 1 - num;
                        if(isup) tag = num;
                        var filed = scrollView.getChildByTag(tag).getChildByName("textField");
                        if(!visible){
                            if(filed.isVisible()){//隐藏输入区域
                                var defalutTxt = scrollView.getChildByTag(tag).getChildByName("defalutTxt");
                                var text = scrollView.getChildByTag(tag).getChildByName("text");
                                filed.setVisible(false);
                                if(filed.getString() == ""){
                                    defalutTxt.setVisible(true);
                                    text.setVisible(false);
                                }else{
                                    defalutTxt.setVisible(false);
                                    text.setString(filed.getString());
                                    text.setVisible(true);
                                }
                            }
                        }else{
                            var setVissibleTextFiled = function (index) {
                                var filed1 = scrollView.getChildByTag(index).getChildByName("textField");
                                if(!filed1.isVisible()){//显示输入区域
                                    var defalutTxt1 = scrollView.getChildByTag(index).getChildByName("defalutTxt");
                                    var text1 = scrollView.getChildByTag(index).getChildByName("text");
                                    filed1.setVisible(true);
                                    defalutTxt1.setVisible(false);
                                    text1.setVisible(false);
                                }
                            };
                            //修改滚动过快时，输入区域无法全部显示的 BUG
                            if(isup){
                                setVissibleTextFiled(tag);
                                setVissibleTextFiled(tag+1);
                                setVissibleTextFiled(tag+2);
                                setVissibleTextFiled(tag+3);
                            }else{
                                setVissibleTextFiled(tag);
                                setVissibleTextFiled(tag-1);
                                setVissibleTextFiled(tag-2);
                                setVissibleTextFiled(tag-3);
                            }
                        }
                    };
                    for(var i = 0; i < hidFiledNum; i++){
                        setVis(i,false);
                    }
                    if(isPlusOneNum == 0){
                        setVis(hidFiledNum,true);
                    }else if(isPlusOneNum == 1){
                        setVis(hidFiledNum,false);
                    }
                };
                seUpDownFiledVis(true);
                seUpDownFiledVis(false);
            }
        });
    },

    editBoxEditingDidEnd: function (editBox) {
        mainView.reusltStr.splice(editBox.getParent().getTag(),1,editBox.getString());
        //cc.log("editBox " + editBox.getString() + " DidEnd !");
        var button = mainView.getChildByName("toSetting");
        if(mainView.isInputHavNull()){
            button.removeFromParent();
            button = mainView.buttonBackColorText("toSetting","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#c8c8c8"));
        }else{
            button.removeFromParent();
            button = mainView.buttonBackColorText("toSetting","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#6fcdc1"));
        }
    },

    readyGame:function(){
        this.gameStage = this.TAG_READY;

        var titleH = 100;
        var editH = 200;
        var bottomH = 80 + 60 + 8;

        var topY = titleH + editH;

        this.currentMaxPer = this.textFiledAddVIew.listView.getItems().length;

        var backView = new cc.LayerColor(cc.color.WHITE, cc.winSize.width,cc.winSize.height);
        backView.setAnchorPoint(0, 0);
        backView.setPosition(0, 0);
        this.addChild(backView);
//Title
        var titleBack = new cc.LayerColor(cc.color("#6fcdc1"), backView.getContentSize().width, titleH);
        titleBack.setPosition(0, backView.getContentSize().height - titleBack.getContentSize().height);
        backView.addChild(titleBack);
        //标题
        var titleName = new cc.LabelTTF("あみだくじの設定",GAME_FONT.PRO_W3);
        titleName.setFontSize(32);
        titleName.setFontFillColor(cc.color("#fff3bf"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);
//Edit
        var resOn = [GhostLegRes.setting_random_on,GhostLegRes.setting_draw_on,GhostLegRes.setting_delete_on,GhostLegRes.setting_reset_on];
        var resOff = [GhostLegRes.setting_random_off,GhostLegRes.setting_draw_off,GhostLegRes.setting_delete_off,GhostLegRes.setting_reset_off];
        var editText = ["ランダム","線の追加","線の削除","リセット"];

        var editBack = new cc.LayerColor(cc.color.WHITE, backView.getContentSize().width, editH);
        editBack.setPosition(0, backView.getContentSize().height - titleBack.getContentSize().height - editBack.getContentSize().height);
        backView.addChild(editBack);

        for(var i = 0; i < 4; i++) {
            if(i == 0 || i == 3)
                var item = new ccui.Button(resOff[i],resOn[i]);
            else
                var item = new ccui.Button(resOff[i]);
            item.setTouchEnabled(true);
            item.setTag(i);
            item.setAnchorPoint(cc.p(0.5, 1));
            item.setPosition(backView.getContentSize().width/2 - backView.getContentSize().width/8 +(backView.getContentSize().width/4) * (i - 1), editBack.getContentSize().height - 10);
            item.addClickEventListener(function (node) {
                var _this = mainView;
                var idxTag = node.getTag();
                if(idxTag == 0 || idxTag == 3){
                    _this.lineWidthStart = [];
                    _this.lineWidthEnd = [];
                    if(idxTag == 0)
                        _this.setWidthLine();
                    else
                        _this.drawWidthLine();
                    if(_this.selectedEditItem == 1 || _this.selectedEditItem == 2)
                        editBack.getChildByTag(_this.selectedEditItem).loadTextures(resOff[_this.selectedEditItem]);
                    _this.selectedEditItem = idxTag;
                }else{
                    if(_this.selectedEditItem == idxTag){
                        node.loadTextures(resOff[idxTag]);
                        _this.selectedEditItem = -1;
                    }else{
                        node.loadTextures(resOn[idxTag]);
                        if(_this.selectedEditItem != -1)
                            editBack.getChildByTag(_this.selectedEditItem).loadTextures(resOff[_this.selectedEditItem]);
                        _this.selectedEditItem = idxTag;
                    }
                }

            });
            editBack.addChild(item);

            var editTxt = new cc.LabelTTF(editText[i],GAME_FONT.PRO_W3);
            editTxt.setFontSize(30);
            editTxt.setFontFillColor(cc.color("#6fcdc1"));
            editTxt.setAnchorPoint(cc.p(0.5, 1));
            editTxt.setPosition(cc.p(item.getPositionX(), item.getPositionY() - item.getContentSize().height - 10));
            editBack.addChild(editTxt);

        }
        //提示说明
        var line50 = new cc.Sprite(GlobalRes.line_50);
        line50.setAnchorPoint(cc.p(0,0));
        line50.setPosition(0,0);
        line50.setScaleX(cc.winSize.width);
        editBack.addChild(line50);

        var editDetail = new cc.LabelTTF("タッチで線の編集ができます。",GAME_FONT.PRO_W3);
        editDetail.setFontSize(24);
        editDetail.setFontFillColor(cc.color("#c8c8c8"));
        editDetail.setAnchorPoint(cc.p(0.5, 0));
        editDetail.setPosition(cc.p(editBack.getContentSize().width>>1, 10));
        editBack.addChild(editDetail);
//scroll
        var sBackView = new cc.LayerColor(cc.color.WHITE, cc.winSize.width,cc.winSize.height - bottomH - topY);
        sBackView.setAnchorPoint(0, 0);
        sBackView.setPosition(0, bottomH);
        backView.addChild(sBackView);
        var scrollTopH = 50;
        var scrollBottomH = 50;
        this.scrollView = this.setHeightLine(sBackView,scrollTopH,scrollBottomH);

        if(this.lineWidthStart.length > 0)
            this.drawWidthLine(-125);
        else
            this.setWidthLine();
//Bottom　　　
        var line8 = new cc.Sprite(GlobalRes.line_8);
        line8.setAnchorPoint(cc.p(0,1));
        line8.setPosition(0,bottomH);
        line8.setScaleX(cc.winSize.width);
        backView.addChild(line8);

        this.buttonBackColorText("toGame","あみだ開始",cc.winSize.width/2, 30,cc.size(200, 80),cc.color("#6fcdc1"),backView);
    },

    drawGame:function(){

        this.gameStage = this.TAG_GAME;

        var titleH = 100;
        var bottomH = 80 + 60 + 8;

        this.currentMaxPer = this.textFiledAddVIew.listView.getItems().length;

        var backView = new cc.LayerColor(cc.color.WHITE, cc.winSize.width,cc.winSize.height);
        backView.setTag(this.ORDER_Z_GAME);
        backView.setAnchorPoint(0, 0);
        backView.setPosition(0, 0);
        this.addChild(backView);
//Title
        var titleBack = new cc.LayerColor(cc.color("#6fcdc1"), backView.getContentSize().width, titleH);
        titleBack.setPosition(0, backView.getContentSize().height - titleBack.getContentSize().height);
        backView.addChild(titleBack);
        //标题
        var titleName = new cc.LabelTTF("あみだくじ",GAME_FONT.PRO_W3);
        titleName.setFontSize(32);
        titleName.setFontFillColor(cc.color("#fff3bf"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);
//scroll
        var sBackView = new cc.LayerColor(cc.color.WHITE, cc.winSize.width,cc.winSize.height - bottomH - titleH);
        sBackView.setAnchorPoint(0, 0);
        sBackView.setPosition(0, bottomH);
        backView.addChild(sBackView);
        var scrollTopH = 125;
        var scrollBottomH = 175;
        this.scrollView = this.setHeightLine(sBackView,scrollTopH,scrollBottomH,true);

        this.drawWidthLine(125);
//Bottom　　　
        var line8 = new cc.Sprite(GlobalRes.line_8);
        line8.setAnchorPoint(cc.p(0,1));
        line8.setPosition(0,bottomH);
        line8.setScaleX(cc.winSize.width);
        backView.addChild(line8);

        this.buttonBackColorText("toResult","結果を見る",cc.winSize.width/2 - 110, 30,cc.size(200, 80),cc.color("#c8c8c8"),backView);
        this.buttonBackColorText("toHome","ホーム",cc.winSize.width/2 + 110, 30,cc.size(200, 80),cc.color("#6fcdc1"),backView);

        this.getreusltStrWithPersonData(scrollTopH,scrollBottomH);
    },

    drawResultView:function(title){
        var mask = new Mask();
        this.addChild(mask);
        mask.open();

        var all_layout = new ccui.Layout();
        all_layout.setContentSize(cc.winSize.width, cc.winSize.height);
        all_layout.setAnchorPoint(0, 0);
        all_layout.setTouchEnabled(true);
        all_layout.addClickEventListener(function(){
            all_layout.removeFromParent();
            mask.removeFromParent();
        });
        this.addChild(all_layout);

        var pop_layout = new RoundRect(cc.winSize.width - 60, cc.winSize.height - 306);
        pop_layout.setAnchorPoint(0.5, 0.5);
        pop_layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
        all_layout.addChild(pop_layout);

        var titleH = 100;
        var bottomH = 100;
        var itemH = 144;

//Title
        var titleBack = new cc.LayerColor(cc.color("#fdfcf3"), pop_layout.getContentSize().width, titleH);
        titleBack.setPosition(0, pop_layout.getContentSize().height - titleBack.getContentSize().height);
        pop_layout.addChild(titleBack);
        //标题
        var str = "あみだくじの結果";
        if(title)str = title;
        var titleName = new cc.LabelTTF(str,GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(cc.color("#c8c8c8"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);

        var draw = new cc.DrawNode();
        var vertices = [cc.p(0, 0), cc.p(titleBack.getContentSize().width, 0) ];
        titleBack.addChild(draw);
        draw.drawPoly(vertices, null, 2, cc.color("#6fcdc1"));

//scroll
        this.currentMaxPer = this.textFiledAddVIew.listView.getItems().length;

        var scrollView = new ccui.ScrollView();
        scrollView.setAnchorPoint(0, 0);
        scrollView.setTouchEnabled(true);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setContentSize(cc.size(pop_layout.getContentSize().width, pop_layout.getContentSize().height - bottomH - titleH));
        scrollView.setBounceEnabled(false);
        var scrollViewRect = scrollView.getContentSize();
        scrollView.setInnerContainerSize(cc.size(scrollViewRect.width,itemH*this.currentMaxPer));
        scrollView.setPosition(0,bottomH);
        pop_layout.addChild(scrollView);

        for(var i = 0; i < this.currentMaxPer; i++) {
            var itemBack = new cc.LayerColor(cc.color("#ffffff"), scrollView.getContentSize().width, itemH);
            itemBack.setPosition(0, scrollView.getInnerContainerSize().height - (i + 1) * itemH);
            scrollView.addChild(itemBack);
            if(i != this.currentMaxPer - 1){
                var line2 = new cc.Sprite(GlobalRes.color_eeeeee);
                line2.setAnchorPoint(0, 0);
                line2.setPosition(0, 0);
                line2.setScale(itemBack.getContentSize().width, 2);
                itemBack.addChild(line2);
            }

            //image
            var idx = this.textFiledAddVIew.getListChildernIcon(i);
            var chaImage = new cc.Sprite("res/Scene/GhostLeg/result/amd_" + idx + "_off.png");
            chaImage.setAnchorPoint(0, 0.5);
            chaImage.setPosition(30, itemBack.getContentSize().height>>1);
            itemBack.addChild(chaImage);
            //resulttext
            var resultText = new cc.LabelTTF((i + 1) + "."+this.reusltStr[this.rStrIndex[i]], GAME_FONT.PRO_W6);
            resultText.setFontSize(36);
            resultText.setFontFillColor(cc.color("#6fcdc1"));
            resultText.setAnchorPoint(cc.p(0, 0.5));
            resultText.setPosition(cc.p(30 + chaImage.getContentSize().width + 30, itemBack.getContentSize().height / 2 + 20));
            itemBack.addChild(resultText);

            //name
            var name = new cc.LabelTTF(this.textFiledAddVIew.getListChildern(i), GAME_FONT.PRO_W3);
            name.setFontSize(36);
            name.setFontFillColor(cc.color("#6fcdc1"));
            name.setAnchorPoint(cc.p(0, 0.5));
            name.setPosition(cc.p(resultText.getPositionX(), itemBack.getContentSize().height / 2 - 20));
            itemBack.addChild(name);
        }

//Bottom
        var bottomBack = new cc.LayerColor(cc.color("#6fcdc1"), pop_layout.getContentSize().width, bottomH);
        bottomBack.setAnchorPoint(cc.p(0, 0));
        bottomBack.setPosition(0, 0);
        pop_layout.addChild(bottomBack);

        var bottom_btn = new ccui.Button();
        bottom_btn.setContentSize(bottomBack.getContentSize().width, bottomH);
        bottom_btn.setAnchorPoint(cc.p(0.5, 0.5));
        bottom_btn.setPosition(bottomBack.getContentSize().width>>1, bottomH>>1);
        bottom_btn.setTouchEnabled(true);
        bottom_btn.setScale9Enabled(true);
        if(title)
            bottom_btn.setTitleText("データ読み込み");
        else
            bottom_btn.setTitleText("確認");
        bottom_btn.setTitleColor(cc.color.WHITE);
        bottom_btn.setTitleFontName(GAME_FONT.PRO_W6);
        bottom_btn.setTitleFontSize(30);
        bottomBack.addChild(bottom_btn);
        bottom_btn.addClickEventListener(function(sender){
            all_layout.removeFromParent();
            mask.removeFromParent();
            if(title){
                mainView.removeAllChildren(true);
                mainView.additionEntry();
            }

        });

    },

    savPopup:function(){
        var mask = new Mask();
        this.addChild(mask);
        mask.open();

        var pop_layout = new RoundRect(570, 40+30+60+40+100+30);
        pop_layout.setAnchorPoint(0.5, 0.5);
        pop_layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
        this.addChild(pop_layout);

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

        //var gray_layout = new ccui.Layout();
        //gray_layout.setAnchorPoint(0, 1);
        //gray_layout.setPosition(35, label.getPosition().y - label.getContentSize().height - 30);
        //gray_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        //gray_layout.setBackGroundColor(cc.color(115,115,115,255));
        //gray_layout.setContentSize(500, 60);
        //pop_layout.addChild(gray_layout);
        //
        //var white_layout = new ccui.Layout();
        //white_layout.setAnchorPoint(0, 1);
        //white_layout.setPosition(35+1, label.getPosition().y - label.getContentSize().height - 30-1);
        //white_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        //white_layout.setBackGroundColor(cc.color(255,255,255,255));
        //white_layout.setContentSize(498, 58);
        //pop_layout.addChild(white_layout);

        var input = new cc.EditBox(cc.size(498, 58),new cc.Scale9Sprite());
        var name = "";
        var size = mainView.textFiledAddVIew.listView.getItems().length;
        for(var i = 0 ; i < size; i++){
            name += this.textFiledAddVIew.getListChildern(i);
            if(i != size-1){
                name+="、";
            }
        }

        input.setFontSize(34);
        input.setFontColor(new cc.Color(111,205,193,255));
        input.setString(name);
        input.setFontName(GAME_FONT.PRO_W3);
        input.setAnchorPoint(0, 1);
        input.setPosition(35+1, label.getPosition().y - label.getContentSize().height - 30-1);
        pop_layout.addChild(input);

        var save_btn = new ccui.Button(GlobalRes.color_b0e2cf, GlobalRes.color_b0e2cf);
        save_btn.setScale(285, 100);
        save_btn.setAnchorPoint(0, 0);
        save_btn.setPosition(285, 0);
        pop_layout.addChild(save_btn);

        var save_callback = function(){
            if(input.getString() === ""){
                alert("タイトルを入力してください");
                return;
            }
            mainView.setHistory(mainView.mode,input.getString());
            mainView.removeAllChildren();
            mainView.init();
        };
        save_btn.addClickEventListener(save_callback);

        var cancel_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
        cancel_btn.setScale(285, 100);
        cancel_btn.setAnchorPoint(0, 0);
        cancel_btn.setPosition(0, 0);
        pop_layout.addChild(cancel_btn);

        var cancel_callback = function(){
            mainView.removeAllChildren();
            mainView.init();
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
    },

    setHeightLine:function(backView,topH,bottomH,isSHowCharacter){

        var draw = new cc.DrawNode();
        this.lineHeightX = [];
        this.lineHeightY = [];
        var _this = this;
        var leftX;
        var width;

        if(this.currentMaxPer == 2){
            leftX = cc.winSize.width/3;
            width = cc.winSize.width/3;
        }else if(this.currentMaxPer == 3){
            leftX = cc.winSize.width/4;
            width = cc.winSize.width/4;
        }else if(this.currentMaxPer == 4){
            leftX = cc.winSize.width/5;
            width = cc.winSize.width/5;
        }else {
            leftX = cc.winSize.width/6;
            width = cc.winSize.width/6;
        }

        var scrollView = new ccui.ScrollView();
        scrollView.setAnchorPoint(0, 0);
        scrollView.setName("scrollView");
        scrollView.setDirection(ccui.ScrollView.DIR_BOTH);
        scrollView.setContentSize(cc.size(backView.getContentSize().width, backView.getContentSize().height));
        //scrollView.setBackGroundColor(cc.color.GREEN);
        //scrollView.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        scrollView.setBounceEnabled(false);
        var scrollViewRect = scrollView.getContentSize();
        //scrollView.setScale(2,1);
        scrollView._setInnerWidth(width*(this.currentMaxPer+1)/* + 3*width*/);
        scrollView.setPosition(0,0);
        backView.addChild(scrollView);
        scrollView.addChild(draw);

        for(var i = 0; i < this.currentMaxPer; i++){
            draw.drawPoly([cc.p(leftX + width*i, bottomH),cc.p(leftX + width*i, scrollView._getInnerHeight() - topH)], null, 5, cc.color("#6fcdc1"));
            this.lineHeightX.push(leftX + width*i);
        }

        for(var i = scrollView._getInnerHeight() - topH - this.lineHeight; i > bottomH; i-=this.lineHeight){
            this.lineHeightY.push(i);
        }

        if(isSHowCharacter){
            _this.endAnimCount = 0;
            //var selectedCharacter = -1;
            for(var i = 0; i < this.currentMaxPer; i++){
                var idx = this.textFiledAddVIew.getListChildernIcon(i);
                var charactor = new ccui.Button("res/Scene/GhostLeg/result/amd_" + idx + "_off.png");
                charactor.setTouchEnabled(true);
                charactor.setTag(i);
                charactor.setAnchorPoint(cc.p(0.5,1));
                charactor.setPosition(leftX + width*i, scrollViewRect.height - 15);
                charactor.addClickEventListener(function(node){
                    node.setTouchEnabled(false);
                    var tag = node.getTag();
                    var resIdx = _this.textFiledAddVIew.getListChildernIcon(tag);
                    var itemRes = "res/Scene/GhostLeg/result/amd_" + resIdx + "_on.png";
                    node.loadTextures(itemRes);

                    //if(selectedCharacter != -1){
                    //    node.getParent().getChildByTag(selectedCharacter).loadTextures("res/Scene/GhostLeg/result/amd_" + _this.textFiledAddVIew.getListChildernIcon(selectedCharacter) + "_off.png");
                    //}

                    //selectedCharacter = tag;
                    //_this.scheduleOnce(function(){
                    //
                    //});

                    _this.setPersonLine(topH,bottomH,tag,itemRes,resultValue);
                });
                scrollView.addChild(charactor);

                //var label = new cc.LabelTTF(this.textFiledAddVIew.getListChildern(i));
                //label.setFontName(GAME_FONT.PRO_W3);
                //label.setFontSize(20);
                //label.setFontFillColor(cc.color.BLACK);
                //label.setAnchorPoint(cc.p(0.5, 1));
                //label.setPosition(charactor.getContentSize().width/2,-5);
                //charactor.addChild(label);

//Bottom
                var bottomCircle = new cc.Sprite(GhostLegRes.cha_block);
                bottomCircle.setAnchorPoint(cc.p(0.5,0));
                bottomCircle.setPosition(leftX + width*i, 80 + 8);
                scrollView.addChild(bottomCircle);

                var circleNum = new cc.LabelTTF(""+(i+1));
                circleNum.setFontName(GAME_FONT.PRO_W6);
                circleNum.setFontSize(36);
                circleNum.setFontFillColor(cc.color.WHITE);
                circleNum.setAnchorPoint(cc.p(0.5, 0.5));
                circleNum.setPosition(bottomCircle.getContentSize().width>>1,bottomCircle.getContentSize().height>>1);
                bottomCircle.addChild(circleNum);
            }
            //fff3c2
            var resultBView = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width > scrollView.getInnerContainerSize().width?backView.getContentSize().width:scrollView.getInnerContainerSize().width,80);
            resultBView.setAnchorPoint(0, 0);
            resultBView.setPosition(0, 0);
            scrollView.addChild(resultBView);

            var resultValue = new cc.LabelTTF("",GAME_FONT.PRO_W6,32);
            resultValue.setFontFillColor(cc.color("#6fcdc1"));
            resultValue.setAnchorPoint(cc.p(0.5, 0.5));
            resultValue.setPosition(resultBView.getContentSize().width>>1, resultBView.getContentSize().height>>1);
            scrollView.addChild(resultValue);
        }else{
            this.setTouchScrollView(scrollView);
        }

        return scrollView;
    },

    setScrollViewTouch:function(isOpen){
        if(this.scrollView){
            if(isOpen){
                for(var i = 0; i < this.currentMaxPer; i++){
                    this.scrollView.getChildByTag(i).setTouchEnabled(true);
                }
            }else{
                for(var i = 0; i < this.currentMaxPer; i++){
                    this.scrollView.getChildByTag(i).setTouchEnabled(false);
                }
            }
        }
    },
    //随机模式
    setWidthLine:function(){
        var maxNum = 7;
        if(0){//forTestAllLine
            for(var i = 0; i < this.lineHeightY.length; i++){
                this.lineWidthStart.push(this.lineHeightX[0]);
                this.lineWidthStart.push(this.lineHeightY[i]);

                this.lineWidthEnd.push(this.lineHeightX[1]);
                this.lineWidthEnd.push(this.lineHeightY[i]);
            }
        }else{
            for(var i = 0; i < this.currentMaxPer - 1; i++){
                var maxLineForHeight = Utility.getRandomInt(3,maxNum);
                var _h = parseInt(this.lineHeightY.length/maxLineForHeight) + 1;
                if(_h <= maxLineForHeight) maxLineForHeight = _h = parseInt(this.lineHeightY.length/(maxNum - 1)) + 1;
                for(var j = 0; j < maxLineForHeight; j++){
                    var rand = _h*j + Utility.getRandomInt(0,_h);
                    //for(var k = 0; k < this.lineWidthStart.length/2; k++){//移除重复的线
                    //    while((this.lineWidthStart[2*k] == this.lineHeightX[i]) && (this.lineWidthStart[2*k + 1] == this.lineHeightY[rand])){
                    //        rand = j + Utility.getRandomInt(0,_h);
                    //        k = 0;
                    //    }
                    //}

                    if(i >= 1){//移除链接的线
                        for(var k = 0; k < this.lineWidthStart.length/2; k++){
                            while((this.lineWidthStart[2*k] == this.lineHeightX[i - 1]) && (this.lineWidthStart[2*k + 1] == this.lineHeightY[rand])){
                                rand = _h*j + Utility.getRandomInt(0,_h);
                                k = 0;
                            }
                        }
                    }
                    this.lineWidthStart.push(this.lineHeightX[i]);
                    this.lineWidthStart.push(this.lineHeightY[rand]);
                    this.lineWidthEnd.push(this.lineHeightX[i + 1]);
                    this.lineWidthEnd.push(this.lineHeightY[rand]);
                }
            }
        }
        this.drawWidthLine();
    },

    drawWidthLine:function(height){
        var draw = this.scrollView.getChildByName("widthLine");
        if(draw){
            draw.removeFromParent();
            draw = null;
        }
        draw = new cc.DrawNode();
        draw.setName("widthLine");
        this.scrollView.addChild(draw);
        for(var i = 0; i < this.lineWidthStart.length/2; i++){
            if(height){
                this.lineWidthStart[2*i+1] = this.lineWidthStart[2*i+1] + height;
                this.lineWidthEnd[2*i+1] = this.lineWidthEnd[2*i+1] + height;
            }
            draw.drawPoly([cc.p(this.lineWidthStart[2*i], this.lineWidthStart[2*i+1]),cc.p(this.lineWidthEnd[2*i], this.lineWidthEnd[2*i+1])], null, 5, cc.color("#6fcdc1"));
        }
    },

    setPersonLine:function(topH,bottomH,perNum,itemRes,text){
        var soundID =  SoundManager.instance().playEffect(GhostLegRes.sound_character_moving);
        var scrollView = this.scrollView;
        //首先清楚之前动画数据
        //if(scrollView.getChildByName("itemSprite"))
        //    scrollView.getChildByName("itemSprite").removeFromParent();
        //if(scrollView.getChildByName("spriteBack"))
        //    scrollView.getChildByName("spriteBack").removeFromParent();
        var isReDraw = -1;
        var isWidthDraw;
        var _this = this;
        var arryPLine = [];
        var startY = scrollView._getInnerHeight() - topH;

        //if(!_this.isChaMoving && scrollView.getChildByName("personLine"))
        //    scrollView.getChildByName("personLine").removeFromParent();
        var deleteAllStopLine = function(){//消失所有静止的线
            for(var k = 0; k < scrollView.getChildrenCount();k++){
                var pDrawLineName = scrollView.getChildren()[k];
                if(pDrawLineName.getName() === "personLine" && pDrawLineName.getTag() === 1){
                    pDrawLineName.setLocalZOrder(-1);
                }
            }
        };

        deleteAllStopLine();
        var draw = new cc.DrawNode();
        draw.setName("personLine");
        draw.setTag(0);//0:表示动画没结束 1:表示动画已经结束
        scrollView.addChild(draw,this.ORDER_Z_LINE);

        if(1){
            //开始线路
            arryPLine.push(cc.p(this.lineHeightX[perNum],startY));
            //var itemSprite = new cc.Sprite(itemRes);
            var itemSprite = new ccui.Button(itemRes,itemRes);
            itemSprite.setTouchEnabled(false);
            itemSprite.setName("itemSprite");
            itemSprite.setTag(perNum);
            itemSprite.setAnchorPoint(cc.p(0.5, 0.5));
            itemSprite.setPosition(cc.p(this.lineHeightX[perNum],startY));
            scrollView.addChild(itemSprite,this.ORDER_Z_MAX);
            var i = startY;
            var isEnd = true;
            var index;
            var temp = new ccui.Layout();
            _this.addChild(temp);
            temp.schedule(function(){
                var drawPersonLine = function(draw,arrayLine,itemSprite,x,y,isGoLine){
                    if(isGoLine){
                        if(isGoLine == 1)//往右走
                            arrayLine.push(cc.p(x + 2, y));
                        else if(isGoLine == 2)//往左走
                            arrayLine.push(cc.p(x - 2, y));
                        else//往下走
                            arrayLine.push(cc.p(x, y - 2));
                    }else
                        arrayLine.push(cc.p(x, y));

                    itemSprite.setPosition(cc.p(x,y));
                    var leng = arrayLine.length;
                    if(leng > 0)
                        draw.drawPoly([arrayLine[leng - 2],arrayLine[leng - 1]], null, 5, cc.color("#fed053"));

                    if(isGoLine)
                        arrayLine.splice(leng - 1,1,cc.p(x, y));

                    //draw.drawCardinalSpline(arrayLine, 1, _this.currentMaxPer*parseInt(cc.winSize.height/_this.lineHeight), 5, cc.color("#fed053"));
                };
                if(i > (bottomH)){
                    _this.isChaMoving = true;
                    if(isReDraw > -1){//横着运动的动画
                        if(isReDraw == 0){//往右走
                            isWidthDraw += _this.lineHeight;
                            if(isWidthDraw >= _this.lineWidthEnd[index]){
                                drawPersonLine(draw,arryPLine,itemSprite,_this.lineWidthEnd[index], _this.lineWidthEnd[index + 1],1);
                                isReDraw = -1;
                            }else
                                drawPersonLine(draw,arryPLine,itemSprite,isWidthDraw, _this.lineWidthEnd[index + 1]);
                        }else{//往左走
                            isWidthDraw -= _this.lineHeight;
                            if(isWidthDraw <= _this.lineWidthStart[index]){
                                drawPersonLine(draw,arryPLine,itemSprite,_this.lineWidthStart[index], _this.lineWidthStart[index + 1],2);
                                isReDraw = -1;
                            }else
                                drawPersonLine(draw,arryPLine,itemSprite,isWidthDraw, _this.lineWidthStart[index + 1]);

                        }
                        return;
                    }

                    i-=_this.lineHeight;
                    var value = arryPLine[arryPLine.length - 1];
                    for(var j = 0; j < _this.lineWidthStart.length/2; j++){//往右走
                        if((_this.lineWidthStart[2*j] == value.x)&&(_this.lineWidthStart[2*j + 1] == i)){
                            index = 2*j;
                            isReDraw = 0;
                            isWidthDraw = _this.lineWidthStart[index];
                            drawPersonLine(draw,arryPLine,itemSprite,_this.lineWidthStart[index],_this.lineWidthStart[index + 1],3);
                            break;
                        }
                    }
                    for(var j = 0; j < _this.lineWidthEnd.length/2; j++){//往左走
                        if((_this.lineWidthEnd[2*j] == value.x)&&(_this.lineWidthEnd[2*j + 1] == i)){
                            index = 2*j;
                            isReDraw = 1;
                            isWidthDraw = _this.lineWidthEnd[index];
                            drawPersonLine(draw,arryPLine,itemSprite,_this.lineWidthEnd[index], _this.lineWidthEnd[index + 1],3);
                            break;
                        }
                    }
                    if(isReDraw == -1)
                        drawPersonLine(draw,arryPLine,itemSprite,value.x, i);
                    //itemSprite.setPosition(cc.p(arryPLine[arryPLine.length - 2].x,arryPLine[arryPLine.length - 2].y));
                    //draw.drawCardinalSpline(arryPLine, 1, 2*parseInt(cc.winSize.height/_this.lineHeight), 5, cc.color("#fed053"));
                }else if(isEnd){
                    if(soundID)
                        SoundManager.instance().stopEffect(soundID);
                    draw.setTag(1);
                    _this.drawLineIndex[perNum] = draw;
                    _this.isChaMoving = false;
                    isEnd = false;
                    var setTextPos = function(idx,is){
                        text.setString(_this.reusltStr[_this.rStrIndex[idx]]);
                        text.setAnchorPoint(0.5,0.5);
                        text.setPositionX(itemSprite.getPositionX());
                        //console.log(text.getContentSize().width/2+"::"+text.getPositionX());
                        var maxScrollWidth = scrollView._getInnerWidth();
                        if(text.getPositionX() < text.getContentSize().width/2){
                            text.setPositionX(10);
                            text.setAnchorPoint(0.0,0.5);
                        }else if((text.getPositionX() + text.getContentSize().width/2) > maxScrollWidth - 10){
                            text.setPositionX(maxScrollWidth - 10);
                            text.setAnchorPoint(1.0,0.5);
                        }
                        var spriteBack = scrollView.getChildByName("spriteBack");
                        if(spriteBack){
                            spriteBack.setPositionX(itemSprite.getPositionX());
                            if(!spriteBack.isVisible())
                                spriteBack.setVisible(true);
                        }
                        deleteAllStopLine();
                        _this.drawLineIndex[perNum].setLocalZOrder(_this.ORDER_Z_LINE);
                    };
                    itemSprite.setTouchEnabled(true);
                    itemSprite.setPosition(cc.p(arryPLine[arryPLine.length - 1].x,bottomH - 45));
                    if(!scrollView.getChildByName("spriteBack")){
                        var spriteBack = new cc.Sprite(GhostLegRes.result_amd_selected);
                        spriteBack.setAnchorPoint(cc.p(0.5, 1));
                        spriteBack.setName("spriteBack");
                        spriteBack.setPosition(cc.p(itemSprite.getPositionX(),itemSprite.getPositionY() + itemSprite.getContentSize().height/2 + 5));
                        scrollView.addChild(spriteBack,_this.ORDER_Z_MAX - 1);
                    }
                    setTextPos(perNum);
                    //当依然存正在运动的线时，消失。
                    for(var k = 0; k < scrollView.getChildrenCount();k++){
                        var pDrawLineName = scrollView.getChildren()[k];
                        if(pDrawLineName.getName() === "personLine" && pDrawLineName.getTag() === 0){
                            draw.setLocalZOrder(-1);
                            break;
                        }
                    }

                    _this.endAnimCount++;
                    if(_this.endAnimCount == _this.currentMaxPer){//updateList 8.5time
                        //for(var k = 0; k < scrollView.getChildrenCount();k++){
                        //    if(scrollView.getChildren()[k].getName() === "itemSprite"){
                        //        scrollView.getChildren()[k].setTouchEnabled(true);
                        //    }
                        //}
                        var backView = _this.getChildByTag(_this.ORDER_Z_GAME);
                        backView.getChildByName("toResult").removeFromParent();
                        _this.buttonBackColorText("toResult","結果を見る",cc.winSize.width/2 - 110, 30,cc.size(200, 80),cc.color("#6fcdc1"),backView);
                    }

                    itemSprite.addTouchEventListener(function(sender, type){
                        switch (type) {
                            case ccui.Widget.TOUCH_BEGAN:
                                break;
                            case ccui.Widget.TOUCH_MOVED:
                                break;
                            case ccui.Widget.TOUCH_ENDED:
                                SoundManager.instance().playEffect(GhostLegRes.sound_result_selected);
                                setTextPos(sender.getTag());
                                break;
                            case ccui.Widget.TOUCH_CANCELED:
                                break;
                            default:
                                break;
                        }
                    });
                    this.removeFromParent();
                    //arryPLine.push(cc.p(arryPLine[arryPLine.length - 1].x,bottomH));
                    //draw.drawCardinalSpline(arryPLine, 1, _this.currentMaxPer*parseInt(cc.winSize.height/_this.lineHeight), 5, cc.color("#fed053"));
                }

            },0.01);
        }else {
            arryPLine.push(cc.p(this.lineHeightX[perNum],startY));
            for(var i = startY; i > (bottomH); i-=this.lineHeight){
                var value = arryPLine[arryPLine.length - 1];
                for(var j = 0; j < _this.lineWidthStart.length/2; j++){
                    if((_this.lineWidthStart[2*j] == value.x)&&(_this.lineWidthStart[2*j + 1] == i)){
                        var index = 2*j;
                        arryPLine.push(cc.p(_this.lineWidthStart[index], _this.lineWidthStart[index + 1]));
                        arryPLine.push(cc.p(_this.lineWidthEnd[index], _this.lineWidthEnd[index + 1]));
                        break;
                    }
                }
                for(var j = 0; j < _this.lineWidthEnd.length/2; j++){
                    if((_this.lineWidthEnd[2*j] == value.x)&&(_this.lineWidthEnd[2*j + 1] == i)){
                        var index = 2*j;
                        arryPLine.push(cc.p(_this.lineWidthEnd[index], _this.lineWidthEnd[index + 1]));
                        arryPLine.push(cc.p(_this.lineWidthStart[index], _this.lineWidthStart[index + 1]));
                        //}
                        break;
                    }
                }

            }
            arryPLine.push(cc.p(arryPLine[arryPLine.length - 1].x,bottomH));
            draw.drawCardinalSpline(arryPLine, 1, 2*parseInt(cc.winSize.height/this.lineHeight), 5, cc.color("#fed053"));
        }
    },

    getreusltStrWithPersonData:function(topH,bottomH){
        this.rStrIndex = [];
        var _this = this;
        var arryPLine = [];
        this.currentMaxPer = this.textFiledAddVIew.listView.getItems().length;
        var startY = this.scrollView._getInnerHeight() - topH;

        for(var perNum = 0; perNum < this.currentMaxPer; perNum++) {
            arryPLine.push(cc.p(this.lineHeightX[perNum], startY));
            for (var i = startY; i > (bottomH); i -= this.lineHeight) {
                var value = arryPLine[arryPLine.length - 1];
                for (var j = 0; j < _this.lineWidthStart.length / 2; j++) {
                    if ((_this.lineWidthStart[2 * j] == value.x) && (_this.lineWidthStart[2 * j + 1] == i)) {
                        var index = 2 * j;
                        arryPLine.push(cc.p(_this.lineWidthStart[index], _this.lineWidthStart[index + 1]));
                        arryPLine.push(cc.p(_this.lineWidthEnd[index], _this.lineWidthEnd[index + 1]));
                        break;
                    }
                }
                for (var j = 0; j < _this.lineWidthEnd.length / 2; j++) {
                    if ((_this.lineWidthEnd[2 * j] == value.x) && (_this.lineWidthEnd[2 * j + 1] == i)) {
                        var index = 2 * j;
                        arryPLine.push(cc.p(_this.lineWidthEnd[index], _this.lineWidthEnd[index + 1]));
                        arryPLine.push(cc.p(_this.lineWidthStart[index], _this.lineWidthStart[index + 1]));
                        break;
                    }
                }
            }

            for (var k = 0; k < this.lineHeightX.length; k++) {
                if(_this.lineHeightX[k] == arryPLine[arryPLine.length - 1].x){
                    _this.rStrIndex.push(k);
                    break;
                }
            }

        }
    },

    //绘制横线模式
    setTouchScrollView:function(scrollView){
        var _this = this;
        var isDelete = -1;
        var layout = new ccui.Layout();
        layout.setContentSize(scrollView._getInnerWidth(),scrollView._getInnerHeight());
        layout.setAnchorPoint(0, 0);
        layout.setPosition(0, 0);
        scrollView.addChild(layout);
        var indexX = -1, indexY = -1;
        var listenerMagazine = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    //cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                    indexX = -1;indexY = -1;
                    for(var i = 0; i < _this.lineHeightX.length - 1; i++){//X在范围内
                            if(locationInNode.x > _this.lineHeightX[i] && locationInNode.x < _this.lineHeightX[i + 1]){
                                indexX = i;
                                break;
                            }
                    }
                    for(var i = 0; i < _this.lineHeightY.length; i++){//Y在范围内
                        var d = Math.abs(locationInNode.y - _this.lineHeightY[i]);
                        if(d < _this.lineHeight/2){
                            indexY = i;
                            break;
                        }
                    }
                    if(indexX > -1 && indexY > -1){
                        for(var i = 0; i < _this.lineWidthStart.length/2; i++){
                            if(_this.lineHeightX[indexX] == _this.lineWidthStart[2*i] && _this.lineHeightY[indexY] == _this.lineWidthStart[2*i + 1]){//相同线不画
                                if(_this.selectedEditItem == 2){
                                    isDelete = 2*i;
                                    return false;
                                }
                            }
                            if((_this.lineHeightX[indexX] == _this.lineWidthStart[2*i] && _this.lineHeightY[indexY] == _this.lineWidthStart[2*i + 1])||//相同线不画
                                (_this.lineHeightX[indexX + 1] == _this.lineWidthStart[2*i] && _this.lineHeightY[indexY] == _this.lineWidthStart[2*i + 1])//右边重叠线不画
                                ||(_this.lineHeightX[indexX] == _this.lineWidthEnd[2*i] && _this.lineHeightY[indexY] == _this.lineWidthEnd[2*i + 1])//左边重叠线不画
                                ){
                                indexX = -1;indexY = -1;
                                return false;
                            }
                        }
                        return false;
                    }
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                cc.log("onTouchMoved");
                return false;
            },
            onTouchEnded: function (touch, event) {
                cc.log("onTouchMoved");
                return false;
            }

        });
        cc.eventManager.addListener(listenerMagazine, layout);
        var tempLocation;
        scrollView.setTouchDelegate(
            function (touch,event,touchEvent) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());

                switch(touchEvent){
                    case ccui.Widget.TOUCH_BEGAN:
                        tempLocation = locationInNode;
                        break;
                    case ccui.Widget.TOUCH_MOVED:
                        //indexX = -1;indexY = -1;
                        break;
                    case ccui.Widget.TOUCH_ENDED:
                        var dx = Math.abs(tempLocation.x - locationInNode.x);
                        var dy = Math.abs(tempLocation.y - locationInNode.y);
                        if(dx > 10 || dy > 10){
                            indexX = -1;indexY = -1;
                        }
                        if(isDelete > -1){
                            _this.lineWidthStart.splice(isDelete,2);
                            _this.lineWidthEnd.splice(isDelete,2);
                            _this.drawWidthLine();
                            isDelete = -1;
                        }else if(indexX > -1 && indexY > -1 && _this.selectedEditItem == 1){
                            _this.lineWidthStart.push(_this.lineHeightX[indexX]);
                            _this.lineWidthStart.push(_this.lineHeightY[indexY]);
                            _this.lineWidthEnd.push(_this.lineHeightX[indexX + 1]);
                            _this.lineWidthEnd.push(_this.lineHeightY[indexY]);
                            _this.drawWidthLine();
                        }
                        break;
                    case ccui.Widget.TOUCH_CANCELED:
                        break;
                }
            });
    },

    gotoReplayView:function(groups,mode){
        console.log("gotoReplayView");
        mainView.getHistory(groups,mode);
        mainView.removeAllChildren(true);
        mainView.additionEntry();
    },

    gotoResultView:function(groups, title, mode){
        console.log("gotoResultView");

        mainView.getHistory(groups,mode);

        mainView.drawResultView(title);
    },

    getHistory:function(groups,mode){
        var _this = this;
        _this.initData();
        _this.mode = mode;
        _this.textFiledAddVIew = new TextFiledAddList(15,10 + 80 + 34 + 2*20 + 8,0);
        if(groups){
            for(var j = 0; j < groups.length; j++){
                for(var k = 0; k < groups[j].members.length; k++){
                    _this.textFiledAddVIew.setListChildern(groups[j].members[k].name,groups[j].members[k].iconIdx);
                    _this.reusltStr.push(groups[j].members[k].rStr);
                    _this.rStrIndex.push(groups[j].members[k].rStrWithP);
                }
            }
        }
    },

    setHistory:function(mode,title,teamName,icon,members){

        //group.add({icon:"01", name:"ブニャ","members":[{"name":"32131321"},{"name":"44444"}]});

        var group = new ArrayList();
        for(var i = 0 ; i < 1; i++){
            var result = {};
            result.name = "title";
            result.icon = "icon";
            result.members = [];
            for(var j = 0 ; j < this.currentMaxPer; j++){
                var data = {};
                data.name = this.textFiledAddVIew.getListChildern(j);
                data.iconIdx = this.textFiledAddVIew.getListChildernIcon(j);
                data.rStr = this.reusltStr[j];
                data.rStrWithP =  this.rStrIndex[j];
                result.members.push(data);
            }
            group.add(result);
        }

        var history = {};
        history.mode = mode;//1: resOne 2: resTow
        history.groups = group.arr;
        history.title = title;
        DataManager.instance().createHistory(GAME_TYPE.GhostLeg, history);
    },

    buttonBackColorText:function(bName,bTxt,x,y,size,color,parent){
        var btn = new ccui.Button();
        btn.setContentSize(size);
        btn.setAnchorPoint(0.5, 0);
        btn.setPosition(x, y);
        btn.setScale9Enabled(true);
        btn.setName(bName);
        btn.setTouchEnabled(true);
        btn.addTouchEventListener(this.touchEvent, this);
        if(parent)
            parent.addChild(btn);
        else
            this.addChild(btn);

        var btnBack = new cc.LayerColor(color, btn.getContentSize().width,btn.getContentSize().height);
        btnBack.setPosition(0, 0);
        btn.addChild(btnBack);

        var btnText = new cc.LabelTTF(bTxt);
        btnText.setFontName(GAME_FONT.PRO_W3);
        btnText.setFontSize(26);
        btnText.setFontFillColor(cc.color.WHITE);
        btnText.setAnchorPoint(0.5, 0.5);
        btnText.setPosition(btn.getContentSize().width/2, btn.getContentSize().height/2);
        btn.addChild(btnText);
        return btn;
    }

});

var GhostLegScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GhostLegLayer();
        this.addChild(layer);
    }
});