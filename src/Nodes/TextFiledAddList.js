/**
 * Created by nhnst on 11/5/15.
 */
var TextFiledAddList = cc.Node.extend({
    titleInput:null,
    listView:null,
    isAddChanged:false,
    _maxList:null,

    _selectedCha:false,
    //_isShowPlus:true,
    _type:null,

    _addBtn:null,
    _addStr:null,
    _addIconIdx:null,
    /*
    * maxPerNum：能添加的最大list数量
    * x：x坐标
    * y：y坐标
    * contentH：listView高度
    * type default: GhostLegScene   0:SortilegeScene 1:        2: MajorityVoteScene
    * */
    ctor:function(maxList,y,type){
        this._super();

        this.initData(maxList,type);

        var _this = this;

        var screenSize = cc.director.getWinSize();

        var x = 0, contentH = screenSize.height - y;

        var backView = new cc.LayerColor(cc.color(255, 255, 255, 255), screenSize.width - 2*x, contentH);
        backView.setPosition(x, y);
        this.addChild(backView);
        var tStr = "参加者登録";
        var InputBackH = 180;
        var InputBackH1 = 0;
        switch(type){
            case 1:
                tStr = "罰ゲームの内容を決める";
                InputBackH = 120;
            break;
            case 2:
                tStr = "多数決項目登録";
                InputBackH = 120;
                InputBackH1 = 128;
                break;
            default:
                break;
        }
//TopArea
        var titleBack = new cc.LayerColor(cc.color("#6fcdc1"), backView.getContentSize().width, 100);
        titleBack.setPosition(0, backView.getContentSize().height - titleBack.getContentSize().height);
        backView.addChild(titleBack);
        //标题

        var titleName = new cc.LabelTTF(tStr,GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(cc.color("#fff3bf"));
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleBack.getContentSize().width>>1, titleBack.getContentSize().height>>1));
        titleBack.addChild(titleName);
        switch(type){
            case 2:
                var InputBack1 = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, InputBackH1);
                InputBack1.setPosition(0, backView.getContentSize().height - titleBack.getContentSize().height - InputBack1.getContentSize().height);
                backView.addChild(InputBack1);

                var name_random_field1 = new cc.EditBox(cc.size(InputBack1.getContentSize().width - 70, 100),new cc.Scale9Sprite());
                name_random_field1.setPlaceholderFontSize(36);
                name_random_field1.setPlaceHolder("     質問を入力して下さい");
                name_random_field1.setPosition(30, (InputBack1.getContentSize().height - 8)/2);
                name_random_field1.setMaxLength(16);
                name_random_field1.setPlaceholderFontColor(cc.color.GRAY);
                name_random_field1.setAnchorPoint(cc.p(0,0.5));
                name_random_field1.setDelegate(this);
                name_random_field1.setName("textFiled1");
                name_random_field1.setFontName(GAME_FONT.PRO_W3);
                name_random_field1.setFontColor(cc.color(111,205,193,255));
                name_random_field1.setFontSize(36);
                name_random_field1.setAdd(true);
                InputBack1.addChild(name_random_field1);
                _this.titleInput = name_random_field1;

                var cutoff1 = new cc.Sprite(GlobalRes.line_8);
                cutoff1.setAnchorPoint(cc.p(0,0));
                cutoff1.setPosition(0,contentH - titleBack.getContentSize().height - InputBack1.getContentSize().height);
                cutoff1.setScaleX(backView.getContentSize().width);
                backView.addChild(cutoff1);

                break;
            default:
                break;
        }
//InputArea
        var InputBack = new cc.LayerColor(cc.color("#ffffff"), backView.getContentSize().width, InputBackH);
        InputBack.setPosition(0, backView.getContentSize().height - titleBack.getContentSize().height - InputBack.getContentSize().height - InputBackH1);
        backView.addChild(InputBack);
        //选择人物按钮
        var cha_random_btn = new ccui.Button(GlobalRes.cha_thumb_random,GlobalRes.cha_thumb_random);
        cha_random_btn.setAnchorPoint(0, 0.5);
        cha_random_btn.setPosition(30, InputBack.getContentSize().height/2);
        cha_random_btn.setName("SelectCharacter");
        cha_random_btn.addClickEventListener(this.chaRandomBtnEvent);
        InputBack.addChild(cha_random_btn);
        //添加按钮
        var btnLayout = new ccui.Layout();
        btnLayout.setContentSize(150, InputBack.getContentSize().height);
        btnLayout.setAnchorPoint(1, 0);
        btnLayout.setName("addToList");
        btnLayout.setPosition(InputBack.getContentSize().width,0);
        btnLayout.setTouchEnabled(true);
        btnLayout.addClickEventListener(this.additionBtnEvent);
        btnLayout.setVisible(false);
        InputBack.addChild(btnLayout);
        this._addBtn = btnLayout;

        var addBtnSprite = new cc.Sprite(GlobalRes.addition_btn);
        addBtnSprite.setAnchorPoint(0.5, 0.5);
        addBtnSprite.setPosition(btnLayout.getContentSize().width>>1, btnLayout.getContentSize().height>>1);
        btnLayout.addChild(addBtnSprite);

        //名字输入框
        var name_random_field;
        switch(type){
            case 1:
                cha_random_btn.setVisible(false);
                name_random_field = new cc.EditBox(cc.size(InputBack.getContentSize().width - 40 - btnLayout.getContentSize().width, InputBackH),new cc.Scale9Sprite());
                name_random_field.setPlaceholderFontSize(36);
                name_random_field.setPlaceHolder("     罰則内容を入力してください");
                name_random_field.setPosition(30, InputBack.getContentSize().height/2);
                name_random_field.setMaxLength(16);
                this._selectedCha = true;
                name_random_field.setAdd(true);

                var fieldLavel = new cc.LabelTTF("罰則入力完了");
                fieldLavel.setFontName(GAME_FONT.PRO_W3);
                fieldLavel.setName("fieldLavel");
                fieldLavel.setFontSize(36);
                fieldLavel.setFontFillColor(cc.color("#c8c8c8"));
                fieldLavel.setAnchorPoint(0, 0.5);
                fieldLavel.setPosition(30, InputBack.getContentSize().height/2);
                InputBack.addChild(fieldLavel);
                fieldLavel.setVisible(false);
                break;
            case 2:
                cha_random_btn.setVisible(false);
                name_random_field = new cc.EditBox(cc.size(InputBack.getContentSize().width - 40 - btnLayout.getContentSize().width, InputBackH),new cc.Scale9Sprite());
                name_random_field.setPlaceholderFontSize(36);
                name_random_field.setPlaceHolder("     選択枠を追加してください");
                name_random_field.setPosition(30, InputBack.getContentSize().height/2);
                name_random_field.setMaxLength(16);
                this._selectedCha = true;
                name_random_field.setAdd(true);

                var fieldLavel = new cc.LabelTTF("名前入力完了");
                fieldLavel.setFontName(GAME_FONT.PRO_W3);
                fieldLavel.setName("fieldLavel");
                fieldLavel.setFontSize(36);
                fieldLavel.setFontFillColor(cc.color("#c8c8c8"));
                fieldLavel.setAnchorPoint(0, 0.5);
                fieldLavel.setPosition(30, InputBack.getContentSize().height/2);
                InputBack.addChild(fieldLavel);
                fieldLavel.setVisible(false);
                break;
            case 0:

                var filedBack = new cc.LayerColor(cc.color("#ffffff"), InputBack.getContentSize().width - 50 - cha_random_btn.getContentSize().width - btnLayout.getContentSize().width, InputBack.getContentSize().height);
                filedBack.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 20, 0);
                filedBack.setName("textFiledLavel");
                InputBack.addChild(filedBack);

                var btnText = new cc.LabelTTF("参加者を登録してください");
                btnText.setFontName(GAME_FONT.PRO_W3);
                btnText.setFontSize(36);
                btnText.setFontFillColor(cc.color("#c8c8c8"));
                btnText.setAnchorPoint(0, 0.5);
                btnText.setPosition(0, InputBack.getContentSize().height/2);
                filedBack.addChild(btnText);

                _this.setInputListener();

                name_random_field = new cc.EditBox(cc.size(InputBack.getContentSize().width - 50 - cha_random_btn.getContentSize().width - btnLayout.getContentSize().width, InputBackH),new cc.Scale9Sprite());
                name_random_field.setPlaceholderFontSize(36);
                name_random_field.setPlaceHolder("");
                name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 20, InputBack.getContentSize().height/2);
                name_random_field.setMaxLength(12);
                //this._isShowPlus = false;
                name_random_field.setVisible(false);
                break;
            default:
                name_random_field = new cc.EditBox(cc.size(InputBack.getContentSize().width - 100 - cha_random_btn.getContentSize().width - btnLayout.getContentSize().width, InputBackH),new cc.Scale9Sprite());
                name_random_field.setPlaceholderFontSize(36);
                name_random_field.setPlaceHolder("     名前を入力してください");
                name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30 + 30, InputBack.getContentSize().height/2);
                name_random_field.setMaxLength(12);
                name_random_field.setAdd(true);
                break;
        }
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setAnchorPoint(cc.p(0,0.5));
        name_random_field.setDelegate(this);
        name_random_field.setName("textFiled");
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111,205,193,255));
        name_random_field.setFontSize(36);
        //name_random_field.setVisible(false);
        InputBack.addChild(name_random_field);
//Line
        var cutoff;
        switch(type) {
            case 2:
                cutoff = new cc.Sprite(GlobalRes.line_50);
                cutoff.setAnchorPoint(cc.p(0, 0));
                cutoff.setPosition(0, contentH - titleBack.getContentSize().height - InputBack.getContentSize().height - InputBackH1 - cutoff.getContentSize().height);
                cutoff.setScaleX(backView.getContentSize().width);
                backView.addChild(cutoff);

                var count_label1 = new cc.LabelTTF("選択肢の数：２～10個登録可能");
                count_label1.setFontName(GAME_FONT.PRO_W3);
                count_label1.setFontSize(26);
                count_label1.setFontFillColor(cc.color(153,153,153,255));
                count_label1.setAnchorPoint(0.5, 0.5);
                count_label1.setPosition(cutoff.getPositionX() + backView.getContentSize().width/2, cutoff.getPositionY() + cutoff.getContentSize().height/2);
                backView.addChild(count_label1);

                break;
            default:
                cutoff = new cc.Sprite(GlobalRes.line_8);
                cutoff.setAnchorPoint(cc.p(0, 0.5));
                cutoff.setPosition(0, contentH - titleBack.getContentSize().height - InputBack.getContentSize().height - InputBackH1);
                cutoff.setScaleX(backView.getContentSize().width);
                //cutoff.setScaleY(0.25);
                backView.addChild(cutoff);
                break;
        }
//ListArea
        this.listView = new ccui.ListView();
        this.listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.listView.setAnchorPoint(cc.p(0,1));
        this.listView.setPosition(0,contentH - titleBack.getContentSize().height - InputBack.getContentSize().height - cutoff.getContentSize().height - InputBackH1);
        this.listView.setTouchEnabled(true);
        this.listView.setBounceEnabled(false);
        this.listView.setBackGroundColor(cc.color.WHITE);
        this.listView.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.listView.setName("listView");
        this.listView.setContentSize(cc.size(backView.getContentSize().width, contentH - titleBack.getContentSize().height - InputBack.getContentSize().height - cutoff.getContentSize().height - InputBackH1));
        //for (var i = 0; i < this._maxList; ++i) {
        //    this.listView.pushBackDefaultItem();
        //}
        backView.addChild(this.listView);

        var mask = new Mask();
        mask.setTag(3);
        mask.close();
        this.addChild(mask);


        return true;
    },

    initData:function(maxPerNum,type){
        this._maxList = maxPerNum;
        this._selectedCha = false;
        this._type = type;
    },

    editBoxEditingDidBegin: function (editBox) {
        cc.log("editBox " + editBox.getString() + " DidBegin !");
        //if(editBox.getName() == "textFiled" && editBox.getChildByTag(2))
        //    editBox.removeChildByTag(2);
    },

    editBoxEditingDidEnd: function (editBox) {
        if(editBox.getName() == "textFiled" && editBox.getString().length == 0){
            //this.drawPlus(editBox);
            var name_random_fieldLavel = editBox.getParent().getChildByName("textFiledLavel");
            if(name_random_fieldLavel){
                name_random_fieldLavel.setVisible(true);
                editBox.setVisible(false);
            }
        }

        cc.log("editBox " + editBox.getString() + " DidEnd !");
    },

    editBoxTextChanged: function (editBox, text) {
        if(editBox.getMaxLength())
            if(editBox.getString().length>editBox.getMaxLength())
                editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));

        if(editBox.getName() != "textFiled1"){
            if(text.length == 0)
                editBox.getParent().getChildByName("addToList").setVisible(false);
            else if(this._selectedCha)
                editBox.getParent().getChildByName("addToList").setVisible(true);
        }
    },

    editBoxReturn: function (editBox) {
        cc.log("editBox " + editBox.getString() + " was returned !");
    },

    chaRandomBtnEvent:function(sender){

        var cha_names = [
            "ブニャ",
            "ばにら",
            "ジェスタ",
            "かぱぱ",
            "くらのすけ",
            "くろまる",
            "コアらん",
            "ボス",
            "のぶこ",
            "ぴょこ",
            "とりざえもん",
            "だいなそー",
            "スキャット",
            "キノコの子",
            "うさぽん",
            "random"
        ];

        var _this = sender.getParent().getParent().getParent();
        var InputBack = sender.getParent();
        var name_random_field = sender.getParent().getChildByName("textFiled");
        var cha_random_btn = sender.getParent().getChildByName("SelectCharacter");
        var addition_btn = sender.getParent().getChildByName("addToList");
        var name_random_fieldLavel = sender.getParent().getChildByName("textFiledLavel");

        name_random_field.setVisible(false);


        var close_layout = new ccui.Layout();
        close_layout.setContentSize(cc.winSize.width, cc.winSize.height);
        close_layout.setAnchorPoint(0, 0);
        close_layout.setTag(4);
        close_layout.setTouchEnabled(true);
        close_layout.addClickEventListener(function(){
            cha_random_btn.loadTextureNormal(GlobalRes.cha_thumb_random);
            cha_random_btn.loadTexturePressed(GlobalRes.cha_thumb_random);
            addition_btn.setVisible(false);
            _this._selectedCha = false;
            name_random_fieldLavel.setVisible(true);
            _this.getChildByTag(3).close();
            close_layout.removeFromParent();

        });
        _this.addChild(close_layout);

        var cha_pop_layout = new ccui.Layout();
        cha_pop_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        cha_pop_layout.setBackGroundColor(cc.color(255,255,255,255));
        cha_pop_layout.setContentSize(570, 680);
        cha_pop_layout.setAnchorPoint(0.5,0.5);
        cha_pop_layout.setTouchEnabled(true);
        cha_pop_layout.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        close_layout.addChild(cha_pop_layout);

        var radioList = {};

        var searchIndex = function(list, index){
            var items = [];
            for(var i = 0 ; i < list.getItems().length; i++){
                if(list.getItem(i).getUserData().index == index){
                    items.push(list.getItem(i));
                }
            }
            return items;
        };
        var israndomblock = 0;
        var flagMax = 2;
        if(_this._type == 0) flagMax = 1;
        for(var i = 0 ; i < 16; i++){
            var flag = searchIndex(_this.listView, i).length;
            var image = "res/Global/cha_pop/cha_pop_" + PAD(i+1, 2) + "_off.png";
            var radio = new ccui.Button(image, image);
            radio.setAnchorPoint(0, 1);
            radio.setPosition(55 + (85 + 40)*parseInt(i%4), cha_pop_layout.getContentSize().height - 60 - (85 + 40)*parseInt(i/4) );
            radio.setUserData({icon:""+PAD(i+1, 2) , name:cha_names[i] , index:i});

            var radio_touchevent = function(node){
                if(radioList.current){
                    if(radioList.current.getUserData().icon === node.getUserData().icon){
                        return;
                    }
                    radioList.current.loadTextureNormal("res/Global/cha_pop/cha_pop_" + radioList.current.getUserData().icon + "_off.png");
                    radioList.current.loadTexturePressed("res/Global/cha_pop/cha_pop_" + radioList.current.getUserData().icon + "_off.png");
                }
                node.loadTextureNormal("res/Global/cha_pop/cha_pop_" + node.getUserData().icon + "_on.png");
                node.loadTexturePressed("res/Global/cha_pop/cha_pop_" + node.getUserData().icon + "_on.png");
                radioList.current = node;
                SoundManager.instance().playEffect(GhostLegRes.sound_normal_1);
                //if(node.getUserData().name == cha_names[14])
                //    SoundManager.instance().playEffect(GhostLegRes.sound_character_selected_1);
                //else if(node.getUserData().name == cha_names[0] ||
                //        node.getUserData().name == cha_names[1] ||
                //        node.getUserData().name == cha_names[8] ||
                //        node.getUserData().name == cha_names[4])
                //    SoundManager.instance().playEffect(GhostLegRes.sound_character_selected_2);
                //else if(node.getUserData().name == cha_names[7] ||
                //        node.getUserData().name == cha_names[6] ||
                //        node.getUserData().name == cha_names[11] ||
                //        node.getUserData().name == cha_names[2] ||
                //        node.getUserData().name == cha_names[3])
                //    SoundManager.instance().playEffect(GhostLegRes.sound_character_selected_3);
                //else if(node.getUserData().name == cha_names[9] ||
                //        node.getUserData().name == cha_names[5] ||
                //        node.getUserData().name == cha_names[10] ||
                //        node.getUserData().name == cha_names[12] ||
                //        node.getUserData().name == cha_names[13])
                //    SoundManager.instance().playEffect(GhostLegRes.sound_character_selected_4);
            }
            if(i == 15 && israndomblock == 15)flag = flagMax;
            if(flag < flagMax)
                radio.addClickEventListener(radio_touchevent);
            cha_pop_layout.addChild(radio);
            if(flag >= flagMax){
                israndomblock++;
                var sprite = new cc.Sprite("res/Scene/Grouping/cha_block.png");
                sprite.setAnchorPoint(0, 1);
                sprite.setPosition(55 + (radio.getContentSize().width + 40)*parseInt(i%4), cha_pop_layout.getContentSize().height - 60 - (radio.getContentSize().height + 40)*parseInt(i/4) );
                cha_pop_layout.addChild(sprite);
            }
        }

        var rect_layout = new ccui.Layout();
        rect_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        rect_layout.setBackGroundColor(cc.color(111,205,193,255));
        rect_layout.setContentSize(570, 100);
        rect_layout.setAnchorPoint(0,0);
        cha_pop_layout.addChild(rect_layout);
        var ok_btn = new ccui.Button();
        ok_btn.setContentSize(rect_layout.getContentSize().width, rect_layout.getContentSize().height);
        ok_btn.setTouchEnabled(true);
        ok_btn.setScale9Enabled(true);
        ok_btn.setTitleText("確認");
        ok_btn.setTitleFontName(GAME_FONT.PRO_W3);
        ok_btn.setTitleFontSize(36);
        ok_btn.setAnchorPoint(0.5,0.5);
        ok_btn.setPosition(rect_layout.getContentSize().width/2, rect_layout.getContentSize().height/2);
        var ok_btn_touchevent = function(){
            if(radioList.current){
                var obj = {};
                if(radioList.current.getUserData().name === "random"){
                    var index = Math.floor(Math.random()*15);
                    while(searchIndex(_this.listView, index).length == flagMax){
                        index = Math.floor(Math.random()*15);
                    }
                    if(flagMax == 1){
                        obj.icon = ""+PAD(index+1, 2);
                    }else{
                        if(searchIndex(_this.listView, index).length == 1){
                            if(searchIndex(_this.listView, index)[0].getUserData().icon.indexOf("_b") == -1){
                                obj.icon = ""+PAD(index+1, 2)+"_b";
                            }else{
                                obj.icon = ""+PAD(index+1, 2);
                            }
                        }else{
                            obj.icon = searchIndex(_this.listView, index).length == 0 ? ""+PAD(index+1, 2) : ""+PAD(index+1, 2)+"_b";
                        }
                    }

                    obj.name = cha_names[index];
                    obj.index = index;
                }else{
                    obj.index = radioList.current.getUserData().index;
                    if(flagMax == 1){
                        obj.icon = ""+PAD(obj.index+1, 2);
                    }else{
                        if(searchIndex(_this.listView, obj.index).length == 1){
                            if(searchIndex(_this.listView, obj.index)[0].getUserData().icon.indexOf("_b") == -1){
                                obj.icon = ""+PAD(obj.index+1, 2)+"_b";
                            }else{
                                obj.icon = ""+PAD(obj.index+1, 2);
                            }
                        }else{
                            obj.icon = searchIndex(_this.listView, obj.index).length == 0 ? ""+PAD(obj.index+1, 2) : ""+PAD(obj.index+1, 2)+"_b";
                        }
                    }

                    obj.name = radioList.current.getUserData().name;
                }
                sender.loadTextureNormal("res/Global/cha_pop/cha_thumb_" + obj.icon + ".png");
                sender.loadTexturePressed("res/Global/cha_pop/cha_thumb_" + obj.icon + ".png");
                sender.setUserData(obj);
                //sender.setAnchorPoint(0, 1);
                //sender.setPosition(30, cc.winSize.height-100-(180-cha_random_btn.getContentSize().height)/2);
                addition_btn.setVisible(true);
                if(1){
                    //直接获得焦点
                    name_random_field.removeFromParent();
                    name_random_field = new cc.EditBox(cc.size(InputBack.getContentSize().width - 80 - cha_random_btn.getContentSize().width - addition_btn.getContentSize().width, 80),
                        new cc.Scale9Sprite(),null,null,true);
                    name_random_field.setBodyStyle(1);
                    name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                    name_random_field.setPlaceholderFontSize(36);
                    name_random_field.setPlaceHolder("");
                    name_random_field.setAnchorPoint(cc.p(0,0.5));
                    name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 20, InputBack.getContentSize().height/2);
                    name_random_field.setDelegate(_this);
                    name_random_field.setName("textFiled");
                    name_random_field.setFontName(GAME_FONT.PRO_W3);
                    name_random_field.setFontColor(cc.color(111,205,193,255));
                    name_random_field.setFontSize(36);
                    name_random_field.setMaxLength(12);
                    name_random_field.setString(obj.name);
                    name_random_field.setUserData(obj.name);
                    InputBack.addChild(name_random_field);
                    //jquery.min.map
                    ok_btn = new ccui.Button();
                    ok_btn.setTitleText("確認");
                    //_this.scheduleOnce(function(){
                    name_random_field.setInputfocus();
                    //});
                }else{
                    name_random_field.setVisible(true);
                    name_random_field.setString(obj.name);
                    name_random_field.setUserData(obj.name);
                }
                name_random_fieldLavel.setVisible(false);
                _this._selectedCha = true;
            }else{
                sender.loadTextureNormal(GlobalRes.cha_thumb_random);
                sender.loadTexturePressed(GlobalRes.cha_thumb_random);
                addition_btn.setVisible(false);
                _this._selectedCha = false;
                name_random_fieldLavel.setVisible(true);
                //name_random_field.setVisible(true);
                //name_random_field.setString("");
            }
            cha_pop_layout.removeFromParent();
            close_layout.removeFromParent();
            _this.getChildByTag(3).close();

        };
        ok_btn.addClickEventListener(ok_btn_touchevent);
        rect_layout.addChild(ok_btn);
        _this.getChildByTag(3).open();

    },

    additionBtnEvent:function(sender){
        var _this = sender.getParent().getParent().getParent();
        var InputBack = sender.getParent();
        var name_random_field = sender.getParent().getChildByName("textFiled");
        var cha_random_btn = sender.getParent().getChildByName("SelectCharacter");
        var addition_btn = sender.getParent().getChildByName("addToList");
        var name_random_fieldLavel = sender.getParent().getChildByName("textFiledLavel");
        var fieldLavel = sender.getParent().getChildByName("fieldLavel");

        var listSize = _this.listView.getItems().length;

        if(listSize > _this._maxList - 1){
            alert("制限を超過しました");
        }else if(name_random_field.getString() && name_random_field.getString() == "" && !_this._addStr && !_this._addIconIdx){
            alert("名前に入力してください");
        }else if(!_this._selectedCha && !_this._addIconIdx){
            alert("チームを選択してください");
        }else if(_this._type == 1 || _this._type == 2){
            var layout = new ccui.Layout();
            layout.setContentSize(750, 122);
            var text = name_random_field.getString();
            //读取的数据
            if(_this._addStr) text = _this._addStr;
            var flag = new cc.LabelTTF(text);
            flag.setFontName(GAME_FONT.PRO_W3);
            flag.setFontSize(36);
            flag.setTag(1);
            flag.setFontFillColor(cc.color(111, 205, 193, 255));
            flag.setAnchorPoint(0, 0.5);
            flag.setPosition(30, layout.getContentSize().height/2);
            layout.addChild(flag);
            var delete_btn = new ccui.Button(GlobalRes.delete_png);
            delete_btn.setAnchorPoint(1, 0.5);
            delete_btn.setPosition(layout.getContentSize().width - 30, layout.getContentSize().height/2);
            var delete_btn_touchevent = function () {
                _this.listView.removeItem(_this.listView.getIndex(layout));
                _this.isAddChanged = true;
                if(fieldLavel){
                    fieldLavel.setVisible(false);
                    name_random_field.setVisible(true);
                }
            };
            delete_btn.addClickEventListener(delete_btn_touchevent);
            layout.addChild(delete_btn);

            var draw = new cc.DrawNode();
            var vertices = [cc.p(0, 0), cc.p(layout.getContentSize().width, 0) ];
            layout.addChild(draw);
            draw.drawPoly(vertices, null, 2, cc.color(200,200,200,77));//30%

            _this.listView.pushBackDefaultItem();
            _this.listView.pushBackCustomItem(layout);

            if(1){
                name_random_field.removeFromParent();
                name_random_field = new cc.EditBox(cc.size(InputBack.getContentSize().width - 40 - addition_btn.getContentSize().width, InputBack.getContentSize().height),new cc.Scale9Sprite());
                name_random_field.setPlaceholderFontSize(36);
                if(_this._type == 1)
                    name_random_field.setPlaceHolder("     罰則内容を入力してください");
                else if(_this._type == 2)
                    name_random_field.setPlaceHolder("     選択枠を追加してください");
                else
                    name_random_field.setPlaceHolder("     質問を入力してください");
                name_random_field.setPosition(30, InputBack.getContentSize().height/2);
                name_random_field.setMaxLength(16);
                name_random_field.setAdd(true);
                name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                name_random_field.setAnchorPoint(cc.p(0,0.5));
                name_random_field.setDelegate(_this);
                name_random_field.setName("textFiled");
                name_random_field.setFontName(GAME_FONT.PRO_W3);
                name_random_field.setFontColor(cc.color(111,205,193,255));
                name_random_field.setFontSize(36);
                InputBack.addChild(name_random_field);
            }else{
                name_random_field.setString("");
                name_random_field.setInputblur();
            }

            addition_btn.setVisible(false);
            _this.isAddChanged = true;
            //_this.drawPlus(name_random_field);

            if(fieldLavel && _this.listView.getItems().length == _this._maxList){
                fieldLavel.setVisible(true);
                name_random_field.setVisible(false);
            }

        }else{

            var data = {};
            if(_this._addIconIdx)//读取的数据
                data.icon = _this._addIconIdx;
            else
                data.icon = cha_random_btn.getUserData().icon;
            if(_this._addIconIdx)
                data.index = Number(data.icon) - 1;
            else
                data.index = cha_random_btn.getUserData().index;
            if(_this._addStr)//读取的数据
                data.name = _this._addStr;
            else
                data.name = name_random_field.getString();



            var layout = new ccui.Layout();
            layout.setUserData(data);
            layout.setContentSize(750, 182);
            var icon = new cc.Sprite("res/Global/cha_pop/cha_thumb_" + data.icon + ".png");
            icon.setTag(2);
            icon.setName(data.icon.toString());
            icon.setAnchorPoint(0, 0.5);
            icon.setPosition(30, layout.getContentSize().height - 90);
            layout.addChild(icon);

            var name = new cc.LabelTTF(data.name);
            name.setFontName(GAME_FONT.PRO_W6);
            name.setTag(1);
            name.setFontSize(36);
            name.setFontFillColor(cc.color(111, 205, 193, 255));
            name.setAnchorPoint(0, 0.5);
            name.setPosition(icon.getPosition().x + 124 + 30, icon.getPosition().y);
            layout.addChild(name);
            //var flag = new cc.LabelTTF("チーム");
            //flag.setFontName(GAME_FONT.PRO_W3);
            //flag.setFontSize(22);
            //flag.setFontFillColor(cc.color(111, 205, 193, 255));
            //flag.setAnchorPoint(0, 1);
            //flag.setPosition(icon.getPosition().x + 124 + 30, icon.getPosition().y - 2);
            //layout.addChild(flag);
            var delete_btn = new ccui.Button(GlobalRes.delete_png);
            delete_btn.setAnchorPoint(1, 0.5);
            delete_btn.setPosition(layout.getContentSize().width - 30, icon.getPosition().y);
            var delete_btn_touchevent = function () {
                _this.listView.removeItem(_this.listView.getIndex(layout));
                _this.isAddChanged = true;
                if(_this.listView.getItems().length == _this._maxList - 1){
                    cha_random_btn.setTouchEnabled(true);
                    _this.setInputListener();
                }
            };
            delete_btn.addClickEventListener(delete_btn_touchevent);
            layout.addChild(delete_btn);

            var cutoff = new cc.Sprite(GlobalRes.line_8);
            cutoff.setAnchorPoint(0, 0);
            cutoff.setScaleX(layout.getContentSize().width);
            cutoff.setScaleY(0.25);
            layout.addChild(cutoff);

            _this.listView.pushBackDefaultItem();
            _this.listView.pushBackCustomItem(layout);

            name_random_fieldLavel.setVisible(true);
            name_random_field.setInputblur();
            name_random_field.setVisible(false);
            addition_btn.setVisible(false);
            cha_random_btn.loadTextureNormal(GlobalRes.cha_thumb_random);
            cha_random_btn.loadTexturePressed(GlobalRes.cha_thumb_random);
            cha_random_btn.setUserData("");
            _this._selectedCha = false;
            _this.isAddChanged = true;

            if(_this.listView.getItems().length == _this._maxList){
                cha_random_btn.setTouchEnabled(false);
                cc.eventManager.removeListeners(name_random_fieldLavel);
            }

        }
        _this._addStr = null;
        _this._addIconIdx = null;
    },

    setInputListener:function(){
        var _this = this;
        var InputBack = this._addBtn.getParent();
        var filedBack = InputBack.getChildByName("textFiledLavel");
        if(_this.listView && _this.listView.getItems().length == _this._maxList)
            return;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    //cc.eventManager.removeListener(this);
                    _this.chaRandomBtnEvent(InputBack.getChildByName("SelectCharacter"));
                    return true;
                }
                return false;
            }
        }), filedBack);
    },

    getListChildernIcon:function(index){
        return this.listView.getItem(index).getChildByTag(2).getName();
    },

    getListChildern:function(index){
        return this.listView.getItem(index).getChildByTag(1).getString();
    },

    setListChildern:function(str,iconIdx){
        this._addStr = str;
        if(iconIdx)
            this._addIconIdx = iconIdx;
        this.additionBtnEvent(this._addBtn);
    },

    getTitleString:function(){
        if(this._type == 2){
            return this.titleInput.getString();
        }

    },

    setTitleString:function(str){
        if(this._type == 2){
            return this.titleInput.setString(str);
        }

    }

});