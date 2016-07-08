/**
 * Created by nhnst on 11/4/15.
 * AngelsAndDemonsDutchpay.js
 * 천사와 악마의 더치페이（天使与恶魔的AA制）
 */
var ADDutchpayLayer = cc.LayerColor.extend({

    STATE_MAIN:0,
    STATE_EQUAL:1,
    STATE_RANDOM:2,
    STATE_ANGEL:3,
    STATE_ANGEL_RESULT:4,
    m_state : 0,
    m_isResult:false,
    m_back_func:null,

    ctor:function () {
        this._super(cc.color(255,255,255,255));

        this.loadMainView();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.ADDutchpay);

        Utility.sendXhr(GAME_TYPE.ADDutchpay.gameid);

        return true;
    },

    update:function(){
        var context = this;
        if(Utility.checkRfresh){
            switch (context.m_state){
                case context.STATE_MAIN:
                    context.getChildByName("toolBar").setPosition(cc.p(0, cc.winSize.height));
                    context.getChildByName("bgAnimation").setPosition(cc.p(0, cc.winSize.height - 100));
                    context.getChildByName("history").setPosition(cc.p(0, cc.winSize.height-100-450));
                    break;
            }
            Utility.checkRfresh = false;
        }
    },

    loadMainView : function(){
        this.removeAllChildren();
        this.m_state = this.STATE_MAIN;
        var toolbar = new Toolbar(GAME_TYPE.ADDutchpay);
        toolbar.setTag(101);
        toolbar.setName("toolBar");
        toolbar.setAnchorPoint(cc.p(0,1));
        toolbar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolbar, 9999);

        var bg1 = new cc.Sprite(ADDutchpayRes.bg);
        bg1.setAnchorPoint(cc.p(0, 0));
        bg1.setPosition(cc.p(0, 0));
        this.addChild(bg1);

        var top_000 = new cc.Sprite();
        top_000.setAnchorPoint(0, 1);
        top_000.setPosition(0, cc.winSize.height-100);
        var frames = [];
        for(var i = 0 ; i < 15; i++){
            frames.push(new cc.SpriteFrame("res/Scene/ADDutchpay/top_" + (i+1) + ".png", new cc.Rect(0, 0, 750, 450)));
        }
        var animation = new cc.Animation(frames, 0.2);
        var animate = cc.animate(animation);
        top_000.runAction(new cc.Sequence(animate).repeatForever());
        top_000.setName("bgAnimation");
        this.addChild(top_000);

        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(true);
        listView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - 450));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height-100-450);
        listView.setBreakPoint(100);
        listView.setName("history");
        //listView.setAutoScrollEnable(false);
        this.addChild(listView);

        var historys = DataManager.instance().getHistory(GAME_TYPE.ADDutchpay);
        if(historys){
            for(var i = historys.size()-1 ; i > -1 ;i--){
                var _this = this;
                var all_layout = new ccui.Layout();
                var layout = new ccui.Layout();
                layout.setTouchEnabled(true);
                layout.setContentSize(cc.winSize.width, 156);
                layout.setUserData(historys.get(i));
                all_layout.setContentSize(cc.winSize.width, layout.getContentSize().height);
                all_layout.addChild(layout);

                var line = new ccui.Layout();
                line.setContentSize(cc.winSize.width + 302, 1);
                line.setAnchorPoint(0, 0);
                line.setPosition(0, 0);
                line.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                line.setBackGroundColor(cc.color(255,243,191,255));
                layout.addChild(line);

                var bg = new ccui.Layout();
                bg.setContentSize(cc.winSize.width, 156);
                bg.setAnchorPoint(0, 0);
                bg.setPosition(302, 0);
                bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                bg.setBackGroundColor(cc.color(111,205,193,255));
                bg.setTag(99);
                bg.setVisible(false);
                layout.addChild(bg);

                var btnImage;
                switch (historys.get(i).data.mode){
                    case "angel":
                        btnImage = ADDutchpayRes.angel_list_btn;
                        break;
                    case "equal":
                        btnImage = ADDutchpayRes.equal_list_btn;
                        break;
                    case "random":
                        btnImage = ADDutchpayRes.random_list_btn;
                        break;
                }

                var topY = (layout.getContentSize().height - (40 + 30 + 10))/2;

                var list_sprite = new cc.Sprite(btnImage);
                list_sprite.setAnchorPoint(0, 1);
                list_sprite.setPosition(30, layout.getContentSize().height - topY);
                layout.addChild(list_sprite);

                var date = new cc.LabelTTF(""+historys.get(i).month + "." + historys.get(i).day);
                date.setFontName(GAME_FONT.PRO_W3);
                date.setFontSize(30);
                date.setFontFillColor(cc.color(255, 243, 191));
                date.setScanPhixelRGB();
                date.setAnchorPoint(1, 1);
                date.setPosition(layout.getContentSize().width-30, layout.getContentSize().height - topY);
                layout.addChild(date);

                var gourpname = new cc.LabelTTF(historys.get(i).data.title);
                gourpname.setFontName(GAME_FONT.PRO_W6);
                gourpname.setFontSize(40);
                gourpname.setFontFillColor(cc.color(255, 243, 191));
                gourpname.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                gourpname.setScanPhixelRGB();
                gourpname.setContentSize(layout.getContentSize().width - list_sprite.getContentSize().width - 30 - 30 - 30 - 30 - date.getContentSize().width, gourpname.getContentSize().height);
                gourpname.setAnchorPoint(0, 1);
                gourpname.setPosition(list_sprite.getContentSize().width + 30 + 30, layout.getContentSize().height - topY);
                gourpname.setTextWidth(layout.getContentSize().width - list_sprite.getContentSize().width - 30 - 30 - 30 - 30 - date.getContentSize().width);
                layout.addChild(gourpname);

                if(historys.get(i).data.mode !== "equal"){
                    str = "";
                    for(j = 0; j < historys.get(i).data.names.length; j++){
                        if(j==historys.get(i).data.names.length-1){
                            str+=historys.get(i).data.names[j];
                        }else{
                            str+=historys.get(i).data.names[j]+"、";
                        }
                    }
                    var membername = new cc.LabelTTF(str);
                    membername.setFontName(GAME_FONT.PRO_W3);
                    membername.setFontSize(30);
                    membername.setFontFillColor(cc.color(255, 243, 191));
                    membername.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                    membername.setScanPhixelRGB();
                    membername.setContentSize(layout.getContentSize().width - list_sprite.getContentSize().width - 30 - 30 - 30 - 30 - date.getContentSize().width, membername.getContentSize().height);
                    membername.setAnchorPoint(0, 1);
                    membername.setPosition(list_sprite.getContentSize().width + 30 + 30, gourpname.getPositionY() - gourpname.getFontSize() - 10);
                    membername.setTextWidth(layout.getContentSize().width - list_sprite.getContentSize().width - 30 - 30 - 30 - 30 - date.getContentSize().width);
                    layout.addChild(membername);
                }


                var replay_layout = new ccui.Layout();
                replay_layout.setContentSize(150, layout.getContentSize().height-1);
                replay_layout.setAnchorPoint(0, 0);
                replay_layout.setPosition(layout.getContentSize().width, 1);
                replay_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                replay_layout.setBackGroundColor(cc.color(72,133,146,255));
                layout.addChild(replay_layout);
                var replay_btn = new ccui.Button(GlobalRes.history_replay_btn, GlobalRes.history_replay_btn);
                replay_btn.setAnchorPoint(0.5, 1);
                replay_btn.setPosition(replay_layout.getContentSize().width/2, replay_layout.getContentSize().height - 40);
                replay_btn.setUserData({data:historys.get(i).data});
                var replay_event = function(node){
                    if(node.getUserData().data.mode === "equal"){
                        _this.loadEqualView({title:node.getUserData().data.title, money:node.getUserData().data.money, number:node.getUserData().data.number}, false);
                    }else if(node.getUserData().data.mode === "random"){
                        _this.loadRandomView({title:node.getUserData().data.title, money:node.getUserData().data.money, number:node.getUserData().data.number, off:node.getUserData().data.off, names:node.getUserData().data.names}, false);
                    }else if(node.getUserData().data.mode === "angel"){
                        _this.loadAngelView(node.getUserData().data);
                    }
                };
                replay_btn.addClickEventListener(replay_event);
                replay_layout.addChild(replay_btn);
                var replay_label = new cc.LabelTTF("やり直し");
                replay_label.setFontName(GAME_FONT.PRO_W3);
                replay_label.setFontSize(22);
                replay_label.setFontFillColor(cc.color(255, 243, 191));
                replay_label.setScanPhixelRGB();
                replay_label.setAnchorPoint(0.5, 1);
                replay_label.setPosition(replay_btn.getPosition().x, replay_btn.getPosition().y - replay_btn.getContentSize().height - 10);
                replay_layout.addChild(replay_label);


                var history_layout = new ccui.Layout();
                history_layout.setContentSize(2, layout.getContentSize().height-1);
                history_layout.setAnchorPoint(0, 0.5);
                history_layout.setPosition(layout.getContentSize().width + replay_layout.getContentSize().width, layout.getContentSize().height/2);
                history_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                history_layout.setBackGroundColor(cc.color(72,133,146,255));
                layout.addChild(history_layout);

                var history_line = new cc.Sprite(GlobalRes.history_line);
                history_line.setAnchorPoint(0, 0.5);
                history_line.setPosition(layout.getContentSize().width + replay_layout.getContentSize().width, layout.getContentSize().height/2);
                layout.addChild(history_line);

                var delete_layout = new ccui.Layout();
                delete_layout.setContentSize(150, layout.getContentSize().height-1);
                delete_layout.setAnchorPoint(0, 0);
                delete_layout.setPosition(layout.getContentSize().width + replay_layout.getContentSize().width + history_line.getContentSize().width, 1);
                delete_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                delete_layout.setBackGroundColor(cc.color(72,133,146,255));
                layout.addChild(delete_layout);
                var delete_btn = new ccui.Button(GlobalRes.history_delete_btn, GlobalRes.history_delete_btn);
                delete_btn.setAnchorPoint(0.5, 1);
                delete_btn.setPosition(delete_layout.getContentSize().width/2, delete_layout.getContentSize().height - 40);
                delete_btn.setUserData({time:historys.get(i).time, item:all_layout});
                var delete_event = function(node){
                    DataManager.instance().deleteHistory(GAME_TYPE.LoveRedLine, node.getUserData().time);
                    listView.removeLastItem();
                    listView.removeItem(listView.getIndex(node.getUserData().item));
                    var empty = new ccui.Layout();
                    empty.setContentSize(cc.winSize.width, listView.getItems().length>=3 ? 250 : 0);
                    listView.pushBackCustomItem(empty);
                };
                delete_btn.addClickEventListener(delete_event);
                delete_layout.addChild(delete_btn);
                var delete_label = new cc.LabelTTF("削除");
                delete_label.setFontName(GAME_FONT.PRO_W3);
                delete_label.setFontSize(22);
                delete_label.setFontFillColor(cc.color(255, 243, 191));
                delete_label.setScanPhixelRGB();
                delete_label.setAnchorPoint(0.5, 1);
                delete_label.setPosition(delete_btn.getPosition().x, delete_btn.getPosition().y - delete_btn.getContentSize().height - 10);
                delete_layout.addChild(delete_label);

                layout.setAnchorPoint(0, 0);
                layout.setPosition(0, 0);
                var listener1 = function(sender, event){
                    switch (event){
                        case ccui.Widget.TOUCH_BEGAN:
                            sender.isMoved = false;
                            break;
                        case ccui.Widget.TOUCH_MOVED:
                            if(sender.getTouchBeganPosition().x - sender.getTouchMovePosition().x < - 100){
                                if(sender.pos == 1 && !sender.isAction){
                                    sender.isAction = true;
                                    var cb = function(){
                                        sender.isAction = false;
                                        sender.pos = 0;
                                    };
                                    var action = new cc.Sequence(new cc.MoveTo(0.2, {x:0, y:sender.getPosition().y}), new cc.CallFunc(cb));
                                    sender.runAction(action);
                                    sender.getChildByTag(99).setVisible(false);
                                }
                            }else if(sender.getTouchBeganPosition().x - sender.getTouchMovePosition().x > 100){
                                if(sender.pos == 0 && !sender.isAction){
                                    sender.isAction = true;
                                    cb = function(){
                                        sender.isAction = false;
                                        sender.pos = 1;
                                        sender.getChildByTag(99).setVisible(true);
                                    };
                                    action = new cc.Sequence(new cc.MoveTo(0.2, {x:-302, y:sender.getPosition().y}), new cc.CallFunc(cb));
                                    sender.runAction(action);
                                }
                            }
                            break;
                        case ccui.Widget.TOUCH_ENDED:
                            if(!sender.isMoved && sender.pos == 0){
                                var year = sender.getUserData().year;
                                var month = sender.getUserData().month;
                                var day = sender.getUserData().day;
                                if(sender.getUserData().data.mode === "equal"){
                                    _this.loadEqualResultView({title:sender.getUserData().data.title, money:sender.getUserData().data.money, number:sender.getUserData().data.number});
                                }else if(sender.getUserData().data.mode === "random"){
                                    _this.loadRandomView({title:sender.getUserData().data.title, money:sender.getUserData().data.money, number:sender.getUserData().data.number, off:sender.getUserData().data.off, names:sender.getUserData().data.names}, true);
                                }else if(sender.getUserData().data.mode === "angel"){
                                    _this.loadAngelResultView(sender.getUserData().data,true);
                                }
                            }
                            break;
                    }
                };
                layout.addTouchEventListener(listener1);
                layout.pos = 0;
                layout.isAction = false;

                listView.pushBackDefaultItem();
                listView.pushBackCustomItem(all_layout);
            }

            var empty = new ccui.Layout();
            empty.setContentSize(cc.winSize.width, historys.size()>=3 ? 250 : 0);
            listView.pushBackCustomItem(empty);
        }

        var mask = new Mask();
        mask.setTag(100);
        mask.close();
        this.addChild(mask);

        var mode_Btn = new ccui.Button(GroupingRes.start_btn, GroupingRes.start_btn);
        mode_Btn.setTag(0);
        mode_Btn.setAnchorPoint(cc.p(1, 0));
        mode_Btn.setPosition(cc.p(cc.winSize.width-22, 30));
        var _this = this;
        mode_Btn.addClickEventListener(function(){_this.modeBtnCallback(mode_Btn);});
        this.addChild(mode_Btn);
    },

    loadEqualView : function(obj, is) {
        this.m_state = this.STATE_EQUAL;
        var _this = this;
        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255, 255, 255, 255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(cc.p(0, 1));
        title.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("均等モード");
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255, 243, 191, 255));
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width >> 1, cc.winSize.height - 50));
        this.addChild(titleName);
        var delegate = {};
        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        //名字输入框
        var name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 100, 120), new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    タイトルを入力してください");
        name_random_field.setAdd(true);
        name_random_field.setDelegate(delegate);
        name_random_field.setAnchorPoint(cc.p(0.5, 1));
        name_random_field.setPosition(cc.winSize.width / 2, cc.winSize.height - 100);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        name_random_field.setTag(1);
        this.addChild(name_random_field);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120);
        this.addChild(cutoff);

        var delegate = {};
        delegate.editBoxEditingDidEnd = function(editBox){
            if(editBox.getString() !== "" && parseInt(editBox.getString()) < 100){
                editBox.setString("100");
            }
        };
        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        //金额
        name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 100, 120), new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    合計金額を入力してください");
        name_random_field.setAdd(true);
        name_random_field.setAnchorPoint(cc.p(0.5, 1));
        name_random_field.setPosition(cc.winSize.width / 2, cc.winSize.height - 100 - 120 - 8);
        name_random_field.setDelegate(delegate);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(36);
        name_random_field.setNumberOnly(true);
        name_random_field.setMaxLength(16);
        name_random_field.setTag(2);
        this.addChild(name_random_field);

        cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120);
        this.addChild(cutoff);

        {//修改android 数字键盘时，跳掉URL焦点BUG
            var delegate = {};
            delegate.editBoxEditingDidBegin = function(editBox){
                _field.setInputblur();
            };
            var _field = new cc.EditBox(cc.size(5, 5), new cc.Scale9Sprite());
            _field.setPosition(-5, cc.winSize.height - 100 - 120 - 8 - 100);
            _field.setDelegate(delegate);
            this.addChild(_field);
        }

        var scrollNum = new ScrollNum(2, 31, obj?obj.number:4 , 0);
        scrollNum.setAnchorPoint(0.5, 1);
        scrollNum.setPosition(cc.winSize.width / 2, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122 / 2);
        this.addChild(scrollNum);

        cutoff = new cc.Sprite(GlobalRes.line_50);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122);
        this.addChild(cutoff);

        var label = new cc.LabelTTF("人數を選択してください");
        label.setAnchorPoint(0.5, 0.5);
        label.setPosition(cc.winSize.width / 2, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122 - 25);
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(25);
        label.setFontFillColor(cc.color(200, 200, 200, 255));
        this.addChild(label);

        var showResult = function(){
            _this.getChildByTag(1).setVisible(false);
            _this.getChildByTag(2).setVisible(false);
            var mask = new Mask();
            _this.addChild(mask);

            _this.m_isResult = true;
            var cancel = function(){
                _this.m_isResult = false;
                _this.getChildByTag(1).setVisible(true);
                _this.getChildByTag(2).setVisible(true);
                _this.removeChild(mask);
                _this.removeChild(cancel_layout);
                _this.removeChild(layout);
            };

            _this.m_back_func = cancel;

            var cancel_layout = new ccui.Layout();
            cancel_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            cancel_layout.setAnchorPoint(0, 0);
            cancel_layout.setTouchEnabled(true);
            cancel_layout.addClickEventListener(cancel);
            _this.addChild(cancel_layout);

            var moneyValue = parseInt(_this.getChildByTag(2).getString());
            var equalValue = parseInt(moneyValue/scrollNum.getNumber());
            var changeValue = moneyValue%scrollNum.getNumber();

            var layout = new RoundRect(640, 700);
            layout.setAnchorPoint(0.5, 0.5);
            layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);

            var title_bg = new ccui.Layout();
            title_bg.setContentSize(640, 100);
            title_bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            title_bg.setBackGroundColor(cc.color("#fdfcf3"));
            title_bg.setAnchorPoint(0.5, 1);
            title_bg.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height);
            layout.addChild(title_bg);

            var title = new cc.LabelTTF("");
            title.setFontName(GAME_FONT.PRO_W3);
            title.setFontSize(32);
            title.setFontFillColor(cc.color(200, 200, 200, 255));
            title.setAnchorPoint(0.5, 0.5);
            title.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 50);
            title.setString(_this.getChildByTag(1).getString());
            layout.addChild(title);

            var cutoff = new ccui.Layout();
            cutoff.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cutoff.setBackGroundColor(cc.color("#6fcdc1"));
            cutoff.setAnchorPoint(0, 1);
            cutoff.setPosition(0, layout.getContentSize().height - 100);
            cutoff.setContentSize(layout.getContentSize().width, 2);
            layout.addChild(cutoff);

            var label1 = new cc.LabelTTF("１人あたりの支払金額");
            label1.setFontName(GAME_FONT.PRO_W3);
            label1.setFontSize(40);
            label1.setFontFillColor(cc.color("#6fcdc1"));
            label1.setAnchorPoint(0.5, 1);
            label1.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100-2-80);
            label1.setScanPhixelRGB();
            layout.addChild(label1);

            var money1 = new cc.LabelTTF("￥000");
            money1.setFontName(GAME_FONT.PRO_W6);
            money1.setFontSize(80);
            money1.setFontFillColor(cc.color("#6fcdc1"));
            money1.setAnchorPoint(0.5, 1);
            money1.setPosition(layout.getContentSize().width>>1, label1.getPosition().y - label1.getContentSize().height-30);
            money1.setScanPhixelRGB();
            money1.setString("￥" + equalValue);
            layout.addChild(money1);

            var label2 = new cc.LabelTTF("あまり");
            label2.setFontName(GAME_FONT.PRO_W3);
            label2.setFontSize(40);
            label2.setFontFillColor(cc.color("#6fcdc1"));
            label2.setAnchorPoint(0.5, 1);
            label2.setPosition(layout.getContentSize().width>>1, money1.getPosition().y - money1.getContentSize().height-70);
            label2.setScanPhixelRGB();
            layout.addChild(label2);

            var money2 = new cc.LabelTTF("￥000");
            money2.setFontName(GAME_FONT.PRO_W6);
            money2.setFontSize(80);
            money2.setFontFillColor(cc.color("#6fcdc1"));
            money2.setAnchorPoint(0.5, 1);
            money2.setPosition(layout.getContentSize().width>>1, label2.getPosition().y - label2.getContentSize().height-30);
            money2.setScanPhixelRGB();
            money2.setString("￥" + changeValue);
            layout.addChild(money2);

            var home_btn_touchevent = function(){
                var mask1 = new Mask();
                _this.addChild(mask1);
                mask1.open();

                var pop_layout = new RoundRect(570, 40+30+60+40+100+30);
                pop_layout.setAnchorPoint(0.5, 0.5);
                pop_layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
                _this.addChild(pop_layout);

                //var pop_layout = new ccui.Layout();
                //pop_layout.setAnchorPoint(0.5, 0.5);
                //pop_layout.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                //pop_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                //pop_layout.setBackGroundColor(cc.color(255,255,255,255));
                //_this.addChild(pop_layout);

                var label = new cc.LabelTTF("結果を保存しますか?");
                label.setFontName(GAME_FONT.PRO_W3);
                label.setFontSize(30);
                label.setFontFillColor(new cc.Color(111,205,193,255));
                label.setScanPhixelRGB();
                label.setAnchorPoint(0.5, 1);
                pop_layout.setContentSize(570, 40+30+60+40+100+label.getContentSize().height);
                label.setPosition(pop_layout.getContentSize().width>>1, pop_layout.getContentSize().height - 80);
                pop_layout.addChild(label);


                var save_btn = new ccui.Button(GlobalRes.color_b0e2cf, GlobalRes.color_b0e2cf);
                save_btn.setScale(285, 100);
                save_btn.setAnchorPoint(0, 0);
                save_btn.setPosition(285, 0);
                pop_layout.addChild(save_btn);

                var save_callback = function(){
                    var history = {};
                    history.mode = "equal";
                    history.title = _this.getChildByTag(1).getString();
                    history.money = _this.getChildByTag(2).getString();
                    history.number = scrollNum.getNumber();
                    DataManager.instance().createHistory(GAME_TYPE.ADDutchpay, history);
                    _this.loadMainView();
                };
                save_btn.addClickEventListener(save_callback);

                var cancel_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
                cancel_btn.setScale(285, 100);
                cancel_btn.setAnchorPoint(0, 0);
                cancel_btn.setPosition(0, 0);
                pop_layout.addChild(cancel_btn);

                var cancel_callback = function(){
                    _this.loadMainView();
                };
                cancel_btn.addClickEventListener(cancel_callback);

                var save_text = new cc.LabelTTF("保存");
                save_text.setFontName(GAME_FONT.PRO_W6);
                save_text.setFontSize(30);
                save_text.setFontFillColor(cc.color(255,255,255,255));
                save_text.setScanPhixelRGB();
                save_text.setAnchorPoint(0.5, 0.5);
                save_text.setPosition(285 + 285/2, 50);
                pop_layout.addChild(save_text);

                var cancel_text = new cc.LabelTTF("キャンセル");
                cancel_text.setFontName(GAME_FONT.PRO_W6);
                cancel_text.setFontSize(30);
                cancel_text.setFontFillColor(cc.color(255,255,255,255));
                cancel_text.setScanPhixelRGB();
                cancel_text.setAnchorPoint(0.5, 0.5);
                cancel_text.setPosition(285/2, 50);
                pop_layout.addChild(cancel_text);
            };

            var home_btn = new ccui.Layout();
            home_btn.setContentSize(320, 100);
            home_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            home_btn.setBackGroundColor(cc.color("#6fcdc1"));
            home_btn.setAnchorPoint(0, 0);
            home_btn.setPosition(layout.getContentSize().width>>1, 0);
            home_btn.setTouchEnabled(true);
            home_btn.addClickEventListener(home_btn_touchevent);
            layout.addChild(home_btn);

            var home_btn_text = new cc.LabelTTF("ホーム");
            home_btn_text.setFontName(GAME_FONT.PRO_W3);
            home_btn_text.setFontSize(26);
            home_btn_text.setFontFillColor(cc.color("#ffffff"));
            home_btn_text.setAnchorPoint(0.5, 0.5);
            home_btn_text.setPosition(home_btn.getContentSize().width>>1, home_btn.getContentSize().height>>1);
            home_btn_text.setScanPhixelRGB();
            home_btn.addChild(home_btn_text);

            var cancel_btn = new ccui.Layout();
            cancel_btn.setContentSize(320, 100);
            cancel_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cancel_btn.setBackGroundColor(cc.color("#b0e2cf"));
            cancel_btn.setAnchorPoint(0, 0);
            cancel_btn.setPosition(0, 0);
            cancel_btn.setTouchEnabled(true);
            cancel_btn.addClickEventListener(cancel);
            layout.addChild(cancel_btn);

            var cancel_btn_text = new cc.LabelTTF("やり直す");
            cancel_btn_text.setFontName(GAME_FONT.PRO_W3);
            cancel_btn_text.setFontSize(26);
            cancel_btn_text.setFontFillColor(cc.color("#ffffff"));
            cancel_btn_text.setAnchorPoint(0.5, 0.5);
            cancel_btn_text.setPosition(cancel_btn.getContentSize().width>>1, cancel_btn.getContentSize().height>>1);
            cancel_btn_text.setScanPhixelRGB();
            cancel_btn.addChild(cancel_btn_text);


            //var clipNode = new cc.ClippingNode(new cc.Sprite(ADDutchpayRes.roundrect_mask_640X700));
            //clipNode.setAnchorPoint(0.5, 0.5);
            //clipNode.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            //clipNode.addChild(layout);
            _this.addChild(layout);
        };


        var next_btn = new ccui.Layout();
        next_btn.setContentSize(200, 80);
        next_btn.setAnchorPoint(0.5, 0);
        next_btn.setPosition(cc.winSize.width/2, 30);
        next_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        next_btn.setBackGroundColor(cc.color("#c8c8c8"));
        next_btn.setTouchEnabled(true);
        next_btn.setTag(3);
        next_btn.addClickEventListener(showResult);
        this.addChild(next_btn);

        var next_btn_text = new cc.LabelTTF("計算");
        next_btn_text.setAnchorPoint(0.5, 0.5);
        next_btn_text.setPosition(100, 40);
        next_btn_text.setFontName(GAME_FONT.PRO_W3);
        next_btn_text.setFontSize(26);
        next_btn_text.setFontFillColor(cc.color(255, 255, 255, 255));
        next_btn_text.setScanPhixelRGB();
        next_btn.addChild(next_btn_text);

        cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 0);
        cutoff.setPosition(0, 140);
        this.addChild(cutoff);

        var callback = function(){
            if(_this.getChildByTag(1).getString()!=="" && _this.getChildByTag(2).getString()!==""){
                _this.getChildByTag(3).setBackGroundColor(cc.color("#6fcdc1"));
                _this.getChildByTag(3).setTouchEnabled(true);
            }else{
                _this.getChildByTag(3).setBackGroundColor(cc.color("#c8c8c8"));
                _this.getChildByTag(3).setTouchEnabled(false);
            }
        };

        title.schedule(callback, 0 ,cc.REPEAT_FOREVER);

        if(obj){
            this.getChildByTag(1).setString(obj.title);
            this.getChildByTag(2).setString(obj.money);
        }

        if(is){
            showResult();
        }

    },

    loadEqualResultView : function(obj){
        var _this = this;
        var mask = new Mask();
        _this.addChild(mask);

        _this.m_isResult = true;
        var cancel = function(){
            _this.m_isResult = false;
            _this.removeChild(mask);
            _this.removeChild(cancel_layout);
            _this.removeChild(layout);
        };

        _this.m_back_func = cancel;

        var cancel_layout = new ccui.Layout();
        cancel_layout.setContentSize(cc.winSize.width, cc.winSize.height);
        cancel_layout.setAnchorPoint(0, 0);
        cancel_layout.setTouchEnabled(true);
        cancel_layout.addClickEventListener(cancel);
        _this.addChild(cancel_layout);

        var moneyValue = parseInt(obj.money);
        var equalValue = parseInt(moneyValue/obj.number);
        var changeValue = moneyValue%obj.number;

        var layout = new RoundRect(640, 700);
        layout.setAnchorPoint(0.5, 0.5);
        layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);

        var title_bg = new ccui.Layout();
        title_bg.setContentSize(640, 100);
        title_bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        title_bg.setBackGroundColor(cc.color("#fdfcf3"));
        title_bg.setAnchorPoint(0.5, 1);
        title_bg.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height);
        layout.addChild(title_bg);

        var title = new cc.LabelTTF("");
        title.setFontName(GAME_FONT.PRO_W3);
        title.setFontSize(32);
        title.setFontFillColor(cc.color(200, 200, 200, 255));
        title.setAnchorPoint(0.5, 0.5);
        title.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 50);
        title.setString(obj.title);
        layout.addChild(title);

        var cutoff = new ccui.Layout();
        cutoff.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        cutoff.setBackGroundColor(cc.color("#6fcdc1"));
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, layout.getContentSize().height - 100);
        cutoff.setContentSize(layout.getContentSize().width, 2);
        layout.addChild(cutoff);

        var label1 = new cc.LabelTTF("１人あたりの支払金額");
        label1.setFontName(GAME_FONT.PRO_W3);
        label1.setFontSize(40);
        label1.setFontFillColor(cc.color("#6fcdc1"));
        label1.setAnchorPoint(0.5, 1);
        label1.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100-2-80);
        label1.setScanPhixelRGB();
        layout.addChild(label1);

        var money1 = new cc.LabelTTF("￥000");
        money1.setFontName(GAME_FONT.PRO_W6);
        money1.setFontSize(80);
        money1.setFontFillColor(cc.color("#6fcdc1"));
        money1.setAnchorPoint(0.5, 1);
        money1.setPosition(layout.getContentSize().width>>1, label1.getPosition().y - label1.getContentSize().height-30);
        money1.setScanPhixelRGB();
        money1.setString("￥" + equalValue);
        layout.addChild(money1);

        var label2 = new cc.LabelTTF("あまり");
        label2.setFontName(GAME_FONT.PRO_W3);
        label2.setFontSize(40);
        label2.setFontFillColor(cc.color("#6fcdc1"));
        label2.setAnchorPoint(0.5, 1);
        label2.setPosition(layout.getContentSize().width>>1, money1.getPosition().y - money1.getContentSize().height-70);
        label2.setScanPhixelRGB();
        layout.addChild(label2);

        var money2 = new cc.LabelTTF("￥000");
        money2.setFontName(GAME_FONT.PRO_W6);
        money2.setFontSize(80);
        money2.setFontFillColor(cc.color("#6fcdc1"));
        money2.setAnchorPoint(0.5, 1);
        money2.setPosition(layout.getContentSize().width>>1, label2.getPosition().y - label2.getContentSize().height-30);
        money2.setScanPhixelRGB();
        money2.setString("￥" + changeValue);
        layout.addChild(money2);

        var home_btn_touchevent = function(){
            _this.m_isResult = false;
            _this.loadEqualView(obj, false);
        };

        var home_btn = new ccui.Layout();
        home_btn.setContentSize(layout.getContentSize().width, 100);
        home_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        home_btn.setBackGroundColor(cc.color("#6fcdc1"));
        home_btn.setAnchorPoint(0, 0);
        home_btn.setPosition(0, 0);
        home_btn.setTouchEnabled(true);
        home_btn.addClickEventListener(home_btn_touchevent);
        layout.addChild(home_btn);

        var home_btn_text = new cc.LabelTTF("データ読み込み");
        home_btn_text.setFontName(GAME_FONT.PRO_W3);
        home_btn_text.setFontSize(26);
        home_btn_text.setFontFillColor(cc.color("#ffffff"));
        home_btn_text.setAnchorPoint(0.5, 0.5);
        home_btn_text.setPosition(home_btn.getContentSize().width>>1, home_btn.getContentSize().height>>1);
        home_btn_text.setScanPhixelRGB();
        home_btn.addChild(home_btn_text);

        _this.addChild(layout);
    },

    loadRandomView : function(obj, is){
        this.m_state = this.STATE_RANDOM;
        var _this = this;
        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255, 255, 255, 255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(cc.p(0, 1));
        title.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("ランダム割引モード");
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255, 243, 191, 255));
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width >> 1, cc.winSize.height - 50));
        this.addChild(titleName);
        var delegate = {};
        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        //名字输入框
        var name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 100, 120), new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    タイトルを入力してください");
        name_random_field.setAdd(true);
        name_random_field.setDelegate(delegate);
        name_random_field.setAnchorPoint(cc.p(0, 1));
        name_random_field.setPosition(50, cc.winSize.height - 100);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        name_random_field.setTag(1);
        this.addChild(name_random_field);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120);
        this.addChild(cutoff);

        var delegate = {};
        delegate.editBoxEditingDidEnd = function(editBox){
            if(editBox.getString() !== "" && parseInt(editBox.getString()) < 100){
                editBox.setString("100");
            }
        };
        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        //金额
        name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 100, 120), new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    合計金額を入力してください");
        name_random_field.setAdd(true);
        name_random_field.setAnchorPoint(cc.p(0, 1));
        name_random_field.setPosition(50, cc.winSize.height - 100 - 120 - 8);
        name_random_field.setDelegate(delegate);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        name_random_field.setTag(2);
        name_random_field.setNumberOnly(true);
        this.addChild(name_random_field);

        cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120);
        this.addChild(cutoff);

        var randomLayout = new ccui.Layout();
        randomLayout.setContentSize(cc.winSize.width, 122);
        randomLayout.setAnchorPoint(0, 1);
        randomLayout.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120 - 8);
        this.addChild(randomLayout);

        var random_label1 = new cc.LabelTTF("割引对象");
        random_label1.setAnchorPoint(0, 0.5);
        random_label1.setFontSize(36);
        random_label1.setFontName(GAME_FONT.PRO_W3);
        random_label1.setFontFillColor(new cc.Color(200, 200, 200, 255));
        randomLayout.addChild(random_label1);

        var random_editbox1 = new ccui.Layout();
        random_editbox1.setContentSize(140, 70);
        random_editbox1.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        random_editbox1.setBackGroundColor(cc.color("#6fcdc1"));
        random_editbox1.setAnchorPoint(0, 0.5);
        randomLayout.addChild(random_editbox1);

        var random_editbox1_bg = new ccui.Layout();
        random_editbox1_bg.setContentSize(136, 66);
        random_editbox1_bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        random_editbox1_bg.setBackGroundColor(cc.color("#ffffff"));
        random_editbox1_bg.setAnchorPoint(0.5, 0.5);
        random_editbox1_bg.setPosition(70, 35);
        random_editbox1.addChild(random_editbox1_bg);

        var delegate = {};
        delegate.editBoxEditingDidBegin = function(editBox){
            //var index = editBox.getString().length;
            //editBox.scheduleOnce(function(){
            //    if (editBox._edTxt.setSelectionRange) {//标准浏览器
            //        var cursurPosition = editBox._edTxt.selectionStart;//获得光标位置
            //        editBox._edTxt.setSelectionRange(index, -1);//设置光标位置
            //    } else { // IE9-
            //        var range = editBox._edTxt.createTextRange();
            //        range.moveStart("character", -index);
            //        range.moveEnd("character", -index);
            //        range.moveStart("character", index);
            //        range.moveEnd("character", 0);
            //        range.select();
            //    }
            //},0.01);
        };

        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };

        var editbox1 = new cc.EditBox(cc.size(136 + 100, 66), new cc.Scale9Sprite());
        editbox1.setAnchorPoint(0, 0.5);
        editbox1.setPosition(0, 35);
        //editbox1._edTxt.style.textAlign = "center";
        editbox1.setNumberOnly(true);
        editbox1.setFontName(GAME_FONT.PRO_W3);
        editbox1.setFontColor(cc.color(111, 205, 193, 255));
        editbox1.setDelegate(delegate);
        editbox1.setFontSize(36);
        editbox1.setMaxLength(2);
        editbox1.setPlaceholderFontColor(cc.color.GRAY);
        editbox1.setPlaceholderFontSize(36);
        editbox1.setPlaceHolder(" ");
        random_editbox1.addChild(editbox1);

        var random_label2 = new cc.LabelTTF("人");
        random_label2.setAnchorPoint(0, 0.5);
        random_label2.setFontSize(36);
        random_label2.setFontName(GAME_FONT.PRO_W3);
        random_label2.setFontFillColor(new cc.Color(200, 200, 200, 255));
        randomLayout.addChild(random_label2);

        var random_editbox2 = new ccui.Layout();
        random_editbox2.setContentSize(140, 70);
        random_editbox2.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        random_editbox2.setBackGroundColor(cc.color("#6fcdc1"));
        random_editbox2.setAnchorPoint(0, 0.5);
        randomLayout.addChild(random_editbox2);

        var random_editbox2_bg = new ccui.Layout();
        random_editbox2_bg.setContentSize(136, 66);
        random_editbox2_bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        random_editbox2_bg.setBackGroundColor(cc.color("#ffffff"));
        random_editbox2_bg.setAnchorPoint(0.5, 0.5);
        random_editbox2_bg.setPosition(70, 35);
        random_editbox2.addChild(random_editbox2_bg);

        var delegate = {};
        delegate.editBoxEditingDidEnd = function(editBox){
            if(editBox.getString() !== "" && parseInt(editBox.getString()) < 1){
                editBox.setString("1");
            }else if(editBox.getString() !== "" && parseInt(editBox.getString()) > 99){
                editBox.setString("99");
            }
        };
        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        var editbox2 = new cc.EditBox(cc.size(136, 66), new cc.Scale9Sprite());
        editbox2.setAnchorPoint(0.5, 0.5);
        editbox2.setPosition(70, 35);
        editbox2.setDelegate(delegate);
        editbox2.setNumberOnly(true);
        editbox2.setFontName(GAME_FONT.PRO_W3);
        editbox2.setFontColor(cc.color(111, 205, 193, 255));
        editbox2.setFontSize(36);
        editbox2.setMaxLength(2);
        editbox2.setPlaceholderFontColor(cc.color.GRAY);
        editbox2.setPlaceholderFontSize(36);
        editbox2.setPlaceHolder(" ");
        random_editbox2.addChild(editbox2);

        var random_label3 = new cc.LabelTTF("%割引");
        random_label3.setAnchorPoint(0, 0.5);
        random_label3.setFontSize(36);
        random_label3.setFontName(GAME_FONT.PRO_W3);
        random_label3.setFontFillColor(new cc.Color(200, 200, 200, 255));
        randomLayout.addChild(random_label3);

        random_label1.setPosition((randomLayout.getContentSize().width - (random_label1.getContentSize().width + 30 + 140 + 5 + random_label2.getContentSize().width + 20 + 140 + 5 + random_label3.getContentSize().width))/2, randomLayout.getContentSize().height/2);
        random_editbox1.setPosition(random_label1.getPosition().x + random_label1.getContentSize().width + 30, randomLayout.getContentSize().height/2);
        random_label2.setPosition(random_editbox1.getPosition().x + random_editbox1.getContentSize().width + 5, randomLayout.getContentSize().height/2);
        random_editbox2.setPosition(random_label2.getPosition().x + random_label2.getContentSize().width+20, randomLayout.getContentSize().height/2);
        random_label3.setPosition(random_editbox2.getPosition().x + random_editbox2.getContentSize().width + 5, randomLayout.getContentSize().height/2);

        cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122);
        this.addChild(cutoff);
        var delegate1 = {};
        delegate1.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        //参加者の名前
        name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 160 - 50, 120), new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    参加者を登録してください");
        name_random_field.setAdd(true);
        name_random_field.setDelegate(delegate);
        name_random_field.setAnchorPoint(cc.p(0, 1));
        name_random_field.setPosition(50, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        name_random_field.setTag(4);
        this.addChild(name_random_field);

        var addition_btn_touchevent = function(){
            if(listView.getItems().length==30){
                return;
            }
            if(_this.getChildByTag(4).getString() && _this.getChildByTag(4).getString() !== ""){
                var data = {};
                data.name = name_random_field.getString();
                var layout = new ccui.Layout();
                layout.setUserData(data);
                layout.setContentSize(750, 122);
                var name = new cc.LabelTTF(data.name);
                name.setFontName(GAME_FONT.PRO_W6);
                name.setFontSize(36);
                name.setFontFillColor(cc.color(111,205,193,255));
                name.setScanPhixelRGB();
                name.setAnchorPoint(0,0.5);
                name.setPosition(30, layout.getContentSize().height/2);
                layout.addChild(name);

                var delete_btn = new ccui.Button(GlobalRes.delete_png, GlobalRes.delete_png);
                delete_btn.setAnchorPoint(1, 0.5);
                delete_btn.setPosition(layout.getContentSize().width-30, layout.getContentSize().height/2);
                var delete_btn_touchevent = function(){
                    listView.removeItem(listView.getIndex(layout));
                    //if(editbox1.getString() !== "" && parseInt(editbox1.getString()) >= listView.getItems().length-1 && listView.getItems().length>=2){
                    //    editbox1.setString(""+(listView.getItems().length-1));
                    //}else if(editbox1.getString() !== "" && parseInt(editbox1.getString()) < 1 && listView.getItems().length>=2){
                    //    editbox1.setString("1");
                    //}else if(editbox1.getString() !== "" && listView.getItems().length<2){
                    //    editbox1.setString("0");
                    //}
                };
                delete_btn.addClickEventListener(delete_btn_touchevent);
                layout.addChild(delete_btn);

                var cutoff = new cc.Sprite(GlobalRes.line_8);
                cutoff.setAnchorPoint(0, 0);
                cutoff.setScaleX(layout.getContentSize().width);
                cutoff.setScaleY(0.25);
                layout.addChild(cutoff);

                listView.pushBackDefaultItem();
                listView.pushBackCustomItem(layout);
                if(1){
                    name_random_field.removeFromParent();
                    name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 160 - 50, 120), new cc.Scale9Sprite());
                    name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                    name_random_field.setPlaceholderFontSize(36);
                    name_random_field.setPlaceHolder("    参加者を登録してください");
                    name_random_field.setAdd(true);
                    name_random_field.setDelegate(delegate1);
                    name_random_field.setAnchorPoint(cc.p(0, 1));
                    name_random_field.setPosition(50, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122);
                    name_random_field.setFontName(GAME_FONT.PRO_W3);
                    name_random_field.setFontColor(cc.color(111, 205, 193, 255));
                    name_random_field.setFontSize(36);
                    name_random_field.setMaxLength(16);
                    name_random_field.setTag(4);
                    _this.addChild(name_random_field);
                }else{
                    name_random_field.setString("");
                    name_random_field.setInputblur();
                }


                //if(editbox1.getString() !== "" && parseInt(editbox1.getString()) >= listView.getItems().length-1 && listView.getItems().length>=2){
                //    editbox1.setString(""+(listView.getItems().length-1));
                //}else if(editbox1.getString() !== "" && parseInt(editbox1.getString()) < 1 && listView.getItems().length>=2){
                //    editbox1.setString("1");
                //}else if(editbox1.getString() !== "" && listView.getItems().length<2){
                //    editbox1.setString("0");
                //}
            }else{
                alert("参加者を登録してください");
            }
        };
        var add_btn = new ccui.Button(GlobalRes.addition_btn, GlobalRes.addition_btn);
        add_btn.setAnchorPoint(1, 0.5);
        add_btn.setPosition(cc.winSize.width - 40, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122 - 60);
        add_btn.addClickEventListener(addition_btn_touchevent);
        var addition_btn_sub = new ccui.Layout();
        addition_btn_sub.setContentSize(115+40, 120);
        addition_btn_sub.setTouchEnabled(true);
        addition_btn_sub.addClickEventListener(addition_btn_touchevent);
        addition_btn_sub.setAnchorPoint(0.5, 0.5);
        addition_btn_sub.setPosition(add_btn.getContentSize().width>>1, add_btn.getContentSize().height>>1);
        add_btn.addChild(addition_btn_sub);
        this.addChild(add_btn);

        cutoff = new cc.Sprite(GlobalRes.line_50);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122 - 8 - 122);
        this.addChild(cutoff);

        var label = new cc.LabelTTF("2人以上の登錄してください");
        label.setAnchorPoint(0.5, 0.5);
        label.setPosition(cc.winSize.width / 2, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122 - 8 - 122 - 25);
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(25);
        label.setFontFillColor(cc.color(200, 200, 200, 255));
        this.addChild(label);

        //组列表
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122 - 8 - 122 - 50 - 140 - 8));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 122 - 8 - 122 - 50);
        this.addChild(listView);

        var showResult = function(){
            _this.getChildByTag(1).setVisible(false);
            _this.getChildByTag(2).setVisible(false);
            _this.getChildByTag(4).setVisible(false);
            editbox1.setVisible(false);
            editbox2.setVisible(false);
            var mask = new Mask();
            _this.addChild(mask);

            _this.m_isResult = true;
            var cancel = function(){
                _this.m_isResult = false;
                _this.getChildByTag(1).setVisible(true);
                _this.getChildByTag(2).setVisible(true);
                _this.getChildByTag(4).setVisible(true);
                editbox1.setVisible(true);
                editbox2.setVisible(true);
                _this.removeChild(mask);
                _this.removeChild(cancel_layout);
                _this.removeChild(layout);
            };

            _this.m_back_func = cancel;

            var cancel_layout = new ccui.Layout();
            cancel_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            cancel_layout.setAnchorPoint(0, 0);
            cancel_layout.setTouchEnabled(true);
            cancel_layout.addClickEventListener(cancel);
            _this.addChild(cancel_layout);

            var members = new ArrayList();
            members.addRange(listView.getItems());
            var names = [];
            for(var i = 0; i < parseInt(editbox1.getString()); i++){
                var index = Math.floor(Math.random()*members.size());
                names[i] = members.removeIndex(index);
            }
            var moneyValue = parseInt(_this.getChildByTag(2).getString());
            var moneyValue1 = parseInt(parseInt(moneyValue/listView.getItems().length)*(parseInt(editbox2.getString())/100));
            var moneyValue2 = parseInt((moneyValue - moneyValue1 * names.length)/(listView.getItems().length-names.length));
            var moneyValue3 = moneyValue - moneyValue1*names.length - moneyValue2*(listView.getItems().length-names.length);

            var layout = new RoundRect(640, 960);
            layout.setAnchorPoint(0.5, 0.5);
            layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);

            var title_bg = new ccui.Layout();
            title_bg.setContentSize(640, 100);
            title_bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            title_bg.setBackGroundColor(cc.color("#fdfcf3"));
            title_bg.setAnchorPoint(0.5, 1);
            title_bg.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height);
            layout.addChild(title_bg);

            var title = new cc.LabelTTF("");
            title.setFontName(GAME_FONT.PRO_W3);
            title.setFontSize(32);
            title.setFontFillColor(cc.color(200, 200, 200, 255));
            title.setAnchorPoint(0.5, 0.5);
            title.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 50);
            title.setString(_this.getChildByTag(1).getString());
            layout.addChild(title);

            var cutoff = new ccui.Layout();
            cutoff.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cutoff.setBackGroundColor(cc.color("#6fcdc1"));
            cutoff.setAnchorPoint(0, 1);
            cutoff.setPosition(0, layout.getContentSize().height - 100);
            cutoff.setContentSize(layout.getContentSize().width, 2);
            layout.addChild(cutoff);

            //组列表
            var listView1 = new ccui.ListView();
            // set list view ex direction
            listView1.setDirection(ccui.ScrollView.DIR_VERTICAL);
            listView1.setTouchEnabled(true);
            listView1.setBounceEnabled(false);
            listView1.setContentSize(cc.size(640, 760-2));
            listView1.setAnchorPoint(0.5, 1);
            listView1.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height-102);
            layout.addChild(listView1);

            var subLayout = new ccui.Layout();
            subLayout.setContentSize(layout.getContentSize().width, 90);

            var label1 = new cc.LabelTTF("ランダム割引当選者は！");
            label1.setFontName(GAME_FONT.PRO_W3);
            label1.setFontSize(40);
            label1.setFontFillColor(cc.color("#6fcdc1"));
            label1.setAnchorPoint(0.5, 0);
            label1.setPosition(subLayout.getContentSize().width>>1, 0);
            label1.setScanPhixelRGB();
            subLayout.addChild(label1);

            listView1.pushBackDefaultItem();
            listView1.pushBackCustomItem(subLayout);

            for(var i = 0; i < names.length; i++){
                var subLayout = new ccui.Layout();
                subLayout.setContentSize(layout.getContentSize().width, 30+80);
                var name = new cc.LabelTTF(names[i].getUserData().name);
                name.setFontName(GAME_FONT.PRO_W6);
                name.setFontSize(80);
                name.setFontFillColor(cc.color("#6fcdc1"));
                name.setAnchorPoint(0.5, 1);
                name.setPosition(subLayout.getContentSize().width>>1, subLayout.getContentSize().height - 30);
                name.setScanPhixelRGB();
                subLayout.addChild(name);

                listView1.pushBackDefaultItem();
                listView1.pushBackCustomItem(subLayout);
            }

            var subLayout = new ccui.Layout();
            subLayout.setContentSize(layout.getContentSize().width, 30+80);

            var money1 = new cc.LabelTTF("￥"+moneyValue1);
            money1.setFontName(GAME_FONT.PRO_W6);
            money1.setFontSize(80);
            money1.setFontFillColor(cc.color("#6fcdc1"));
            money1.setAnchorPoint(0.5, 1);
            money1.setPosition(layout.getContentSize().width>>1, subLayout.getContentSize().height - 30);
            money1.setScanPhixelRGB();
            subLayout.addChild(money1);

            listView1.pushBackDefaultItem();
            listView1.pushBackCustomItem(subLayout);

            var subLayout = new ccui.Layout();
            subLayout.setContentSize(layout.getContentSize().width, 40+2+50+40+30+60+40+2+50+40+30+60+50 + 50);

            var cutoff = new ccui.Layout();
            cutoff.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cutoff.setBackGroundColor(cc.color("#eeeeee"));
            cutoff.setAnchorPoint(0, 1);
            cutoff.setPosition(0, subLayout.getContentSize().height - 40);
            cutoff.setContentSize(layout.getContentSize().width, 2);
            subLayout.addChild(cutoff);

            var label2 = new cc.LabelTTF("その他１人あたりの支払金額");
            label2.setFontName(GAME_FONT.PRO_W3);
            label2.setFontSize(40);
            label2.setFontFillColor(cc.color("#6fcdc1"));
            label2.setAnchorPoint(0.5, 1);
            label2.setPosition(subLayout.getContentSize().width>>1, cutoff.getPosition().y - cutoff.getContentSize().height-50);
            label2.setScanPhixelRGB();
            subLayout.addChild(label2);

            var money2 = new cc.LabelTTF("￥000");
            money2.setFontName(GAME_FONT.PRO_W6);
            money2.setFontSize(80);
            money2.setFontFillColor(cc.color("#6fcdc1"));
            money2.setAnchorPoint(0.5, 1);
            money2.setPosition(subLayout.getContentSize().width>>1, label2.getPosition().y - label2.getContentSize().height-30);
            money2.setScanPhixelRGB();
            money2.setString("￥" + moneyValue2);
            subLayout.addChild(money2);

            var cutoff = new ccui.Layout();
            cutoff.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cutoff.setBackGroundColor(cc.color("#eeeeee"));
            cutoff.setAnchorPoint(0, 1);
            cutoff.setPosition(0, money2.getPosition().y - money2.getContentSize().height - 40);
            cutoff.setContentSize(layout.getContentSize().width, 2);
            subLayout.addChild(cutoff);

            var label3 = new cc.LabelTTF("あまり");
            label3.setFontName(GAME_FONT.PRO_W3);
            label3.setFontSize(40);
            label3.setFontFillColor(cc.color("#6fcdc1"));
            label3.setAnchorPoint(0.5, 1);
            label3.setPosition(subLayout.getContentSize().width>>1, cutoff.getPosition().y - cutoff.getContentSize().height-50);
            label3.setScanPhixelRGB();
            subLayout.addChild(label3);

            var money3 = new cc.LabelTTF("￥000");
            money3.setFontName(GAME_FONT.PRO_W6);
            money3.setFontSize(80);
            money3.setFontFillColor(cc.color("#6fcdc1"));
            money3.setAnchorPoint(0.5, 1);
            money3.setPosition(subLayout.getContentSize().width>>1, label3.getPosition().y - label3.getContentSize().height-30);
            money3.setScanPhixelRGB();
            money3.setString("￥" + moneyValue3);
            subLayout.addChild(money3);

            listView1.pushBackDefaultItem();
            listView1.pushBackCustomItem(subLayout);

            var home_btn_touchevent = function(){
                var mask1 = new Mask();
                _this.addChild(mask1);
                mask1.open();

                var pop_layout = new RoundRect(570, 40+30+60+40+100+30);
                pop_layout.setAnchorPoint(0.5, 0.5);
                pop_layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
                _this.addChild(pop_layout);

                var label = new cc.LabelTTF("結果を保存しますか？");
                label.setFontName(GAME_FONT.PRO_W3);
                label.setFontSize(30);
                label.setFontFillColor(new cc.Color(111,205,193,255));
                label.setScanPhixelRGB();
                label.setAnchorPoint(0.5, 1);
                pop_layout.setContentSize(570, 40+30+60+40+100+label.getContentSize().height);
                label.setPosition(pop_layout.getContentSize().width>>1, pop_layout.getContentSize().height - 80);
                pop_layout.addChild(label);


                var save_btn = new ccui.Button(GlobalRes.color_b0e2cf, GlobalRes.color_b0e2cf);
                save_btn.setScale(285, 100);
                save_btn.setAnchorPoint(0, 0);
                save_btn.setPosition(285, 0);
                pop_layout.addChild(save_btn);

                var save_callback = function(){
                    var history = {};
                    history.mode = "random";
                    history.title = _this.getChildByTag(1).getString();
                    history.money = _this.getChildByTag(2).getString();
                    history.number = editbox1.getString();
                    history.off = editbox2.getString();
                    history.names = [];
                    for(var i = 0 ; i < listView.getItems().length; i++){
                        history.names[i] = listView.getItem(i).getUserData().name;
                    }
                    DataManager.instance().createHistory(GAME_TYPE.ADDutchpay, history);
                    _this.loadMainView();
                };
                save_btn.addClickEventListener(save_callback);

                var cancel_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
                cancel_btn.setScale(285, 100);
                cancel_btn.setAnchorPoint(0, 0);
                cancel_btn.setPosition(0, 0);
                pop_layout.addChild(cancel_btn);

                var cancel_callback = function(){
                    _this.loadMainView();
                };
                cancel_btn.addClickEventListener(cancel_callback);

                var save_text = new cc.LabelTTF("保存");
                save_text.setFontName(GAME_FONT.PRO_W6);
                save_text.setFontSize(30);
                save_text.setFontFillColor(cc.color(255,255,255,255));
                save_text.setScanPhixelRGB();
                save_text.setAnchorPoint(0.5, 0.5);
                save_text.setPosition(285 + 285/2, 50);
                pop_layout.addChild(save_text);

                var cancel_text = new cc.LabelTTF("キャンセル");
                cancel_text.setFontName(GAME_FONT.PRO_W6);
                cancel_text.setFontSize(30);
                cancel_text.setFontFillColor(cc.color(255,255,255,255));
                cancel_text.setScanPhixelRGB();
                cancel_text.setAnchorPoint(0.5, 0.5);
                cancel_text.setPosition(285/2, 50);
                pop_layout.addChild(cancel_text);
            };

            var home_btn = new ccui.Layout();
            home_btn.setContentSize(320, 100);
            home_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            home_btn.setBackGroundColor(cc.color("#6fcdc1"));
            home_btn.setAnchorPoint(0, 0);
            home_btn.setPosition(layout.getContentSize().width>>1, 0);
            home_btn.setTouchEnabled(true);
            home_btn.addClickEventListener(home_btn_touchevent);
            layout.addChild(home_btn);

            var home_btn_text = new cc.LabelTTF("ホーム");
            home_btn_text.setFontName(GAME_FONT.PRO_W3);
            home_btn_text.setFontSize(26);
            home_btn_text.setFontFillColor(cc.color("#ffffff"));
            home_btn_text.setAnchorPoint(0.5, 0.5);
            home_btn_text.setPosition(home_btn.getContentSize().width>>1, home_btn.getContentSize().height>>1);
            home_btn_text.setScanPhixelRGB();
            home_btn.addChild(home_btn_text);

            var cancel_btn = new ccui.Layout();
            cancel_btn.setContentSize(320, 100);
            cancel_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cancel_btn.setBackGroundColor(cc.color("#b0e2cf"));
            cancel_btn.setAnchorPoint(0, 0);
            cancel_btn.setPosition(0, 0);
            cancel_btn.setTouchEnabled(true);
            cancel_btn.addClickEventListener(cancel);
            layout.addChild(cancel_btn);

            var cancel_btn_text = new cc.LabelTTF("やり直す");
            cancel_btn_text.setFontName(GAME_FONT.PRO_W3);
            cancel_btn_text.setFontSize(26);
            cancel_btn_text.setFontFillColor(cc.color("#ffffff"));
            cancel_btn_text.setAnchorPoint(0.5, 0.5);
            cancel_btn_text.setPosition(cancel_btn.getContentSize().width>>1, cancel_btn.getContentSize().height>>1);
            cancel_btn_text.setScanPhixelRGB();
            cancel_btn.addChild(cancel_btn_text);

            //var clipNode = new cc.ClippingNode(new cc.Sprite(ADDutchpayRes.roundrect_mask_640X960));
            //clipNode.setAnchorPoint(0.5, 0.5);
            //clipNode.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            //clipNode.addChild(layout);
            _this.addChild(layout);
        };

        var next_btn = new ccui.Layout();
        next_btn.setContentSize(200, 80);
        next_btn.setAnchorPoint(0.5, 0);
        next_btn.setPosition(cc.winSize.width/2, 30);
        next_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        next_btn.setBackGroundColor(cc.color("#c8c8c8"));
        next_btn.setTouchEnabled(true);
        next_btn.setTag(3);
        next_btn.addClickEventListener(showResult);
        this.addChild(next_btn);

        var next_btn_text = new cc.LabelTTF("計算");
        next_btn_text.setAnchorPoint(0.5, 0.5);
        next_btn_text.setPosition(100, 40);
        next_btn_text.setFontName(GAME_FONT.PRO_W3);
        next_btn_text.setFontSize(26);
        next_btn_text.setFontFillColor(cc.color(255, 255, 255, 255));
        next_btn_text.setScanPhixelRGB();
        next_btn.addChild(next_btn_text);

        cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 0);
        cutoff.setPosition(0, 140);
        this.addChild(cutoff);

        var callback = function(){
            if(listView.getItems().length==30){
                name_random_field.setVisible(false);
            }else{
                name_random_field.setVisible(true);
            }

            if(_this.getChildByTag(1).getString()!=="" && _this.getChildByTag(2).getString()!=="" && listView.getItems().length >= 2 && editbox1.getString() !=="" && parseInt(editbox1.getString()) >=1 && parseInt(editbox1.getString()) <= listView.getItems().length-1 && editbox2.getString() !==""){
                _this.getChildByTag(3).setBackGroundColor(cc.color("#6fcdc1"));
                _this.getChildByTag(3).setTouchEnabled(true);
            }else{
                _this.getChildByTag(3).setBackGroundColor(cc.color("#c8c8c8"));
                _this.getChildByTag(3).setTouchEnabled(false);
            }

            if(_this.getChildByTag(4).getString()!==""){
                add_btn.setVisible(true);
            }else{
                add_btn.setVisible(false);
            }
        };

        title.schedule(callback, 0 ,cc.REPEAT_FOREVER);

        if(obj){
            this.getChildByTag(1).setString(obj.title);
            this.getChildByTag(2).setString(obj.money);
            editbox1.setString(obj.number);
            editbox2.setString(obj.off);
            for(var i = 0 ;i < obj.names.length; i++){
                var data = {};
                data.name = obj.names[i];
                var layout = new ccui.Layout();
                layout.setUserData(data);
                layout.setContentSize(750, 122);
                var name = new cc.LabelTTF(data.name);
                name.setFontName(GAME_FONT.PRO_W6);
                name.setFontSize(36);
                name.setFontFillColor(cc.color(111,205,193,255));
                name.setScanPhixelRGB();
                name.setAnchorPoint(0,0.5);
                name.setPosition(30, layout.getContentSize().height/2);
                layout.addChild(name);

                var delete_btn = new ccui.Button(GlobalRes.delete_png, GlobalRes.delete_png);
                delete_btn.setAnchorPoint(1, 0.5);
                delete_btn.setPosition(layout.getContentSize().width-30, layout.getContentSize().height/2);
                delete_btn.setUserData(layout);
                var delete_btn_touchevent = function(sender){
                    listView.removeItem(listView.getIndex(sender.getUserData()));
                    if(editbox1.getString() !== "" && parseInt(editbox1.getString()) >= listView.getItems().length-1 && listView.getItems().length>=2){
                        editbox1.setString(""+(listView.getItems().length-1));
                    }else if(editbox1.getString() !== "" && parseInt(editbox1.getString()) < 1 && listView.getItems().length>=2){
                        editbox1.setString("1");
                    }else if(editbox1.getString() !== "" && listView.getItems().length<2){
                        editbox1.setString("0");
                    }
                };
                delete_btn.addClickEventListener(delete_btn_touchevent);
                layout.addChild(delete_btn);

                var cutoff = new cc.Sprite(GlobalRes.line_8);
                cutoff.setAnchorPoint(0, 0);
                cutoff.setScaleX(layout.getContentSize().width);
                cutoff.setScaleY(0.25);
                layout.addChild(cutoff);

                listView.pushBackDefaultItem();
                listView.pushBackCustomItem(layout);
            }
        }

        if(is){
            showResult();
        }
    },

    loadAngelView : function(obj){
        this.m_state = this.STATE_ANGEL;
        var _this = this;
        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255, 255, 255, 255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(cc.p(0, 1));
        title.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("天国と地獄モード");
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255, 243, 191, 255));
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width >> 1, cc.winSize.height - 50));
        this.addChild(titleName);
        var delegate = {};
        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        //名字输入框
        var name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 100, 120), new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    タイトルを入力してください");
        name_random_field.setAdd(true);
        name_random_field.setDelegate(delegate);
        name_random_field.setAnchorPoint(cc.p(0, 1));
        name_random_field.setPosition(50, cc.winSize.height - 100);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        name_random_field.setTag(1);
        this.addChild(name_random_field);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120);
        this.addChild(cutoff);

        var delegate = {};
        delegate.editBoxEditingDidEnd = function(editBox){
            if(editBox.getString() !== "" && parseInt(editBox.getString()) < 100){
                editBox.setString("100");
            }
        };
        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        //金额
        name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 100, 120), new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    合計金額を入力してください");
        name_random_field.setAdd(true);
        name_random_field.setAnchorPoint(cc.p(0, 1));
        name_random_field.setPosition(50, cc.winSize.height - 100 - 120 - 8);
        name_random_field.setDelegate(delegate);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        name_random_field.setTag(2);
        name_random_field.setNumberOnly(true);
        this.addChild(name_random_field);

        cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120);
        this.addChild(cutoff);
        var delegate = {};
        delegate.editBoxTextChanged = function(editBox, text) {
            if(editBox.getMaxLength())
                if(editBox.getString().length>editBox.getMaxLength())
                    editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
        };
        //参加者の名前
        name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 160 - 50, 120), new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    参加者を登録してください");
        name_random_field.setAdd(true);
        name_random_field.setDelegate(delegate);
        name_random_field.setAnchorPoint(cc.p(0, 1));
        name_random_field.setPosition(50, cc.winSize.height - 100 - 120 - 8 - 120 - 8);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111, 205, 193, 255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        name_random_field.setTag(4);
        this.addChild(name_random_field);

        var addition_btn_touchevent = function(){
            if(listView.getItems().length==30){
                return;
            }
            if(_this.getChildByTag(4).getString() && _this.getChildByTag(4).getString() !== ""){
                var data = {};
                data.name = name_random_field.getString();
                var layout = new ccui.Layout();
                layout.setUserData(data);
                layout.setContentSize(750, 122);
                var name = new cc.LabelTTF(data.name);
                name.setFontName(GAME_FONT.PRO_W6);
                name.setFontSize(36);
                name.setFontFillColor(cc.color(111,205,193,255));
                name.setScanPhixelRGB();
                name.setAnchorPoint(0,0.5);
                name.setPosition(30, layout.getContentSize().height/2);
                layout.addChild(name);

                var delete_btn = new ccui.Button(GlobalRes.delete_png, GlobalRes.delete_png);
                delete_btn.setAnchorPoint(1, 0.5);
                delete_btn.setPosition(layout.getContentSize().width-30, layout.getContentSize().height/2);
                var delete_btn_touchevent = function(){
                    listView.removeItem(listView.getIndex(layout));
                };
                delete_btn.addClickEventListener(delete_btn_touchevent);
                layout.addChild(delete_btn);

                var cutoff = new cc.Sprite(GlobalRes.line_8);
                cutoff.setAnchorPoint(0, 0);
                cutoff.setScaleX(layout.getContentSize().width);
                cutoff.setScaleY(0.25);
                layout.addChild(cutoff);

                listView.pushBackDefaultItem();
                listView.pushBackCustomItem(layout);
                name_random_field.setString("");
                name_random_field._edTxt.blur();

            }else{
                alert("参加者を登録してください");
            }
        };
        var add_btn = new ccui.Button(GlobalRes.addition_btn, GlobalRes.addition_btn);
        add_btn.setAnchorPoint(1, 0.5);
        add_btn.setPosition(cc.winSize.width - 40, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 60);
        add_btn.addClickEventListener(addition_btn_touchevent);
        var addition_btn_sub = new ccui.Layout();
        addition_btn_sub.setContentSize(115+40, 120);
        addition_btn_sub.setTouchEnabled(true);
        addition_btn_sub.addClickEventListener(addition_btn_touchevent);
        addition_btn_sub.setAnchorPoint(0.5, 0.5);
        addition_btn_sub.setPosition(add_btn.getContentSize().width>>1, add_btn.getContentSize().height>>1);
        add_btn.addChild(addition_btn_sub);
        this.addChild(add_btn);

        cutoff = new cc.Sprite(GlobalRes.line_50);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 120);
        this.addChild(cutoff);

        var label = new cc.LabelTTF("3人以上登録してください");
        label.setAnchorPoint(0.5, 0.5);
        label.setPosition(cc.winSize.width / 2, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 120 - 25);
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(25);
        label.setFontFillColor(cc.color(200, 200, 200, 255));
        this.addChild(label);

        //组列表
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 120 - 50 - 140 - 8));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 120 - 50);
        this.addChild(listView);

        var next = function(){
            var obj = {};
            obj.title = _this.getChildByTag(1).getString();
            obj.money = _this.getChildByTag(2).getString();
            obj.names = [];
            for(var i = 0; i < listView.getItems().length; i++){
                obj.names[i] = listView.getItems()[i].getUserData().name;
            }
            _this.loadAngelResultView(obj);
        };

        var next_btn = new ccui.Layout();
        next_btn.setContentSize(200, 80);
        next_btn.setAnchorPoint(0.5, 0);
        next_btn.setPosition(cc.winSize.width/2, 30);
        next_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        next_btn.setBackGroundColor(cc.color("#c8c8c8"));
        next_btn.setTouchEnabled(true);
        next_btn.setTag(3);
        next_btn.addClickEventListener(next);
        this.addChild(next_btn);

        var next_btn_text = new cc.LabelTTF("計算");
        next_btn_text.setAnchorPoint(0.5, 0.5);
        next_btn_text.setPosition(100, 40);
        next_btn_text.setFontName(GAME_FONT.PRO_W3);
        next_btn_text.setFontSize(26);
        next_btn_text.setFontFillColor(cc.color(255, 255, 255, 255));
        next_btn_text.setScanPhixelRGB();
        next_btn.addChild(next_btn_text);

        cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 0);
        cutoff.setPosition(0, 140);
        this.addChild(cutoff);

        var fineInput = new cc.LabelTTF("参加者入力完了");
        fineInput.setFontName(GAME_FONT.PRO_W3);
        fineInput.setFontSize(36);
        fineInput.setFontFillColor(cc.color.GRAY);
        fineInput.setAnchorPoint(0, 1);
        fineInput.setPosition(50, cc.winSize.height - 100 - 120 - 8 - 120 - 8 - 40);
        this.addChild(fineInput);
        if(listView.getItems().length==30){
            name_random_field.setVisible(false);
            fineInput.setVisible(true);
        }else{
            name_random_field.setVisible(true);
            fineInput.setVisible(false);
        }
        var callback = function(){
            if(listView.getItems().length==30){
                name_random_field.setVisible(false);
                fineInput.setVisible(true);
            }else{
                name_random_field.setVisible(true);
                fineInput.setVisible(false);
            }

            if(_this.getChildByTag(1).getString()!=="" && _this.getChildByTag(2).getString()!=="" && listView.getItems().length >= 3){
                _this.getChildByTag(3).setBackGroundColor(cc.color("#6fcdc1"));
                _this.getChildByTag(3).setTouchEnabled(true);
            }else{
                _this.getChildByTag(3).setBackGroundColor(cc.color("#c8c8c8"));
                _this.getChildByTag(3).setTouchEnabled(false);
            }

            if(_this.getChildByTag(4).getString()!==""){
                add_btn.setVisible(true);
            }else{
                add_btn.setVisible(false);
            }
        };

        title.schedule(callback, 0 ,cc.REPEAT_FOREVER);

        if(obj){
            _this.getChildByTag(1).setString(obj.title1);
            _this.getChildByTag(2).setString(obj.money);
            for(var i = 0 ;i < obj.names.length; i++){
                var data = {};
                data.name = obj.names[i];
                var layout = new ccui.Layout();
                layout.setUserData(data);
                layout.setContentSize(750, 122);
                var name = new cc.LabelTTF(data.name);
                name.setFontName(GAME_FONT.PRO_W6);
                name.setFontSize(36);
                name.setFontFillColor(cc.color(111,205,193,255));
                name.setScanPhixelRGB();
                name.setAnchorPoint(0,0.5);
                name.setPosition(30, layout.getContentSize().height/2);
                layout.addChild(name);

                var delete_btn = new ccui.Button(GlobalRes.delete_png, GlobalRes.delete_png);
                delete_btn.setAnchorPoint(1, 0.5);
                delete_btn.setPosition(layout.getContentSize().width-30, layout.getContentSize().height/2);
                delete_btn.setUserData(layout);
                var delete_btn_touchevent = function(sender){
                    listView.removeItem(listView.getIndex(sender.getUserData()));
                };
                delete_btn.addClickEventListener(delete_btn_touchevent);
                layout.addChild(delete_btn);

                var cutoff = new cc.Sprite(GlobalRes.line_8);
                cutoff.setAnchorPoint(0, 0);
                cutoff.setScaleX(layout.getContentSize().width);
                cutoff.setScaleY(0.25);
                layout.addChild(cutoff);

                listView.pushBackDefaultItem();
                listView.pushBackCustomItem(layout);
            }
        }
    },

    loadAngelResultView : function(obj, is){
        this.m_state = this.STATE_ANGEL_RESULT;
        var _this = this;
        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255, 255, 255, 255)));
        var title = new ccui.Layout();
        title.setContentSize(cc.winSize.width, 100);
        title.setAnchorPoint(cc.p(0, 1));
        title.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        title.setBackGroundColor(cc.color("#6fcdc1"));
        //title.setPosition(cc.p(0, cc.winSize.height));
        //this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("天国と地獄モードの結果");
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255, 243, 191, 255));
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width >> 1, 50));
        title.addChild(titleName);

        var names = new ArrayList();
        names.addRange(obj.names);
        var angel = obj.angel?obj.angel:names.removeIndex(Math.floor(Math.random()*names.size()));
        var devil = obj.devil?obj.angel:names.removeIndex(Math.floor(Math.random()*names.size()));
        var money1 = obj.money1?obj.money1:parseInt(parseInt(obj.money)/obj.names.length);
        var money2 = obj.money2?obj.money2:obj.money - money1*names.size();
        var input,name = "";
        var home_btn_touchevent = function(){
            var mask1 = new Mask();
            _this.addChild(mask1);
            mask1.open();

            var pop_layout = new RoundRect(570, 40+30+60+40+100+30);
            pop_layout.setAnchorPoint(0.5, 0.5);
            pop_layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            _this.addChild(pop_layout);

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

            input = new cc.EditBox(cc.size(498, 58),new cc.Scale9Sprite());

            var size = obj.names.length;
            for(var i = 0 ; i < size; i++){
                name += obj.names[i];
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
                var history = {};
                history.mode = "angel";
                history.angel = angel;
                history.devil = devil;
                history.money1 = money1;
                history.money2 = money2;
                history.names = obj.names;
                history.title1 = obj.title;
                if(input.getString() == name)
                    history.title = obj.title;
                else
                    history.title = input.getString();
                history.money = obj.money;
                DataManager.instance().createHistory(GAME_TYPE.ADDutchpay, history);
                _this.loadMainView();
            };
            save_btn.addClickEventListener(save_callback);

            var cancel_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            cancel_btn.setScale(285, 100);
            cancel_btn.setAnchorPoint(0, 0);
            cancel_btn.setPosition(0, 0);
            pop_layout.addChild(cancel_btn);

            var cancel_callback = function(){
                _this.loadMainView();
            };
            cancel_btn.addClickEventListener(cancel_callback);

            var save_text = new cc.LabelTTF("保存");
            save_text.setFontName(GAME_FONT.PRO_W6);
            save_text.setFontSize(30);
            save_text.setFontFillColor(cc.color(255,255,255,255));
            save_text.setScanPhixelRGB();
            save_text.setAnchorPoint(0.5, 0.5);
            save_text.setPosition(285 + 285/2, 50);
            pop_layout.addChild(save_text);

            var cancel_text = new cc.LabelTTF("キャンセル");
            cancel_text.setFontName(GAME_FONT.PRO_W6);
            cancel_text.setFontSize(30);
            cancel_text.setFontFillColor(cc.color(255,255,255,255));
            cancel_text.setScanPhixelRGB();
            cancel_text.setAnchorPoint(0.5, 0.5);
            cancel_text.setPosition(285/2, 50);
            pop_layout.addChild(cancel_text);
        };
        this.m_back_func = home_btn_touchevent;


        var showResult = function(){
            var mask = new Mask();
            _this.addChild(mask);

            var cancel = function(){
                _this.removeChild(mask);
                _this.removeChild(cancel_layout);
                _this.removeChild(layout);
                _this.m_back_func = home_btn_touchevent;
            };

            _this.m_back_func = cancel;

            var cancel_layout = new ccui.Layout();
            cancel_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            cancel_layout.setAnchorPoint(0, 0);
            cancel_layout.setTouchEnabled(true);
            cancel_layout.addClickEventListener(cancel);
            _this.addChild(cancel_layout);

            var layout = new RoundRect(640, 960);
            layout.setAnchorPoint(0.5, 0.5);
            layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);

            var title_bg = new ccui.Layout();
            title_bg.setContentSize(640, 100);
            title_bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            title_bg.setBackGroundColor(cc.color("#fdfcf3"));
            title_bg.setAnchorPoint(0.5, 1);
            title_bg.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height);
            layout.addChild(title_bg);

            var title = new cc.LabelTTF(obj.title);
            title.setFontName(GAME_FONT.PRO_W3);
            title.setFontSize(32);
            title.setFontFillColor(cc.color(200, 200, 200, 255));
            title.setAnchorPoint(0.5, 0.5);
            title.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 50);
            layout.addChild(title);

            var cutoff = new ccui.Layout();
            cutoff.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cutoff.setBackGroundColor(cc.color("#6fcdc1"));
            cutoff.setAnchorPoint(0, 1);
            cutoff.setPosition(0, layout.getContentSize().height - 100);
            cutoff.setContentSize(layout.getContentSize().width, 2);
            layout.addChild(cutoff);

            var label = new cc.LabelTTF("天国行きは");
            label.setFontName(GAME_FONT.PRO_W3);
            label.setFontSize(30);
            label.setFontFillColor(cc.color("#6fcdc1"));
            label.setAnchorPoint(0.5, 1);
            label.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100 - 2 - 40);
            layout.addChild(label);

            var label = new cc.LabelTTF(angel);
            label.setFontName(GAME_FONT.PRO_W6);
            label.setFontSize(60);
            label.setFontFillColor(cc.color("#6fcdc1"));
            label.setAnchorPoint(0.5, 1);
            label.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30);
            layout.addChild(label);

            var label = new cc.LabelTTF("￥000");
            label.setFontName(GAME_FONT.PRO_W6);
            label.setFontSize(60);
            label.setFontFillColor(cc.color("#6fcdc1"));
            label.setAnchorPoint(0.5, 1);
            label.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30 - 60 - 20);
            layout.addChild(label);

            var cutoff = new ccui.Layout();
            cutoff.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cutoff.setBackGroundColor(cc.color("#eeeeee"));
            cutoff.setAnchorPoint(0, 1);
            cutoff.setPosition(0, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30 - 60 - 20 - 60 - 40);
            cutoff.setContentSize(layout.getContentSize().width, 2);
            layout.addChild(cutoff);

            var label = new cc.LabelTTF("天国でも地獄でもない人は");
            label.setFontName(GAME_FONT.PRO_W3);
            label.setFontSize(30);
            label.setFontFillColor(cc.color("#6fcdc1"));
            label.setAnchorPoint(0.5, 1);
            label.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30 - 60 - 20 - 60 - 40　-　2　-　40);
            layout.addChild(label);

            var label = new cc.LabelTTF("￥"+money1);
            label.setFontName(GAME_FONT.PRO_W6);
            label.setFontSize(60);
            label.setFontFillColor(cc.color("#6fcdc1"));
            label.setAnchorPoint(0.5, 1);
            label.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30 - 60 - 20 - 60 - 40　-　2　-　40　-　30　-　30);
            layout.addChild(label);

            var cutoff = new ccui.Layout();
            cutoff.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cutoff.setBackGroundColor(cc.color("#eeeeee"));
            cutoff.setAnchorPoint(0, 1);
            cutoff.setPosition(0, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30 - 60 - 20 - 60 - 40　-　2　-　40　-　30　-　30　-　60　-　40);
            cutoff.setContentSize(layout.getContentSize().width, 2);
            layout.addChild(cutoff);

            var label = new cc.LabelTTF("地獄行きは");
            label.setFontName(GAME_FONT.PRO_W3);
            label.setFontSize(30);
            label.setFontFillColor(cc.color("#6fcdc1"));
            label.setAnchorPoint(0.5, 1);
            label.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30 - 60 - 20 - 60 - 40　-　2　-　40　-　30　-　30　-　60　-　40　-　2　-　40);
            layout.addChild(label);

            var label = new cc.LabelTTF(devil);
            label.setFontName(GAME_FONT.PRO_W6);
            label.setFontSize(60);
            label.setFontFillColor(cc.color("#6fcdc1"));
            label.setAnchorPoint(0.5, 1);
            label.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30 - 60 - 20 - 60 - 40　-　2　-　40　-　30　-　30　-　60　-　40　-　2　-　40 - 30 - 30);
            layout.addChild(label);

            var label = new cc.LabelTTF("￥"+money2);
            label.setFontName(GAME_FONT.PRO_W6);
            label.setFontSize(60);
            label.setFontFillColor(cc.color("#6fcdc1"));
            label.setAnchorPoint(0.5, 1);
            label.setPosition(layout.getContentSize().width>>1, layout.getContentSize().height - 100 - 2 - 40 - 30 - 30 - 60 - 20 - 60 - 40　-　2　-　40　-　30　-　30　-　60　-　40　-　2　-　40 - 30 - 30 - 60 - 20);
            layout.addChild(label);

            var home_btn = new ccui.Layout();
            home_btn.setContentSize(640, 100);
            home_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            home_btn.setBackGroundColor(cc.color("#6fcdc1"));
            home_btn.setAnchorPoint(0, 0);
            home_btn.setTouchEnabled(true);
            home_btn.addClickEventListener(cancel);
            layout.addChild(home_btn);

            var home_btn_text = new cc.LabelTTF("閉じる");
            home_btn_text.setFontName(GAME_FONT.PRO_W3);
            home_btn_text.setFontSize(26);
            home_btn_text.setFontFillColor(cc.color("#ffffff"));
            home_btn_text.setAnchorPoint(0.5, 0.5);
            home_btn_text.setPosition(home_btn.getContentSize().width>>1, home_btn.getContentSize().height>>1);
            home_btn_text.setScanPhixelRGB();
            layout.addChild(home_btn_text);

            //var clipNode = new cc.ClippingNode(new cc.Sprite(ADDutchpayRes.roundrect_mask_640X960));
            //clipNode.setAnchorPoint(0.5, 0.5);
            //clipNode.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            //clipNode.addChild(layout);
            _this.addChild(layout);
        };

        var angel_btn_event = function(){
            SoundManager.instance().playEffect(ADDutchpayRes.angel_popup_sound);

            var mask = new Mask();
            _this.addChild(mask);
            mask.open();

            var cancel = function(){
                _this.removeChild(mask);
                _this.removeChild(cancel_layout);
                _this.removeChild(bg);
                _this.m_back_func = home_btn_touchevent;
            };

            _this.m_back_func = cancel;

            var cancel_layout = new ccui.Layout();
            cancel_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            cancel_layout.setAnchorPoint(0, 0);
            cancel_layout.setTouchEnabled(true);
            cancel_layout.addClickEventListener(cancel);
            _this.addChild(cancel_layout);

            var bg = new cc.Sprite(ADDutchpayRes.angel_popup);
            bg.setAnchorPoint(0.5, 0.5);
            bg.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            _this.addChild(bg);

            var label1 = new cc.LabelTTF("天使が微笑んだ");
            label1.setAnchorPoint(0.5, 1);
            label1.setPosition((bg.getContentSize().width>>1)+20, bg.getContentSize().height - 300);
            label1.setFontName(GAME_FONT.PRO_W3);
            label1.setFontSize(32);
            label1.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label1);

            var label2 = new cc.LabelTTF("幸運の持ち主は！");
            label2.setAnchorPoint(0.5, 1);
            label2.setPosition((bg.getContentSize().width>>1)+20, label1.getPosition().y - label1.getContentSize().height - 10);
            label2.setFontName(GAME_FONT.PRO_W3);
            label2.setFontSize(32);
            label2.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label2);

            var label3 = new cc.LabelTTF(angel);
            label3.setAnchorPoint(0.5, 1);
            label3.setPosition((bg.getContentSize().width>>1), label2.getPosition().y - label2.getContentSize().height - 60);
            label3.setFontName(GAME_FONT.PRO_W6);
            label3.setFontSize(60);
            label3.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label3);

            var label4 = new cc.LabelTTF("様");
            label4.setAnchorPoint(0, 0);
            label4.setPosition((label3.getPosition().x)+(label3.getContentSize().width>>1)+10, label3.getPosition().y - label3.getContentSize().height);
            label4.setFontName(GAME_FONT.PRO_W3);
            label4.setFontSize(40);
            label4.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label4);

            var label5 = new cc.LabelTTF("今回はタダです〜");
            label5.setAnchorPoint(0.5, 1);
            label5.setPosition((bg.getContentSize().width>>1)+20, label3.getPosition().y - label3.getContentSize().height - 60);
            label5.setFontName(GAME_FONT.PRO_W3);
            label5.setFontSize(32);
            label5.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label5);

            var home_btn = new ccui.Layout();
            home_btn.setContentSize(200, 80);
            home_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            home_btn.setBackGroundColor(cc.color("#6fcdc1"));
            home_btn.setAnchorPoint(0.5, 1);
            home_btn.setPosition((bg.getContentSize().width>>1)+20, label5.getPosition().y - label5.getContentSize().height - 60);
            home_btn.setTouchEnabled(true);
            home_btn.addClickEventListener(cancel);
            bg.addChild(home_btn);

            var text = new cc.LabelTTF("閉じる");
            text.setAnchorPoint(0.5, 0.5);
            text.setPosition(100, 40);
            text.setFontName(GAME_FONT.PRO_W3);
            text.setFontSize(32);
            text.setFontFillColor(cc.color("#ffffff"));
            home_btn.addChild(text);

        };

        var normal_btn_event = function(){
            SoundManager.instance().playEffect(ADDutchpayRes.human_popup_sound);

            var mask = new Mask();
            _this.addChild(mask);
            mask.open();

            var cancel = function(){
                _this.removeChild(mask);
                _this.removeChild(cancel_layout);
                _this.removeChild(bg);
                _this.m_back_func = home_btn_touchevent;
            };

            _this.m_back_func = cancel;

            var cancel_layout = new ccui.Layout();
            cancel_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            cancel_layout.setAnchorPoint(0, 0);
            cancel_layout.setTouchEnabled(true);
            cancel_layout.addClickEventListener(cancel);
            _this.addChild(cancel_layout);

            var bg = new cc.Sprite(ADDutchpayRes.normal_popup);
            bg.setAnchorPoint(0.5, 0.5);
            bg.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            _this.addChild(bg);

            var label1 = new cc.LabelTTF("天国でも地獄でもない");
            label1.setAnchorPoint(0.5, 1);
            label1.setPosition((bg.getContentSize().width>>1)+10, bg.getContentSize().height - 300);
            label1.setFontName(GAME_FONT.PRO_W3);
            label1.setFontSize(32);
            label1.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label1);

            var label2 = new cc.LabelTTF("現世のままの皆さんは");
            label2.setAnchorPoint(0.5, 1);
            label2.setPosition((bg.getContentSize().width>>1)+10, label1.getPosition().y - label1.getContentSize().height - 10);
            label2.setFontName(GAME_FONT.PRO_W3);
            label2.setFontSize(32);
            label2.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label2);

            var label3 = new cc.LabelTTF("１人あたり");
            label3.setAnchorPoint(0.5, 1);
            label3.setPosition((bg.getContentSize().width>>1)+10, label2.getPosition().y - label2.getContentSize().height - 10);
            label3.setFontName(GAME_FONT.PRO_W3);
            label3.setFontSize(32);
            label3.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label3);

            var label3 = new cc.LabelTTF("￥"+money1);
            label3.setAnchorPoint(0.5, 1);
            label3.setPosition((bg.getContentSize().width>>1)+10, label2.getPosition().y - label2.getContentSize().height - 60);
            label3.setFontName(GAME_FONT.PRO_W6);
            label3.setFontSize(60);
            label3.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label3);

            var label5 = new cc.LabelTTF("お支払い下さい");
            label5.setAnchorPoint(0.5, 1);
            label5.setPosition((bg.getContentSize().width>>1)+10, label3.getPosition().y - label3.getContentSize().height - 60);
            label5.setFontName(GAME_FONT.PRO_W3);
            label5.setFontSize(32);
            label5.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label5);

            var home_btn = new ccui.Layout();
            home_btn.setContentSize(200, 80);
            home_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            home_btn.setBackGroundColor(cc.color("#6fcdc1"));
            home_btn.setAnchorPoint(0.5, 1);
            home_btn.setPosition((bg.getContentSize().width>>1)+10, label5.getPosition().y - label5.getContentSize().height - 60);
            home_btn.setTouchEnabled(true);
            home_btn.addClickEventListener(cancel);
            bg.addChild(home_btn);

            var text = new cc.LabelTTF("閉じる");
            text.setAnchorPoint(0.5, 0.5);
            text.setPosition(100, 40);
            text.setFontName(GAME_FONT.PRO_W3);
            text.setFontSize(32);
            text.setFontFillColor(cc.color("#ffffff"));
            home_btn.addChild(text);

        };

        var devil_btn_event = function(){
            SoundManager.instance().playEffect(ADDutchpayRes.devil_popup_sound);

            var mask = new Mask();
            _this.addChild(mask);
            mask.open();

            var cancel = function(){
                _this.removeChild(mask);
                _this.removeChild(cancel_layout);
                _this.removeChild(bg);
                _this.m_back_func = home_btn_touchevent;
            };

            _this.m_back_func = cancel;

            var cancel_layout = new ccui.Layout();
            cancel_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            cancel_layout.setAnchorPoint(0, 0);
            cancel_layout.setTouchEnabled(true);
            cancel_layout.addClickEventListener(cancel);
            _this.addChild(cancel_layout);

            var bg = new cc.Sprite(ADDutchpayRes.devil_popup);
            bg.setAnchorPoint(0.5, 0.5);
            bg.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            _this.addChild(bg);

            var label1 = new cc.LabelTTF("信じられない...");
            label1.setAnchorPoint(0.5, 1);
            label1.setPosition((bg.getContentSize().width>>1)-20, bg.getContentSize().height - 300);
            label1.setFontName(GAME_FONT.PRO_W3);
            label1.setFontSize(32);
            label1.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label1);

            var label2 = new cc.LabelTTF("悪魔につかまってしまった");
            label2.setAnchorPoint(0.5, 1);
            label2.setPosition((bg.getContentSize().width>>1)-20, label1.getPosition().y - label1.getContentSize().height - 10);
            label2.setFontName(GAME_FONT.PRO_W3);
            label2.setFontSize(32);
            label2.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label2);

            var label3 = new cc.LabelTTF(devil);
            label3.setAnchorPoint(0.5, 1);
            label3.setPosition((bg.getContentSize().width>>1)-20, label2.getPosition().y - label2.getContentSize().height - 40);
            label3.setFontName(GAME_FONT.PRO_W6);
            label3.setFontSize(60);
            label3.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label3);

            var label4 = new cc.LabelTTF("様");
            label4.setAnchorPoint(0, 0);
            label4.setPosition((label3.getPosition().x)+(label3.getContentSize().width>>1)+10, label3.getPosition().y - label3.getContentSize().height);
            label4.setFontName(GAME_FONT.PRO_W3);
            label4.setFontSize(40);
            label4.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label4);

            var label5 = new cc.LabelTTF("￥"+money2);
            label5.setAnchorPoint(0.5, 1);
            label5.setPosition((bg.getContentSize().width>>1)-20, label3.getPosition().y - label3.getContentSize().height - 40);
            label5.setFontName(GAME_FONT.PRO_W6);
            label5.setFontSize(60);
            label5.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label5);

            var label6 = new cc.LabelTTF("お支払い下さい");
            label6.setAnchorPoint(0.5, 1);
            label6.setPosition((bg.getContentSize().width>>1)-20, label5.getPosition().y - label5.getContentSize().height - 10);
            label6.setFontName(GAME_FONT.PRO_W3);
            label6.setFontSize(32);
            label6.setFontFillColor(cc.color("#6fcdc1"));
            bg.addChild(label6);

            var home_btn = new ccui.Layout();
            home_btn.setContentSize(200, 80);
            home_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            home_btn.setBackGroundColor(cc.color("#6fcdc1"));
            home_btn.setAnchorPoint(0.5, 1);
            home_btn.setPosition((bg.getContentSize().width>>1)-20, label6.getPosition().y - label6.getContentSize().height - 20);
            home_btn.setTouchEnabled(true);
            home_btn.addClickEventListener(cancel);
            bg.addChild(home_btn);

            var text = new cc.LabelTTF("閉じる");
            text.setAnchorPoint(0.5, 0.5);
            text.setPosition(100, 40);
            text.setFontName(GAME_FONT.PRO_W3);
            text.setFontSize(32);
            text.setFontFillColor(cc.color("#ffffff"));
            home_btn.addChild(text);

        };

        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 120));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height);
        listView.setBreakPoint(100);
        //listView.setAutoScrollEnable(false);
        this.addChild(listView);

        listView.pushBackCustomItem(title);

        var _h = (cc.winSize.height - 100 - 100 - 3*(200 + 32 + 20))/4;
        var _height = 32 + 20 + _h;
        var imageWH = 200;
        var leftX = 30;
        var midX = 20;

        var layout = new ccui.Layout();//天使
        layout.setContentSize(cc.winSize.width, _height + imageWH);
        layout.setAnchorPoint(0, 1);
        layout.setPosition(0, cc.winSize.height - 100);
        layout.setTouchEnabled(true);
        layout.addClickEventListener(angel_btn_event);
        listView.pushBackCustomItem(layout);

        var button = new cc.Sprite(ADDutchpayRes.angel_button);
        button.setAnchorPoint(0.5, 0);
        button.setPosition(layout.getContentSize().width/2, 20 + 32);
        layout.addChild(button);
        var label1 = new cc.LabelTTF("天国行きの参加者?");
        label1.setFontName(GAME_FONT.PRO_W6);
        label1.setFontSize(32);
        label1.setFontFillColor(cc.color(111,205,193,255));
        label1.setAnchorPoint(cc.p(0.5, 0));
        label1.setPosition(button.getPositionX(), 0);
        layout.addChild(label1);

        //var button = new cc.Sprite(ADDutchpayRes.angel_button);
        //button.setAnchorPoint(0, 0);
        //button.setPosition(leftX, 0);
        ////button.addClickEventListener(angel_btn_event);
        //layout.addChild(button);
        //var label1 = new cc.LabelTTF("天国行きの参加者");
        //label1.setFontName(GAME_FONT.PRO_W6);
        //label1.setFontSize(44);
        //label1.setFontFillColor(cc.color(111,205,193,255));
        //label1.setScanPhixelRGB();
        //label1.setAnchorPoint(cc.p(0, 0));
        //label1.setPosition(button.getPositionX() + imageWH + midX, button.getContentSize().height/2 + 8);
        //layout.addChild(label1);
        //var label2 = new cc.LabelTTF("天使が微笑んだ幸運の持ち主は？");
        //label2.setFontName(GAME_FONT.PRO_W3);
        //label2.setFontSize(30);
        //label2.setFontFillColor(cc.color(111,205,193,255));
        //label2.setScanPhixelRGB();
        //label2.setAnchorPoint(cc.p(0, 1));
        //label2.setPosition(label1.getPositionX(), button.getContentSize().height/2 - 8);
        //layout.addChild(label2);

        var layout = new ccui.Layout();//平民
        layout.setContentSize(cc.winSize.width, _height + imageWH);
        layout.setAnchorPoint(0, 1);
        layout.setPosition(0, cc.winSize.height-100-(_height + imageWH));
        layout.setTouchEnabled(true);
        layout.addClickEventListener(normal_btn_event);
        listView.pushBackCustomItem(layout);

        var button = new cc.Sprite(ADDutchpayRes.normal_button);
        button.setAnchorPoint(0.5, 0);
        button.setPosition(layout.getContentSize().width/2, 20 + 32);
        layout.addChild(button);
        var label1 = new cc.LabelTTF("現世のままの参加者?");
        label1.setFontName(GAME_FONT.PRO_W6);
        label1.setFontSize(32);
        label1.setFontFillColor(cc.color(111,205,193,255));
        label1.setAnchorPoint(cc.p(0.5, 0));
        label1.setPosition(button.getPositionX(), 0);
        layout.addChild(label1);
        //var button = new cc.Sprite(ADDutchpayRes.normal_button);
        //button.setAnchorPoint(0, 0);
        //button.setPosition(leftX, 0);
        ////button.addClickEventListener(normal_btn_event);
        //layout.addChild(button);
        //var label1 = new cc.LabelTTF("現世のままの参加者");
        //label1.setFontName(GAME_FONT.PRO_W6);
        //label1.setFontSize(44);
        //label1.setFontFillColor(cc.color(111,205,193,255));
        //label1.setScanPhixelRGB();
        //label1.setAnchorPoint(cc.p(0, 0));
        //label1.setPosition(button.getPositionX() + imageWH + midX, button.getContentSize().height/2 + 8);
        //layout.addChild(label1);
        //var label2 = new cc.LabelTTF("天国でも地獄でもない普通の人は？");
        //label2.setFontName(GAME_FONT.PRO_W3);
        //label2.setFontSize(30);
        //label2.setFontFillColor(cc.color(111,205,193,255));
        //label2.setScanPhixelRGB();
        //label2.setAnchorPoint(cc.p(0, 1));
        //label2.setPosition(label1.getPositionX(), button.getContentSize().height/2 - 8);
        //layout.addChild(label2);

        var layout = new ccui.Layout();//恶魔
        layout.setContentSize(cc.winSize.width, _height + imageWH);
        layout.setAnchorPoint(0, 1);
        layout.setPosition(0, cc.winSize.height-100-2*(_height + imageWH));
        layout.setTouchEnabled(true);
        layout.addClickEventListener(devil_btn_event);
        listView.pushBackCustomItem(layout);

        var button = new cc.Sprite(ADDutchpayRes.devil_button);
        button.setAnchorPoint(0.5, 0);
        button.setPosition(layout.getContentSize().width/2, 20 + 32);
        layout.addChild(button);
        var label1 = new cc.LabelTTF("地獄行きの参加者?");
        label1.setFontName(GAME_FONT.PRO_W6);
        label1.setFontSize(32);
        label1.setFontFillColor(cc.color(111,205,193,255));
        label1.setAnchorPoint(cc.p(0.5, 0));
        label1.setPosition(button.getPositionX(), 0);
        layout.addChild(label1);
        //var button = new cc.Sprite(ADDutchpayRes.devil_button);
        //button.setAnchorPoint(0, 0);
        //button.setPosition(leftX, 0);
        ////button.addClickEventListener(devil_btn_event);
        //layout.addChild(button);
        //var label1 = new cc.LabelTTF("地獄行きの参加者");
        //label1.setFontName(GAME_FONT.PRO_W6);
        //label1.setFontSize(44);
        //label1.setFontFillColor(cc.color(111,205,193,255));
        //label1.setScanPhixelRGB();
        //label1.setAnchorPoint(cc.p(0, 0));
        //label1.setPosition(button.getPositionX() + imageWH + midX, button.getContentSize().height/2 + 8);
        //layout.addChild(label1);
        //var label2 = new cc.LabelTTF("悪魔につかまった不運な人は?");
        //label2.setFontName(GAME_FONT.PRO_W3);
        //label2.setFontSize(30);
        //label2.setFontFillColor(cc.color(111,205,193,255));
        //label2.setScanPhixelRGB();
        //label2.setAnchorPoint(cc.p(0, 1));
        //label2.setPosition(label1.getPositionX(), button.getContentSize().height/2 - 8);
        //layout.addChild(label2);

        if(is){
            this.m_back_func = null;
            var home_btn_touchevent = function(){
                _this.loadAngelView(obj);
            };

            var home_btn = new ccui.Layout();
            home_btn.setContentSize(300, 80);
            home_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            home_btn.setBackGroundColor(cc.color("#6fcdc1"));
            home_btn.setAnchorPoint(0.5, 0);
            home_btn.setPosition(layout.getContentSize().width>>1, 10);
            home_btn.setTouchEnabled(true);
            home_btn.addClickEventListener(home_btn_touchevent);
            this.addChild(home_btn);

            var home_btn_text = new cc.LabelTTF("データ読み込み");
            home_btn_text.setFontName(GAME_FONT.PRO_W3);
            home_btn_text.setFontSize(26);
            home_btn_text.setFontFillColor(cc.color("#ffffff"));
            home_btn_text.setAnchorPoint(0.5, 0.5);
            home_btn_text.setPosition(home_btn.getContentSize().width>>1, home_btn.getContentSize().height>>1);
            home_btn_text.setScanPhixelRGB();
            home_btn.addChild(home_btn_text);
        }else{
            var home_layout = new ccui.Layout();
            home_layout.setContentSize(300, 80);
            home_layout.setAnchorPoint(0, 0);
            home_layout.setPosition(cc.winSize.width/2 - (150+300+10)/2 - 5, 30);
            this.addChild(home_layout);

            var home_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            home_btn.setScale(home_layout.getContentSize().width, 80);
            home_btn.setAnchorPoint(0, 0);
            home_btn.setTouchEnabled(true);
            home_btn.addClickEventListener(showResult);
            home_layout.addChild(home_btn);

            var home_text = new cc.LabelTTF("全体結果を見る");
            home_text.setFontName(GAME_FONT.PRO_W3);
            home_text.setFontSize(26);
            home_text.setFontFillColor(cc.color(255,255,255,255));
            home_text.setScanPhixelRGB();
            home_text.setAnchorPoint(0.5, 0.5);
            home_text.setPosition(home_layout.getContentSize().width/2, home_layout.getContentSize().height/2);
            home_layout.addChild(home_text);

            var next_layout = new ccui.Layout();
            next_layout.setContentSize(150, 80);
            next_layout.setAnchorPoint(0, 0);
            next_layout.setPosition(cc.winSize.width/2 - (150+300+10)/2 - 5 + 10 + home_layout.getContentSize().width, 30);
            this.addChild(next_layout);

            var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            next_btn.setScale(next_layout.getContentSize().width, 80);
            next_btn.setAnchorPoint(0, 0);
            next_btn.setTouchEnabled(true);
            next_btn.addClickEventListener(home_btn_touchevent);
            next_layout.addChild(next_btn);

            var next_text = new cc.LabelTTF("ホーム");
            next_text.setFontName(GAME_FONT.PRO_W3);
            next_text.setFontSize(26);
            next_text.setFontFillColor(cc.color(255,255,255,255));
            next_text.setScanPhixelRGB();
            next_text.setAnchorPoint(0.5, 0.5);
            next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
            next_layout.addChild(next_text);
        }


    },

    modeBtnCallback:function(node){
        var haveRandMode = false;
        if(!node.getParent().getChildByTag(1)){
            var _this = this;
            node.setTouchEnabled(false);
            node.getParent().getChildByTag(100).open();

            var close_layout = new ccui.Layout();
            close_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            close_layout.setAnchorPoint(0, 0);
            close_layout.setTag(4);
            close_layout.setTouchEnabled(true);
            var close_layout_event = function(){
                angel_play_btn = node.getParent().getChildByTag(1);
                if(haveRandMode)
                    random_play_btn = node.getParent().getChildByTag(2);
                equal_play_btn = node.getParent().getChildByTag(3);
                var func = function(){
                    node.getParent().removeChildByTag(1);
                    node.getParent().removeChildByTag(2);
                    node.getParent().removeChildByTag(3);
                    node.getParent().removeChildByTag(4);
                    node.getParent().getChildByTag(100).close();
                };
                angel_play_btn.runAction(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)));
                if(haveRandMode)
                    random_play_btn.runAction(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)));
                equal_play_btn.runAction(new cc.Sequence(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)), new cc.callFunc(func, this)));
            };
            close_layout.addTouchEventListener(close_layout_event);
            node.getParent().addChild(close_layout);

            var angel_play_btn = new ccui.Button(ADDutchpayRes.angel_play_btn, ADDutchpayRes.angel_play_btn);
            angel_play_btn.setTag(1);
            angel_play_btn.setAnchorPoint(cc.p(1, 0));
            angel_play_btn.setPosition(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2);
            angel_play_btn.addClickEventListener(function(){_this.loadAngelView();});
            var angel_play_text = new cc.LabelTTF("天国と地獄");
            angel_play_text.setFontName(GAME_FONT.PRO_W3);
            angel_play_text.setFontSize(36);
            angel_play_text.setFontFillColor(cc.color(255,243,191));
            angel_play_text.setScanPhixelRGB();
            angel_play_text.setAnchorPoint(1, 0);
            angel_play_text.setPosition(-20, angel_play_btn.getContentSize().height/2);
            var angel_play_text1 = new cc.LabelTTF("１人がタダ、１人が２倍支払う");
            angel_play_text1.setFontName(GAME_FONT.PRO_W3);
            angel_play_text1.setFontSize(28);
            angel_play_text1.setFontFillColor(cc.color("#6fcdc1"));
            angel_play_text1.setScanPhixelRGB();
            angel_play_text1.setAnchorPoint(1, 1);
            angel_play_text1.setPosition(-20, angel_play_btn.getContentSize().height/2);
            angel_play_btn.addChild(angel_play_text);
            angel_play_btn.addChild(angel_play_text1);
            var action = new cc.MoveTo(0.2,cc.p(angel_play_btn.getPosition().x, node.y+node.getBoundingBox().height + 22));
            angel_play_btn.runAction(action);
            node.getParent().addChild(angel_play_btn);
            if(haveRandMode){
                var random_play_btn = new ccui.Button(ADDutchpayRes.random_play_btn, ADDutchpayRes.random_play_btn);
                random_play_btn.setTag(2);
                random_play_btn.setAnchorPoint(cc.p(1, 0));
                random_play_btn.setPosition(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2);
                random_play_btn.addClickEventListener(function(){_this.loadRandomView();});
                var random_play_text = new cc.LabelTTF("ランダムモード");
                random_play_text.setFontName(GAME_FONT.PRO_W3);
                random_play_text.setFontSize(36);
                random_play_text.setFontFillColor(cc.color(255,243,191));
                random_play_text.setScanPhixelRGB();
                random_play_text.setAnchorPoint(1, 0);
                random_play_text.setPosition(-20, random_play_btn.getContentSize().height/2);
                var random_play_text1 = new cc.LabelTTF("設定した人數、%で割引設定ができる");
                random_play_text1.setFontName(GAME_FONT.PRO_W3);
                random_play_text1.setFontSize(28);
                random_play_text1.setFontFillColor(cc.color("#6fcdc1"));
                random_play_text1.setScanPhixelRGB();
                random_play_text1.setAnchorPoint(1, 1);
                random_play_text1.setPosition(-20, random_play_btn.getContentSize().height/2);
                random_play_btn.addChild(random_play_text);
                random_play_btn.addChild(random_play_text1);
                action = new cc.MoveTo(0.2,cc.p(random_play_btn.getPosition().x, node.y+node.getBoundingBox().height + 22 + 15 + angel_play_btn.getBoundingBox().height));
                random_play_btn.runAction(action);
                node.getParent().addChild(random_play_btn);
            }


            var equal_play_btn = new ccui.Button(ADDutchpayRes.equal_play_btn, ADDutchpayRes.equal_play_btn);
            equal_play_btn.setTag(3);
            equal_play_btn.setAnchorPoint(cc.p(1, 0));
            equal_play_btn.setPosition(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2);
            equal_play_btn.addClickEventListener(function(){_this.loadEqualView();});
            var equal_play_text = new cc.LabelTTF("均等モード");
            equal_play_text.setFontName(GAME_FONT.PRO_W3);
            equal_play_text.setFontSize(36);
            equal_play_text.setFontFillColor(cc.color(255,243,191));
            equal_play_text.setScanPhixelRGB();
            equal_play_text.setAnchorPoint(1, 0);
            equal_play_text.setPosition(-20, equal_play_btn.getContentSize().height/2);
            var equal_play_text1 = new cc.LabelTTF("全額を均等に分ける");
            equal_play_text1.setFontName(GAME_FONT.PRO_W3);
            equal_play_text1.setFontSize(28);
            equal_play_text1.setFontFillColor(cc.color("#6fcdc1"));
            equal_play_text1.setScanPhixelRGB();
            equal_play_text1.setAnchorPoint(1, 1);
            equal_play_text1.setPosition(-20, equal_play_btn.getContentSize().height/2);
            equal_play_btn.addChild(equal_play_text);
            equal_play_btn.addChild(equal_play_text1);
            if(haveRandMode) {
                action = new cc.Sequence(new cc.MoveTo(0.2, cc.p(equal_play_btn.getPosition().x,
                    node.y + node.getBoundingBox().height + 22 + 30 + angel_play_btn.getBoundingBox().height + random_play_btn.getBoundingBox().height)),
                    new cc.callFunc(function () {node.setTouchEnabled(true);}, this));
            }else{
                action = new cc.Sequence(new cc.MoveTo(0.2,cc.p(equal_play_btn.getPosition().x,
                    node.y+node.getBoundingBox().height + 22 + 15 + angel_play_btn.getBoundingBox().height)),
                    new cc.callFunc(function () {node.setTouchEnabled(true);}, this));
            }
            equal_play_btn.runAction(action);
            node.getParent().addChild(equal_play_btn);
        }else{
            angel_play_btn = node.getParent().getChildByTag(1);
            if(haveRandMode)
                random_play_btn = node.getParent().getChildByTag(2);
            equal_play_btn = node.getParent().getChildByTag(3);
            var func = function(){
                node.getParent().removeChildByTag(1);
                node.getParent().removeChildByTag(2);
                node.getParent().removeChildByTag(3);
                node.getParent().removeChildByTag(4);
                node.getParent().getChildByTag(100).close();
            };
            angel_play_btn.runAction(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)));
            if(haveRandMode)
                random_play_btn.runAction(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)));
            equal_play_btn.runAction(new cc.Sequence(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)), new cc.callFunc(func, this)));


        }
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
            case context.STATE_EQUAL:
            case context.STATE_RANDOM:
                if(context.m_isResult){
                    context.m_back_func();

                }else{
                    context.loadMainView();
                }
            break;
            case context.STATE_ANGEL:
                context.loadMainView();
                break;
            case context.STATE_ANGEL_RESULT:
                if(context.m_back_func)
                    context.m_back_func();
                else
                    context.loadMainView();
                break;
        }
    }

});

var ADDutchpayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new ADDutchpayLayer();
        this.addChild(layer);
    }
});