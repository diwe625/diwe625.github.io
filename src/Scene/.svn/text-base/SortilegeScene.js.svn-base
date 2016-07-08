/**
 * Created by nhnst on 11/2/15.
 * 제비뽑기（抽签）
 */
var SortilegeLayer = cc.LayerColor.extend({
    maxPer:null,//参加人数
    joinInPersonslistView: null,
    penaltyPer:null,//当前剩下的当たり数量
    penaltyPerlistView: null,
    textFiledAddArray:null,//当たり数组
    isCanRock:null,
    ROCK_MAX:6,
    selMode:null,
    isClearResult:true,
    gameStage:0,
    TAG_MAIN:0,
    TAG_SETTING:200,
    TAG_READY:201,
    TAG_GAME:202,
    TAG_MASK:205,
    TAG_ANIM:206,
    ORDER_Z_MAIN:10,
    ORDER_Z_SETTING:20,
    ORDER_Z_TUTORIAL:50,
    ORDER_Z_EFFECT:60,
    ORDER_Z_RESULT:60,
    intoScreenHeight:null,//判断进入时的屏幕高度：修改重叠安卓BUG
    _itemPositionArray: null,
    _itemPositionArrayA:[
        [124,85],
        [480,54],
        [270,270],
        [20,380],
        [460,350],

        [195,400],
        [430,305],
        [62,205],
        [480,105],
        [176,30]
    ],
    _itemPositionArrayB:[
        [124 - 60,85 - 60],
        [480 - 60,54 - 60 - 30],
        [270 - 60,270 - 60 - 30],
        [20 - 60,380 - 60],
        [511 - 60,350 - 60],

        [200 - 60,400 - 100],
        [424 - 60,305 - 100],
        [74 - 60,205 - 100],
        [450 - 60,105 - 100],
        [170 - 60,30 - 100]
    ],
    _cuItemNode:null,
    ctor:function () {
        this._super(cc.color(111,205,192,255));

        mainView = this;

        this.initMainView();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.intoScreenHeight = cc.winSize.height;

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.Sortilege);

        Utility.sendXhr(GAME_TYPE.Sortilege.gameid);

        return true;
    },

    update:function(){
        var context = this;
        if(Utility.checkRfresh){
            switch (context.gameStage){
                case context.TAG_MAIN:
                    var h = context.getChildByName("mainBack").getContentSize().height;
                    //context.getChildByName("mainBack").setPosition(0, (cc.winSize.height - h)/2);//位置修改
                    if(context.intoScreenHeight == cc.winSize.height){
                        context.getChildByName("mainBack").setPosition(0, 0);
                    }else
                        context.getChildByName("mainBack").setPosition(0, (cc.winSize.height - h)/2);
                    context.getChildByName("mainBack").setContentSize(cc.winSize);//大小修改
                    context.getChildByName("toolBar").setPosition(cc.p(0,cc.winSize.height));
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
            case context.TAG_SETTING:
            case context.TAG_GAME:
                mainView.removeAllChildren();
                mainView.initMainView();
                break;

        }
    },

    initMainView:function () {
        this._cuItemNode = [];
        this.selMode = -1;
        this.isCanRock = this.ROCK_MAX;
        this.gameStage = this.TAG_MAIN;

        this.textFiledAddArray = [];

        var toolbar = new Toolbar(GAME_TYPE.Sortilege);
        toolbar.setAnchorPoint(cc.p(0,1));
        toolbar.setName("toolBar");
        toolbar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolbar,this.ORDER_Z_MAIN);

        var aeBack = new cc.LayerColor(cc.color(111,205,192,255), cc.winSize.width,cc.winSize.height);
        aeBack.setPosition(0, 0);
        aeBack.setName("mainBack");
        this.addChild(aeBack);

        var dis = 0;
        if(cc.winSize.height < 500) dis = 80;
        else if(cc.winSize.height < 600) dis = 40;

        var topH = 260 - dis;
        var bottomH = 110 - dis;

        this.initButton("mode1","",cc.winSize.width/2 - 237 + 10,cc.winSize.height/2 + topH,SortilegeRes.icon_bom_off,aeBack);
        this.initButton("mode2","",cc.winSize.width/2 + 10,cc.winSize.height/2 + topH,SortilegeRes.icon_kuji_off,aeBack);
        this.initButton("mode3","",cc.winSize.width/2 + 237 + 10,cc.winSize.height/2 + topH,SortilegeRes.icon_gacha_off,aeBack);

        this.initLabel("くじタイブを選択",cc.winSize.width/2,aeBack.getChildByName("mode1").getPositionY() + 120,"text1",aeBack);

        this.initLabel("くじの数を選択",cc.winSize.width/2,cc.winSize.height/2 + 47,"text2",aeBack);
        this.joinInPersonslistView = new ScrollNum(2,11,2,1);
        this.joinInPersonslistView.setPosition(cc.winSize.width/2, cc.winSize.height/2 - 50);
        aeBack.addChild(this.joinInPersonslistView);

        var draw = new cc.DrawNode();
        var vertices = [cc.p(cc.winSize.width/2 - 235, cc.winSize.height/2 - 107), cc.p(cc.winSize.width/2 + 235, cc.winSize.height/2 - 107) ];
        aeBack.addChild(draw);
        draw.drawPoly(vertices, null, 2, cc.color("#a1ded7"));

        this.initLabel("はずれの数を選択",cc.winSize.width/2,cc.winSize.height/2 - 163,"text3",aeBack);
        this.penaltyPerlistView = new ScrollNum(1,10,1,1);
        this.penaltyPerlistView.setPosition(cc.winSize.width/2, cc.winSize.height/2 - 260);
        aeBack.addChild(this.penaltyPerlistView);

        this.buttonBackColorText("Start","今すぐ開始" ,cc.winSize.width/2 - 150, bottomH,cc.size(280, 100),cc.color("#448f94"));
        this.buttonBackColorText("SetWinners","はずれ設定" ,cc.winSize.width/2 + 150, bottomH,cc.size(280, 100),cc.color("#448f94"));

    },

    initWinnersLayerView:function () {
        this.removeAllChildren();

        this.gameStage = this.TAG_SETTING;

        var aeBack = new cc.LayerColor(cc.color("#ffffff"), cc.winSize.width,cc.winSize.height);
        aeBack.setPosition(0, 0);
        this.addChild(aeBack);

        var _H = 20;
        var titleH = 100;
        var bottomH = 80 + 60 + 8;
        var itemH = 138;
        var maxNum = this.penaltyPer;
//Title
        var titleBack = new cc.LayerColor(cc.color("#6fcdc1"), aeBack.getContentSize().width, titleH);
        titleBack.setPosition(0, aeBack.getContentSize().height - titleBack.getContentSize().height);
        aeBack.addChild(titleBack);
        //标题
        var titleName = new cc.LabelTTF("罰ゲームの内容を決める",GAME_FONT.PRO_W3);
        titleName.setFontSize(32);
        titleName.setFontFillColor(cc.color("#fff3bf"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);
//listView
        var scrollView = new ccui.ScrollView();
        scrollView.setAnchorPoint(0, 0);
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setContentSize(cc.size(aeBack.getContentSize().width, aeBack.getContentSize().height - titleH - bottomH));
        scrollView.setBounceEnabled(false);
        var scrollViewRect = scrollView.getContentSize();
        scrollView.setInnerContainerSize(cc.size(scrollViewRect.width,itemH*(maxNum)));
        scrollView.setPosition(0,bottomH);
        aeBack.addChild(scrollView);

        this.itemEditMode(scrollView,itemH,maxNum);

//Bottom
        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(cc.p(0,1));
        cutoff.setPosition(0,bottomH);
        cutoff.setScaleX(cc.winSize.width);
        this.addChild(cutoff);

        this.buttonBackColorText("Start","開始",cc.winSize.width/2, 30,cc.size(200, 80),cc.color("#c8c8c8"));

    },

    isInputHavNull:function(){
        var isHave = false;
        for(var i = 0; i < this.textFiledAddArray.length; i++){
            if(this.textFiledAddArray[i] == ""){
                isHave = true;
                break;
            }
        }
        return isHave;
    },

    editBoxEditingDidEnd: function (editBox) {
        mainView.textFiledAddArray.splice(editBox.getParent().getTag(),1,editBox.getString());
        //cc.log("editBox " + editBox.getString() + " DidEnd !");
        var button = mainView.getChildByName("Start");
        if(mainView.isInputHavNull()){
            button.removeFromParent();
            mainView.buttonBackColorText("Start","開始",cc.winSize.width/2, 30,cc.size(200, 80),cc.color("#c8c8c8"));
        }else{
            button.removeFromParent();
            mainView.buttonBackColorText("Start","開始",cc.winSize.width/2, 30,cc.size(200, 80),cc.color("#6fcdc1"));
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

            var textString = "つ目の罰ゲームを入力してください";

            var aSpriteLavel = new cc.LabelTTF(cc.sys.os == cc.sys.OS_IOS?"       "+textString:"          "+textString,GAME_FONT.PRO_W3);
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
            if(this.textFiledAddArray.length == maxNum){
                textField.setString(this.textFiledAddArray[i]);
            }else
                this.textFiledAddArray.push("");
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

    touchEvent: function (sender, type) {

        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                //this._topDisplayLabel.setString("Touch Down");
                break;
            case ccui.Widget.TOUCH_MOVED:
                //this._topDisplayLabel.setString("Touch Move");
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.log("touchEvent " + sender.getName());

                if(sender.getName() == "mode1" || sender.getName() == "mode2" || sender.getName() == "mode3"){
                    mainView.setIconMode(sender);
                }else  if(sender.getName() == "SetWinners" || (sender.getName() == "Start" && !mainView.isInputHavNull())){
                    mainView.initSetting(sender);
                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
                //this._topDisplayLabel.setString("Touch Cancelled");
                break;

            default:
                break;
        }
    },

    initLabel:function(labelStr,x, y, nameStr,back){
        var text = new ccui.Text(labelStr,GAME_FONT.PRO_W3,34);
        //text.ignoreContentAdaptWithSize(false);
        //text.setContentSize(cc.size(280, 150));
        //text.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setName(nameStr);
        text.setAnchorPoint(cc.p(0.5,0.5));
        text.setColor(cc.color("#dbf2ef"));
        text.setPosition(x, y);
        if(back)
            back.addChild(text);
        else
            this.addChild(text);
        return text;
    },

    initButton:function(nameStr,butStr,x, y,imageRes,back){
        var Button = new ccui.Button(imageRes,imageRes);
        Button.setTouchEnabled(true);
        Button.setAnchorPoint(cc.p(0.5,0.5));
        Button.setName(nameStr);
        Button.setPosition(x, y);
        Button.setTitleText(butStr);
        Button.setTitleColor(cc.color.BLACK);
        Button.addTouchEventListener(mainView.touchEvent, mainView);
        if(back)
            back.addChild(Button);
        else
            this.addChild(Button);
        return Button;
    },

    buttonBackColorText:function(bName,bTxt,x,y,size,color){
        var btn = new ccui.Button();
        btn.setContentSize(size);
        btn.setAnchorPoint(0.5, 0);
        btn.setPosition(x, y);
        btn.setScale9Enabled(true);
        btn.setName(bName);
        btn.setTouchEnabled(true);
        btn.addTouchEventListener(this.touchEvent, this);
        this.addChild(btn);

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
    },

    setIconMode:function(sender){

        if(sender.getName() == "mode1"){
            if(this.selMode == 0)return;
            this.selMode = 0;
            sender.loadTextures(SortilegeRes.icon_bom_on,SortilegeRes.icon_bom_on);
            var getChildren = sender.getParent().getChildren();
            for(var i = 0; i < getChildren.length; i ++){
                if(getChildren[i].getName() == "mode2")
                    getChildren[i].loadTextures(SortilegeRes.icon_kuji_off,SortilegeRes.icon_kuji_off);
                if(getChildren[i].getName() == "mode3")
                    getChildren[i].loadTextures(SortilegeRes.icon_gacha_off,SortilegeRes.icon_gacha_off);
            }

        }else if(sender.getName() == "mode2"){
            if(this.selMode == 1)return;
            this.selMode = 1;
            sender.loadTextures(SortilegeRes.icon_kuji_on,SortilegeRes.icon_kuji_on);
            var getChildren = sender.getParent().getChildren();
            for(var i = 0; i < getChildren.length; i ++){
                if(getChildren[i].getName() == "mode1")
                    getChildren[i].loadTextures(SortilegeRes.icon_bom_off,SortilegeRes.icon_bom_off);
                if(getChildren[i].getName() == "mode3")
                    getChildren[i].loadTextures(SortilegeRes.icon_gacha_off,SortilegeRes.icon_gacha_off);
            }

        }else if(sender.getName() == "mode3"){
            if(this.selMode == 2)return;
            this.selMode = 2;
            sender.loadTextures(SortilegeRes.icon_gacha_on,SortilegeRes.icon_gacha_on);
            var getChildren = sender.getParent().getChildren();
            for(var i = 0; i < getChildren.length; i ++){
                if(getChildren[i].getName() == "mode1")
                    getChildren[i].loadTextures(SortilegeRes.icon_bom_off,SortilegeRes.icon_bom_off);
                if(getChildren[i].getName() == "mode2")
                    getChildren[i].loadTextures(SortilegeRes.icon_kuji_off,SortilegeRes.icon_kuji_off);
            }

        }
        SoundManager.instance().playEffect(SortilegeRes.sound_kuji_seleted);
    },

    initSetting:function(sender){
        if(this.selMode < 0)
            this.initAlert("くじタイブを選択してください");
        else{
            this.maxPer = this.joinInPersonslistView.selectNum;
            this.penaltyPer = this.penaltyPerlistView.selectNum;
            if(this.penaltyPer >= this.maxPer){
                this.initAlert("当たり数がくじ数を超過しました。");
            }else if(sender.getName() == "SetWinners"){
                this.initWinnersLayerView();
            }else {
                this.startGame();
            }
        }
    },

    initAlert:function(str){
        alert(str);
    },

    startGame:function(){
        this.gameStage = this.TAG_GAME;
        this.removeAllChildren();

        var aeBack = new cc.LayerColor(cc.color(111,205,192,255), cc.winSize.width,cc.winSize.height);
        aeBack.setAnchorPoint(0.5,0,5);
        aeBack.setPosition(0, 0);
        this.addChild(aeBack);

        var imageRes;
        if(this.selMode == 0){
            this._itemPositionArray = this._itemPositionArrayA;
            imageRes = SortilegeRes.anim_bomb;
        }else if(this.selMode == 1){
            this._itemPositionArray = this._itemPositionArrayB;
            imageRes = SortilegeRes.anim_kuji;
        }else if(this.selMode == 2){
            this.startGameMode3();
            return;
        }

        var  arr = [];
        for(var i = 0; i< this.maxPer;i++){
            var rand = Utility.getRandomInt(0,this._itemPositionArray.length);
            for(var k = 0; k< arr.length;k++) {
                while(arr[k] == rand){
                    rand = Utility.getRandomInt(0,this._itemPositionArray.length);
                    k = 0;
                }
            }
            arr.push(rand);
        }


        for(var i = 0; i< arr.length;i++) {
            var item = new cc.Sprite(imageRes);
            item.setAnchorPoint(cc.p(0.5, 0.5));
            if(arr[i] > 4) {
                item.setPosition(this._itemPositionArray[arr[i]][0] + item.getContentSize().width/2,
                    this._itemPositionArray[arr[i]][1] + item.getContentSize().height/2);
            }else{
                item.setPosition(this._itemPositionArray[arr[i]][0] + item.getContentSize().width/2,
                    cc.winSize.height - this._itemPositionArray[arr[i]][1] - item.getContentSize().height/2);
            }
            this._cuItemNode.push(item);
            this.addChild(item);

            var listenerMagazine = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if(mainView.selMode == 1)
                        rect = cc.rect(70, 120, 210, 190);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        mainView.setResultAnim(target);
                        return true;
                    }
                    return false;
                }
            });
            cc.eventManager.addListener(listenerMagazine, item);

        }
        var shaking = new ccui.Button(SortilegeRes.result_shaking,SortilegeRes.result_shaking);
        shaking.setAnchorPoint(cc.p(0.5, 0.5));
        shaking.setPosition(cc.winSize.width - 15 - shaking.getContentSize().width/2, 20 + shaking.getContentSize().width/2);
        this.addChild(shaking);

        if(0) {//摇一摇
            var SHAKE_THRESHOLD = 3000;
            var last_update = 0;
            var x = y = z = last_x = last_y = last_z = 0;

            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', deviceMotionHandler, false);
            } else {
                alert('not support mobile event');
            }

            function deviceMotionHandler(eventData) {
                var acceleration = eventData.accelerationIncludingGravity;
                var curTime = new Date().getTime();
                if ((curTime - last_update) > 100) {
                    var diffTime = curTime - last_update;
                    last_update = curTime;
                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;
                    var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

                    if (speed > SHAKE_THRESHOLD) {
                        mainView.setItemPostion();
                        //alert("摇动了");
                    }
                    last_x = x;
                    last_y = y;
                    last_z = z;
                }
            }

        }else{//触摸
            //var actionToLft = cc.rotateTo(0.2, -45);
            //var actionToRight = cc.rotateTo(0.4, 45);
            //var actionToBack = cc.rotateTo(0.2, 0);
            //var delay = cc.delayTime(0.15);
            //shaking.runAction(cc.sequence(actionToLft, delay, actionToRight,delay,actionToBack).repeatForever());

            //cc.eventManager.addListener(cc.EventListener.create({
            //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //    swallowTouches: true,
            //    onTouchBegan: function (touch, event) {
            //        mainView.setItemPostion();
            //        return false;
            //    },
            //}), shaking);

            shaking.addClickEventListener(function(node){
                mainView.setItemPostion();
            });
        }
    },

    startGameMode3:function(){
        this.gaChaTutorialAnimation();
        var width = (cc.winSize.width - 20)/10;
        for(var i = 0; i< this.maxPer;i++){
            var item = new cc.Sprite(SortilegeRes.result_gacha_ball_off);
            item.setAnchorPoint(cc.p(0, 0));
            item.setPosition(10 + width*i,20);
            this.addChild(item);
        }

        for(var i = 0; i< this.maxPer;i++){
            var item = new cc.Sprite(SortilegeRes.result_gacha_ball_on);
            item.setAnchorPoint(cc.p(0, 0));
            item.setPosition(10 + width*i,20);
            this._cuItemNode.push(item);
            this.addChild(item);
        }

    },

    setMode3TouchArea:function(tutorialAnim) {
        var gacha = new cc.Sprite(SortilegeRes.animation_gacha001);
        gacha.setAnchorPoint(cc.p(0.5, 0.5));
        gacha.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(gacha);

        var touchBack= new cc.LayerColor(cc.color(255, 255, 0, 0), 200, 200);
        touchBack.setPosition(gacha.getContentSize().width/4 + 35, gacha.getContentSize().height/4);
        gacha.addChild(touchBack);

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
                if(mainView.isCanRock == mainView.ROCK_MAX && mainView._cuItemNode.length > 0){
                    if(tutorialAnim){
                        tutorialAnim.removeFromParent();
                        tutorialAnim = null;
                    }
                    mainView.isCanRock = -1;
                    mainView.gaChaAnimation();
                }
                return true;
            }
        });
        cc.eventManager.addListener(listenerMagazine, touchBack);

    },


    setResultAnim:function(note){
        if(this.isCanRock == -1)return;
        var _this = this;
        if(this._cuItemNode.length > 0){
            this.isCanRock = -1;
            if(this.selMode == 0){
                if(mainView.getPenaltyRandom())
                    this.bombOutAnimation(note.getPositionX()-36,note.getPositionY() - 1);
                else
                    this.bombSafeAnimation(note.getPositionX()-36,note.getPositionY() - 1);
            }else if(this.selMode == 1){
                this.kujiAnimation(note.getPositionX(),note.getPositionY());
            }
            note.scheduleOnce(function(){
                for(var i = 0; i < _this._cuItemNode.length; i++){
                    if(_this._cuItemNode[i] == note){
                        _this._cuItemNode.splice(i,1);
                        break;
                    }
                }
                note.removeFromParent();
            },0.2);
        }
    },

    setPenaltyView:function(){
        SoundManager.instance().playEffect(SortilegeRes.sound_kuji_popup);
        var canTouch = true;
        var rsultback= new cc.LayerColor(cc.color(0, 0, 0, 180), cc.winSize.width, cc.winSize.height);
        rsultback.setPosition(0, 0);
        rsultback.setTag(this.TAG_ANIM);
        this.addChild(rsultback,this.ORDER_Z_RESULT);

        var result = new cc.Sprite(SortilegeRes.result_atari_bg);
        result.setAnchorPoint(cc.p(0.5, 0.5));
        result.setScale(cc.winSize.width/result.getContentSize().width,cc.winSize.height/result.getContentSize().height);
        result.setPosition(rsultback.getContentSize().width/2, rsultback.getContentSize().height/2);
        rsultback.addChild(result);

        if(this.textFiledAddArray && this.textFiledAddArray.length > 0){
            var rand = Utility.getRandomInt(0,this.textFiledAddArray.length);
            var str = this.textFiledAddArray.splice(rand,1);

            var label = new cc.LabelTTF(str);
            label.setFontName(GAME_FONT.PRO_W6);
            label.setFontSize(60);
            label.setFontFillColor(cc.color("#568f95"));
            label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            label._setBoundingWidth(60*7);
            label.setAnchorPoint(cc.p(0.5, 0.5));
            label.setPosition(cc.p(result.getContentSize().width/2, result.getContentSize().height/2 + 180));
            result.addChild(label);
        }else{
            var resulttxt = new cc.Sprite(SortilegeRes.result_atari_txt);
            resulttxt.setAnchorPoint(cc.p(0.5, 0.5));
            resulttxt.setPosition(result.getContentSize().width/2, result.getContentSize().height/2 + 180);
            result.addChild(resulttxt);
        }

        rsultback.scheduleOnce(function(){
            if(!canTouch)
                return;
            mainView.setNextView(rsultback);
            canTouch = false;
        },5);

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
                if(!canTouch)
                    return;
                mainView.setNextView(rsultback);
                canTouch = false;
            }
        });
        cc.eventManager.addListener(listenerMagazine, rsultback);

    },

    setNextView:function(rsultback){
        SoundManager.instance().stopAllEffects();
        if(this.selMode == 2){//只有在gacha状态时，删除最后的item。
            this._cuItemNode.pop().removeFromParent();
        }

        if(this._cuItemNode.length > 0 && this.penaltyPer != 0){//如果item没了或者没有剩下的当たり数量就回main
            if(rsultback)
                rsultback.removeFromParent();
        }else{
            var back= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
            back.setPosition(0, 0);
            this.addChild(back,this.ORDER_Z_RESULT);
            back.runAction(cc.sequence(cc.fadeTo(1, 250)));

            back.scheduleOnce(function(){
                mainView.removeAllChildren();
                mainView.initMainView();

                var back1= new cc.LayerColor(cc.color(0, 0, 0, 255), cc.winSize.width, cc.winSize.height);
                back1.setPosition(0, 0);
                mainView.addChild(back1,mainView.ORDER_Z_RESULT);
                var func = function(){
                    back1.removeFromParent(true);
                };
                back1.runAction(cc.sequence(cc.fadeTo(1, 0), new cc.callFunc(func, this)));
            },1.2);
        }
        this.isCanRock = this.ROCK_MAX;
    },

    setItemPostion:function(){
        SoundManager.instance().playEffect(SortilegeRes.sound_kuji_shaking);
        if(this.isCanRock == -1)return;
        var leng = mainView._cuItemNode.length;

        var  arr = [];

        for(var i = 0; i< leng;i++){
            var rand = Utility.getRandomInt(0,this._itemPositionArray.length);
            for(var k = 0; k< arr.length;k++) {
                while(arr[k] == rand){
                    rand = Utility.getRandomInt(0,this._itemPositionArray.length);
                    k = 0;
                }
            }
            arr.push(rand);
        }

        for(var i = 0; i < leng; i ++){
            var x,y;
            if(arr[i] > 4) {
                x = this._itemPositionArray[arr[i]][0] + this._cuItemNode[i].getContentSize().width/2;
                y = this._itemPositionArray[arr[i]][1] + this._cuItemNode[i].getContentSize().height/2;
                //this._cuItemNode[i].setPosition(this._itemPositionArray[arr[i]][0] + this._cuItemNode[i].getContentSize().width/2,
                //    this._itemPositionArray[arr[i]][1] + this._cuItemNode[i].getContentSize().height/2);
            }else{
                x = this._itemPositionArray[arr[i]][0] + this._cuItemNode[i].getContentSize().width/2;
                y = cc.winSize.height - this._itemPositionArray[arr[i]][1] - this._cuItemNode[i].getContentSize().height/2;
                //this._cuItemNode[i].setPosition(this._itemPositionArray[arr[i]][0] + this._cuItemNode[i].getContentSize().width/2,
                //    cc.winSize.height - this._itemPositionArray[arr[i]][1] - this._cuItemNode[i].getContentSize().height/2);
            }
            console.log(x+"::"+y);
            this._cuItemNode[i].setPosition(x,y);

        }

    },

    bombSafeAnimation:function(x,y){
        SoundManager.instance().playEffect(SortilegeRes.sound_kuji_safe);
        var frameTime = 0.10;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback,this.ORDER_Z_EFFECT);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(x, y);
        var frames = [];
        for(var i = 1 ; i <= 16; i++){
            var _num = "0";
            if(i >= 10) _num = "";
            var str = "res/Scene/Sortilege/animation/bomb_safe_0" + (_num) + (i) + ".png";
            frames.push(new cc.SpriteFrame(str,new cc.Rect(0, 0, 360, 360)));
        }
        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate).repeatForever());
        animback.addChild(anim);
        animback.scheduleOnce(function(){
            animback.removeFromParent();
            mainView.setNextView(animback);
        },animation.getTotalDelayUnits()*frameTime);
    },

    bombOutAnimation:function(x,y){

        var frameTime = 0.02;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback,this.ORDER_Z_EFFECT);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(x, y);
        var frames = [];
        for(var i = 1 ; i <= 15; i++){
            var _num = "0";
            if(i >= 10) _num = "";
            var str = "res/Scene/Sortilege/animation/bomb_out_0" + (_num) + (i) + ".png";
            var cuNum = 4;
            if(i <= 4)
                cuNum = 6;
            else if(i <= 11)
                cuNum = 5;
            else if(i <= 16)
                cuNum = 6;
            for(var k = 0 ; k < cuNum; k++)
                frames.push(new cc.SpriteFrame(str,new cc.Rect(0, 0, 600, 600)));
        }
        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate).repeatForever());
        animback.addChild(anim);
        animback.scheduleOnce(function(){
            animback.removeFromParent();
            mainView.setPenaltyView();
        },animation.getTotalDelayUnits()*frameTime);

        animback.scheduleOnce(function(){
            SoundManager.instance().playEffect(SortilegeRes.sound_bomb);
        },18*frameTime);
    },

    kujiAnimation:function(x,y){
        SoundManager.instance().playEffect(SortilegeRes.sound_kuji_safe);
        var frameTime = 0.1;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback,this.ORDER_Z_EFFECT);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(x, y);
        var frames = [];
        for(var i = 1 ; i <= 10; i++){
            var _num = "0";
            if(i >= 10) _num = "";
            var str = "res/Scene/Sortilege/animation/kuji_0" + (_num) + (i) + ".png";
            frames.push(new cc.SpriteFrame(str,new cc.Rect(0, 0, 360, 360)));
        }
        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate).repeatForever());
        animback.addChild(anim);
        animback.scheduleOnce(function(){
            animback.removeFromParent();
            if(mainView.getPenaltyRandom())
                mainView.setPenaltyView();
            else
                mainView.setNextView();
        },animation.getTotalDelayUnits()*frameTime);
    },

    gaChaTutorialAnimation:function(){

        SoundManager.instance().playEffect(SortilegeRes.sound_arrow_pointing);
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback,this.ORDER_Z_EFFECT);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        var frames = [];
        frames.push(new cc.SpriteFrame("res/Scene/Sortilege/animation/gacha_001.png", new cc.Rect(0, 0, 550, 900)));
        var animate1 = cc.animate(new cc.Animation(frames, 0.2));

        frames = [];
        for(var i = 2 ; i <= 4; i++){
            frames.push(new cc.SpriteFrame("res/Scene/Sortilege/animation/gacha_00" + (i) + ".png", new cc.Rect(0, 0, 550, 900)));
        }
        var animate2 = cc.animate(new cc.Animation(frames, 0.5));

        anim.runAction(new cc.Sequence(animate1,animate2).repeatForever());
        animback.addChild(anim);


        animback.scheduleOnce(function(){
            animback.removeFromParent();
        },(0.2*1 + 0.5*3));
        mainView.setMode3TouchArea(animback);
    },

    gaChaAnimation:function(){
        SoundManager.instance().playEffect(SortilegeRes.sound_lever_gacha_ball);
        var frameTime = 0.1;
        var animback= new cc.LayerColor(cc.color(0, 0, 0, 0), cc.winSize.width, cc.winSize.height);
        animback.setPosition(0, 0);
        animback.setTag(this.TAG_ANIM);
        this.addChild(animback,this.ORDER_Z_EFFECT);

        var anim = new cc.Sprite();
        anim.setAnchorPoint(0.5, 0.5);
        anim.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        var frames = [];
        for(var i = 5 ; i <= 19; i++){
            var _num = "0";
            if(i >= 10) _num = "";
            var str = "res/Scene/Sortilege/animation/gacha_0" + (_num) + (i) + ".png";
            if(i == 24){
                frames.push(new cc.SpriteFrame(str,new cc.Rect(0, 0, 550, 900)));
            }
            frames.push(new cc.SpriteFrame(str,new cc.Rect(0, 0, 550, 900)));
        }
        var animation = new cc.Animation(frames, frameTime);
        var animate = cc.animate(animation);
        anim.runAction(new cc.Sequence(animate).repeatForever());
        animback.addChild(anim);
        animback.scheduleOnce(function(){
            animback.removeFromParent();
            if(mainView.getPenaltyRandom())
                mainView.setPenaltyView();
            else
                mainView.setNextView();

        },animation.getTotalDelayUnits()*frameTime);
    },

    getPenaltyRandom:function(){

        var max = this._cuItemNode.length;
        var rand = Utility.getRandomInt(0,max);

        if(rand < this.penaltyPer){//选中
            this.penaltyPer--;
            return true;
        }else
            return false;

    }

});

var SortilegeScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SortilegeLayer();
        this.addChild(layer);
    }
});