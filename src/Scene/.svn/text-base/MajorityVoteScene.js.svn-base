/**
 * Created by nhnst on 11/2/15.
 * 다수결（多数决）
 */
var MajorityVoteLayer = cc.LayerColor.extend({
    gameStage:0,
    fromHistory:false,//读取的数据
    cuSelected:null,
    textFiledAddVIew:null,
    textFiledVoteNum:null,
    photoTitle:null,
    photoList:null,
    cuPhotoWH:null,
    cMode:null,

    photoRect:null,//切图范围
    photoScale:null,
    photoPos:null,//切图移动的距离

    TAG_MAIN:0,
    TAG_SETTING:200,
    TAG_READY:201,
    TAG_MASK:205,
    TAG_RESULT:206,

    ORDER_Z_MAIN:10,
    ORDER_Z_SETTING:20,
    ORDER_Z_TUTORIAL:50,
    ORDER_Z_EFFECT:60,

    IMAGE_WH:340,
    ctor:function () {
        this._super(cc.color(111,205,192,255));

        mainView = this;
        //var abcd = confirm("1231");
        this.initMain();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.MajorityVote);

        Utility.sendXhr(GAME_TYPE.MajorityVote.gameid);

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
                case context.TAG_RESULT:
                    if(context.resultTitle){
                        if(context.cMode == 0){
                            context.textModeVoteResult(context.resultTitle);
                        }else if(context.cMode == 1){
                            context.photoModeVoteResult(context.resultTitle);
                        }
                    }

                    break;
            }
            var parentCut = context.getChildByName("iCutLayout");
            if(parentCut){
                if(context.textureinfo){
                    parentCut.removeFromParent();
                    context.imageCutView(context.textureinfo[0],context.textureinfo[1],context.textureinfo[2],context.textureinfo[3]);
                }
            }
            Utility.checkRfresh = false;
        }

        if(Utility.siLoadingFile){
            if(!context.getChildByName("Loading")){
                context.photoTitle.setVisible(false);
                for(var j = 0; j < context.photoList.length; j++){
                    context.photoList[j].setVisible(false);
                }
                context.getChildByName("Start").setVisible(false);


                var aeBack = new cc.LayerColor(cc.color(111,205,192,255), cc.winSize.width,cc.winSize.height);
                aeBack.setName("Loading");
                aeBack.setPosition(0, 0);
                context.addChild(aeBack,99);

                var label1 = new cc.LabelTTF("Image Loading...");
                label1.setFontName(GAME_FONT.PRO_W6);
                label1.setFontSize(38);
                label1.setFontFillColor(cc.color("#FFFFFF"));
                label1.setAnchorPoint(cc.p(0.5, 0.5));
                label1.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height>>1));
                aeBack.addChild(label1);

            }
        }else if(context.getChildByName("Loading")){
            context.getChildByName("Loading").removeFromParent();
        }

        //if(this.check == true){
        //    window.opener = null;
        //    window.close();
        //    this.check = false;
        //}

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
                mainView.removeAllChildren();
                mainView.initMain();
                break;
            case context.TAG_READY:
                if(mainView.cMode == 0)
                    mainView.startTextMode();
                else
                    mainView.startPhotoMode();
                break;
            case context.TAG_RESULT:
                    if(mainView.fromHistory){
                        mainView.fromHistory = false;
                        mainView.removeAllChildren();
                        mainView.initMain();
                    }else{
                        mainView.textFiledVoteNum[mainView.cuSelected]--;
                        if(mainView.cMode == 0)
                            mainView.textModeVote();
                        else
                            mainView.photoModeVote();
                    }
                break;
        }
    },

    initMain:function(){

        this.gameStage = this.TAG_MAIN;

        this.clearData();

        var bg = new cc.Sprite(MajorityVoteRes.main_vote_bg);
        bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(bg);

        var toolBar = new Toolbar(GAME_TYPE.MajorityVote);
        toolBar.setName("toolBar");
        toolBar.setAnchorPoint(cc.p(0,1));
        toolBar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolBar,this.ORDER_Z_MAIN);

        this.mainAnimation();

        var histtoryLW = new HistorysListView(cc.winSize.height - 550,GAME_TYPE.MajorityVote,
            MajorityVoteRes.common_photo_list_btn,
            MajorityVoteRes.common_text_list_btn,
            this.gotoReplayView,
            this.gotoResultView,1);
        histtoryLW.setName("history");
        this.addChild(histtoryLW);

        this.addChild(new MainModeBtn(
            MajorityVoteRes.common_start_btn,
            {selector:this.startPhotoMode, img:MajorityVoteRes.common_photo_play_btn,str:"画像",subStr:"選択肢を写真で登録"},
            {selector:this.startTextMode, img:MajorityVoteRes.common_text_play_btn,str:"テキスト",subStr:"選択肢をテキストで登録"}
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
        for(var i = 1 ; i < 13; i++){
            if(i < 10)
                frames.push(new cc.SpriteFrame("res/Scene/MajorityVote/main/vote_00" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
            else
                frames.push(new cc.SpriteFrame("res/Scene/MajorityVote/main/vote_0" + (i) + ".png", new cc.Rect(0, 0, 750, 450)));
        }
        var animate = cc.animate(new cc.Animation(frames, 0.15));

        var frames = [];
        frames.push(new cc.SpriteFrame(MajorityVoteRes.main_vote013, new cc.Rect(0, 0, 750, 450)));
        var animate1 = cc.animate(new cc.Animation(frames, 0.5));


        vote.runAction(new cc.Sequence(animate,animate1).repeatForever());
        this.addChild(vote);
    },

    touchEvent: function (sender, type) {
        var _this = mainView;
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.log("touchEvent " + sender.getName());
                switch(sender.getName()){
                    case "Start":
                        if(mainView.cMode == 0) {
                            if (mainView.textFiledAddVIew.listView.getItems().length >= 2) {
                                if(this.textFiledAddVIew.getTitleString() == ""){
                                    window.alert("質問を入力して下さい");
                                }else
                                    mainView.textModeVote();
                            }
                        }else{
                            if(mainView.getphtoMaxNum() >= 2){
                                if(mainView.photoTitle && mainView.photoTitle.getString() == ""){
                                    window.alert("質問を入力して下さい");
                                }else
                                    mainView.photoModeVote();
                            }
                        }
                        break;
                    case "voteContinue":
                        if(_this.cuSelected > -1){
                            _this.textFiledVoteNum[_this.cuSelected]++;
                            //回复默认值
                            var backView = _this.getChildByTag(_this.TAG_READY);
                            var btnVoteContinue = backView.getChildByName("voteContinue");
                            if(btnVoteContinue){
                                btnVoteContinue.removeFromParent();
                                _this.buttonBackColorText("voteContinue","次の人の投票へ",cc.winSize.width/2 - 155, 20,cc.size(300, 80),cc.color("#c8c8c8"),backView);
                            }
                            //var btnSeeResult = backView.getChildByName("seeResult");
                            //if(btnSeeResult){
                            //    btnSeeResult.removeFromParent();
                            //    _this.buttonBackColorText("seeResult","投票結果を見る",cc.winSize.width/2 + 155, 20,cc.size(300, 80),cc.color("#c8c8c8"),backView);
                            //}

                            if(_this.cMode == 0){
                                var listView = backView.getChildByName("listView");
                                var str = _this.textFiledAddVIew.getListChildern(_this.cuSelected);
                                listView.removeItem(_this.cuSelected);
                                listView.insertCustomItem(_this.addListLayout(false,str),_this.cuSelected);
                            }else{
                                _this.photoList[_this.cuSelected].getChildByTag(3).setVisible(false);
                            }
                            _this.cuSelected = -1;
                        }
                        break;
                    case "seeResult":
                        if(_this.cuSelected > -1) {
                            _this.textFiledVoteNum[_this.cuSelected]++;
                        }
                        if (_this.cMode == 0) {
                            _this.textModeVoteResult();
                        } else
                            _this.photoModeVoteResult();
                        break;
                    case "reVote":
                        if(mainView.cMode == 0)
                            mainView.textModeVote();
                        else
                            mainView.photoModeVote();
                        break;
                    case "home":
                        mainView.savPopup();
                        break;
                    case "dataImport":
                        if(mainView.cMode == 0){
                            mainView.fromHistory = false;
                            mainView.startTextMode();
                        }else {
                            mainView.fromHistory = false;
                            mainView.startPhotoMode();

                        }
                        break;
                    //case "cutImgOK":
                    //    var photo = sender.getParent().getChildByName("scrollViewRect").getChildByName("photo");
                        break;
                    case "cutImgCancel":
                        sender.getParent().removeFromParent();
                        this.photoTitle.setVisible(true);
                        for(var j = 0; j < this.photoList.length; j++){
                            this.photoList[j].setVisible(true);
                        }
                        this.getChildByName("Start").setVisible(true);
                        break;
                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    startTextMode:function(node){

        mainView.cMode = 0;

        mainView.removeAllChildren();

        mainView.gameStage = mainView.TAG_SETTING;

        var aeBack = new cc.LayerColor(cc.color("#ffffff"), cc.winSize.width,cc.winSize.height);
        aeBack.setPosition(0, 0);
        mainView.addChild(aeBack);

        var _H = 20;


        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(cc.p(0,0));
        cutoff.setPosition(0,10 + 80 + 34 + 2*_H);
        cutoff.setScaleX(cc.winSize.width);
        mainView.addChild(cutoff);

        var label1 = new cc.LabelTTF(" 個の選択肢が登録されています");
        label1.setFontName(GAME_FONT.PRO_W3);
        label1.setFontSize(26);
        label1.setFontFillColor(cc.color("#999999"));
        label1.setAnchorPoint(cc.p(0.5, 0.5));
        label1.setPosition(cc.p(cc.winSize.width>>1, 10 + 80 + 17 + _H));
        mainView.addChild(label1);

        var label = new cc.LabelTTF();
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(26);
        label.setFontFillColor(cc.color("#6fcdc1"));
        label.setAnchorPoint(cc.p(1, 0.5));
        label.setPosition(cc.p(label1.getPosition().x - label1.getContentSize().width/2, 10 + 80 + 17 + _H));
        label.setString("0");
        mainView.addChild(label);

        if(mainView.textFiledAddVIew){
            var button = mainView.buttonBackColorText("Start","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#6fcdc1"));
            var num = mainView.textFiledAddVIew.listView.getItems().length;
            if(num > 9)
                label.setString(num);
            else
                label.setString("0" + num);
        }else{
            mainView.textFiledAddVIew = new TextFiledAddList(10,10 + 80 + 34 + 2*_H + 8,2);
            var button = mainView.buttonBackColorText("Start","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#c8c8c8"));
        }
        mainView.addChild(mainView.textFiledAddVIew);

        label.schedule(function(){
            if(mainView.textFiledAddVIew.isAddChanged){
                var num = mainView.textFiledAddVIew.listView.getItems().length;
                if(num > 9)
                    label.setString(num);
                else
                    label.setString("0" + num);

                if(num >= 2){
                    button.removeFromParent();
                    button = mainView.buttonBackColorText("Start","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#6fcdc1"));
                }else{
                    button.removeFromParent();
                    button = mainView.buttonBackColorText("Start","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#c8c8c8"));
                }
                mainView.textFiledVoteNum = [];
                for(var i = 0; i < num; i++)
                    mainView.textFiledVoteNum.push(0);
                mainView.textFiledAddVIew.isAddChanged = false;
            }
        });


    },

    textModeVote:function(){

        this.cuSelected = -1;

        this.removeAllChildren();

        this.gameStage = this.TAG_READY;

        var backView = new cc.LayerColor(cc.color(255, 255, 255, 255), cc.winSize.width, cc.winSize.height);
        backView.setTag(this.TAG_READY);
        this.addChild(backView);

        var topH = 100;
        var titleH = 122;
        var BottomH = 20 + 80 + 20 + 8;
//Top
        var topBack = new cc.LayerColor(cc.color("#6fcdc1"), backView.getContentSize().width, topH);
        topBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height);
        backView.addChild(topBack);

        var topName = new cc.LabelTTF("多数決投票",GAME_FONT.PRO_W3);
        topName.setFontSize(36);
        topName.setFontFillColor(cc.color("#fff3bf"));
        topName.setAnchorPoint(cc.p(0.5, 0.5));
        topName.setPosition(cc.p(topBack.getContentSize().width>>1, topBack.getContentSize().height>>1));
        topBack.addChild(topName);
//Title
        var titleBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, titleH);
        titleBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height);
        backView.addChild(titleBack);
        //标题
        var titleName = new cc.LabelTTF(this.textFiledAddVIew.getTitleString(),GAME_FONT.PRO_W6);
        titleName.setFontSize(36);
        titleName.setFontFillColor(cc.color("#6fcdc1"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(cc.p(0, 0));
        cutoff.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height - 8);
        cutoff.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoff);

//list
        var listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setAnchorPoint(cc.p(0,1));
        listView.setPosition(0,backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height - 8);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setBackGroundColor(cc.color.WHITE);
        listView.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        listView.setName("listView");
        listView.setContentSize(cc.size(backView.getContentSize().width, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height - BottomH));
        listView.addEventListener(this.selectedItemEvent, this);
        backView.addChild(listView);

        var dist = this.textFiledAddVIew.listView.getItems().length;
        var str;
        for(var i = 0; i < dist; i++){
            str = this.textFiledAddVIew.getListChildern(i);
            listView.pushBackDefaultItem();
            listView.pushBackCustomItem(this.addListLayout(false,str));
        }

//bottom
        var cutoffB = new cc.Sprite(GlobalRes.line_8);
        cutoffB.setAnchorPoint(cc.p(0, 1));
        cutoffB.setPosition(0, BottomH);
        cutoffB.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoffB);

        this.buttonBackColorText("voteContinue","次の人の投票へ",cc.winSize.width/2 - 155, 20,cc.size(300, 80),cc.color("#c8c8c8"),backView);
        this.buttonBackColorText("seeResult","投票結果を見る",cc.winSize.width/2 + 155, 20,cc.size(300, 80),cc.color("#6fcdc1"),backView);

    },

    selectedItemEvent: function (sender, type) {
        switch (type) {
            case ccui.ListView.ON_SELECTED_ITEM_END:
                var _this = mainView;
                if(sender.getCurSelectedIndex() == _this.cuSelected)
                    break;
                if(_this.cuSelected == -1){
                    var backView = _this.getChildByTag(_this.TAG_READY);
                    var btnVoteContinue = backView.getChildByName("voteContinue");
                    if(btnVoteContinue){
                        btnVoteContinue.removeFromParent();
                        _this.buttonBackColorText("voteContinue","次の人の投票へ",cc.winSize.width/2 - 155, 20,cc.size(300, 80),cc.color("#6fcdc1"),backView);
                    }
                    //var btnSeeResult = backView.getChildByName("seeResult");
                    //if(btnSeeResult){
                    //    btnSeeResult.removeFromParent();
                    //    _this.buttonBackColorText("seeResult","投票結果を見る",cc.winSize.width/2 + 155, 20,cc.size(300, 80),cc.color("#6fcdc1"),backView);
                    //}
                }
                var temp = _this.cuSelected;
                _this.cuSelected = sender.getCurSelectedIndex();
                if(temp > -1){
                    var strTemp = _this.textFiledAddVIew.getListChildern(temp);
                    sender.removeItem(temp);
                    sender.insertCustomItem(_this.addListLayout(false,strTemp),temp);
                }
                var str = _this.textFiledAddVIew.getListChildern(_this.cuSelected);
                sender.removeItem(_this.cuSelected);
                sender.insertCustomItem(_this.addListLayout(true,str),_this.cuSelected);
                break;
            default:
                break;
        }
    },

    addListLayout:function(isSelected, str){
        var backColor = "#b0e2cf";
        var txtColor = "#ffffff";
        var fontName = GAME_FONT.PRO_W6;
        var fontSize = 30;
        if(isSelected){
            backColor = "#6fcdc1";
            txtColor = "#999999";
            fontName = GAME_FONT.PRO_W3;
            fontSize = 36;
        }
        var itemLayout = new ccui.Layout();
        itemLayout.setContentSize(cc.winSize.width, 90);
        itemLayout.setTouchEnabled(true);

        var itemBack = new cc.LayerColor(cc.color(backColor), cc.winSize.width - 80, 80);
        itemBack.setPositionY(5);
        itemBack.setPositionX(40);
        itemLayout.addChild(itemBack);


        var name = new cc.LabelTTF(str,fontName);
        name.setFontSize(fontSize);
        name.setFontFillColor(cc.color(txtColor));
        name.setAnchorPoint(cc.p(0.5, 0.5));
        name.setPosition(cc.p(itemBack.getContentSize().width>>1, itemBack.getContentSize().height>>1));
        itemBack.addChild(name);

        return itemLayout;
    },

    textModeVoteResult:function(title) {

        this.removeAllChildren();

        this.gameStage = this.TAG_RESULT;

        var strTitle = "多数決の結果";
        if(title) strTitle = title;
        var backView = new cc.LayerColor(cc.color(255, 255, 255, 255), cc.winSize.width, cc.winSize.height);
        this.addChild(backView);

        var topH = 100;
        var titleH = 200 + 8;
        var BottomH = 160;
        var maxNum = this.voteMaxIndex();
//Top
        var topBack = new cc.LayerColor(cc.color("#6fcdc1"), backView.getContentSize().width, topH);
        topBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height);
        backView.addChild(topBack);

        var topName = new cc.LabelTTF(strTitle,GAME_FONT.PRO_W3);
        topName.setFontSize(36);
        topName.setFontFillColor(cc.color("#fff3bf"));
        topName.setAnchorPoint(cc.p(0.5, 0.5));
        topName.setPosition(cc.p(topBack.getContentSize().width>>1, topBack.getContentSize().height>>1));
        topBack.addChild(topName);
//Title
        var titleBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, titleH);
        titleBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height);
        backView.addChild(titleBack);
        //标题
        var titleName = new cc.LabelTTF(this.textFiledAddVIew.getTitleString(),GAME_FONT.PRO_W3);
        titleName.setFontSize(32);
        titleName.setFontFillColor(cc.color("#6fcdc1"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, (titleBack.getContentSize().height>>1) + 26));
        titleBack.addChild(titleName);
        //标题
        var titleName1 = new cc.LabelTTF(this.textFiledAddVIew.getListChildern(maxNum),GAME_FONT.PRO_W6);
        titleName1.setFontSize(36);
        titleName1.setFontFillColor(cc.color("#568f95"));
        titleName1.setAnchorPoint(cc.p(0.5, 0.5));
        titleName1.setPosition(cc.p(titleBack.getContentSize().width>>1, (titleBack.getContentSize().height>>1) - 26));
        titleBack.addChild(titleName1);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(cc.p(0, 0));
        cutoff.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height);
        cutoff.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoff);
//list
        var listView = new ccui.ListView();
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setAnchorPoint(cc.p(0,1));
        listView.setPosition(0,backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setBackGroundColor(cc.color.WHITE);
        listView.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        listView.setName("listView");
        listView.setContentSize(cc.size(backView.getContentSize().width, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height - BottomH));
        listView.addEventListener(this.selectedItemEvent, this);
        backView.addChild(listView);

        var dist = this.textFiledAddVIew.listView.getItems().length;
        var str;
        var num;

        for(var i =0; i < dist; i++){
            str = this.textFiledAddVIew.getListChildern(i);
            num = this.textFiledVoteNum[i].toString();

            listView.pushBackDefaultItem();
            if(maxNum == i)
                listView.pushBackCustomItem(this.addListLayoutResult(true,str,num));
            else
                listView.pushBackCustomItem(this.addListLayoutResult(false,str,num));
        }
//bottom
        var cutoffB = new cc.Sprite(GlobalRes.line_8);
        cutoffB.setAnchorPoint(cc.p(0, 1));
        cutoffB.setPosition(0, BottomH);
        cutoffB.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoffB);


        if(title){
            this.buttonBackColorText("dataImport","データ読み込み",cc.winSize.width/2, BottomH/2 - 40,cc.size(300, 80),cc.color("#6fcdc1"),backView);
            return;
        }

        var Bname = new cc.LabelTTF();
        Bname.setFontName(GAME_FONT.PRO_W6);
        Bname.setString("人が投票に参加しました");
        Bname.setFontSize(26);
        Bname.setFontFillColor(cc.color("#999999"));
        Bname.setAnchorPoint(cc.p(0.5, 0));
        Bname.setPosition(cc.p(cc.winSize.width/2, 85 + 20));
        backView.addChild(Bname);

        var maxVoteNum = function(){
            var mI = 0;
            var arry = mainView.textFiledVoteNum;
            for(var i = 0 ; i < arry.length ; i++){
                mI += arry[i];
            }
            return mI;
        };
        var maxNumber = maxVoteNum();

        var number = new cc.LabelTTF();
        number.setFontName(GAME_FONT.PRO_W3);
        if(maxNumber > 9)
            number.setString(maxNumber);
        else
            number.setString("0" + maxNumber);
        number.setFontSize(26);
        number.setFontFillColor(cc.color("#6fcdc1"));
        number.setAnchorPoint(cc.p(0.5, 0));
        number.setPosition(cc.p(cc.winSize.width/2 - 26*6 - 7, 85 + 20));
        backView.addChild(number);


        this.buttonBackColorText("reVote","再投票",cc.winSize.width/2 - 105, 5,cc.size(200, 80),cc.color("#6fcdc1"),backView);

        this.buttonBackColorText("home","ホーム",cc.winSize.width/2 + 105, 5,cc.size(200, 80),cc.color("#6fcdc1"),backView);
    },

    addListLayoutResult:function(isMax,str,num){
        var backColor = "#bee8e3";
        var txtColor = "#ffffff";
        var fontName = GAME_FONT.PRO_W3;
        if(isMax){
            backColor = "#6fcdc1";
        }
        var itemLayout = new ccui.Layout();
        itemLayout.setContentSize(cc.winSize.width, 80);

        var itemBack = new cc.LayerColor(cc.color(backColor), cc.winSize.width - 60, 50);
        //itemBack._setAnchorY(0);
        itemBack.setPositionX(30);
        itemLayout.addChild(itemBack);

        if(!isMax){
            var maxNum = this.textFiledVoteNum[this.voteMaxIndex()];
            var backColor = new cc.LayerColor(cc.color("#6fcdc1"), itemBack.getContentSize().width*num/maxNum, 50);
            itemBack.addChild(backColor);
        }

        var name = new cc.LabelTTF(str,fontName);
        name.setFontSize(30);
        name.setFontFillColor(cc.color(txtColor));
        name.setAnchorPoint(cc.p(0, 0.5));
        name.setPosition(cc.p(15, itemBack.getContentSize().height>>1));
        itemBack.addChild(name);

        var num = new cc.LabelTTF(num,fontName);
        num.setFontSize(30);
        num.setFontFillColor(cc.color(txtColor));
        num.setAnchorPoint(cc.p(1, 0.5));
        num.setPosition(cc.p(itemBack.getContentSize().width - 15, itemBack.getContentSize().height>>1));
        itemBack.addChild(num);

        return itemLayout;
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

        //var gray_layout = new ccui.Layout();
        //gray_layout.setAnchorPoint(0, 1);
        //gray_layout.setPosition(35, label.getPosition().y - label.getContentSize().height - 30);
        //gray_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        //gray_layout.setBackGroundColor(cc.color(115,115,115,255));
        //gray_layout.setContentSize(500, 60);
        //pop_layout.addChild(gray_layout);

        var line2 = new cc.Sprite(GlobalRes.color_eeeeee);
        line2.setAnchorPoint(0, 0);
        line2.setPosition(35,label.getPosition().y - label.getContentSize().height - 30 - 58);
        line2.setScale(498,2);
        pop_layout.addChild(line2);

        //var white_layout = new ccui.Layout();
        //white_layout.setAnchorPoint(0, 1);
        //white_layout.setPosition(35+1, label.getPosition().y - label.getContentSize().height - 30-1);
        //white_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        //white_layout.setBackGroundColor(cc.color(255,255,255,255));
        //white_layout.setContentSize(498, 58);
        //pop_layout.addChild(white_layout);


        var maxNum = this.voteMaxIndex();

        var input = new cc.EditBox(cc.size(498, 58),new cc.Scale9Sprite());
        var name = "";
        if(mainView.cMode == 0)
            name = this.textFiledAddVIew.getTitleString() + " " + this.textFiledAddVIew.getListChildern(maxNum);
        else
            name = this.photoTitle.getString();

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
            mainView.setHistory(mainView.cMode,input.getString());
            mainView.removeAllChildren();
            mainView.initMain();
        };
        save_btn.addClickEventListener(save_callback);

        var cancel_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
        cancel_btn.setScale(285, 100);
        cancel_btn.setAnchorPoint(0, 0);
        cancel_btn.setPosition(0, 0);
        pop_layout.addChild(cancel_btn);

        var cancel_callback = function(){
            mainView.removeAllChildren();
            mainView.initMain();
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
        cancel_text.setPosition(0 + 285/2, 50);
        pop_layout.addChild(cancel_text);
    },
/*
    yesOrNotPopup:function(){
        var mask = new Mask();
        this.addChild(mask);
        mask.open();

        var all_layout = new ccui.Layout();
        all_layout.setContentSize(cc.winSize.width, cc.winSize.height);
        all_layout.setAnchorPoint(0, 0);
        all_layout.setTouchEnabled(true);
        all_layout.addTouchEventListener(function(){
            pop_layout.removeFromParent();
            all_layout.removeFromParent();
            mask.removeFromParent();
        });
        this.addChild(all_layout);

        var pop_layout = new RoundRect(570, 40+30+60+40+100+30);
        pop_layout.setAnchorPoint(0.5, 0.5);
        pop_layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
        all_layout.addChild(pop_layout);

        var label = new cc.LabelTTF("投票を継続したり\n結果画面に移動します。");
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(30);
        label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        label.setFontFillColor(new cc.Color(111,205,193,255));
        label.setAnchorPoint(0.5, 1);
        label.setPosition(pop_layout.getContentSize().width/2, pop_layout.getContentSize().height/2 + 80);
        pop_layout.addChild(label);

        var save_btn = new ccui.Button(GlobalRes.color_b0e2cf, GlobalRes.color_b0e2cf);
        save_btn.setScale(285, 100);
        save_btn.setAnchorPoint(0, 0);
        save_btn.setPosition(0, 0);
        pop_layout.addChild(save_btn);
        var _this = this;
        var save_callback = function(){
            _this.textFiledVoteNum[_this.cuSelected]++;
            pop_layout.removeFromParent();
            all_layout.removeFromParent();
            mask.removeFromParent();
            //回复默认值
            var backView = _this.getChildByTag(_this.TAG_READY);
            var button = backView.getChildByName("collective");
            if(button){
                button.removeFromParent();
                _this.buttonBackColorText("collective","集計",cc.winSize.width/2, 20,cc.size(200, 80),cc.color("#c8c8c8"),backView);
            }
            if(_this.cMode == 0){
                var listView = backView.getChildByName("listView");
                var str = _this.textFiledAddVIew.getListChildern(_this.cuSelected);
                listView.removeItem(_this.cuSelected);
                listView.insertCustomItem(_this.addListLayout(false,str),_this.cuSelected);
            }else{
                _this.photoList[_this.cuSelected].getChildByTag(3).setVisible(false);
            }
            _this.cuSelected = -1;
        };
        save_btn.addClickEventListener(save_callback);

        var cancel_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
        cancel_btn.setScale(285, 100);
        cancel_btn.setAnchorPoint(0, 0);
        cancel_btn.setPosition(285, 0);
        pop_layout.addChild(cancel_btn);

        var cancel_callback = function(){
            _this.textFiledVoteNum[_this.cuSelected]++;
            if(_this.cMode == 0) {
                _this.textModeVoteResult();
            }else
                _this.photoModeVoteResult();

            pop_layout.removeFromParent();
            all_layout.removeFromParent();
            mask.removeFromParent();
        };
        cancel_btn.addClickEventListener(cancel_callback);

        var save_text = new cc.LabelTTF("投票続き");
        save_text.setFontName(GAME_FONT.PRO_W6);
        save_text.setFontSize(30);
        save_text.setFontFillColor(cc.color(255,255,255,255));
        save_text.setAnchorPoint(0.5, 0.5);
        save_text.setPosition(285/2, 50);
        pop_layout.addChild(save_text);

        var cancel_text = new cc.LabelTTF("投票結果見る");
        cancel_text.setFontName(GAME_FONT.PRO_W6);
        cancel_text.setFontSize(30);
        cancel_text.setFontFillColor(cc.color(255,255,255,255));
        cancel_text.setAnchorPoint(0.5, 0.5);
        cancel_text.setPosition(285 + 285/2, 50);
        pop_layout.addChild(cancel_text);
    },
*/
    voteMaxIndex:function(){
        var mI = 0;
        var arry = this.textFiledVoteNum;
        var start = 0;
        if(arry.length <= 1)return mI;
        for(var i = 0 ; i < arry.length; i++){
            if(arry[i] > start){
                mI = i;
                start = arry[i];
            }
        }
        return mI;
    },

    isSameMaxIndex:function(){
        var mIndex = this.voteMaxIndex();
        var mI = 0;
        var arry = this.textFiledVoteNum;
        for(var i = 0 ; i < arry.length; i++){
            if(arry[i] == arry[mIndex]){
                mI++;
            }
        }
        return (mI > 1)?true:false;
    },

    startPhotoMode:function(node){
        mainView.cMode = 1;

        mainView.removeAllChildren();

        mainView.gameStage = mainView.TAG_SETTING;

        var backView = new cc.LayerColor(cc.color("#ffffff"), cc.winSize.width,cc.winSize.height);
        backView.setPosition(0, 0);
        mainView.addChild(backView);

        var topH = 100;
        var titleH = 122;
        var cameraH = 100 + 24;
        var BottomH = 10 + 80 + 34 + 2*20 + 8;
//Top
        var topBack = new cc.LayerColor(cc.color("#6fcdc1"), backView.getContentSize().width, topH);
        topBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height);
        backView.addChild(topBack);

        var topName = new cc.LabelTTF("多数決項目登録",GAME_FONT.PRO_W3);
        topName.setFontSize(36);
        topName.setFontFillColor(cc.color("#fff3bf"));
        topName.setAnchorPoint(cc.p(0.5, 0.5));
        topName.setPosition(cc.p(topBack.getContentSize().width>>1, topBack.getContentSize().height>>1));
        topBack.addChild(topName);
//Title
        var titleBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, titleH);
        titleBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height);
        backView.addChild(titleBack);

        if(mainView.photoTitle){
            mainView.photoTitle.setString(mainView.photoTitle.getString());
            mainView.photoTitle.removeFromParent();
        }else
            mainView.photoTitle　=　mainView.setPhotoTitleView(titleH);

        titleBack.addChild(mainView.photoTitle);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(cc.p(0, 0));
        cutoff.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height);
        cutoff.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoff);
//buttomH
        var cButtomBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, cameraH);
        cButtomBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height - cButtomBack.getContentSize().height);
        backView.addChild(cButtomBack);

        //var sprite = new cc.Scale9Sprite(MajorityVoteRes.setting_camera);
        //
        //var camraButton = new cc.LoadClientData(cc.size(200, 50), 1, sprite);
        //camraButton.setDelegate(mainView);
        //camraButton.setAnchorPoint(cc.p(1,1));
        //camraButton.setPosition((cButtomBack.getContentSize().width>>1) - 50, cameraH - 15);
        //cButtomBack.addChild(camraButton);
        //
        //var cameraLavel = new cc.LabelTTF("カメラ",GAME_FONT.PRO_W6);
        //cameraLavel.setFontSize(32);
        //cameraLavel.setFontFillColor(cc.color("#6fcdc1"));
        //cameraLavel.setAnchorPoint(cc.p(0.5, 0.5));
        //cameraLavel.setPosition(cc.p(camraButton.getContentSize().width - 90, camraButton.getContentSize().height/2 - 5));
        //camraButton.addChild(cameraLavel);
        //
        //var sprite1 = new cc.Scale9Sprite(MajorityVoteRes.setting_gallery);
        //var photoButton = new cc.LoadClientData(cc.size(200, 50), 4, sprite1);
        //photoButton.setDelegate(mainView);
        //photoButton.setAnchorPoint(cc.p(0,1));
        //photoButton.setPosition((cButtomBack.getContentSize().width>>1) + 50, cameraH - 15);
        //cButtomBack.addChild(photoButton);
        //
        //var photoLavel = new cc.LabelTTF("ギャラリー",GAME_FONT.PRO_W6);
        //photoLavel.setFontSize(32);
        //photoLavel.setFontFillColor(cc.color("#6fcdc1"));
        //photoLavel.setAnchorPoint(cc.p(0.5, 0.5));
        //photoLavel.setPosition(cc.p(photoButton.getContentSize().width - 65, photoButton.getContentSize().height/2 - 5));
        //photoButton.addChild(photoLavel);


        ////分割线
        //var grayLine = new cc.Sprite(GlobalRes.line_50);
        //grayLine.setScaleX(cc.winSize.width);
        //grayLine.setAnchorPoint(cc.p(0, 1));
        //grayLine.setPosition(cc.p(0, cc.winSize.height-100-120));
        //this.addChild(grayLine);

        var bDetileLavel = new cc.LabelTTF("選択肢の数：２～4枚登録可能",GAME_FONT.PRO_W3);
        bDetileLavel.setFontSize(24);
        bDetileLavel.setFontFillColor(cc.color("#c8c8c8"));
        bDetileLavel.setAnchorPoint(cc.p(0.5, 0.5));
        bDetileLavel.setPosition(cc.p(cButtomBack.getContentSize().width>>1, cButtomBack.getContentSize().height>>1));
        cButtomBack.addChild(bDetileLavel);
//Photo
        if(mainView.photoList.length > 0){
            for(var i = 0; i < mainView.photoList.length; i++){
                mainView.photoList[i].removeFromParent();
                backView.addChild(mainView.photoList[i]);
                if(mainView.photoList[i].getChildByTag(4).isVisible())
                    mainView.photoList[i].getChildByTag(1).setVisible(true);
                else
                    mainView.photoList[i].getChildByTag(5).setVisible(true);
                mainView.photoList[i].getChildByTag(2).setVisible(false);
                mainView.photoList[i].getChildByTag(3).setVisible(false);
            }
        }else{
            var photoH = backView.getContentSize().height - topH - titleH - cameraH - BottomH;
            mainView.addphotoListView(photoH,BottomH);
            for(var i = 0; i < mainView.photoList.length; i++){
                backView.addChild(mainView.photoList[i]);
            }
        }

//
//Bottom
        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(cc.p(0,1));
        cutoff.setPosition(0,BottomH);
        cutoff.setScaleX(cc.winSize.width);
        mainView.addChild(cutoff);

        var label1 = new cc.LabelTTF(" 個の選択肢が登録されています");
        label1.setFontName(GAME_FONT.PRO_W3);
        label1.setFontSize(26);
        label1.setFontFillColor(cc.color("#999999"));
        label1.setAnchorPoint(cc.p(0.5, 0.5));
        label1.setPosition(cc.p(cc.winSize.width>>1, 10 + 80 + 17 + 20));
        mainView.addChild(label1);

        var label = new cc.LabelTTF();
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(26);
        label.setFontFillColor(cc.color("#6fcdc1"));
        label.setAnchorPoint(cc.p(1, 0.5));
        label.setPosition(cc.p(label1.getPosition().x - label1.getContentSize().width/2, 10 + 80 + 17 + 20));
        label.setString("0");
        mainView.addChild(label);

        var button = mainView.buttonBackColorText("Start","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#c8c8c8"));

        var tempNum = 0;
        label.schedule(function(){
            var num = mainView.getphtoMaxNum();
            if(tempNum != num){
                label.setString("0" + num);
                if(num >= 2){
                    button.removeFromParent();
                    button = mainView.buttonBackColorText("Start","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#6fcdc1"));
                }else{
                    button.removeFromParent();
                    button = mainView.buttonBackColorText("Start","登録完了",cc.winSize.width/2, 10,cc.size(200, 80),cc.color("#c8c8c8"));
                }

                tempNum = num;
            }
        });

        mainView.textFiledVoteNum = [];
        for(var i = 0; i < 4; i++)
            mainView.textFiledVoteNum.push(0);

    },

    photoModeVote:function(){

        this.cuSelected = -1;

        this.removeAllChildren();

        this.gameStage = this.TAG_READY;

        var backView = new cc.LayerColor(cc.color(255, 255, 255, 255), cc.winSize.width, cc.winSize.height);
        backView.setTag(this.TAG_READY);
        this.addChild(backView);

        var topH = 100;
        var titleH = 200;
        var BottomH = 20 + 80 + 20 + 8;
//Top
        var topBack = new cc.LayerColor(cc.color("#6fcdc1"), backView.getContentSize().width, topH);
        topBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height);
        backView.addChild(topBack);

        var topName = new cc.LabelTTF("多数決投票",GAME_FONT.PRO_W3);
        topName.setFontSize(36);
        topName.setFontFillColor(cc.color("#fff3bf"));
        topName.setAnchorPoint(cc.p(0.5, 0.5));
        topName.setPosition(cc.p(topBack.getContentSize().width>>1, topBack.getContentSize().height>>1));
        topBack.addChild(topName);
//Title
        var titleBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, titleH);
        titleBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height);
        backView.addChild(titleBack);
        //标题
        var titleName = new cc.LabelTTF(mainView.photoTitle.getString(),GAME_FONT.PRO_W6);
        titleName.setFontSize(32);
        titleName.setFontFillColor(cc.color("#6fcdc1"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(cc.p(0, 0));
        cutoff.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height - 8);
        cutoff.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoff);

//photo
        var photoBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, backView.getContentSize().height - topH - titleH - BottomH);
        photoBack.setAnchorPoint(cc.p(0.5, 1));
        photoBack.setPosition(0, backView.getContentSize().height - topH - titleH - BottomH - photoBack.getContentSize().height);
        backView.addChild(photoBack);

            for(var i = 0; i < mainView.photoList.length; i++){
                mainView.photoList[i].removeFromParent();
                photoBack.addChild(mainView.photoList[i]);
                mainView.photoList[i].getChildByTag(1).setVisible(false);
                if(mainView.photoList[i].getChildByTag(4).isVisible())
                    mainView.photoList[i].getChildByTag(2).setVisible(true);
                mainView.photoList[i].getChildByTag(3).setVisible(false);
                mainView.photoList[i].getChildByTag(5).setVisible(false);
            }


//bottom
        var cutoffB = new cc.Sprite(GlobalRes.line_8);
        cutoffB.setAnchorPoint(cc.p(0, 1));
        cutoffB.setPosition(0, BottomH);
        cutoffB.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoffB);

        var btnVoteContinue = this.buttonBackColorText("voteContinue","次の人の投票へ",cc.winSize.width/2 - 155, 20,cc.size(300, 80),cc.color("#c8c8c8"),backView);
        var btnSeeResult = this.buttonBackColorText("seeResult","投票結果を見る",cc.winSize.width/2 + 155, 20,cc.size(300, 80),cc.color("#6fcdc1"),backView);

        var tempSelected = -1;

        backView.schedule(function(){
            var _this = mainView;
            if(_this.cuSelected != tempSelected){
                if(_this.cuSelected == -1){
                    btnVoteContinue.removeFromParent();
                    //btnSeeResult.removeFromParent();
                    btnVoteContinue = _this.buttonBackColorText("voteContinue","次の人の投票へ",cc.winSize.width/2 - 155, 20,cc.size(300, 80),cc.color("#c8c8c8"),backView);
                    //btnSeeResult = _this.buttonBackColorText("seeResult","投票結果を見る",cc.winSize.width/2 + 155, 20,cc.size(300, 80),cc.color("#c8c8c8"),backView);
                }else {
                    btnVoteContinue.removeFromParent();
                    //btnSeeResult.removeFromParent();
                    btnVoteContinue = _this.buttonBackColorText("voteContinue","次の人の投票へ",cc.winSize.width/2 - 155, 20,cc.size(300, 80),cc.color("#6fcdc1"),backView);
                    //btnSeeResult = _this.buttonBackColorText("seeResult","投票結果を見る",cc.winSize.width/2 + 155, 20,cc.size(300, 80),cc.color("#6fcdc1"),backView);
                }
                tempSelected = _this.cuSelected;
            }
        });

    },

    photoModeVoteResult:function(title){

        this.removeAllChildren();

        this.gameStage = this.TAG_RESULT;

        var strTitle = "多数決の結果";
        if(title) strTitle = title;
        var backView = new cc.LayerColor(cc.color(255, 255, 255, 255), cc.winSize.width, cc.winSize.height);
        backView.setTag(this.TAG_READY);
        this.addChild(backView);

        var topH = 100;
        var titleH = 100;
        var titlePhotoH = 340 + 30;
        var BottomH = 160;
//Top
        var topBack = new cc.LayerColor(cc.color("#6fcdc1"), backView.getContentSize().width, topH);
        topBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height);
        backView.addChild(topBack);

        var topName = new cc.LabelTTF(strTitle,GAME_FONT.PRO_W3);
        topName.setFontSize(36);
        topName.setFontFillColor(cc.color("#fff3bf"));
        topName.setAnchorPoint(cc.p(0.5, 0.5));
        topName.setPosition(cc.p(topBack.getContentSize().width>>1, topBack.getContentSize().height>>1));
        topBack.addChild(topName);
//Title
        var titleBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, titleH);
        titleBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height);
        backView.addChild(titleBack);
        //标题
        var titleName = new cc.LabelTTF(mainView.photoTitle.getString(),GAME_FONT.PRO_W3);
        titleName.setFontSize(32);
        titleName.setFontFillColor(cc.color("#6fcdc1"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);
//photomax
        var photoTitleBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, titlePhotoH);
        photoTitleBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height  - photoTitleBack.getContentSize().height);
        backView.addChild(photoTitleBack);

        var mIndex = this.voteMaxIndex();
        var sprite = this.photoList[mIndex].getChildByTag(4);
        var texture =  sprite.getTexture();
        while(texture == null){
            ++mIndex;
            if(mIndex > 3)
                mIndex = 0;
            sprite = this.photoList[mIndex].getChildByTag(4);
            texture =  sprite.getTexture();
        }
        var photoMax = new cc.Sprite();
        photoMax.initWithTexture(texture);
        photoMax.setAnchorPoint(cc.p(0.5, 1));
        photoMax.setPosition(backView.getContentSize().width/2, photoTitleBack.getContentSize().height);
        var sY = 340/texture.getContentSize().height;
        if(1)sX = sY = (texture.getContentSize().width>texture.getContentSize().height)?sX:sY;//不变形
        photoMax.setScale(sX,sY);
        photoTitleBack.addChild(photoMax);

        if(this.isSameMaxIndex())
            photoTitleBack.setVisible(false);//for 8updateList

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(cc.p(0, 0));
        cutoff.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height - photoTitleBack.getContentSize().height - 8);
        cutoff.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoff);
//photo
        var photoBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, backView.getContentSize().height - topH - titleH - titlePhotoH - BottomH);
        photoBack.setPosition(0, backView.getContentSize().height - topBack.getContentSize().height - titleBack.getContentSize().height  - photoTitleBack.getContentSize().height - photoBack.getContentSize().height);
        backView.addChild(photoBack);

        var dis = 10;
        var photoH = photoBack.getContentSize().height - 2*dis;
        var _w = 250,_h = 250;
        if(photoH < _w*2){
            _w = _h = photoH/2;
        }
        var arryXY = [
            -_w/2 - dis, _h/2 + 2*dis,
            _w/2 + dis, _h/2 + 2*dis,
            -_w/2 - dis, -_h/2 + dis,
            _w/2 + dis, -_h/2 + dis
        ];
        var photo;
        for(var i = 0; i < this.photoList.length; i++){
            var sprite1 = this.photoList[i].getChildByTag(4);
            if(!sprite1.isVisible()) continue;
            var texture =  sprite1.getTexture();
            //photo.push(new cc.Sprite());
            photo = new cc.Sprite();
            photo.initWithTexture(texture);
            photo.setAnchorPoint(cc.p(0.5, 0.5));
            photo.setPosition(photoBack.getContentSize().width/2 + arryXY[2*i], photoBack.getContentSize().height/2 + arryXY[2*i + 1]);
            var sX = _w/texture.getContentSize().width;
            var sY = _w/texture.getContentSize().height;
            if(1)sX = sY = (texture.getContentSize().width>texture.getContentSize().height)?sX:sY;//不变形
            photo.setScale(sX,sX);
            photoBack.addChild(photo);


            var backNum = new cc.LayerColor(cc.color("#6fcdc1"), 100, 50);
            backNum.setPosition(photo.getPositionX() - _w/2,photo.getPositionY() + _w/2 - 50);
            //backNum.setAnchorPoint(cc.p(0, 0));
            //backNum.setPosition(0, (_h - 50)*(photo.getContentSize().height/_h));
            //backNum.setScale(photo.getContentSize().width/_w,photo.getContentSize().height/_h);
            photoBack.addChild(backNum);


            var uIcon = new cc.Sprite(MajorityVoteRes.common_user_icon);
            uIcon.setAnchorPoint(cc.p(0, 0.5));
            uIcon.setPosition(10, backNum.getContentSize().height/2);
            backNum.addChild(uIcon);

            var uNum = new cc.LabelTTF();
            uNum.setFontName(GAME_FONT.PRO_W3);
            var num = this.textFiledVoteNum[i];
            if(num > 9)
                uNum.setString(num.toString());
            else
                uNum.setString("0"+num.toString());
            uNum.setFontSize(24);
            uNum.setFontFillColor(cc.color("#fff3bf"));
            uNum.setAnchorPoint(cc.p(0.5, 0.5));
            uNum.setPosition(cc.p((backNum.getContentSize().width + 10 + uIcon.getContentSize().width)/2, backNum.getContentSize().height/2 - 3));
            backNum.addChild(uNum);

        }
//bottom
        var cutoffB = new cc.Sprite(GlobalRes.line_8);
        cutoffB.setAnchorPoint(cc.p(0, 1));
        cutoffB.setPosition(0, BottomH);
        cutoffB.setScaleX(backView.getContentSize().width);
        backView.addChild(cutoffB);


        if(title){
            this.buttonBackColorText("dataImport","データ読み込み",cc.winSize.width/2, BottomH/2 - 40,cc.size(300, 80),cc.color("#6fcdc1"),backView);
            return;
        }

        var Bname = new cc.LabelTTF();
        Bname.setFontName(GAME_FONT.PRO_W6);
        Bname.setString("人が投票に参加しました");
        Bname.setFontSize(26);
        Bname.setFontFillColor(cc.color("#999999"));
        Bname.setAnchorPoint(cc.p(0.5, 0));
        Bname.setPosition(cc.p(cc.winSize.width/2, 85 + 20));
        backView.addChild(Bname);

        var maxVoteNum = function(){
            var mI = 0;
            var arry = mainView.textFiledVoteNum;
            for(var i = 0 ; i < arry.length ; i++){
                mI += arry[i];
            }
            return mI;
        };
        var maxNumber = maxVoteNum();

        var number = new cc.LabelTTF();
        number.setFontName(GAME_FONT.PRO_W3);
        if(maxNumber > 9)
            number.setString(maxNumber);
        else
            number.setString("0" + maxNumber);
        number.setFontSize(26);
        number.setFontFillColor(cc.color("#6fcdc1"));
        number.setAnchorPoint(cc.p(0.5, 0));
        number.setPosition(cc.p(cc.winSize.width/2 - 26*6 - 7, 85 + 20));
        backView.addChild(number);


        this.buttonBackColorText("reVote","再投票",cc.winSize.width/2 - 105, 5,cc.size(200, 80),cc.color("#6fcdc1"),backView);

        this.buttonBackColorText("home","ホーム",cc.winSize.width/2 + 105, 5,cc.size(200, 80),cc.color("#6fcdc1"),backView);
    },

    gotoReplayView:function(groups,mode){
        mainView.getResultData(groups,mode);

        if(mainView.cMode == 0){
            mainView.startTextMode();
        }
        //else
        //    mainView.startPhotoMode();

    },

    gotoResultView:function(groups, title, mode){
        mainView.fromHistory = true;
        mainView.resultTitle = title;
        mainView.getResultData(groups,mode,title);

        if(mainView.cMode == 0){
            mainView.textModeVoteResult(title);
        }else if(mainView.cMode == 1){
            //mainView.photoModeVoteResult(title);
        }

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
    },

    setHistory:function(mode,title,teamName,icon,members){

        //group.add({icon:"01", name:"ブニャ","members":[{"name":"32131321"},{"name":"44444"}]});

        var dist;
        if(mainView.cMode == 0){
            dist = this.textFiledAddVIew.listView.getItems().length;
        }else
            dist = this.photoList.length;
        var group = new ArrayList();
        for(var i = 0 ; i < 1; i++){
            var result = {};
            if(mainView.cMode == 0)
                result.name = this.textFiledAddVIew.getTitleString();//title
            else
                result.name = this.photoTitle.getString();//title
            result.icon = this.voteMaxIndex().toString();//maxVote
            result.members = [];
            for(var j = 0 ; j < dist; j++){
                var data = {};
                if(mainView.cMode == 0)
                    data.name = this.textFiledAddVIew.getListChildern(j);
                else{
                    //var key = GAME_TYPE.MajorityVote.name + "photo" + j;
                    //data.name = j;
                    //DataManager.instance().saveData(key, this.photoList[j].getName());
                    data.name = DataManager.instance().createPhotoHistory(GAME_TYPE.MajorityVote, this.photoList[j].getChildByTag(4).getName(),j == 0);
                }

                data.number = this.textFiledVoteNum[j];
                result.members.push(data);
            }
            group.add(result);
        }

        var history = {};
        history.mode = mode;//1: resOne 2: resTow
        history.groups = group.arr;
        history.title = title;
        DataManager.instance().createHistory(GAME_TYPE.MajorityVote, history);
    },

    clearData:function(){
        mainView.cuPhotoWH = null;

        if(this.textFiledAddVIew){
            this.textFiledAddVIew.listView.removeAllItems();
            this.textFiledAddVIew.removeFromParent();
            this.textFiledAddVIew = null;
        }
        this.textFiledVoteNum  = [];
        this.photoList = [];
        if(this.photoTitle){
            this.photoTitle.removeFromParent();
            this.photoTitle = null;
        }

    },

    getResultData:function(groups,mode,title){
        this.cMode = mode;

        //this.clearData();
        if(this.cMode == 0){
            this.textFiledAddVIew = new TextFiledAddList(30,10 + 80 + 34 + 2*20 + 8,2);
        }else{
            this.photoTitle = this.setPhotoTitleView(122);
            this.addphotoListView(cc.winSize.height - 100 - 122 - 124 - 172, 172);
        }

        if(groups){
            for(var j = 0; j < groups.length; j++){
                if(this.cMode == 0)
                    this.textFiledAddVIew.setTitleString(groups[j].name);
                else
                    this.photoTitle.setString(groups[j].name);
                for(var k = 0; k < groups[j].members.length; k++){
                    if(this.cMode == 0)
                        this.textFiledAddVIew.setListChildern(groups[j].members[k].name);
                    else{
                        //var name = DataManager.instance().getData(groups[j].members[k].name);
                        var obj = DataManager.instance().getPhotoHistory(groups[j].members[k].name,k);
                        this.setPhotoTexture(obj,null,k,title);//obj.type,
                    }
                    this.textFiledVoteNum.push(groups[j].members[k].number);
                }
            }
        }
    },

    loadClientDataChanged: function (loadClientData, file,fileOriginal, iType) {
        mainView.scheduleOnce(function(){
            for(var index = 0; index < file.length; index++){
                //mainView.setPhotoTexture(file[index],fileOriginal[index],loadClientData.getName());
                mainView.textureinfo = [];
                mainView.textureinfo.push(file[index]);
                mainView.textureinfo.push(fileOriginal[index]);
                mainView.textureinfo.push(loadClientData.getName());
                mainView.textureinfo.push(iType);
                mainView.imageCutView(file[index],fileOriginal[index],loadClientData.getName(),iType);
                break;
            }
        },0.01);
    },

    imageCutView:function(file,fileOriginal,index,iType){

        this.photoTitle.setVisible(false);
        for(var j = 0; j < this.photoList.length; j++){
            this.photoList[j].setVisible(false);
        }
        this.getChildByName("Start").setVisible(false);

        var _this = this;

        var iCutLayout = new ccui.Layout();
        iCutLayout.setContentSize(cc.winSize.width, cc.winSize.height);
        iCutLayout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        iCutLayout.setBackGroundColor(cc.color(115,115,115,255));
        iCutLayout.setName("iCutLayout");
        this.addChild(iCutLayout);

        var titleH = 80;

        var scrollViewRect = new ccui.Layout();
        scrollViewRect.setName("scrollViewRect");
        scrollViewRect.setContentSize(iCutLayout.getContentSize().width, iCutLayout.getContentSize().height - titleH);
        scrollViewRect.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        scrollViewRect.setBackGroundColor(cc.color(115,115,115,255));
        scrollViewRect.setAnchorPoint(0, 0);
        scrollViewRect.setPosition(0, 0);
        iCutLayout.addChild(scrollViewRect);


        //读取的图片
        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(file);
        texture2d.handleLoadedTexture();
        var photo = new cc.Sprite();
        photo.setName("photo");
        photo.initWithTexture(texture2d);
        photo.setAnchorPoint(cc.p(0.5, 0.5));
        photo.setPosition(scrollViewRect.width/2, (scrollViewRect.height)/2);
        //if(iType == 1){
        //    photo.setRotation(90);
        //    var sX = scrollViewRect.width/texture2d.getContentSize().height;
        //    var sY = scrollViewRect.height/texture2d.getContentSize().width;
        //}else{
            var sX = scrollViewRect.width/texture2d.getContentSize().width;
            var sY = scrollViewRect.height/texture2d.getContentSize().height;
        //}
        var ratio = texture2d.getContentSize().height/texture2d.getContentSize().width;
        var ratio1 = scrollViewRect.height/scrollViewRect.width;
        //if(iType == 1)
        //    sX = sY = ((texture2d.getContentSize().width < texture2d.getContentSize().height)&&(ratio > ratio1))?sY:sX;//不变形
        //else
            sX = sY = ((texture2d.getContentSize().width < texture2d.getContentSize().height)&&(ratio > ratio1))?sY:sX;//不变形
        photo.setScale(sX,sY);
        scrollViewRect.addChild(photo);
        texture2d = null;

        var startDist = 0;
        var addScale = sX;
        var tempPoint = null;
        var tempPos = null;
        var sPos = photo.getPosition();
        var px = 0, py = 0;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touches[0].getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode) && startDist == 0) {
                    if(touches.length >= 2){
                        var point1 = touches[0].getLocation(),
                            point2 = touches[1].getLocation();
                        startDist = cc.pDistance(point1,point2);
                    }else if(tempPoint == null)
                        tempPoint = touches[0].getLocation();
                    else{
                        var point1 = touches[0].getLocation(),
                            point2 = tempPoint;
                        startDist = cc.pDistance(point1,point2);
                    }
                }
                return false;
            },
            onTouchesMoved: function(touches, event) {
                var target = event.getCurrentTarget();
                //cc.log("Touch #. onTouchesMoved at: " + touches.length +"::"+startDist + "::"+tempPoint);
                if(startDist != 0 && touches.length >= 2){
                        var point1 = touches[0].getLocation(),
                            point2 = touches[1].getLocation();
                        var dis = cc.pDistance(point1,point2);

                        if(dis > startDist){
                            if(addScale < 4*sX)
                            {
                                addScale += 0.1;
                                photo.setScale(addScale,addScale);
                            }
                        }else{
                            if(addScale > sX)
                            {
                                addScale -= 0.1;
                                if(addScale <= sX){
                                    addScale = sX;
                                    photo.setPosition(sPos.x,sPos.y);
                                }else{
                                    photo.setScale(addScale,addScale);
                                    if(photo.getPositionX() > sPos.x){
                                        var dd = (photo.getPositionX() - sPos.x);
                                        photo.setPositionX(photo.getPositionX() - dd*0.1/(addScale - sX));
                                    }else if(photo.getPositionX() < sPos.x){
                                        var dd = (sPos.x - photo.getPositionX());
                                        photo.setPositionX(photo.getPositionX() + dd*0.1/(addScale - sX));
                                    }

                                    if(photo.getPositionY() > sPos.y){
                                        var dd = (photo.getPositionY() - sPos.y);
                                        photo.setPositionY(photo.getPositionY() - dd*0.1/(addScale - sX));
                                    }else if(photo.getPositionY() < sPos.y){
                                        var dd = (sPos.y - photo.getPositionY());
                                        photo.setPositionY(photo.getPositionY() + dd*0.1/(addScale - sX));
                                    }
                                }
                            }
                        }
                        startDist = dis;
                        _this.photoScale = addScale;
                }
            },
            onTouchesEnded: function(touches, event) {
                //if(touches.length < 2){
                    startDist = 0;
                    tempPoint = null;
                    //cc.log("Touch #. onTouchesEnded at: " + touches.length);
                //}
            }
        }, photo);


        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode) && startDist == 0) {
                    px = target.getPositionX();
                    py = target.getPositionY();
                    //if(iType == 1){
                    //    var cw = target.getContentSize().height*target.getScaleX();
                    //    var ch = target.getContentSize().width*target.getScaleY();
                    //}else{
                        var cw = target.getContentSize().width*target.getScaleX();
                        var ch = target.getContentSize().height*target.getScaleY();
                    //}


                    //if(target.getPositionX() < cw){
                    //    target.setPositionX(cw);
                    //    return false;
                    //}
                    //
                    console.log(px + "::" + py + ":CW:" + cw + ":CH:" + ch+":SW:"+scrollViewRect.width+":SH:"+scrollViewRect.height);

                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                if(startDist != 0) return false;
                if(px == 0 && py == 0) return false;
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                if(tempPos == null || pos == tempPos)
                    tempPos = touch.getLocation();
                else{

                    if(addScale > sX){
                        //if(iType == 1){
                        //    var cw = target.getContentSize().height*target.getScaleX();
                        //    var ch = target.getContentSize().width*target.getScaleY();
                        //}else{
                            var cw = target.getContentSize().width*target.getScaleX();
                            var ch = target.getContentSize().height*target.getScaleY();
                        //}

                        if(cw > scrollViewRect.width){//move X
                            var canMoveX = (cw - scrollViewRect.width)>>1;
                            target.setPositionX(px + (pos.x - tempPos.x));

                            if((target.getPositionX() - sPos.x) > canMoveX){//left
                                target.setPositionX(sPos.x + canMoveX);
                            }
                            if((sPos.x - target.getPositionX()) > canMoveX){//right
                                target.setPositionX(sPos.x - canMoveX);
                            }
                        }

                        if(ch > scrollViewRect.height){//move Y
                            var canMoveY = (ch - scrollViewRect.height)>>1;
                            target.setPositionY(py + (pos.y - tempPos.y));

                            if((target.getPositionY() - sPos.y) > canMoveY){//up
                                target.setPositionY(sPos.y + canMoveY);
                            }

                            if((sPos.y - target.getPositionY()) > canMoveY){
                                target.setPositionY(sPos.y - canMoveY);
                            }
                        }
                    }
                    var cdx = (sPos.x - target.getPosition().x);//以中间为基准，实际移动的X距离
                    var cdy = (target.getPosition().y - sPos.y);//以中间为基准，实际移动的Y距离
                    _this.photoPos = cc.p(cdx,cdy);//target.getPosition();

                    //cc.log(cuRect.x+"::"+(cuRect.height)+"::"+cuRect.width);
                }
            },
            onTouchEnded: function(touches, event) {
                tempPos = null;
                px = 0;
                py = 0;
            }
        }, photo);

        var wh = 300;
        _this.photoPos = cc.p(0,0);// photo.getPosition();
        _this.photoScale = sX;
        _this.photoRect = cc.rect(cc.winSize.width/2 - wh/2, cc.winSize.height/2 - wh/2, wh, wh);
        this.drawRectCutPhoto(_this.photoRect,scrollViewRect);
        var btn = this.buttonBackColorText("cutImgOK","保存",cc.winSize.width/2 + cc.winSize.width/4, cc.winSize.height - titleH,cc.size(cc.winSize.width/2, titleH),cc.color("#6fcdc1"),iCutLayout);
        this.buttonBackColorText("cutImgCancel","キャンセル",cc.winSize.width/4, cc.winSize.height - titleH,cc.size(cc.winSize.width/2, titleH),cc.color("#6fcdc1"),iCutLayout);

        var btn_touchevent = function(){
            //if(iType == 1){
            //    var cw = photo.getContentSize().height*photo.getScaleX();
            //    var ch = photo.getContentSize().width*photo.getScaleY();
            //}else{
                var cw = photo.getContentSize().width*photo.getScaleX();
                var ch = photo.getContentSize().height*photo.getScaleY();
            //}
            var xxx = photo.getPositionX();
            var yyy = photo.getPositionY();
            var tempRect = cc.rect(xxx - cw/2, yyy - ch/2, cw, ch);
            var re2 = cc.rectIntersection(_this.photoRect, tempRect);
            if(Math.abs(re2.width - _this.photoRect.width) <= 0.5 && Math.abs(re2.height - _this.photoRect.height) <= 0.5){
                iCutLayout.removeFromParent();
                _this.photoTitle.setVisible(true);
                for(var j = 0; j < _this.photoList.length; j++){
                    _this.photoList[j].setVisible(true);
                }
                _this.getChildByName("Start").setVisible(true);
                _this.setPhotoTexture(file,fileOriginal,index);
            }else {
                window.alert("イメージ内に選択してください");
            };


        };
        btn.addClickEventListener(btn_touchevent);
        Utility.siLoadingFile = false;
    },

    drawRectCutPhoto:function(rect,parent){
        var img = parent.getChildByName("photo");
        var width = parent.getContentSize().width;
        var height = parent.getContentSize().height;
        var opcity = 100;
        var cw,ch;
        var _this = this;
        if(img){
            cw = img.getContentSize().width*img.getScaleX();
            ch = img.getContentSize().height*img.getScaleY();
            if(cw < ch){
                if(cw < rect.width)
                    rect =  cc.rect(cc.winSize.width/2 - cw/2, cc.winSize.height/2 - cw/2, cw, cw);
            }else{
                if(ch < rect.height)
                    rect =  cc.rect(cc.winSize.width/2 - ch/2, cc.winSize.height/2 - ch/2, ch, ch);
            }
        }

        var backLayout = new ccui.Layout();
        backLayout.setContentSize(width, height);
        parent.addChild(backLayout);

        var leftLayout = new cc.LayerColor(cc.color(0, 0, 0, opcity), rect.x, height);
        leftLayout.setPosition(cc.p(0,0));
        backLayout.addChild(leftLayout);

        var rightLayout = new cc.LayerColor(cc.color(0, 0, 0, opcity), width - rect.x - rect.width, height);
        rightLayout.setPosition(cc.p(rect.x + rect.width,0));
        backLayout.addChild(rightLayout);

        var upLayout = new cc.LayerColor(cc.color(0, 0, 0, opcity), rect.width, height - rect.y - rect.height);
        upLayout.setPosition(cc.p(rect.x,rect.y + rect.height));
        backLayout.addChild(upLayout);

        var downLayout = new cc.LayerColor(cc.color(0, 0, 0, opcity), rect.width, rect.y);
        downLayout.setPosition(cc.p(rect.x,0));
        backLayout.addChild(downLayout);

        var cutLayout = new ccui.Layout();
        cutLayout.setContentSize(rect.width, rect.height);
        cutLayout.setPosition(cc.p(rect.x,rect.y));
        backLayout.addChild(cutLayout);

        var lineBottom = new cc.Sprite(GlobalRes.color_b0e2cf);
        lineBottom.setAnchorPoint(0,0);
        lineBottom.setPosition(0, 0);
        cutLayout.addChild(lineBottom);


        var draw = new cc.DrawNode();
        draw.setTag(0);
        cutLayout.addChild(draw);
        draw.drawRect(cc.p(0, 0), cc.p(rect.width, rect.height), null, 2, cc.color(255, 255, 255, 255));
        draw.drawPoly([cc.p(rect.width/3, 0), cc.p(rect.width/3, rect.height)], null, 2, cc.color(255, 255, 255, 255));
        draw.drawPoly([cc.p(2*rect.width/3, 0), cc.p(2*rect.width/3, rect.height)], null, 2, cc.color(255, 255, 255, 255));
        draw.drawPoly([cc.p(0, rect.height/3), cc.p(rect.width, rect.height/3)], null, 2, cc.color(255, 255, 255, 255));
        draw.drawPoly([cc.p(0, 2*rect.height/3), cc.p(rect.width, 2*rect.height/3)], null, 2, cc.color(255, 255, 255, 255));


        var btnLeftBottom = new ccui.Button(GlobalRes.dot);
        btnLeftBottom.setAnchorPoint(0.5, 0.5);
        btnLeftBottom.setPosition(0, 0);
        btnLeftBottom.setTag(1);
        btnLeftBottom.setScale(2,2);
        cutLayout.addChild(btnLeftBottom);

        var btnRightBottom = new ccui.Button(GlobalRes.dot);
        btnRightBottom.setAnchorPoint(0.5, 0.5);
        btnRightBottom.setPosition(rect.width, 0);
        btnRightBottom.setTag(2);
        btnRightBottom.setScale(2,2);
        cutLayout.addChild(btnRightBottom);

        var btnRightTop = new ccui.Button(GlobalRes.dot);
        btnRightTop.setAnchorPoint(0.5, 0.5);
        btnRightTop.setPosition(rect.width, rect.height);
        btnRightTop.setTag(3);
        btnRightTop.setScale(2,2);
        cutLayout.addChild(btnRightTop);

        var btnLeftTop = new ccui.Button(GlobalRes.dot);
        btnLeftTop.setAnchorPoint(0.5, 0.5);
        btnLeftTop.setPosition(0, rect.height);
        btnLeftTop.setTag(4);
        btnLeftTop.setScale(2,2);
        cutLayout.addChild(btnLeftTop);

        var setRect = function(newRect){
            if(newRect.x < 0) newRect.x = 0;
            if(newRect.y < 0) newRect.y = 0;
            if(newRect.x + newRect.width > width) newRect.x = width - newRect.width;
            if(newRect.y + newRect.height > height) newRect.y = height - newRect.height;
            if(newRect.width < 100) newRect.width = 100;
            if(newRect.height < 100) newRect.height = 100;
            if(newRect.width > width) newRect.width = width;
            if(newRect.height > height) newRect.height = height;
            _this.photoRect = newRect;

            leftLayout.setContentSize(newRect.x, height);

            rightLayout.setContentSize(width - newRect.x - newRect.width, height);
            rightLayout.setPosition(cc.p(newRect.x + newRect.width,0));

            upLayout.setContentSize(newRect.width, height - newRect.y - newRect.height);
            upLayout.setPosition(cc.p(newRect.x,newRect.y + newRect.height));

            downLayout.setContentSize(newRect.width, newRect.y);
            downLayout.setPosition(cc.p(newRect.x,0));

            cutLayout.setContentSize(newRect.width, newRect.height);
            cutLayout.setPosition(cc.p(newRect.x,newRect.y));

            btnLeftBottom.setPosition(0, 0);
            btnRightBottom.setPosition(newRect.width, 0);
            btnRightTop.setPosition(newRect.width, newRect.height);
            btnLeftTop.setPosition(0, newRect.height);

            cutLayout.getChildByTag(0).removeFromParent();
            var draw = new cc.DrawNode();
            draw.setTag(0);
            cutLayout.addChild(draw);
            draw.drawRect(cc.p(0, 0), cc.p(newRect.width, newRect.height), null, 2, cc.color(255, 255, 255, 255));
            draw.drawPoly([cc.p(newRect.width/3, 0), cc.p(newRect.width/3, newRect.height)], null, 2, cc.color(255, 255, 255, 255));
            draw.drawPoly([cc.p(2*newRect.width/3, 0), cc.p(2*newRect.width/3, newRect.height)], null, 2, cc.color(255, 255, 255, 255));
            draw.drawPoly([cc.p(0, newRect.height/3), cc.p(newRect.width, newRect.height/3)], null, 2, cc.color(255, 255, 255, 255));
            draw.drawPoly([cc.p(0, 2*newRect.height/3), cc.p(newRect.width, 2*newRect.height/3)], null, 2, cc.color(255, 255, 255, 255));

        };
        var tempPos;
        var sp;
        //var newRect = rect;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    sp = target.getPosition();
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                var pos = touch.getLocation();
                if(tempPos == null || pos == tempPos)
                    tempPos = touch.getLocation();
                else{
                    rect.x = sp.x + (pos.x - tempPos.x);
                    rect.y = sp.y + (pos.y - tempPos.y);
                    setRect(rect);
                }
            },
            onTouchEnded: function(touches, event) {
                tempPos = null;
                px = 0;
                py = 0;
            }
        }, cutLayout);


        var buttonEvent = function(sender, type){
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    //sp = sender.getPosition();
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    //var x = sender.getTouchMovePosition().x - rect.x,
                    //    y = sender.getTouchMovePosition().y - rect.y;
                    //sender.setPosition(x,y);
                    var rX = rect.x,rY = rect.y,rW = rect.width,rH = rect.height;
                    var dX = 0,dY = 0;
                    switch(sender.getTag()){
                        case 1:
                            dX = rect.x - sender.getTouchMovePosition().x;
                            dY = rect.y - sender.getTouchMovePosition().y;
                            rect.width = rect.width + dX;
                            rect.height = rect.height + dY;
                            if(1){//等比率变化
                                if(Math.abs(dX) > Math.abs(dY)){
                                    rect.width = rect.height;
                                }else{
                                    rect.height = rect.width;
                                }
                                rect.x = rX + rW - rect.width;
                                rect.y = rY + rH - rect.width;
                            }else{
                                rect.x = sender.getTouchMovePosition().x;
                                rect.y = sender.getTouchMovePosition().y;
                            }
                            break;
                        case 2:
                            dX = sender.getTouchMovePosition().x - rect.x - rect.width;
                            dY = rect.y - sender.getTouchMovePosition().y;
                            rect.width = rect.width + dX;
                            rect.height = rect.height + dY;
                            if(1){//等比率变化
                                if(Math.abs(dX) > Math.abs(dY)){
                                    rect.width = rect.height;
                                }else{
                                    rect.height = rect.width;
                                }
                                //rect.x = rX + rW - rect.width;
                                rect.y = rY + rH - rect.width;
                            }else{
                                rect.x = sender.getTouchMovePosition().x - rect.width;
                                rect.y = sender.getTouchMovePosition().y;
                            }
                            break;
                        case 3:
                            dX = sender.getTouchMovePosition().x - rect.x - rect.width;
                            dY = sender.getTouchMovePosition().y - rect.y - rect.height;
                            rect.width = rect.width + dX;
                            rect.height = rect.height + dY;
                            if(1){//等比率变化
                                if(Math.abs(dX) > Math.abs(dY)){
                                    rect.width = rect.height;
                                }else{
                                    rect.height = rect.width;
                                }
                                //rect.x = rX + rW - rect.width;
                                //rect.y = rY + rH - rect.width;
                            }else{
                                rect.x = sender.getTouchMovePosition().x - rect.width;
                                rect.y = sender.getTouchMovePosition().y - rect.height;
                            }
                            break;
                        case 4:
                            dX = rect.x - sender.getTouchMovePosition().x;
                            dY = sender.getTouchMovePosition().y - rect.y - rect.height;
                            rect.width = rect.width + dX;
                            rect.height = rect.height + dY;
                            if(1){//等比率变化
                                if(Math.abs(dX) > Math.abs(dY)){
                                    rect.width = rect.height;
                                }else{
                                    rect.height = rect.width;
                                }
                                rect.x = rX + rW - rect.width;
                                //rect.y = rY + rH - rect.width;
                            }else{
                                rect.x = sender.getTouchMovePosition().x;
                                rect.y = sender.getTouchMovePosition().y - rect.height;
                            }
                            break;
                    }



                    if(rect.width <= 100){
                        rect.x = rX;
                        rect.width = rW;
                    }
                    if(rect.height <= 100){
                        rect.y = rY;
                        rect.height = rH;
                    }
                    setRect(rect);
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    //cc.log(sender.getTouchMovePosition());
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
                default:
                    break;
            }
        };
        btnLeftBottom.addTouchEventListener(buttonEvent);
        btnRightBottom.addTouchEventListener(buttonEvent);
        btnRightTop.addTouchEventListener(buttonEvent);
        btnLeftTop.addTouchEventListener(buttonEvent);

        return rect;
    },

    setPhotoTexture:function(file,fileOriginal,index,title){
        var _this = this;
        if(fileOriginal){
            var ret = _this.getCutImageRes(file);
            cc.loader.loadImg(ret, {isCrossOrigin : false }, function(err, img){
                var texture2d = new cc.Texture2D();
                texture2d.initWithElement(img);
                texture2d.handleLoadedTexture();
                _this.photoList[index].getChildByTag(5).setVisible(false);
                _this.photoList[index].getChildByTag(4).initWithTexture(texture2d);
                var swh = _this.cuPhotoWH?(_this.cuPhotoWH/img.width):(_this.IMAGE_WH/img.height);
                _this.photoList[index].getChildByTag(4).setScale(swh,swh);
                _this.photoList[index].getChildByTag(4).setName(ret);
                _this.photoList[index].getChildByTag(4).setVisible(true);
                _this.photoList[index].getChildByTag(1).setVisible(true);
                texture2d = null;
            });
        }else{
            cc.loader.loadImg(file, {isCrossOrigin : false }, function(err, img){
                if(file != null && file != ""){
                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(img);
                    texture2d.handleLoadedTexture();
                    _this.photoList[index].getChildByTag(5).setVisible(false);
                    _this.photoList[index].getChildByTag(4).initWithTexture(texture2d);
                    _this.photoList[index].getChildByTag(4).setName(file);
                    var swh = _this.cuPhotoWH?(_this.cuPhotoWH/img.width):(_this.IMAGE_WH/img.height);
                    _this.photoList[index].getChildByTag(4).setScale(swh,swh);
                    _this.photoList[index].getChildByTag(4).setVisible(true);
                    _this.photoList[index].getChildByTag(1).setVisible(true);
                    texture2d = null;
                }
                if(index == _this.photoList.length - 1){
                    if(_this.fromHistory)
                        _this.photoModeVoteResult(title);
                    else
                        _this.startPhotoMode();
                }

            });
        }
    },

    getCutImageRes:function(file){
        //var sX = _this.cuPhotoWH?(_this.cuPhotoWH/file.width):(_this.IMAGE_WH/file.width);
        //var sY = _this.cuPhotoWH?(_this.cuPhotoWH/file.height):(_this.IMAGE_WH/file.height);
        //if(1)sX = sY = (file.width>file.height)?sX:sY;//不变形
        var _this = this;

        var cw = file.width*_this.photoScale;
        var ch = file.height*_this.photoScale;
        var cwd = (cc.winSize.width - cw)/2, chd = (cc.winSize.height - 80 - ch)/2;//大于或小于画面宽高计算

        var w = _this.photoRect.width/_this.photoScale;//切图的实际宽度
        var h = _this.photoRect.height/_this.photoScale;//切图的实际高度

        var tempx = _this.photoRect.x/_this.photoScale, tempy =(_this.photoRect.y/_this.photoScale);//切图的实际其实点 以左下为锚点

        var x = tempx - cwd/_this.photoScale;//减去出去的图片部分X

        var y = file.height - tempy - h + chd/_this.photoScale;//切图需要左上为锚点，需要转换，再减去出去的图片部分Y

        var cdx = (_this.photoPos.x)/_this.photoScale;//以中间为基准，实际移动的X距离
        var cdy = (_this.photoPos.y)/_this.photoScale;//以中间为基准，实际移动的Y距离

        x = cdx + x;//获得最终X
        y = cdy + y;//获得最终Y

        var finallyRect = cc.rect(x, y, w, h);

        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(file);
        texture2d.handleLoadedTexture();

        var tempElement = texture2d.getHtmlElementObj();

        var nCanvas = cc.newElement("canvas");
        nCanvas.width = finallyRect.width;
        nCanvas.height = finallyRect.height;
        var ctx = nCanvas.getContext("2d");
        ctx.translate(nCanvas.width / 2, nCanvas.height / 2);
        ctx.drawImage(tempElement, finallyRect.x, finallyRect.y, finallyRect.height, finallyRect.width, -finallyRect.height / 2, -finallyRect.width / 2, finallyRect.height, finallyRect.width);
        texture2d = null;
        var ret = nCanvas.toDataURL("image/jpeg",0.8);
        nCanvas = null;//nCanvas.remove();
        return ret;
    },

    getphtoMaxNum:function(){
        var num = 0 ;
        for(var j = 0; j < mainView.photoList.length; j++){
            if(mainView.photoList[j].getChildByTag(4).isVisible()){
                num++;
            }
        }
        return num;
    },

    setPhotoTitleView:function(titleH){
        var photoTitle = new cc.EditBox(cc.size(cc.winSize.width - 70, titleH),new cc.Scale9Sprite());
        photoTitle.setPlaceholderFontSize(36);
        photoTitle.setPlaceHolder("     質問を入力して下さい");
        photoTitle.setPlaceholderFontColor(cc.color.GRAY);
        photoTitle.setPosition(30, (titleH)/2);
        photoTitle.setMaxLength(16);
        photoTitle.setAnchorPoint(cc.p(0,0.5));
        photoTitle.setDelegate(this);
        photoTitle.setFontName(GAME_FONT.PRO_W3);
        photoTitle.setFontColor(cc.color(111,205,193,255));
        photoTitle.setFontSize(36);
        photoTitle.setAdd(true);
        return photoTitle;
    },

    addphotoListView:function(pH,BottomH){

        var dis = 10;
        var photoH = pH - 2*dis;
        var photoW = cc.winSize.width;
        var _w = this.IMAGE_WH,_h = this.IMAGE_WH;
        if(photoH < _w*2)
        {
            mainView.cuPhotoWH = _w = _h = photoH/2;
        }
        var arryXY = [
            -_w/2 - dis/2, _h/2 + 2*dis,
            _w/2 + dis/2, _h/2 + 2*dis,
            -_w/2 - dis/2, -_h/2 + dis,
            _w/2 + dis/2, -_h/2 + dis
        ];
        for(var i = 0; i < 4; i++){
            var photoLayout = new ccui.Layout();
            //photoLayout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            //photoLayout.setBackGroundColor(cc.color(115,115,115,255));
            photoLayout.setAnchorPoint(cc.p(0.5, 0.5));
            photoLayout.setPosition(photoW/2 + arryXY[2*i], photoH/2 + BottomH + arryXY[2*i +1]);
            photoLayout.setTag(i);
            photoLayout.setContentSize(_w, _h);
            //读取图片按钮
            var www = parseInt(_w+2);
            var hhh = parseInt(_h+2);
            var camraButton = new cc.LoadClientData(cc.size(www, hhh), 1, new cc.Scale9Sprite(MajorityVoteRes.setting_image_btn, cc.rect(0, 0, 292, 292), cc.rect(30, 30, 292 - 60, 292 - 60)));
            camraButton.setDelegate(this);
            camraButton.setAnchorPoint(cc.p(0.5,0.5));
            camraButton.setPosition(_w/2, _h/2);
            camraButton.setName(i);
            camraButton.setTag(5);
            photoLayout.addChild(camraButton);
            //读取的图片
            var photo = new cc.Sprite();
            photo.setVisible(false);
            photo.setAnchorPoint(cc.p(0.5, 0.5));
            photo.setPosition(_w/2, _h/2);
            photo.setName("");
            photo.setTag(4);
            photoLayout.addChild(photo);
            //删除图片按钮
            var delete_btn = new cc.Sprite(MajorityVoteRes.common_delete_p);
            delete_btn.setVisible(false);
            delete_btn.setAnchorPoint(cc.p(1.0, 1.0));
            delete_btn.setPosition(cc.p(_w, _h));
            delete_btn.setTag(1);
            if(mainView.cuPhotoWH)
                delete_btn.setScale(mainView.cuPhotoWH/this.IMAGE_WH,mainView.cuPhotoWH/this.IMAGE_WH);
            photoLayout.addChild(delete_btn);
            cc.eventManager.addListener(cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        target.getParent().getChildByTag(5).setVisible(true);
                        target.getParent().getChildByTag(4).setVisible(false);
                        target.getParent().getChildByTag(4).setName("");
                        target.getParent().getChildByTag(3).setVisible(false);
                        target.getParent().getChildByTag(2).setVisible(false);
                        target.setVisible(false);
                        return true;
                    }
                    return false;
                }
            }), delete_btn);
            //选中图片
            var photo_cover = new cc.Sprite(MajorityVoteRes.common_img_cover);
            photo_cover.setVisible(false);
            photo_cover.setAnchorPoint(cc.p(0.5, 0.5));
            photo_cover.setPosition(_w/2, _h/2);
            var s = 1.05;
            if(mainView.cuPhotoWH)
                photo_cover.setScale((mainView.cuPhotoWH/this.IMAGE_WH)*s,(mainView.cuPhotoWH/this.IMAGE_WH)*s);
            else
                photo_cover.setScale(s,s);
            photo_cover.setTag(3);
            photoLayout.addChild(photo_cover);
            //选中区域
            var photo_cover_layout = new ccui.Layout();
            photo_cover_layout.setVisible(false);
            photo_cover_layout.setTouchEnabled(true);
            photo_cover_layout.setContentSize(_w, _h);
            photo_cover_layout.setAnchorPoint(cc.p(0.5, 0.5));
            photo_cover_layout.setPosition(_w/2, _h/2);
            photo_cover_layout.setTag(2);
            photoLayout.addChild(photo_cover_layout);
            photo_cover_layout.addTouchEventListener(function (sender, type) {
                if(type == ccui.Widget.TOUCH_BEGAN){
                    for(var i = 0; i < mainView.photoList.length; i++){
                        if(sender.getParent().getChildByTag(3) == mainView.photoList[i].getChildByTag(3)){
                            sender.getParent().getChildByTag(3).setVisible(!sender.getParent().getChildByTag(3).isVisible());
                            if(sender.getParent().getChildByTag(3).isVisible())
                                mainView.cuSelected = i;
                            else
                                mainView.cuSelected = -1;
                        }else
                            mainView.photoList[i].getChildByTag(3).setVisible(false);
                    }
                }
            }, this);
            mainView.photoList.push(photoLayout);
        }
    }

});

var MajorityVoteScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MajorityVoteLayer();
        this.addChild(layer);
    }
});