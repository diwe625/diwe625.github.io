/**
 * Created by nhnst on 11/4/15.
 * 사랑의 붉은실（爱情红线）
 */
var LoveRedLineLayer = cc.LayerColor.extend({

    m_male:null,
    m_women:null,
    m_sex:null,
    m_tableMode:null,
    m_groupMode:null,
    m_state:-1,
    STATE_MAIN:0,
    STATE_MEMBERSETTING:1,
    STATE_ENVIRONMENTSETTING:2,
    STATE_TAGBELRESULT:3,
    STATE_CHOOSEVIEW:4,
    STATE_REDLINERESULTVIEW:5,
    STATE_REDLINERESULTVIEW2:6,
    m_history:false,
    m_func_isbacktomain:null,

    ctor:function () {
        this._super(cc.color(255,0,255,255));

        this.m_male = new ArrayList();
        this.m_women = new ArrayList();
        this.m_sex = 0;
        this.m_tableMode = 0;//0--圆形 1--方形
        this.m_groupMode = 0;//0--男女分开 1--男女混合

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);
        //for(var i = 0 ; i < 12 ; i++){
        //    var obj = {icon:PAD((i+1), 2), name:"male"+i};
        //    this.m_male.add(obj);
        //
        //}
        //for(var i = 0 ; i < 2 ; i++){
        //    var obj = {icon:PAD((i+15+1), 2), name:"women"+i};
        //    this.m_women.add(obj);
        //}
        //
        //this.m_male.get(0).select = "women117";
        //this.m_women.get(1).select = "male001";
        //this.m_male.get(2).select = "women016";
        //this.m_male.get(1).select = "women016";
        //this.m_male.get(0).select = "women016";


        //DataManager.instance().removeData(GAME_TYPE.LoveRedLine.name + "_history");

        this.loadMainView();

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.LoveRedLine);

        Utility.sendXhr(GAME_TYPE.LoveRedLine.gameid);

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
                case context.STATE_TAGBELRESULT:
                    context.loadTabelResult(true);
                    break;
                case context.STATE_REDLINERESULTVIEW2:
                    context.loadRedLineResultView2(true);
                    break;
            }
            Utility.checkRfresh = false;
        }
    },

    loadMainView:function(){
        this.m_state = this.STATE_MAIN;

        this.m_male.clear();
        this.m_women.clear();
        this.m_sex = 0;
        this.m_tableMode = 0;//0--圆形 1--方形
        this.m_groupMode = 0;//0--男女分开 1--男女混合

        this.removeAllChildren();
        var toolbar = new Toolbar(GAME_TYPE.LoveRedLine);
        toolbar.setTag(4);
        toolbar.setName("toolBar");
        toolbar.setAnchorPoint(cc.p(0,1));
        toolbar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolbar, 9999);

        var bg1 = new cc.Sprite(LoveRedLineRes.bg);
        bg1.setAnchorPoint(cc.p(0, 0));
        bg1.setPosition(cc.p(0, 0));
        this.addChild(bg1);

        var top_000 = new cc.Sprite();
        top_000.setAnchorPoint(0, 1);
        top_000.setPosition(0, cc.winSize.height-100);
        var frames = [];
        for(var i = 0 ; i < 11; i++){
            frames.push(new cc.SpriteFrame("res/Scene/LoveRedLine/top" + (i+1) + ".png", new cc.Rect(0, 0, 750, 450)));
        }
        var animation = new cc.Animation(frames, 0.2);
        var animate = cc.animate(animation);

        frames = [];
        frames.push(new cc.SpriteFrame("res/Scene/LoveRedLine/top12.png", new cc.Rect(0, 0, 750, 450)));
        animation = new cc.Animation(frames, 1);
        var animate1 = cc.animate(animation);
        top_000.runAction(new cc.Sequence(animate, animate1).repeatForever());
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

        var historys = DataManager.instance().getHistory(GAME_TYPE.LoveRedLine);
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
                var topY = (layout.getContentSize().height - (40 + 30 + 10))/2;
                var btnImage = historys.get(i).data.mode === "seat"? LoveRedLineRes.seat_list_btn : LoveRedLineRes.love_list_btn;
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

                //var str = "";
                //for(var j = 0; j < historys.get(i).data.groups.length; j++){
                //    if(j == historys.get(i).data.groups.length-1){
                //        str += historys.get(i).data.groups[j].name;
                //        break;
                //    }
                //    str += historys.get(i).data.groups[j].name + "、";
                //}
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

                str = "";
                for(j = 0; j < historys.get(i).data.male.length; j++){
                    str+=historys.get(i).data.male[j].name;
                }
                for(j = 0; j < historys.get(i).data.women.length; j++){
                    str+=historys.get(i).data.women[j].name;
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
                var mode = historys.get(i).data.mode;

                replay_btn.setUserData({male:historys.get(i).data.male, women:historys.get(i).data.women, mode:mode});
                var replay_event = function(node){
                    for(var j = 0 ; j < node.getUserData().male.length; j++){
                        _this.m_male.add(node.getUserData().male[j]);
                        if(node.getUserData().male[j].select){
                            delete node.getUserData().male[j].select;
                        }
                    }
                    for(var j = 0 ; j < node.getUserData().women.length; j++){
                        _this.m_women.add(node.getUserData().women[j]);
                        if(node.getUserData().women[j].select){
                            delete node.getUserData().women[j].select;
                        }
                    }
                    _this.loadMemberSettingView(node.getUserData().mode!=="seat");
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
                                var arm = sender.getUserData().data.groups;
                                var year = sender.getUserData().year;
                                var month = sender.getUserData().month;
                                var day = sender.getUserData().day;
                                for(var j = 0 ; j < sender.getUserData().data.male.length; j++){
                                    _this.m_male.add(sender.getUserData().data.male[j]);
                                }
                                for(var j = 0 ; j < sender.getUserData().data.women.length; j++){
                                    _this.m_women.add(sender.getUserData().data.women[j]);
                                }
                                if(sender.getUserData().data.mode === "seat"){
                                    _this.m_tableMode = sender.getUserData().data.tableMode;
                                    _this.m_groupMode = sender.getUserData().data.groupMode;
                                    _this.loadTabelResult(true);
                                }else{
                                    _this.loadRedLineResultView2(true);
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
        mask.setTag(3);
        mask.close();
        this.addChild(mask);

        var mode_Btn = new ccui.Button(LoveRedLineRes.start_btn, LoveRedLineRes.start_btn);
        mode_Btn.setTag(0);
        mode_Btn.setAnchorPoint(cc.p(1, 0));
        mode_Btn.setPosition(cc.p(cc.winSize.width-22, 30));
        var _this = this;
        mode_Btn.addClickEventListener(function(){_this.modeBtnCallback(mode_Btn);});
        this.addChild(mode_Btn, 999);
    },


    modeBtnCallback:function(node){
        if(!node.getParent().getChildByTag(1)){
            var _this = this;
            node.setTouchEnabled(false);
            node.getParent().getChildByTag(3).open();

            var close_layout = new ccui.Layout();
            close_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            close_layout.setAnchorPoint(0, 0);
            close_layout.setTag(4);
            close_layout.setTouchEnabled(true);
            var close_layout_event = function(){
                simple_play_btn = node.getParent().getChildByTag(1);
                setting_play_btn = node.getParent().getChildByTag(2);
                var func = function(){
                    node.getParent().removeChildByTag(1);
                    node.getParent().removeChildByTag(2);
                    node.getParent().removeChildByTag(4);
                    node.getParent().getChildByTag(3).close();
                };
                simple_play_btn.runAction(new cc.Sequence(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)), new cc.callFunc(func, this)));
                setting_play_btn.runAction(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)));
            };
            close_layout.addTouchEventListener(close_layout_event);
            node.getParent().addChild(close_layout);

            var simple_play_btn = new ccui.Button(LoveRedLineRes.seat_play_btn, LoveRedLineRes.seat_play_btn);
            simple_play_btn.setTag(1);
            simple_play_btn.setAnchorPoint(cc.p(1, 0));
            simple_play_btn.setPosition(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2);
            simple_play_btn.addClickEventListener(function(){_this.loadMemberSettingView(false);});
            var simple_play_text = new cc.LabelTTF("席順を決める");
            simple_play_text.setFontName(GAME_FONT.PRO_W3);
            simple_play_text.setFontSize(36);
            simple_play_text.setFontFillColor(cc.color(255,243,191));
            simple_play_text.setScanPhixelRGB();
            simple_play_text.setAnchorPoint(1, 0);
            simple_play_text.setPosition(-20, simple_play_btn.getContentSize().height/2);
            simple_play_btn.addChild(simple_play_text);
            var simple_play_text1 = new cc.LabelTTF("テーブルに座る男女の順番を決める");
            simple_play_text1.setFontName(GAME_FONT.PRO_W3);
            simple_play_text1.setFontSize(28);
            simple_play_text1.setFontFillColor(cc.color("#6fcdc1"));
            simple_play_text1.setScanPhixelRGB();
            simple_play_text1.setAnchorPoint(1, 1);
            simple_play_text1.setPosition(-20, simple_play_btn.getContentSize().height/2);
            simple_play_btn.addChild(simple_play_text1);
            var action = new cc.Sequence(new cc.MoveTo(0.2,cc.p(simple_play_btn.getPosition().x, node.y+node.getBoundingBox().height + 22 + 15 + simple_play_btn.getBoundingBox().height)), new cc.callFunc(function(){node.setTouchEnabled(true);}, this));
            simple_play_btn.runAction(action);

            node.getParent().addChild(simple_play_btn);
            var setting_play_btn = new ccui.Button(LoveRedLineRes.love_play_btn, LoveRedLineRes.love_play_btn);
            setting_play_btn.setTag(2);
            setting_play_btn.setAnchorPoint(cc.p(1, 0));
            setting_play_btn.setPosition(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2);
            setting_play_btn.addClickEventListener(function(){_this.loadMemberSettingView(true);});
            var setting_play_text = new cc.LabelTTF("運命の赤い糸");
            setting_play_text.setFontName(GAME_FONT.PRO_W3);
            setting_play_text.setFontSize(36);
            setting_play_text.setFontFillColor(cc.color(255,243,191));
            setting_play_text.setScanPhixelRGB();
            setting_play_text.setAnchorPoint(1, 0);
            setting_play_text.setPosition(-20, setting_play_btn.getContentSize().height/2);
            setting_play_btn.addChild(setting_play_text);
            var setting_play_text1 = new cc.LabelTTF("好みの異性同士を結びつける");
            setting_play_text1.setFontName(GAME_FONT.PRO_W3);
            setting_play_text1.setFontSize(28);
            setting_play_text1.setFontFillColor(cc.color("#6fcdc1"));
            setting_play_text1.setScanPhixelRGB();
            setting_play_text1.setAnchorPoint(1, 1);
            setting_play_text1.setPosition(-20, setting_play_btn.getContentSize().height/2);
            setting_play_btn.addChild(setting_play_text1);
            action = new cc.MoveTo(0.2,cc.p(setting_play_btn.getPosition().x, node.y+node.getBoundingBox().height + 22));
            setting_play_btn.runAction(action);
            node.getParent().addChild(setting_play_btn);
        }else{
            simple_play_btn = node.getParent().getChildByTag(1);
            setting_play_btn = node.getParent().getChildByTag(2);
            var func = function(){
                node.getParent().removeChildByTag(1);
                node.getParent().removeChildByTag(2);
                node.getParent().removeChildByTag(4);
                node.getParent().getChildByTag(3).close();
            };
            simple_play_btn.runAction(new cc.Sequence(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)), new cc.callFunc(func, this)));
            setting_play_btn.runAction(new cc.MoveTo(0.2,cc.p(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2)));
        }
    },

    loadMemberSettingView : function(quick){
        this.m_state = this.STATE_MEMBERSETTING;
        var _this = this;

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

        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255,255,255,255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(cc.p(0, 1));
        title.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("参加者登錄");
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-50));
        this.addChild(titleName);

        var count_label2 = new cc.LabelTTF("00");
        var count_label4 = new cc.LabelTTF("00");
        var next_btn = new ccui.Button(GlobalRes.color_c8c8c8, GlobalRes.color_c8c8c8);
        next_btn.setTouchEnabled(false);

        var addMember = function(listView, data, count_label){
            var layout = new ccui.Layout();
            layout.setUserData(data);
            layout.setContentSize(750, 182);
            var icon = new cc.Sprite("res/Global/cha_pop/cha_thumb_" + data.icon + ".png");
            icon.setAnchorPoint(0, 0.5);
            icon.setPosition(30, layout.getContentSize().height-90);
            layout.addChild(icon);
            var name = new cc.LabelTTF(data.name);
            name.setFontName(GAME_FONT.PRO_W6);
            name.setFontSize(36);
            name.setFontFillColor(cc.color(111,205,193,255));
            name.setScanPhixelRGB();
            name.setAnchorPoint(0,0.5);
            name.setPosition(icon.getPosition().x + icon.getContentSize().width + 30, icon.getPosition().y+2);
            layout.addChild(name);
            //添加删除按钮
            var delete_btn_touchevent = function(){
                listView.removeItem(listView.getIndex(layout));
                count_label.setString(""+PAD(listView.getItems().length, 2));
                if(listView_male.getItems().length >= 2 && listView_women.getItems().length >= 2){
                    next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                    next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                    next_btn.setTouchEnabled(true);
                }else{
                    next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                    next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                    next_btn.setTouchEnabled(false);
                }
            };
            var btnLayout = new ccui.Layout();
            btnLayout.setContentSize(200, layout.getContentSize().height);
            btnLayout.setAnchorPoint(1, 0.5);
            btnLayout.setPosition(layout.getContentSize().width, icon.getPosition().y);
            btnLayout.setTouchEnabled(true);
            btnLayout.addClickEventListener(delete_btn_touchevent);
            layout.addChild(btnLayout);
            var delete_btn = new ccui.Button(GlobalRes.delete_png, GlobalRes.delete_png);
            delete_btn.setAnchorPoint(0.5, 0.5);
            delete_btn.setTouchEnabled(false);
            delete_btn.setPosition(btnLayout.getContentSize().width/2, btnLayout.getContentSize().height/2);
            btnLayout.addChild(delete_btn);

            var cutoff = new cc.Sprite(GlobalRes.line_8);
            cutoff.setAnchorPoint(0, 0);
            cutoff.setScaleX(layout.getContentSize().width);
            cutoff.setScaleY(0.25);
            layout.addChild(cutoff);

            listView.pushBackDefaultItem();
            listView.pushBackCustomItem(layout);
            count_label.setString(""+PAD(listView.getItems().length, 2));
        };

        //分割线
        var grayLine = new cc.Sprite(GlobalRes.line_50);
        grayLine.setScaleX(cc.winSize.width);
        grayLine.setAnchorPoint(cc.p(0, 1));
        grayLine.setPosition(cc.p(0, cc.winSize.height-100-100 - 8 - 180 -8));
        this.addChild(grayLine);

        var cclabel1 = new cc.LabelTTF("男女の参加者を各２人以上登録してください");
        cclabel1.setFontName(GAME_FONT.PRO_W3);
        cclabel1.setFontSize(26);
        cclabel1.setFontFillColor(cc.color(153,153,153,255));
        cclabel1.setAnchorPoint(0.5, 0.5);
        cclabel1.setPosition(cc.winSize.width/2, grayLine.getPosition().y - 30);
        this.addChild(cclabel1);

        //组列表
        var listView_male = new ccui.ListView();
        // set list view ex direction
        listView_male.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView_male.setTouchEnabled(true);
        listView_male.setBounceEnabled(false);
        listView_male.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - 100 - 8 - 8 - 180 - 200 - 50));
        listView_male.setAnchorPoint(0, 1);
        listView_male.setPosition(0, cc.winSize.height-100-100 - 8 - 180 -8 - 50);
        listView_male.setVisible(true);
        this.addChild(listView_male);

        for(var i = 0 ;i < this.m_male.size(); i ++){
            addMember(listView_male, this.m_male.get(i), count_label2);
        }

        var listView_women = new ccui.ListView();
        // set list view ex direction
        listView_women.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView_women.setTouchEnabled(true);
        listView_women.setBounceEnabled(false);
        listView_women.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - 100 - 8 - 8 - 180 - 200 - 50));
        listView_women.setAnchorPoint(0, 1);
        listView_women.setPosition(0, cc.winSize.height-100-100 - 8 - 180 -8 - 50);
        listView_women.setVisible(false);
        this.addChild(listView_women);

        for(var i = 0 ;i < this.m_women.size(); i ++){
            addMember(listView_women, this.m_women.get(i), count_label4);
        }

        this.m_male.clear();
        this.m_women.clear();
        if(listView_male.getItems().length >= 2 && listView_women.getItems().length >= 2){
            next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
            next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
            next_btn.setTouchEnabled(true);
        }else{
            next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
            next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
            next_btn.setTouchEnabled(false);
        }

        var male_radio_text = new cc.LabelTTF("♂男性");
        male_radio_text.setAnchorPoint(0.5, 0.5);
        male_radio_text.setPosition(cc.winSize.width/2/2, (100-6)/2);
        male_radio_text.setFontName(GAME_FONT.PRO_W3);
        male_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
        male_radio_text.setScanPhixelRGB();
        male_radio_text.setFontSize(32);

        var male_radio_selected = new ccui.Layout();
        male_radio_selected.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        male_radio_selected.setBackGroundColor(cc.color(111,205,193,255));
        male_radio_selected.setContentSize(cc.winSize.width/2, 6);
        male_radio_selected.setAnchorPoint(0, 0);
        male_radio_selected.setPosition(0, 0);

        var male_radio = new ccui.Layout();
        male_radio.setContentSize(cc.winSize.width/2, 100);
        male_radio.setAnchorPoint(0, 1);
        male_radio.setPosition(0, cc.winSize.height-100);
        male_radio.setTouchEnabled(true);
        male_radio.addChild(male_radio_text);
        male_radio.addChild(male_radio_selected);
        male_radio.radiotext = male_radio_text;
        male_radio.isSelected = male_radio_selected;
        male_radio.selected = function(is){
            if(is){
                _this.m_sex = 0;
                this.radiotext.removeFromParent();
                var male_radio_text = new cc.LabelTTF("♂男性");
                male_radio_text.setAnchorPoint(0.5, 0.5);
                male_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                male_radio_text.setFontName(GAME_FONT.PRO_W3);
                male_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
                male_radio_text.setScanPhixelRGB();
                male_radio_text.setFontSize(32);
                this.radiotext = male_radio_text;
                this.addChild(male_radio_text);
                this.isSelected.setVisible(true);
                listView_male.setVisible(true);
            }else{
                this.radiotext.removeFromParent();
                var male_radio_text = new cc.LabelTTF("♂男性");
                male_radio_text.setAnchorPoint(0.5, 0.5);
                male_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                male_radio_text.setFontName(GAME_FONT.PRO_W3);
                male_radio_text.setFontFillColor(new cc.Color(200,200,200,255));
                male_radio_text.setScanPhixelRGB();
                male_radio_text.setFontSize(32);
                this.radiotext = male_radio_text;
                this.addChild(male_radio_text);
                this.isSelected.setVisible(false);
                listView_male.setVisible(false);
            }
        };
        male_radio.selected(true);
        this.addChild(male_radio);

        var women_radio_text = new cc.LabelTTF("♀女性");
        women_radio_text.setAnchorPoint(0.5, 0.5);
        women_radio_text.setPosition(cc.winSize.width/2/2, (100-6)/2);
        women_radio_text.setFontName(GAME_FONT.PRO_W3);
        women_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
        women_radio_text.setScanPhixelRGB();
        women_radio_text.setFontSize(32);

        var women_radio_selected = new ccui.Layout();
        women_radio_selected.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        women_radio_selected.setBackGroundColor(cc.color(111,205,193,255));
        women_radio_selected.setContentSize(cc.winSize.width/2, 6);
        women_radio_selected.setAnchorPoint(0, 0);
        women_radio_selected.setPosition(0, 0);

        var women_radio = new ccui.Layout();
        women_radio.setContentSize(cc.winSize.width/2, 100);
        women_radio.setAnchorPoint(0, 1);
        women_radio.setPosition(cc.winSize.width/2, cc.winSize.height-100);
        women_radio.setTouchEnabled(true);
        women_radio.addChild(women_radio_text);
        women_radio.addChild(women_radio_selected);
        women_radio.radiotext = women_radio_text;
        women_radio.isSelected = women_radio_selected;
        women_radio.selected = function(is){
            if(is){
                _this.m_sex = 1;
                this.radiotext.removeFromParent();
                var women_radio_text = new cc.LabelTTF("♀女性");
                women_radio_text.setAnchorPoint(0.5, 0.5);
                women_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                women_radio_text.setFontName(GAME_FONT.PRO_W3);
                women_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
                women_radio_text.setScanPhixelRGB();
                women_radio_text.setFontSize(32);
                this.radiotext = women_radio_text;
                this.addChild(women_radio_text);
                this.isSelected.setVisible(true);
                listView_women.setVisible(true);
            }else{
                this.radiotext.removeFromParent();
                var women_radio_text = new cc.LabelTTF("♀女性");
                women_radio_text.setAnchorPoint(0.5, 0.5);
                women_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                women_radio_text.setFontName(GAME_FONT.PRO_W3);
                women_radio_text.setFontFillColor(new cc.Color(200,200,200,255));
                women_radio_text.setScanPhixelRGB();
                women_radio_text.setFontSize(32);
                this.radiotext = women_radio_text;
                this.addChild(women_radio_text);
                this.isSelected.setVisible(false);
                listView_women.setVisible(false);
            }
        };
        women_radio.selected(false);
        this.addChild(women_radio);

        male_radio.addClickEventListener(function(){
            if(_this.m_sex == 1){
                cha_random_btn.loadTextureNormal(LoveRedLineRes.cha_thumb_random);
                cha_random_btn.loadTexturePressed(LoveRedLineRes.cha_thumb_random);
                //name_random_field.removeFromParent();
                //name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - cha_random_btn.getContentSize().width - addition_btn.getContentSize().width, 80),
                //    new cc.Scale9Sprite(),new cc.Scale9Sprite(),new cc.Scale9Sprite(),true);
                //name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                //name_random_field.setPlaceholderFontSize(36);
                //name_random_field.setPlaceHolder("名前に入力してください");
                //name_random_field.setAnchorPoint(cc.p(0,0.5));
                //name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30, cc.winSize.height - 100 -100-8 - 180/2);
                //name_random_field.setDelegate(_this);
                //name_random_field.setFontName(GAME_FONT.PRO_W3);
                //name_random_field.setFontColor(cc.color(111,205,193,255));
                //name_random_field.setFontSize(36);
                //name_random_field.setMaxLength(12);
                //_this.addChild(name_random_field);
                name_random_field.setString("");
                addition_btn.setVisible(false);
            }
            male_radio.selected(true);
            women_radio.selected(false);
        });

        women_radio.addClickEventListener(function(){
            if(_this.m_sex == 0){
                cha_random_btn.loadTextureNormal(LoveRedLineRes.cha_thumb_random);
                cha_random_btn.loadTexturePressed(LoveRedLineRes.cha_thumb_random);
                //name_random_field.removeFromParent();
                //name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - cha_random_btn.getContentSize().width - addition_btn.getContentSize().width, 80),
                //    new cc.Scale9Sprite(),new cc.Scale9Sprite(),new cc.Scale9Sprite(),true);
                //name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                //name_random_field.setPlaceholderFontSize(36);
                //name_random_field.setPlaceHolder("名前に入力してください");
                //name_random_field.setAnchorPoint(cc.p(0,0.5));
                //name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30, cc.winSize.height - 100 -100-8 - 180/2);
                //name_random_field.setDelegate(_this);
                //name_random_field.setFontName(GAME_FONT.PRO_W3);
                //name_random_field.setFontColor(cc.color(111,205,193,255));
                //name_random_field.setFontSize(36);
                //name_random_field.setMaxLength(12);
                //_this.addChild(name_random_field);
                name_random_field.setString("");
                addition_btn.setVisible(false);
            }
            male_radio.selected(false);
            women_radio.selected(true);
        });

        //分割线
        var grayLine = new cc.Sprite(GlobalRes.line_8);
        grayLine.setScaleX(cc.winSize.width);
        grayLine.setAnchorPoint(cc.p(0, 1));
        grayLine.setPosition(cc.p(0, cc.winSize.height-200));
        this.addChild(grayLine);


        var searchIndex = function(list, index){
            var items = [];
            for(var i = 0 ; i < list.getItems().length; i++){
                if(list.getItem(i).getUserData().index == index){
                    items.push(list.getItem(i));
                }
            }
            return items;
        };

        //“点击添加”按钮回调
        var cha_random_btn_event = function(){
            var listView = _this.m_sex == 0? listView_male : listView_women;

            if(listView.getItems().length == 15){
                return;
            }

            var fieldVisible = name_random_field.isVisible();
            name_random_field.setVisible(false);

            var cancel_layout = new ccui.Layout();
            cancel_layout.setTouchEnabled(true);
            cancel_layout.setContentSize(cc.winSize.width, cc.winSize.height);
            cancel_layout.setAnchorPoint(0.5,0.5);
            cancel_layout.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            _this.addChild(cancel_layout, 998);

            var cha_pop_layout = new ccui.Layout();
            cha_pop_layout.setTouchEnabled(true);
            cha_pop_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            cha_pop_layout.setBackGroundColor(cc.color(255,255,255,255));
            cha_pop_layout.setContentSize(570, 680);
            cha_pop_layout.setAnchorPoint(0.5,0.5);
            cha_pop_layout.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            _this.addChild(cha_pop_layout, 999);

            cancel_layout.addClickEventListener(function(){
                name_random_field.setVisible(fieldVisible);
                cha_pop_layout.removeFromParent();
                cancel_layout.removeFromParent();
                _this.getChildByTag(3).close();
            });

            var radioList = {};

            for(var i = 0 ; i < 16; i++){
                var flag = searchIndex(_this.m_sex == 0 ? listView_male : listView_women, i).length;
                var image = "res/Global/cha_pop/cha_pop_" + PAD(i+1, 2) + "_off.png";
                var radio = new ccui.Button(image, image);
                radio.setAnchorPoint(0, 1);
                radio.setPosition(55 + (radio.getContentSize().width + 40)*parseInt(i%4), cha_pop_layout.getContentSize().height - 60 - (radio.getContentSize().height + 40)*parseInt(i/4) );
                radio.setUserData({icon:""+PAD(i+1, 2) , name:cha_names[i], index:i});
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
                    SoundManager.instance().playEffect(LoveRedLineRes.sound_normal_1);
                    //if(node.getUserData().name == cha_names[14])
                    //    SoundManager.instance().playEffect(LoveRedLineRes.sound_character_selected_1);
                    //else if(node.getUserData().name == cha_names[0] ||
                    //    node.getUserData().name == cha_names[1] ||
                    //    node.getUserData().name == cha_names[8] ||
                    //    node.getUserData().name == cha_names[4])
                    //    SoundManager.instance().playEffect(LoveRedLineRes.sound_character_selected_2);
                    //else if(node.getUserData().name == cha_names[7] ||
                    //    node.getUserData().name == cha_names[6] ||
                    //    node.getUserData().name == cha_names[11] ||
                    //    node.getUserData().name == cha_names[2] ||
                    //    node.getUserData().name == cha_names[3])
                    //    SoundManager.instance().playEffect(LoveRedLineRes.sound_character_selected_3);
                    //else if(node.getUserData().name == cha_names[9] ||
                    //    node.getUserData().name == cha_names[5] ||
                    //    node.getUserData().name == cha_names[10] ||
                    //    node.getUserData().name == cha_names[12] ||
                    //    node.getUserData().name == cha_names[13])
                    //    SoundManager.instance().playEffect(LoveRedLineRes.sound_character_selected_4);
                };
                if(flag < 2)
                    radio.addClickEventListener(radio_touchevent);
                cha_pop_layout.addChild(radio);

                if(flag >= 2){
                    var sprite = new cc.Sprite(GroupingRes.cha_block);
                    sprite.setAnchorPoint(0, 1);
                    sprite.setPosition(55 + (radio.getContentSize().width + 40)*parseInt(i%4), cha_pop_layout.getContentSize().height - 60 - (radio.getContentSize().height + 40)*parseInt(i/4) );
                    cha_pop_layout.addChild(sprite);
                }
            }

            var ok_btn = new ccui.Layout();
            ok_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            ok_btn.setBackGroundColor(cc.color(111,205,193,255));
            ok_btn.setContentSize(570, 100);
            ok_btn.setAnchorPoint(0,0);
            ok_btn.setTouchEnabled(true);
            cha_pop_layout.addChild(ok_btn);
            var ok_btn_text = new cc.LabelTTF("確認");
            ok_btn_text.setFontName(GAME_FONT.PRO_W3);
            ok_btn_text.setFontSize(36);
            ok_btn_text.setAnchorPoint(0.5,0.5);
            ok_btn_text.setPosition(ok_btn.getContentSize().width/2, ok_btn.getContentSize().height/2);
            ok_btn.addChild(ok_btn_text);
            var ok_btn_touchevent = function(){
                if(radioList.current){
                    var obj = {};
                    if(radioList.current.getUserData().name === "random"){
                        var index = Math.floor(Math.random()*15);
                        while(searchIndex(_this.m_sex == 0 ? listView_male : listView_women, index).length == 2){
                            index = Math.floor(Math.random()*15);
                        }
                        if(searchIndex(_this.m_sex == 0 ? listView_male : listView_women, index).length == 1){
                            if(searchIndex(_this.m_sex == 0 ? listView_male : listView_women, index)[0].getUserData().icon.indexOf("_b") == -1){
                                obj.icon = ""+PAD((_this.m_sex == 0 ? index : index+15)+1, 2)+"_b";
                            }else{
                                obj.icon = ""+PAD((_this.m_sex == 0 ? index : index+15)+1, 2);
                            }
                        }else{
                            obj.icon = searchIndex(_this.m_sex == 0 ? listView_male : listView_women, index).length == 0 ? ""+PAD((_this.m_sex == 0 ? index : index+15)+1, 2) : ""+PAD((_this.m_sex == 0 ? index : index+15)+1, 2)+"_b";
                        }
                        obj.name = cha_names[index];
                        obj.index = index;
                    }else{
                        obj.index = radioList.current.getUserData().index;
                        if(searchIndex(_this.m_sex == 0 ? listView_male : listView_women, obj.index).length == 1){
                            if(searchIndex(_this.m_sex == 0 ? listView_male : listView_women, obj.index)[0].getUserData().icon.indexOf("_b") == -1){
                                obj.icon = ""+PAD((_this.m_sex == 0 ? obj.index : obj.index+15)+1, 2)+"_b";
                            }else{
                                obj.icon = ""+PAD((_this.m_sex == 0 ? obj.index : obj.index+15)+1, 2);
                            }
                        }else{
                            obj.icon = searchIndex(_this.m_sex == 0 ? listView_male : listView_women, obj.index).length == 0 ? ""+PAD((_this.m_sex == 0 ? obj.index : obj.index+15)+1, 2) : ""+PAD((_this.m_sex == 0 ? obj.index : obj.index+15)+1, 2)+"_b";
                        }
                        obj.name = radioList.current.getUserData().name;
                    }
                    cha_random_btn.loadTextureNormal("res/Global/cha_pop/cha_thumb_" + obj.icon + ".png");
                    cha_random_btn.loadTexturePressed("res/Global/cha_pop/cha_thumb_" + obj.icon + ".png");
                    cha_random_btn.setUserData(obj);
                    cha_random_btn.setAnchorPoint(0, 0.5);
                    cha_random_btn.setPosition(30, cc.winSize.height-100-100-8-180/2);
                    addition_btn.setVisible(true);

                    if(1){
                        //直接获得焦点
                        name_random_field.removeFromParent();
                        name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - cha_random_btn.getContentSize().width - addition_btn.getContentSize().width, 180),
                            new cc.Scale9Sprite(),null,null,true);
                        name_random_field.setBodyStyle(1);
                        //name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                        name_random_field.setPlaceholderFontSize(36);
                        name_random_field.setPlaceHolder("");
                        name_random_field.setAnchorPoint(cc.p(0,0.5));
                        name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30, cc.winSize.height - 100 -100-8 - 180/2);
                        name_random_field.setDelegate(this);
                        name_random_field.setFontName(GAME_FONT.PRO_W3);
                        name_random_field.setFontColor(cc.color(111,205,193,255));
                        name_random_field.setFontSize(36);
                        name_random_field.setMaxLength(12);
                        _this.addChild(name_random_field);
                        //name_random_field.setVisible(false);
                        name_random_field.setTag(6);
                        name_random_field.setDisFocusCallback(isPlaceholder);
                        ok_btn = new ccui.Button();
                        ok_btn.setTitleText("確認");
                        name_random_field.setInputfocus();
                    }

                    name_random_field.setString(obj.name);
                    name_random_field.setUserData(obj.name);
                }else{
                    name_random_field.setVisible(fieldVisible);
                }
                cha_pop_layout.removeFromParent();
                cancel_layout.removeFromParent();
                _this.getChildByTag(3).close();
            };
            ok_btn.addClickEventListener(ok_btn_touchevent);
            _this.getChildByTag(3).open();
        };

        //“点击添加”按钮
        var cha_random_btn = new ccui.Button(LoveRedLineRes.cha_thumb_random, LoveRedLineRes.cha_thumb_random);
        cha_random_btn.setAnchorPoint(0, 0.5);
        cha_random_btn.setPosition(30, cc.winSize.height-100-100-8-180/2);
        cha_random_btn.addClickEventListener(cha_random_btn_event);
        this.addChild(cha_random_btn);


        var addition_btn_touchevent = function(){
            var listView = _this.m_sex == 0? listView_male : listView_women;
            var count_label = _this.m_sex == 0? count_label2 : count_label4;

            if(listView.getItems().length == 15){
                return;
            }

            if(name_random_field.getString() && name_random_field.getString() !== ""){
                var data = {};
                data.icon = cha_random_btn.getUserData().icon;
                data.index = cha_random_btn.getUserData().index;
                data.sex = _this.m_sex;
                data.name = name_random_field.getString();
                var layout = new ccui.Layout();
                layout.setUserData(data);
                layout.setContentSize(750, 182);
                var icon = new cc.Sprite("res/Global/cha_pop/cha_thumb_" + data.icon + ".png");
                icon.setAnchorPoint(0, 0.5);
                icon.setPosition(30, layout.getContentSize().height-90);
                layout.addChild(icon);
                var name = new cc.LabelTTF(data.name);
                name.setFontName(GAME_FONT.PRO_W6);
                name.setFontSize(36);
                name.setFontFillColor(cc.color(111,205,193,255));
                name.setScanPhixelRGB();
                name.setAnchorPoint(0,0.5);
                name.setPosition(icon.getPosition().x + icon.getContentSize().width + 30, icon.getPosition().y+2);
                layout.addChild(name);


                var delete_btn_touchevent = function(){
                    listView.removeItem(listView.getIndex(layout));
                    count_label.setString(""+PAD(listView.getItems().length, 2));
                    if(listView_male.getItems().length >= 2 && listView_women.getItems().length >= 2){
                        next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                        next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                        next_btn.setTouchEnabled(true);
                    }else{
                        next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                        next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                        next_btn.setTouchEnabled(false);
                    }
                };
                var btnLayout = new ccui.Layout();
                btnLayout.setContentSize(200, layout.getContentSize().height);
                btnLayout.setAnchorPoint(1, 0.5);
                btnLayout.setPosition(layout.getContentSize().width, icon.getPosition().y);
                btnLayout.setTouchEnabled(true);
                btnLayout.addClickEventListener(delete_btn_touchevent);
                layout.addChild(btnLayout);
                var delete_btn = new ccui.Button(GlobalRes.delete_png, GlobalRes.delete_png);
                delete_btn.setAnchorPoint(0.5, 0.5);
                delete_btn.setTouchEnabled(false);
                delete_btn.setPosition(btnLayout.getContentSize().width/2, btnLayout.getContentSize().height/2);
                btnLayout.addChild(delete_btn);

                var cutoff = new cc.Sprite(GlobalRes.line_8);
                cutoff.setAnchorPoint(0, 0);
                cutoff.setScaleX(layout.getContentSize().width);
                cutoff.setScaleY(0.25);
                layout.addChild(cutoff);

                listView.pushBackDefaultItem();
                listView.pushBackCustomItem(layout);
                count_label.setString(""+PAD(listView.getItems().length, 2));

                if(listView_male.getItems().length >= 2 && listView_women.getItems().length >= 2){
                    next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                    next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                    next_btn.setTouchEnabled(true);
                }else{
                    next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                    next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                    next_btn.setTouchEnabled(false);
                }
                name_random_field.setString("");
                name_random_field.setInputblur();
                addition_btn.setVisible(false);
                cha_random_btn.loadTextureNormal(LoveRedLineRes.cha_thumb_random);
                cha_random_btn.loadTexturePressed(LoveRedLineRes.cha_thumb_random);
                cha_random_btn.setUserData("");
            }else{
                alert("名前に入力してください");
            }
        };
        var addition_btn = new ccui.Button(GlobalRes.addition_btn, GlobalRes.addition_btn);
        addition_btn.setAnchorPoint(1, 0.5);
        addition_btn.setPosition(cc.winSize.width - 30, cc.winSize.height - 100 - 100 -8-180/2);
        addition_btn.setVisible(false);
        addition_btn.addClickEventListener(addition_btn_touchevent);
        addition_btn.setTag(7);
        var addition_btn_sub = new ccui.Layout();
        addition_btn_sub.setContentSize(115+30, 120);
        addition_btn_sub.setTouchEnabled(true);
        addition_btn_sub.addClickEventListener(addition_btn_touchevent);
        addition_btn_sub.setAnchorPoint(0.5, 0.5);
        addition_btn_sub.setPosition(addition_btn.getContentSize().width>>1, addition_btn.getContentSize().height>>1);
        addition_btn.addChild(addition_btn_sub);
        this.addChild(addition_btn);

        var isPlaceholder = function(string){
            if(string && string !== ""){
                _this.getChildByTag(5).setVisible(false);
                _this.getChildByTag(6).setVisible(true);
            }else{
                _this.getChildByTag(5).setVisible(true);
                _this.getChildByTag(6).setVisible(false);
                _this.getChildByTag(7).setVisible(false);
            }
        };

        //名字输入框
        var name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - cha_random_btn.getContentSize().width - addition_btn.getContentSize().width, 180),new cc.Scale9Sprite());
        //name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        //name_random_field.setPlaceHolder("名前に入力してください");
        name_random_field.setAnchorPoint(cc.p(0,0.5));
        name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30, cc.winSize.height - 100 -100-8 - 180/2);
        name_random_field.setDelegate(this);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111,205,193,255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(12);
        name_random_field.setVisible(false);
        name_random_field.setTag(6);
        name_random_field.setDisFocusCallback(isPlaceholder);
        this.addChild(name_random_field);

        var placeholder = new cc.LabelTTF("参加者を登録してください");
        placeholder.setFontName(GAME_FONT.PRO_W3);
        placeholder.setFontSize(36);
        placeholder.setFontFillColor(cc.color.GRAY);
        var placeLayout = new ccui.Layout();
        placeLayout.setTouchEnabled(true);
        placeLayout.setContentSize(placeholder.getContentSize());
        placeLayout.setAnchorPoint(0, 0.5);
        placeLayout.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30, cc.winSize.height - 100 -100-8 - 180/2);
        this.addChild(placeLayout);
        placeholder.setAnchorPoint(0, 0.5);
        placeholder.setPosition(0, placeLayout.getContentSize().height/2);
        placeLayout.addChild(placeholder);
        placeLayout.setTag(5);
        placeLayout.addClickEventListener(cha_random_btn_event);

        //分割线
        //var grayLine1 = new cc.Sprite(GlobalRes.line_8);
        //grayLine1.setScaleX(cc.winSize.width);
        //grayLine1.setAnchorPoint(cc.p(0, 1));
        //grayLine1.setPosition(cc.p(0, cc.winSize.height - 100 -100-8-180));
        //this.addChild(grayLine1);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, listView_male.getPosition().y - listView_male.getContentSize().height);
        this.addChild(cutoff);

        var count_label1 = new cc.LabelTTF("参加者：男性");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label1);

        count_label2.setFontName(GAME_FONT.PRO_W3);
        count_label2.setFontSize(26);
        count_label2.setFontFillColor(cc.color(111,205,193,255));
        this.addChild(count_label2);

        var count_label3 = new cc.LabelTTF("人/女性");
        count_label3.setFontName(GAME_FONT.PRO_W3);
        count_label3.setFontSize(26);
        count_label3.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label3);

        count_label4.setFontName(GAME_FONT.PRO_W3);
        count_label4.setFontSize(26);
        count_label4.setFontFillColor(cc.color(111,205,193,255));
        this.addChild(count_label4);

        var count_label5 = new cc.LabelTTF("人");
        count_label5.setFontName(GAME_FONT.PRO_W3);
        count_label5.setFontSize(26);
        count_label5.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label5);

        var text_width = count_label1.getContentSize().width + count_label2.getContentSize().width + count_label3.getContentSize().width + count_label4.getContentSize().width + count_label5.getContentSize().width;

        count_label1.setAnchorPoint(0, 1);
        count_label1.setPosition(cc.winSize.width/2 - text_width/2, cutoff.getPosition().y - 8 - 30);

        count_label2.setAnchorPoint(0, 1);
        count_label2.setPosition(count_label1.getPosition().x + count_label1.getContentSize().width, cutoff.getPosition().y - 8 - 30);

        count_label3.setAnchorPoint(0, 1);
        count_label3.setPosition(count_label2.getPosition().x + count_label2.getContentSize().width, cutoff.getPosition().y - 8 - 30);

        count_label4.setAnchorPoint(0, 1);
        count_label4.setPosition(count_label3.getPosition().x + count_label3.getContentSize().width, cutoff.getPosition().y - 8 - 30);

        count_label5.setAnchorPoint(0, 1);
        count_label5.setPosition(count_label4.getPosition().x + count_label4.getContentSize().width, cutoff.getPosition().y - 8 - 30);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(200, 80);
        next_layout.setAnchorPoint(0.5, 1);
        next_layout.setPosition(cc.winSize.width/2, count_label2.getPosition().y - count_label2.getContentSize().height-30);
        this.addChild(next_layout);

        next_btn.setScale(200, 80);
        next_btn.setAnchorPoint(0, 0);
        var next_btn_touchevent = function(){
            for(var i = 0 ; i < listView_male.getItems().length; i++){
                _this.m_male.add(listView_male.getItems()[i].getUserData());
            }
            for(var i = 0 ; i < listView_women.getItems().length; i++){
                _this.m_women.add(listView_women.getItems()[i].getUserData());
            }
            if(quick){
                _this.loadChooseView();
            }else{
                _this.loadEnvironmentSetting();
            }
        };
        next_btn.addClickEventListener(next_btn_touchevent);
        next_layout.addChild(next_btn);

        var next_text = new cc.LabelTTF("登録完了");
        next_text.setFontName(GAME_FONT.PRO_W3);
        next_text.setFontSize(26);
        next_text.setFontFillColor(cc.color(255,255,255,255));
        next_text.setScanPhixelRGB();
        next_text.setAnchorPoint(0.5, 0.5);
        next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
        next_layout.addChild(next_text);

        var mask = new Mask();
        mask.setTag(3);
        mask.close();
        this.addChild(mask);
    },

    loadEnvironmentSetting : function(){
        this.m_tableMode = 0;
        this.m_groupMode = 0;
        this.m_state = this.STATE_ENVIRONMENTSETTING;
        var _this = this;

        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255,255,255,255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(cc.p(0, 1));
        title.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("並び方設定");
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-50));
        this.addChild(titleName);

        var line50_1 = new cc.Sprite(GlobalRes.line_50);
        line50_1.setScale(cc.winSize.width, 1);
        line50_1.setAnchorPoint(cc.p(0, 1));
        line50_1.setPosition(cc.p(0, cc.winSize.height-100));
        this.addChild(line50_1);

        var label1 = new cc.LabelTTF("テーブルを選択してください");
        label1.setFontSize(24);
        label1.setFontFillColor(cc.color(200,200,200,255));
        label1.setFontName(GAME_FONT.PRO_W3);
        label1.setAnchorPoint(cc.p(0.5, 0.5));
        label1.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-100-25));
        this.addChild(label1);

        var radio1layout = new ccui.Layout();
        radio1layout.setContentSize(cc.winSize.width, 120);
        radio1layout.setAnchorPoint(0, 1);
        radio1layout.setPosition(0, cc.winSize.height-100-50);
        this.addChild(radio1layout);

        var radio1round = new ccui.Layout();
        radio1round.setContentSize(270, 80);
        radio1round.setAnchorPoint(1, 0.5);
        radio1round.setPosition(radio1layout.getContentSize().width/2-20, radio1layout.getContentSize().height/2);
        radio1round.setTouchEnabled(true);
        radio1round.selected = function(is){
            if(is){
                _this.m_tableMode = 0;
                this.roundrect.setVisible(true);
            }else{
                this.roundrect.setVisible(false);
            }
        };
        radio1layout.addChild(radio1round);

        var radio1round_text = new cc.LabelTTF("円形テーブル");
        radio1round_text.setFontSize(36);
        radio1round_text.setFontFillColor(cc.color(111,205,193,255));
        radio1round_text.setFontName(GAME_FONT.PRO_W3);
        radio1round_text.setScanPhixelRGB();
        radio1round_text.setAnchorPoint(cc.p(0.5, 0.5));
        radio1round_text.setPosition(cc.p(radio1round.getContentSize().width>>1, radio1round.getContentSize().height/2));
        radio1round.addChild(radio1round_text);

        var radio1round_selected = new cc.Sprite(LoveRedLineRes.roundrect);
        radio1round_selected.setAnchorPoint(cc.p(0.5, 0.5));
        radio1round_selected.setPosition(cc.p(radio1round.getContentSize().width>>1, radio1round.getContentSize().height/2));
        radio1round.roundrect = radio1round_selected;
        radio1round.addChild(radio1round_selected);

        var radio1rect = new ccui.Layout();
        radio1rect.setContentSize(270, 80);
        radio1rect.setAnchorPoint(0, 0.5);
        radio1rect.setPosition(radio1layout.getContentSize().width/2+20, radio1layout.getContentSize().height/2);
        radio1rect.setTouchEnabled(true);
        radio1rect.selected = function(is){
            if(is){
                _this.m_tableMode = 1;
                this.roundrect.setVisible(true);
            }else{
                this.roundrect.setVisible(false);
            }
        };
        radio1layout.addChild(radio1rect);

        var radio1rect_text = new cc.LabelTTF("長形テーブル");
        radio1rect_text.setFontSize(36);
        radio1rect_text.setFontFillColor(cc.color(111,205,193,255));
        radio1rect_text.setFontName(GAME_FONT.PRO_W3);
        radio1rect_text.setScanPhixelRGB();
        radio1rect_text.setAnchorPoint(cc.p(0.5, 0.5));
        radio1rect_text.setPosition(cc.p(radio1rect.getContentSize().width>>1, radio1rect.getContentSize().height/2));
        radio1rect.addChild(radio1rect_text);

        var radio1rect_selected = new cc.Sprite(LoveRedLineRes.roundrect);
        radio1rect_selected.setAnchorPoint(cc.p(0.5, 0.5));
        radio1rect_selected.setPosition(cc.p(radio1rect.getContentSize().width>>1, radio1rect.getContentSize().height/2));
        radio1rect_selected.setVisible(false);
        radio1rect.roundrect = radio1rect_selected;
        radio1rect.addChild(radio1rect_selected);

        radio1round.addClickEventListener(function(){radio1round.selected(true); radio1rect.selected(false);});
        radio1rect.addClickEventListener(function(){radio1round.selected(false); radio1rect.selected(true);});

        var line50_2 = new cc.Sprite(GlobalRes.line_50);
        line50_2.setScale(cc.winSize.width, 1);
        line50_2.setAnchorPoint(cc.p(0, 1));
        line50_2.setPosition(cc.p(0, cc.winSize.height-100 -50-120));
        this.addChild(line50_2);

        var label2 = new cc.LabelTTF("男女の並び方を選択してください");
        label2.setFontSize(24);
        label2.setFontFillColor(cc.color(200,200,200,255));
        label2.setFontName(GAME_FONT.PRO_W3);
        label2.setAnchorPoint(cc.p(0.5, 0.5));
        label2.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-100-50-120-25));
        this.addChild(label2);

        var radio2layout = new ccui.Layout();
        radio2layout.setContentSize(cc.winSize.width, 120);
        radio2layout.setAnchorPoint(0, 1);
        radio2layout.setPosition(0, cc.winSize.height-100-50-120-50);
        this.addChild(radio2layout);

        var radio2classify = new ccui.Layout();
        radio2classify.setContentSize(270, 80);
        radio2classify.setAnchorPoint(1, 0.5);
        radio2classify.setPosition(radio2layout.getContentSize().width/2-20, radio2layout.getContentSize().height/2);
        radio2classify.setTouchEnabled(true);
        radio2classify.selected = function(is){
            if(is){
                _this.m_groupMode = 0;
                this.roundrect.setVisible(true);
            }else{
                this.roundrect.setVisible(false);
            }
        };
        radio2layout.addChild(radio2classify);

        var radio2classify_text = new cc.LabelTTF("男女分ける");
        radio2classify_text.setFontSize(36);
        radio2classify_text.setFontFillColor(cc.color(111,205,193,255));
        radio2classify_text.setFontName(GAME_FONT.PRO_W3);
        radio2classify_text.setScanPhixelRGB();
        radio2classify_text.setAnchorPoint(cc.p(0.5, 0.5));
        radio2classify_text.setPosition(cc.p(radio2classify.getContentSize().width>>1, radio2classify.getContentSize().height/2));
        radio2classify.addChild(radio2classify_text);

        var radio2classify_selected = new cc.Sprite(LoveRedLineRes.roundrect);
        radio2classify_selected.setAnchorPoint(cc.p(0.5, 0.5));
        radio2classify_selected.setPosition(cc.p(radio2classify.getContentSize().width>>1, radio2classify.getContentSize().height/2));
        radio2classify.roundrect = radio2classify_selected;
        radio2classify.addChild(radio2classify_selected);

        var radio2cross = new ccui.Layout();
        radio2cross.setContentSize(270, 80);
        radio2cross.setAnchorPoint(0, 0.5);
        radio2cross.setPosition(radio2layout.getContentSize().width/2+20, radio2layout.getContentSize().height/2);
        radio2cross.setTouchEnabled(true);
        radio2cross.selected = function(is){
            if(is){
                _this.m_groupMode = 1;
                this.roundrect.setVisible(true);
            }else{
                this.roundrect.setVisible(false);
            }
        };
        radio2layout.addChild(radio2cross);

        var radio2cross_text = new cc.LabelTTF("男女混合");
        radio2cross_text.setFontSize(36);
        radio2cross_text.setFontFillColor(cc.color(111,205,193,255));
        radio2cross_text.setFontName(GAME_FONT.PRO_W3);
        radio2cross_text.setScanPhixelRGB();
        radio2cross_text.setAnchorPoint(cc.p(0.5, 0.5));
        radio2cross_text.setPosition(cc.p(radio2cross.getContentSize().width>>1, radio2cross.getContentSize().height/2));
        radio2cross.addChild(radio2cross_text);

        var radio2cross_selected = new cc.Sprite(LoveRedLineRes.roundrect);
        radio2cross_selected.setAnchorPoint(cc.p(0.5, 0.5));
        radio2cross_selected.setPosition(cc.p(radio2cross.getContentSize().width>>1, radio2cross.getContentSize().height/2));
        radio2cross_selected.setVisible(false);
        radio2cross.roundrect = radio2cross_selected;
        radio2cross.addChild(radio2cross_selected);

        radio2classify.addClickEventListener(function(){radio2classify.selected(true); radio2cross.selected(false);});
        radio2cross.addClickEventListener(function(){radio2classify.selected(false); radio2cross.selected(true);});

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 0);
        cutoff.setPosition(0, 30+80+30);
        this.addChild(cutoff);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(300, 80);
        next_layout.setAnchorPoint(0.5, 0);
        next_layout.setPosition(cc.winSize.width/2, 30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
        next_btn.setScale(next_layout.getContentSize().width, next_layout.getContentSize().height);
        next_btn.setAnchorPoint(0, 0);
        next_btn.setTouchEnabled(true);
        var next_btn_touchevent = function(){
            _this.loadTabelResult(false);
        };
        next_btn.addClickEventListener(next_btn_touchevent);
        next_layout.addChild(next_btn);

        var next_text = new cc.LabelTTF("席順を決定へ");
        next_text.setFontName(GAME_FONT.PRO_W3);
        next_text.setFontSize(26);
        next_text.setFontFillColor(cc.color(255,255,255,255));
        next_text.setScanPhixelRGB();
        next_text.setAnchorPoint(0.5, 0.5);
        next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
        next_layout.addChild(next_text);
    },

    loadTabelResult : function(ishistory){
        this.m_state = this.STATE_TAGBELRESULT;
        this.m_history = ishistory;
        var _this = this;

        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255,255,255,255)));


        var history = {};
        history.mode = "seat";
        history.tableMode = this.m_tableMode;
        history.groupMode = this.m_groupMode;
        history.male = [];
        for(var i = 0 ; i < this.m_male.size(); i++){
            history.male.push(this.m_male.get(i));
        }
        history.women = [];
        for(var i = 0 ; i < this.m_women.size(); i++){
            history.women.push(this.m_women.get(i));
        }

        var count_label1 = new cc.LabelTTF("参加者：男性");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label1);

        var count_label2 = new cc.LabelTTF(""+PAD(this.m_male.size(), 2));
        count_label2.setFontName(GAME_FONT.PRO_W3);
        count_label2.setFontSize(26);
        count_label2.setFontFillColor(cc.color(111,205,193,255));
        this.addChild(count_label2);

        var count_label3 = new cc.LabelTTF("人/女性");
        count_label3.setFontName(GAME_FONT.PRO_W3);
        count_label3.setFontSize(26);
        count_label3.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label3);

        var count_label4 = new cc.LabelTTF(""+PAD(this.m_women.size(), 2));
        count_label4.setFontName(GAME_FONT.PRO_W3);
        count_label4.setFontSize(26);
        count_label4.setFontFillColor(cc.color(111,205,193,255));
        this.addChild(count_label4);

        var count_label5 = new cc.LabelTTF("人");
        count_label5.setFontName(GAME_FONT.PRO_W3);
        count_label5.setFontSize(26);
        count_label5.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label5);

        var text_width = count_label1.getContentSize().width + count_label2.getContentSize().width + count_label3.getContentSize().width + count_label4.getContentSize().width + count_label5.getContentSize().width;

        count_label1.setAnchorPoint(0, 0);
        count_label1.setPosition(cc.winSize.width/2 - text_width/2, 30+80+30);

        count_label2.setAnchorPoint(0, 0);
        count_label2.setPosition(count_label1.getPosition().x + count_label1.getContentSize().width, 30+80+30);

        count_label3.setAnchorPoint(0, 0);
        count_label3.setPosition(count_label2.getPosition().x + count_label2.getContentSize().width, 30+80+30);

        count_label4.setAnchorPoint(0, 0);
        count_label4.setPosition(count_label3.getPosition().x + count_label3.getContentSize().width, 30+80+30);

        count_label5.setAnchorPoint(0, 0);
        count_label5.setPosition(count_label4.getPosition().x + count_label4.getContentSize().width, 30+80+30);

        var listView = new ccui.ScrollView();
        // set list view ex direction
        listView.setTouchEnabled(true);
        listView.setDirection(ccui.ScrollView.DIR_BOTH);
        listView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 30 - 80 - 30 - count_label1.getContentSize().height - 30 - 8));
        listView.setAnchorPoint(0, 0);
        listView.setPosition(0, 30 + 80 + 30 + count_label1.getContentSize().height + 30 + 8);
        listView.setInnerContainerSize(cc.size(cc.winSize.width, cc.winSize.height - 30 - 80 - 30 - count_label1.getContentSize().height - 30 - 8));
        this.addChild(listView);

        var zoom_layout = new ccui.Layout();
        zoom_layout.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 30 - 80 - 30 - count_label1.getContentSize().height - 30 - 8));
        zoom_layout.setAnchorPoint(0, 0);
        zoom_layout.setPosition(0, 30 + 80 + 30 + count_label1.getContentSize().height + 30 + 8);
        this.addChild(zoom_layout);

        if(this.m_tableMode == 0){
            var count = this.m_male.size()+this.m_women.size();
            var table_layout = ccui.helper.seekWidgetByName(ccs.load(LoveRedLineRes["table"+count+"_json"]).node, "table_layout");
            table_layout.removeFromParent();
            if(table_layout.getContentSize().height > listView.getContentSize().height){
                listView.setInnerContainerSize(cc.size(listView.getInnerContainerSize().width, table_layout.getContentSize().height));
            }
            table_layout.setAnchorPoint(0.5, 0.5);
            table_layout.setPosition(listView.getInnerContainerSize().width/2, listView.getInnerContainerSize().height/2);
            listView.addChild(table_layout);

            var count = this.m_male.size()+this.m_women.size();

            var member_scale = 1;
            if(count == 13 || count == 14){
                member_scale = 0.9;
            }else if(count == 15 || count == 16){
                member_scale = 0.765;
            }else if(count == 17 || count == 18){
                member_scale = 0.6885;
            }else if(count == 19 || count == 20){
                member_scale = 0.61965;
            }else if(count == 21 || count == 22){
                member_scale = 0.557685;
            }else if(count == 23 || count == 24){
                member_scale = 0.5130702;
            }else if(count == 25 || count == 26){
                member_scale = 0.472024584;
            }else if(count == 27 || count == 28){
                member_scale = 0.43426261728;
            }else if(count == 29 || count == 30){
                member_scale = 0.4038642340704;
            }

            var innerSize = cc.size(listView.getInnerContainerSize().width, listView.getInnerContainerSize().height);
            var originPos = function(center){
                if(center){
                    return cc.p((listView.getContentSize().width-listView.getInnerContainer().getContentSize().width)/2, (listView.getContentSize().height-listView.getInnerContainer().getContentSize().height)/2);
                }else{
                    return cc.p((listView.getContentSize().width-listView.getInnerContainer().getContentSize().width), (listView.getContentSize().height-listView.getInnerContainer().getContentSize().height));
                }
            };
            listView.getInnerContainer().setPosition(originPos(false));
            var time = 0;
            var zoom = 1;
            var listener1 = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch, event){
                    if(count<12){
                        return false;
                    }
                    var touchPoint = touch.getLocation();
                    var tmp = new Date().getTime();
                    if(tmp - time < 300){
                        if(zoom == 1/member_scale){
                            zoom = 1;
                            listView.setInnerContainerSize(cc.size(innerSize.width*zoom, innerSize.height*zoom));
                            table_layout.setScale(zoom, zoom);
                            table_layout.setPosition(listView.getInnerContainerSize().width/2, listView.getInnerContainerSize().height/2);
                            listView.getInnerContainer().setPosition(originPos(false));
                        }else{
                            zoom = 1/member_scale;
                            listView.setInnerContainerSize(cc.size(innerSize.width*zoom, innerSize.height*zoom));
                            table_layout.setScale(zoom, zoom);
                            table_layout.setPosition(listView.getInnerContainerSize().width/2, listView.getInnerContainerSize().height/2);
                            listView.getInnerContainer().setPosition(originPos(true));
                            touchPoint = listView.convertToNodeSpace(touchPoint);
                            listView.getInnerContainer().setPosition(listView.getInnerContainer().getPosition().x-(touchPoint.x-listView.getContentSize().width/2)*zoom, listView.getInnerContainer().getPosition().y-(touchPoint.y-listView.getContentSize().height/2)*zoom);
                        }
                        time = 0;
                    }else{
                        time = tmp;
                    }
                    return false;
                }
            });
            cc.eventManager.addListener(listener1, zoom_layout);

            if(this.m_groupMode == 0){
                for(var i = 0 ; i < count; i++){
                    var icon = ccui.helper.seekWidgetByName(ccui.helper.seekWidgetByName(table_layout, "FileNode_" + (i+1)), "Panel");
                    if(i<this.m_male.size()){
                        ccui.helper.seekWidgetByName(icon, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + this.m_male.get(i).icon + ".png");
                        ccui.helper.seekWidgetByName(icon, "name").setString(this.m_male.get(i).name);
                    }else{
                        ccui.helper.seekWidgetByName(icon, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + this.m_women.get(i-this.m_male.size()).icon + ".png");
                        ccui.helper.seekWidgetByName(icon, "name").setString(this.m_women.get(i-this.m_male.size()).name);
                    }
                }
            }else{
                var is = true;
                var j = 0;
                var k = 0;
                for(var i = 0 ; i < count; i++){
                    var icon = ccui.helper.seekWidgetByName(ccui.helper.seekWidgetByName(table_layout, "FileNode_" + (i+1)), "Panel");
                    ccui.helper.seekWidgetByName(icon, "icon").setVisible(true);
                    ccui.helper.seekWidgetByName(icon, "name").setVisible(true);
                    if(is){
                        if(j < this.m_male.size()){
                            ccui.helper.seekWidgetByName(icon, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + this.m_male.get(j).icon + ".png");
                            ccui.helper.seekWidgetByName(icon, "name").setString(this.m_male.get(j).name);
                            j++;
                        }else{
                            ccui.helper.seekWidgetByName(icon, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + this.m_women.get(k).icon + ".png");
                            ccui.helper.seekWidgetByName(icon, "name").setString(this.m_women.get(k).name);
                            k++;
                        }
                    }else{
                        if(k < this.m_women.size()){
                            ccui.helper.seekWidgetByName(icon, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + this.m_women.get(k).icon + ".png");
                            ccui.helper.seekWidgetByName(icon, "name").setString(this.m_women.get(k).name);
                            k++;
                        }else{
                            ccui.helper.seekWidgetByName(icon, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + this.m_male.get(j).icon + ".png");
                            ccui.helper.seekWidgetByName(icon, "name").setString(this.m_male.get(j).name);
                            j++;
                        }
                    }
                    is = !is;
                }
            }
        }else{
            var count = this.m_male.size()+this.m_women.size();
            var tableSize = 0;
            if(count == 4){
                tableSize = 2;
            }else if(count > 4 && count <= 6){
                tableSize = 3;
            }else if(count > 6 && count <= 8){
                tableSize = 4;
            }else if(count > 8){
                tableSize = 6;
            }

            var member_scale = 1;
            if(count == 13 || count == 14){
                member_scale = 0.9;
            }else if(count == 15 || count == 16){
                member_scale = 0.765;
            }else if(count == 17 || count == 18){
                member_scale = 0.6885;
            }else if(count == 19 || count == 20){
                member_scale = 0.61965;
            }else if(count == 21 || count == 22){
                member_scale = 0.557685;
            }else if(count == 23 || count == 24){
                member_scale = 0.5130702;
            }else if(count == 25 || count == 26){
                member_scale = 0.472024584;
            }else if(count == 27 || count == 28){
                member_scale = 0.43426261728;
            }else if(count == 29 || count == 30){
                member_scale = 0.4038642340704;
            }

            var memberNode = ccui.helper.seekWidgetByName(ccs.load(LoveRedLineRes["member_json"]).node, "Panel");

            var count2X = count%2==0?count:count+1;

            var male_layout = new ccui.Layout();
            male_layout.setContentSize(memberNode.getContentSize().width * member_scale, memberNode.getContentSize().height * member_scale * (count2X/2) + (count2X-1)*5/2);

            var women_layout = new ccui.Layout();
            women_layout.setContentSize(memberNode.getContentSize().width * member_scale, memberNode.getContentSize().height * member_scale * (count2X/2) + (count2X-1)*5/2);

            var table_layout = ccui.helper.seekWidgetByName(ccs.load(LoveRedLineRes["table"+tableSize+"X_json"]).node, "table_layout");
            table_layout.removeFromParent();


            var layout = new ccui.Layout();
            layout.setContentSize(male_layout.getContentSize().width + women_layout.getContentSize().width + table_layout.getContentSize().width, male_layout.getContentSize().height>table_layout.getContentSize().height?male_layout.getContentSize().height:table_layout.getContentSize().height);
            if(layout.getContentSize().height > listView.getContentSize().height){
                listView.setInnerContainerSize(cc.size(listView.getInnerContainerSize().width, layout.getContentSize().height));
            }
            layout.setAnchorPoint(0.5, 0.5);
            layout.setPosition(listView.getInnerContainerSize().width/2, listView.getInnerContainerSize().height/2);
            listView.addChild(layout);

            var innerSize = cc.size(listView.getInnerContainerSize().width, listView.getInnerContainerSize().height);
            var originPos = function(center){
                if(center){
                    return cc.p((listView.getContentSize().width-listView.getInnerContainer().getContentSize().width)/2, (listView.getContentSize().height-listView.getInnerContainer().getContentSize().height)/2);
                }else{
                    return cc.p((listView.getContentSize().width-listView.getInnerContainer().getContentSize().width), (listView.getContentSize().height-listView.getInnerContainer().getContentSize().height));
                }
            };
            listView.getInnerContainer().setPosition(originPos(false));
            var time = 0;
            var zoom = 1;
            var listener1 = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch, event){
                    if(count<12){
                        return false;
                    }
                    var touchPoint = touch.getLocation();
                    var tmp = new Date().getTime();
                    if(tmp - time < 300){
                        if(zoom == 1/member_scale){
                            zoom = 1;
                            listView.setInnerContainerSize(cc.size(innerSize.width*zoom, innerSize.height*zoom));
                            layout.setScale(zoom, zoom);
                            layout.setPosition(listView.getInnerContainerSize().width/2, listView.getInnerContainerSize().height/2);
                            listView.getInnerContainer().setPosition(originPos(false));
                        }else{
                            zoom = 1/member_scale;
                            listView.setInnerContainerSize(cc.size(innerSize.width*zoom, innerSize.height*zoom));
                            layout.setScale(zoom, zoom);
                            layout.setPosition(listView.getInnerContainerSize().width/2, listView.getInnerContainerSize().height/2);
                            listView.getInnerContainer().setPosition(originPos(true));
                            touchPoint = listView.convertToNodeSpace(touchPoint);
                            listView.getInnerContainer().setPosition(listView.getInnerContainer().getPosition().x-(touchPoint.x-listView.getContentSize().width/2)*zoom, listView.getInnerContainer().getPosition().y-(touchPoint.y-listView.getContentSize().height/2)*zoom);
                        }
                        time = 0;
                    }else{
                        time = tmp;
                    }
                    return false;
                }
            });
            cc.eventManager.addListener(listener1, zoom_layout);


            male_layout.setAnchorPoint(0, 0.5);
            male_layout.setPosition(0, layout.getContentSize().height/2);
            layout.addChild(male_layout);

            table_layout.setAnchorPoint(0.5, 0.5);
            table_layout.setPosition(layout.getContentSize().width/2, layout.getContentSize().height/2);
            layout.addChild(table_layout);

            women_layout.setAnchorPoint(1, 0.5);
            women_layout.setPosition(layout.getContentSize().width, layout.getContentSize().height/2);
            layout.addChild(women_layout);

            var male_members = new ArrayList();
            var women_members = new ArrayList();
            if(this.m_groupMode == 0) {
                for (var i = 0; i < count; i++) {
                    if (i < this.m_male.size()) {
                        if (i < count2X / 2) {
                            male_members.add(this.m_male.get(i));
                        } else {
                            women_members.add(this.m_male.get(i));
                        }
                    } else {
                        if (i < count2X / 2) {
                            male_members.add(this.m_women.get(i - this.m_male.size()));
                        } else {
                            women_members.add(this.m_women.get(i - this.m_male.size()));
                        }
                    }
                }
            }else{
                var male_temp = new ArrayList(this.m_male);
                var women_temp = new ArrayList(this.m_women);
                for (var i = 0, is = true; i < count; i++) {
                    if (is) {
                        if (i < count2X / 2) {
                            male_members.add(male_temp.size()>0?male_temp.removeIndex(0):women_temp.removeIndex(0));
                        } else {
                            women_members.add(male_temp.size()>0?male_temp.removeIndex(0):women_temp.removeIndex(0));
                        }
                    } else {
                        if (i < count2X / 2) {
                            male_members.add(women_temp.size()>0?women_temp.removeIndex(0):male_temp.removeIndex(0));
                        } else {
                            women_members.add(women_temp.size()>0?women_temp.removeIndex(0):male_temp.removeIndex(0));
                        }
                    }
                    is = !is;
                }
            }
            for(var i = 0; i < male_members.size(); i++){
                memberNode = ccui.helper.seekWidgetByName(ccs.load(LoveRedLineRes["member_json"]).node, "Panel");
                memberNode.removeFromParent();
                memberNode.setScaleX(member_scale);
                memberNode.setScaleY(member_scale);
                ccui.helper.seekWidgetByName(memberNode, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + male_members.get(i).icon + ".png");
                ccui.helper.seekWidgetByName(memberNode, "name").setString(male_members.get(i).name);
                memberNode.setAnchorPoint(0, 1);
                memberNode.setPosition(0, male_layout.getContentSize().height - (memberNode.getContentSize().height*member_scale + 5)*i);
                male_layout.addChild(memberNode);
            }
            for(var i = 0; i < women_members.size(); i++){
                memberNode = ccui.helper.seekWidgetByName(ccs.load(LoveRedLineRes["member_json"]).node, "Panel");
                memberNode.removeFromParent();
                memberNode.setScaleX(member_scale);
                memberNode.setScaleY(member_scale);
                ccui.helper.seekWidgetByName(memberNode, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + women_members.get(i).icon + ".png");
                ccui.helper.seekWidgetByName(memberNode, "name").setString(women_members.get(i).name);
                memberNode.setAnchorPoint(0, 1);
                memberNode.setPosition(0, women_layout.getContentSize().height - (memberNode.getContentSize().height*member_scale + 5)*i);
                women_layout.addChild(memberNode);
            }
        }


        var grayLine1 = new cc.Sprite(GlobalRes.line_8);
        grayLine1.setScaleX(cc.winSize.width);
        grayLine1.setAnchorPoint(0, 0);
        grayLine1.setPosition(0, 30+80+30+count_label1.getContentSize().height+30);
        this.addChild(grayLine1);

        if(ishistory){
            var next_layout = new ccui.Layout();
            next_layout.setContentSize(250, 80);
            next_layout.setAnchorPoint(0, 0);
            next_layout.setPosition(cc.winSize.width/2-(250+350+10)/2-5, 30, 30);
            this.addChild(next_layout);

            var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            next_btn.setScale(250, 80);
            next_btn.setAnchorPoint(0, 0);
            next_btn.setTouchEnabled(true);
            var next_btn_touchevent = function(){
                _this.loadMemberSettingView(false);
            };
            next_btn.addClickEventListener(next_btn_touchevent);
            next_layout.addChild(next_btn);

            var next_text = new cc.LabelTTF("データ読み込み");
            next_text.setFontName(GAME_FONT.PRO_W3);
            next_text.setFontSize(26);
            next_text.setFontFillColor(cc.color(255,255,255,255));
            next_text.setScanPhixelRGB();
            next_text.setAnchorPoint(0.5, 0.5);
            next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
            next_layout.addChild(next_text);


            var next_layout = new ccui.Layout();
            next_layout.setContentSize(350, 80);
            next_layout.setAnchorPoint(0, 0);
            next_layout.setPosition(cc.winSize.width/2-(250+350+10)/2+255, 30);
            this.addChild(next_layout);

            var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            next_btn.setScale(350, 80);
            next_btn.setAnchorPoint(0, 0);
            next_btn.setTouchEnabled(true);
            var next_btn_touchevent = function(){
                _this.loadChooseView();
            };
            next_btn.addClickEventListener(next_btn_touchevent);
            next_layout.addChild(next_btn);

            var next_text = new cc.LabelTTF("同じメンバーで赤い糸へGo!");
            next_text.setFontName(GAME_FONT.PRO_W3);
            next_text.setFontSize(26);
            next_text.setFontFillColor(cc.color(255,255,255,255));
            next_text.setScanPhixelRGB();
            next_text.setAnchorPoint(0.5, 0.5);
            next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
            next_layout.addChild(next_text);
        }else{

            var next_layout = new ccui.Layout();
            next_layout.setContentSize(350, 80);
            next_layout.setAnchorPoint(0, 0);
            next_layout.setPosition(cc.winSize.width/2-(150+350+10)/2+155, 30);
            this.addChild(next_layout);

            var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            next_btn.setScale(350, 80);
            next_btn.setAnchorPoint(0, 0);
            next_btn.setTouchEnabled(true);
            var next_btn_touchevent = function(){
                _this.loadChooseView();
            };
            next_btn.addClickEventListener(next_btn_touchevent);
            next_layout.addChild(next_btn);

            var home_layout = new ccui.Layout();
            home_layout.setContentSize(150, 80);
            home_layout.setAnchorPoint(0, 0);
            home_layout.setPosition(cc.winSize.width/2-(150+350+10)/2-5, 30);
            this.addChild(home_layout);

            var home_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            home_btn.setScale(150, 80);
            home_btn.setAnchorPoint(0, 0);
            home_btn.setTouchEnabled(true);
            var home_btn_touchevent = function(){
                mask.open();
                var pop_layout = new ccui.Layout();
                pop_layout.setAnchorPoint(0.5, 0.5);
                pop_layout.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                pop_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                pop_layout.setBackGroundColor(cc.color(255,255,255,255));
                _this.addChild(pop_layout, 999);

                var label = new cc.LabelTTF("結果を保存しますか？");
                label.setFontName(GAME_FONT.PRO_W3);
                label.setFontSize(30);
                label.setFontFillColor(new cc.Color(111,205,193,255));
                label.setScanPhixelRGB();
                label.setAnchorPoint(0, 1);
                pop_layout.setContentSize(570, 40+30+60+40+100+label.getContentSize().height);
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
                for(var i = 0 ; i < _this.m_male.size(); i++){
                    name += _this.m_male.get(i).name;
                    name+="、";
                }
                for(var i = 0 ; i < _this.m_women.size(); i++){
                    name += _this.m_women.get(i).name;
                    if(i != _this.m_women.size()-1){
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
                        alert("タイトルに入力してください");
                        return;
                    }
                    history.title = input.getString();
                    DataManager.instance().createHistory(GAME_TYPE.LoveRedLine, history);
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
            _this.m_func_isbacktomain = home_btn_touchevent;
            home_btn.addClickEventListener(home_btn_touchevent);
            home_layout.addChild(home_btn);

            var next_text = new cc.LabelTTF("同じメンバーで赤い糸へGo!");
            next_text.setFontName(GAME_FONT.PRO_W3);
            next_text.setFontSize(26);
            next_text.setFontFillColor(cc.color(255,255,255,255));
            next_text.setScanPhixelRGB();
            next_text.setAnchorPoint(0.5, 0.5);
            next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
            next_layout.addChild(next_text);

            var home_text = new cc.LabelTTF("ホーム");
            home_text.setFontName(GAME_FONT.PRO_W3);
            home_text.setFontSize(26);
            home_text.setFontFillColor(cc.color(255,255,255,255));
            home_text.setScanPhixelRGB();
            home_text.setAnchorPoint(0.5, 0.5);
            home_text.setPosition(home_layout.getContentSize().width/2, home_layout.getContentSize().height/2);
            home_layout.addChild(home_text);

            var mask = new Mask();
            this.addChild(mask, 99);
            mask.close();
        }

    },

    loadChooseView : function(){
        this.m_state = this.STATE_CHOOSEVIEW;
        var _this = this;
        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255,255,255,255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(cc.p(0, 1));
        title.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("運命の選択");
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-50));
        this.addChild(titleName);

        //组列表
        var listView_male = new ccui.ListView();
        // set list view ex direction
        listView_male.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView_male.setTouchEnabled(true);
        listView_male.setBounceEnabled(false);
        listView_male.setAnchorPoint(0, 1);
        listView_male.setVisible(true);
        this.addChild(listView_male);

        var listView_women = new ccui.ListView();
        // set list view ex direction
        listView_women.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView_women.setTouchEnabled(true);
        listView_women.setBounceEnabled(false);
        listView_women.setAnchorPoint(0, 1);
        listView_women.setVisible(false);
        this.addChild(listView_women);

        var addListItem = function(data, list){
            var layout = new ccui.Layout();
            layout.setUserData(data);
            layout.setContentSize(750, 182);
            layout.setTouchEnabled(true);
            var icon = new cc.Sprite("res/Global/cha_pop/cha_thumb_" + data.icon + ".png");
            icon.setAnchorPoint(0, 0.5);
            icon.setPosition(30, layout.getContentSize().height-90);
            layout.addChild(icon);
            var name = new cc.LabelTTF(data.name);
            name.setFontName(GAME_FONT.PRO_W6);
            name.setFontSize(36);
            name.setFontFillColor(cc.color(111,205,193,255));
            name.setScanPhixelRGB();
            name.setAnchorPoint(0,0);
            name.setPosition(icon.getPosition().x + icon.getContentSize().width + 30, icon.getPosition().y+2);
            layout.addChild(name);

            var cutoff = new cc.Sprite(GlobalRes.line_8);
            cutoff.setAnchorPoint(0, 0);
            cutoff.setScaleX(layout.getContentSize().width);
            cutoff.setScaleY(0.25);
            layout.addChild(cutoff);

            var layout_event = function(sender){
                var cha_pop_layout = new RoundRect(cc.winSize.width-30-30, cc.winSize.height-150-150);
                cha_pop_layout.setAnchorPoint(0.5, 0.5);
                cha_pop_layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
                _this.addChild(cha_pop_layout, 999);

                var topBackLayout = new ccui.Layout();
                topBackLayout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                topBackLayout.setBackGroundColor(cc.color("#fdfcf3"));
                topBackLayout.setContentSize(cha_pop_layout.getContentSize().width, 32 + 30 + 30);
                topBackLayout.setAnchorPoint(0,1);
                topBackLayout.setPosition(0, cha_pop_layout.getContentSize().height);
                cha_pop_layout.addChild(topBackLayout);

                var label = new cc.LabelTTF("好みの異性を選択してください");
                label.setFontSize(32);
                label.setFontFillColor(new cc.Color(200,200,200,255));
                label.setFontName(GAME_FONT.PRO_W3);
                label.setScanPhixelRGB();
                label.setAnchorPoint(0.5, 1);
                label.setPosition(cha_pop_layout.getContentSize().width>>1, cha_pop_layout.getContentSize().height-30);
                cha_pop_layout.addChild(label);

                var line_1 = new ccui.Layout();
                line_1.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                line_1.setBackGroundColor(cc.color(111,205,193,255));
                line_1.setContentSize(cha_pop_layout.getContentSize().width, 2);
                line_1.setAnchorPoint(0,1);
                line_1.setPosition(0, cha_pop_layout.getContentSize().height - 30-30-label.getContentSize().height);
                cha_pop_layout.addChild(line_1);

                var listView = new ccui.ListView();
                // set list view ex direction
                listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
                listView.setTouchEnabled(true);
                listView.setBounceEnabled(false);
                listView.setAnchorPoint(0, 0);
                listView.setContentSize(cha_pop_layout.getContentSize().width, cha_pop_layout.getContentSize().height - 30-30-label.getContentSize().height-100-1);
                listView.setPosition(0, 100);
                cha_pop_layout.addChild(listView);

                var list = _this.m_sex==1?_this.m_male:_this.m_women;
                var current = null;
                for(var i = 0; i < list.size(); i++){
                    var layout = new ccui.Layout();
                    layout.setUserData(list.get(i));
                    layout.setContentSize(750, 176);
                    layout.setTouchEnabled(true);
                    var icon = new cc.Sprite("res/Global/cha_pop/cha_thumb_" + list.get(i).icon + ".png");
                    icon.setAnchorPoint(0, 0.5);
                    icon.setPosition(30, layout.getContentSize().height-90);
                    layout.addChild(icon);
                    if(sender.getUserData().select && sender.getUserData().select === "" + list.get(i).name + list.get(i).icon){
                        var sel = new cc.Sprite(LoveRedLineRes.selected_popup);
                        sel.setAnchorPoint(0, 0.5);
                        sel.setPosition(30, layout.getContentSize().height-90);
                        sel.setTag(1);
                        layout.addChild(sel);
                        current = layout;
                    }
                    var name = new cc.LabelTTF(list.get(i).name);
                    name.setFontName(GAME_FONT.PRO_W6);
                    name.setFontSize(36);
                    name.setFontFillColor(cc.color(111,205,193,255));
                    name.setScanPhixelRGB();
                    name.setAnchorPoint(0,0);
                    name.setPosition(icon.getPosition().x + icon.getContentSize().width + 30, icon.getPosition().y+2);
                    layout.addChild(name);

                    var line_2 = new ccui.Layout();
                    line_2.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                    line_2.setBackGroundColor(cc.color("#eeeeee"));
                    line_2.setContentSize(cha_pop_layout.getContentSize().width, 2);
                    line_2.setAnchorPoint(0,0);
                    line_2.setPosition(0, 0);
                    layout.addChild(line_2);

                    var select = function(sender){
                        if(current == sender){
                            return;
                        }
                        if(current){
                            current.removeChildByTag(1, true);
                        }
                        current = sender;
                        var sel = new cc.Sprite(LoveRedLineRes.selected_popup);
                        sel.setAnchorPoint(0, 0.5);
                        sel.setPosition(31, sender.getContentSize().height-90);
                        sel.setTag(1);
                        sender.addChild(sel);
                    };

                    layout.addClickEventListener(select);

                    listView.pushBackDefaultItem();
                    listView.pushBackCustomItem(layout);
                }

                var ok_btn = new ccui.Layout();
                ok_btn.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                ok_btn.setBackGroundColor(cc.color(111,205,193,255));
                ok_btn.setContentSize(cha_pop_layout.getContentSize().width, 100);
                ok_btn.setAnchorPoint(0,0);
                ok_btn.setTouchEnabled(true);
                cha_pop_layout.addChild(ok_btn);
                var ok_btn_text = new cc.LabelTTF("選択完了");
                ok_btn_text.setFontName(GAME_FONT.PRO_W3);
                ok_btn_text.setFontSize(36);
                ok_btn_text.setAnchorPoint(0.5,0.5);
                ok_btn_text.setPosition(ok_btn.getContentSize().width/2, ok_btn.getContentSize().height/2);
                ok_btn.addChild(ok_btn_text);
                //var ok_btn = new ccui.Button();
                //ok_btn.setContentSize(rect_layout.getContentSize().width, rect_layout.getContentSize().height);
                //ok_btn.setTouchEnabled(true);
                //ok_btn.setScale9Enabled(true);
                //ok_btn.setTitleText("選択完了");
                //ok_btn.setTitleFontName(GAME_FONT.PRO_W3);
                //ok_btn.setTitleFontSize(36);
                //ok_btn.setAnchorPoint(0.5,0.5);
                //ok_btn.setPosition(rect_layout.getContentSize().width/2, rect_layout.getContentSize().height/2);
                var ok_btn_touchevent = function(){
                    if(current){
                        sender.getUserData().select = "" + current.getUserData().name + current.getUserData().icon;
                        var sel = new cc.Sprite(LoveRedLineRes.selected_self);
                        sel.setAnchorPoint(0, 0.5);
                        sel.setPosition(30, sender.getContentSize().height-90);
                        sender.addChild(sel);
                    }

                    var count_male = 0;
                    for(var i = 0 ; i < listView_male.getItems().length; i++){
                        if(listView_male.getItems()[i].getUserData().select){
                            count_male++;
                        }
                    }
                    var count_women = 0;
                    for(var i = 0 ; i < listView_women.getItems().length; i++){
                        if(listView_women.getItems()[i].getUserData().select){
                            count_women++;
                        }
                    }
                    if(count_women + count_male == listView_male.getItems().length + listView_women.getItems().length){
                        next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                        next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                        next_btn.setTouchEnabled(true);
                    }

                    count_label2.setString(PAD(count_male, 2));
                    count_label4.setString(PAD(count_women, 2));

                    cha_pop_layout.removeFromParent();
                    _this.getChildByTag(3).close();
                };
                ok_btn.addClickEventListener(ok_btn_touchevent);
                //rect_layout.addChild(ok_btn);
                _this.getChildByTag(3).open();
            };
            layout.addClickEventListener(layout_event);

            list.pushBackDefaultItem();
            list.pushBackCustomItem(layout);
        };

        for(var i = 0 ; i < this.m_male.size(); i++){
            addListItem(this.m_male.get(i), listView_male);
        }

        for(var i = 0 ; i < this.m_women.size(); i++){
            addListItem(this.m_women.get(i), listView_women);
        }

        var male_radio_text = new cc.LabelTTF("♂男性");
        male_radio_text.setAnchorPoint(0.5, 0.5);
        male_radio_text.setPosition(cc.winSize.width/2/2, (100-6)/2);
        male_radio_text.setFontName(GAME_FONT.PRO_W3);
        male_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
        male_radio_text.setScanPhixelRGB();
        male_radio_text.setFontSize(32);

        var male_radio_selected = new ccui.Layout();
        male_radio_selected.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        male_radio_selected.setBackGroundColor(cc.color(111,205,193,255));
        male_radio_selected.setContentSize(cc.winSize.width/2, 6);
        male_radio_selected.setAnchorPoint(0, 0);
        male_radio_selected.setPosition(0, 0);

        var male_radio = new ccui.Layout();
        male_radio.setContentSize(cc.winSize.width/2, 100);
        male_radio.setAnchorPoint(0, 1);
        male_radio.setPosition(0, cc.winSize.height-100);
        male_radio.setTouchEnabled(true);
        male_radio.addChild(male_radio_text);
        male_radio.addChild(male_radio_selected);
        male_radio.radiotext = male_radio_text;
        male_radio.isSelected = male_radio_selected;
        male_radio.selected = function(is){
            if(is){
                _this.m_sex = 0;
                this.radiotext.setFontFillColor(new cc.Color(111,205,193,255));
                this.isSelected.setVisible(true);
                listView_male.setVisible(true);
            }else{
                this.radiotext.setFontFillColor(new cc.Color(200,200,200,255));
                this.isSelected.setVisible(false);
                listView_male.setVisible(false);
            }
        };
        male_radio.selected(true);
        this.addChild(male_radio);

        var women_radio_text = new cc.LabelTTF("♀女性");
        women_radio_text.setAnchorPoint(0.5, 0.5);
        women_radio_text.setPosition(cc.winSize.width/2/2, (100-6)/2);
        women_radio_text.setFontName(GAME_FONT.PRO_W3);
        women_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
        women_radio_text.setScanPhixelRGB();
        women_radio_text.setFontSize(32);

        var women_radio_selected = new ccui.Layout();
        women_radio_selected.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        women_radio_selected.setBackGroundColor(cc.color(111,205,193,255));
        women_radio_selected.setContentSize(cc.winSize.width/2, 6);
        women_radio_selected.setAnchorPoint(0, 0);
        women_radio_selected.setPosition(0, 0);

        var women_radio = new ccui.Layout();
        women_radio.setContentSize(cc.winSize.width/2, 100);
        women_radio.setAnchorPoint(0, 1);
        women_radio.setPosition(cc.winSize.width/2, cc.winSize.height-100);
        women_radio.setTouchEnabled(true);
        women_radio.addChild(women_radio_text);
        women_radio.addChild(women_radio_selected);
        women_radio.radiotext = women_radio_text;
        women_radio.isSelected = women_radio_selected;
        women_radio.selected = function(is){
            if(is){
                _this.m_sex = 1;
                this.radiotext.setFontFillColor(new cc.Color(111,205,193,255));
                this.isSelected.setVisible(true);
                listView_women.setVisible(true);
            }else{
                this.radiotext.setFontFillColor(new cc.Color(200,200,200,255));
                this.isSelected.setVisible(false);
                listView_women.setVisible(false);
            }
        };
        women_radio.selected(false);
        this.addChild(women_radio);

        male_radio.addClickEventListener(function(){
            male_radio.selected(true);
            women_radio.selected(false);
        });

        women_radio.addClickEventListener(function(){
            male_radio.selected(false);
            women_radio.selected(true);
        });

        var label_1 = new cc.LabelTTF("選択する人をタップしてください");
        label_1.setFontSize(24);
        label_1.setFontFillColor(new cc.Color(200,200,200,255));
        label_1.setFontName(GAME_FONT.PRO_W3);
        label_1.setScanPhixelRGB();
        label_1.setAnchorPoint(cc.p(0.5, 0.5));
        label_1.setPosition(cc.p(cc.winSize.width>>1, male_radio.getPosition().y-male_radio.getContentSize().height-25));
        this.addChild(label_1);

        var count_label1 = new cc.LabelTTF("選択完了：男性");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label1);

        var count_label2 = new cc.LabelTTF("00");
        count_label2.setFontName(GAME_FONT.PRO_W3);
        count_label2.setFontSize(26);
        count_label2.setFontFillColor(cc.color(111,205,193,255));
        this.addChild(count_label2);

        var count_label3 = new cc.LabelTTF("人/女性");
        count_label3.setFontName(GAME_FONT.PRO_W3);
        count_label3.setFontSize(26);
        count_label3.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label3);

        var count_label4 = new cc.LabelTTF("00");
        count_label4.setFontName(GAME_FONT.PRO_W3);
        count_label4.setFontSize(26);
        count_label4.setFontFillColor(cc.color(111,205,193,255));
        this.addChild(count_label4);

        var count_label5 = new cc.LabelTTF("人");
        count_label5.setFontName(GAME_FONT.PRO_W3);
        count_label5.setFontSize(26);
        count_label5.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label5);

        var text_width = count_label1.getContentSize().width + count_label2.getContentSize().width + count_label3.getContentSize().width + count_label4.getContentSize().width + count_label5.getContentSize().width;

        count_label1.setAnchorPoint(0, 0);
        count_label1.setPosition(cc.winSize.width/2 - text_width/2, 30+80+30);

        count_label2.setAnchorPoint(0, 0);
        count_label2.setPosition(count_label1.getPosition().x + count_label1.getContentSize().width, 30+80+30);

        count_label3.setAnchorPoint(0, 0);
        count_label3.setPosition(count_label2.getPosition().x + count_label2.getContentSize().width, 30+80+30);

        count_label4.setAnchorPoint(0, 0);
        count_label4.setPosition(count_label3.getPosition().x + count_label3.getContentSize().width, 30+80+30);

        count_label5.setAnchorPoint(0, 0);
        count_label5.setPosition(count_label4.getPosition().x + count_label4.getContentSize().width, 30+80+30);


        var count_label6 = new cc.LabelTTF("参加者：男性");
        count_label6.setFontName(GAME_FONT.PRO_W3);
        count_label6.setFontSize(26);
        count_label6.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_label6);

        var count_label7 = new cc.LabelTTF(""+PAD(this.m_male.size(), 2));
        count_label7.setFontName(GAME_FONT.PRO_W3);
        count_label7.setFontSize(26);
        count_label7.setFontFillColor(cc.color(111,205,193,255));
        this.addChild(count_label7);

        var count_labe8 = new cc.LabelTTF("人/女性");
        count_labe8.setFontName(GAME_FONT.PRO_W3);
        count_labe8.setFontSize(26);
        count_labe8.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_labe8);

        var count_labe9 = new cc.LabelTTF(""+PAD(this.m_women.size(), 2));
        count_labe9.setFontName(GAME_FONT.PRO_W3);
        count_labe9.setFontSize(26);
        count_labe9.setFontFillColor(cc.color(111,205,193,255));
        this.addChild(count_labe9);

        var count_labe10 = new cc.LabelTTF("人");
        count_labe10.setFontName(GAME_FONT.PRO_W3);
        count_labe10.setFontSize(26);
        count_labe10.setFontFillColor(cc.color(153,153,153,255));
        this.addChild(count_labe10);

        var text_width1 = count_label6.getContentSize().width + count_label7.getContentSize().width + count_labe8.getContentSize().width + count_labe9.getContentSize().width + count_labe10.getContentSize().width;

        count_label6.setAnchorPoint(0, 0);
        count_label6.setPosition(cc.winSize.width/2 - text_width1/2, 30+80+30+count_label1.getContentSize().height+30);

        count_label7.setAnchorPoint(0, 0);
        count_label7.setPosition(count_label6.getPosition().x + count_label6.getContentSize().width, 30+80+30+count_label1.getContentSize().height+30);

        count_labe8.setAnchorPoint(0, 0);
        count_labe8.setPosition(count_label7.getPosition().x + count_label7.getContentSize().width, 30+80+30+count_label1.getContentSize().height+30);

        count_labe9.setAnchorPoint(0, 0);
        count_labe9.setPosition(count_labe8.getPosition().x + count_labe8.getContentSize().width, 30+80+30+count_label1.getContentSize().height+30);

        count_labe10.setAnchorPoint(0, 0);
        count_labe10.setPosition(count_labe9.getPosition().x + count_labe9.getContentSize().width, 30+80+30+count_label1.getContentSize().height+30);

        var grayLine1 = new cc.Sprite(GlobalRes.line_8);
        grayLine1.setScaleX(cc.winSize.width);
        grayLine1.setAnchorPoint(0, 0);
        grayLine1.setPosition(0, 30+80+30+30+count_label6.getContentSize().height+30+30);
        this.addChild(grayLine1);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(200, 80);
        next_layout.setAnchorPoint(0.5, 0);
        next_layout.setPosition(cc.winSize.width/2, 30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_c8c8c8, GlobalRes.color_c8c8c8);
        next_btn.setScale(200, 80);
        next_btn.setAnchorPoint(0, 0);
        next_btn.setTouchEnabled(false);
        var next_btn_touchevent = function(){
            _this.m_male.clear();
            _this.m_women.clear();
            for(var i = 0 ;i < listView_male.getItems().length; i++){
                _this.m_male.add(listView_male.getItems()[i].getUserData());
            }
            for(var i = 0 ;i < listView_women.getItems().length; i++){
                _this.m_women.add(listView_women.getItems()[i].getUserData());
            }
            _this.loadRedLineResultView(false);
        };
        next_btn.addClickEventListener(next_btn_touchevent);
        next_layout.addChild(next_btn);

        var next_text = new cc.LabelTTF("判定結果へ");
        next_text.setFontName(GAME_FONT.PRO_W3);
        next_text.setFontSize(26);
        next_text.setFontFillColor(cc.color(255,255,255,255));
        next_text.setScanPhixelRGB();
        next_text.setAnchorPoint(0.5, 0.5);
        next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
        next_layout.addChild(next_text);

        listView_male.setContentSize(750, cc.winSize.height - (grayLine1.getPosition().y+grayLine1.getContentSize().height) - (cc.winSize.height - (label_1.getPosition().y-25)));
        listView_male.setPosition(0, label_1.getPosition().y-25);
        listView_women.setContentSize(750, cc.winSize.height - (grayLine1.getPosition().y+grayLine1.getContentSize().height) - (cc.winSize.height - (label_1.getPosition().y-25)));
        listView_women.setPosition(0, label_1.getPosition().y-25);

        var mask = new Mask();
        mask.setTag(3);
        mask.close();
        this.addChild(mask);
    },

    loadRedLineResultView : function(ishistory){
        this.m_state = this.STATE_REDLINERESULTVIEW;
        var convert = {
            G16:"01",
            G17:"02",
            G18:"03",
            G19:"04",
            G20:"05",
            G21:"06",
            G22:"07",
            G23:"08",
            G24:"09",
            G25:"10",
            G26:"11",
            G27:"12",
            G28:"13",
            G29:"14",
            G30:"15",
            G16_b:"01_b",
            G17_b:"02_b",
            G18_b:"03_b",
            G19_b:"04_b",
            G20_b:"05_b",
            G21_b:"06_b",
            G22_b:"07_b",
            G23_b:"08_b",
            G24_b:"09_b",
            G25_b:"10_b",
            G26_b:"11_b",
            G27_b:"12_b",
            G28_b:"13_b",
            G29_b:"14_b",
            G30_b:"15_b"
        };

        var _this = this;
        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255,255,255,255)));

        var titleLayout = new ccui.Layout();
        titleLayout.setContentSize(cc.winSize.width, 100);
        titleLayout.setAnchorPoint(0, 1);
        titleLayout.setPosition(0, cc.winSize.height);
        this.addChild(titleLayout);

        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(cc.p(0, 0));
        title.setPosition(cc.p(0, 0));
        titleLayout.addChild(title);

        var pairs = new ArrayList();
        for(var i = 0 ; i < this.m_male.size(); i++){
            if(this.m_male.get(i).select){
                for(var j = 0; j < this.m_women.size(); j++){
                    if(this.m_male.get(i).select === "" + this.m_women.get(j).name + this.m_women.get(j).icon){
                        if(this.m_women.get(j).select === "" + this.m_male.get(i).name + this.m_male.get(i).icon){
                            pairs.add({male:this.m_male.get(i), women:this.m_women.get(j)});
                        }
                    }
                }
            }
        }

        //标题
        var titleName = new cc.LabelTTF("運命の赤い糸結果");
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(titleLayout.getContentSize().width>>1, titleLayout.getContentSize().height-50));
        titleLayout.addChild(titleName);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(0, 0);
        cutoff.setPosition(0,30+80+30);
        cutoff.setScaleX(cc.winSize.width);
        this.addChild(cutoff);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(300, 80);
        next_layout.setAnchorPoint(0.5, 0);
        next_layout.setPosition(cc.winSize.width/2, 30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
        next_btn.setScale(next_layout.getContentSize().width, next_layout.getContentSize().height);
        next_btn.setAnchorPoint(0, 0);
        next_btn.setTouchEnabled(true);
        var next_btn_touchevent = function(){
            _this.loadRedLineResultView2(ishistory);
        };
        next_btn.addClickEventListener(next_btn_touchevent);
        next_layout.addChild(next_btn);

        var next_text = new cc.LabelTTF(/*pairs.size() == 0 ? "ホーム" :*/ "全体結果を見る");
        next_text.setFontName(GAME_FONT.PRO_W3);
        next_text.setFontSize(26);
        next_text.setFontFillColor(cc.color(255,255,255,255));
        next_text.setScanPhixelRGB();
        next_text.setAnchorPoint(0.5, 0.5);
        next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
        next_layout.addChild(next_text);

        if(pairs.size() == 0){
            SoundManager.instance().playEffect(LoveRedLineRes.single);
            var layout1 = new ccui.Layout();
            layout1.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            layout1.setBackGroundColor(cc.color(111,205,193,255));
            layout1.setContentSize(cc.winSize.width, 108);
            layout1.setAnchorPoint(0, 1);
            layout1.setPosition(0, cc.winSize.height - 100);
            this.addChild(layout1);

            var label1 = new cc.LabelTTF("成立したカップルはありませんでした");
            label1.setFontSize(32);
            label1.setFontFillColor(new cc.Color(255,243,191,255));
            label1.setFontName(GAME_FONT.PRO_W6);
            label1.setScanPhixelRGB();
            label1.setAnchorPoint(cc.p(0.5, 0.5));
            label1.setPosition(cc.p(layout1.getContentSize().width>>1, layout1.getContentSize().height>>1));
            layout1.addChild(label1);

            var layout2 = new ccui.Layout();
            layout2.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            layout2.setBackGroundColor(cc.color(111,205,193,255));
            layout2.setContentSize(cc.winSize.width, cc.winSize.height - 100 - 107 - 30 - 30 - 80 - 8);
            layout2.setAnchorPoint(0, 0);
            layout2.setPosition(0, 30 + 80 + 30 + 8);
            this.addChild(layout2);

            var charactor = new cc.Sprite();
            charactor.setAnchorPoint(0.5, 0.5);
            charactor.setPosition(cc.p(layout2.getContentSize().width>>1, layout2.getContentSize().height>>1));
            layout2.addChild(charactor);
            var frames = [];
            for(var k = 1 ; k < 4; k++){
                frames.push(new cc.SpriteFrame("res/Scene/LoveRedLine/sadness_" + k + ".png", new cc.Rect(0, 0, 783, 1390)));
            }
            var animation = new cc.Animation(frames, 0.25);
            var animate = cc.animate(animation);
            charactor.runAction(new cc.Sequence(animate).repeatForever());

        }else if(pairs.size() == 1){
            SoundManager.instance().playEffect(LoveRedLineRes.couple);
            var layout1 = new ccui.Layout();
            layout1.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            layout1.setBackGroundColor(cc.color(111,205,193,255));
            layout1.setContentSize(cc.winSize.width, 108);
            layout1.setAnchorPoint(0, 1);
            layout1.setPosition(0, cc.winSize.height - 100);
            this.addChild(layout1);

            var label1 = new cc.LabelTTF("成立したカップルは");
            label1.setFontSize(32);
            label1.setFontFillColor(new cc.Color(255,243,191,255));
            label1.setFontName(GAME_FONT.PRO_W6);
            label1.setScanPhixelRGB();
            label1.setAnchorPoint(0, 0);
            layout1.addChild(label1);

            var label2 = new cc.LabelTTF("01");
            label2.setFontSize(48);
            label2.setFontFillColor(new cc.Color(255,243,191,255));
            label2.setFontName(GAME_FONT.PRO_W6);
            label2.setScanPhixelRGB();
            label2.setAnchorPoint(0, 0.5);
            layout1.addChild(label2);

            var label3 = new cc.LabelTTF("組です！");
            label3.setFontSize(32);
            label3.setFontFillColor(new cc.Color(255,243,191,255));
            label3.setFontName(GAME_FONT.PRO_W6);
            label3.setScanPhixelRGB();
            label3.setAnchorPoint(0, 0);
            layout1.addChild(label3);

            var label_width = label1.getContentSize().width + label2.getContentSize().width + label3.getContentSize().width;
            label1.setPosition(layout1.getContentSize().width/2 - label_width/2, layout1.getContentSize().height/2 - label2.getContentSize().height/2);
            label2.setPosition(label1.getContentSize().width + label1.getPosition().x, layout1.getContentSize().height/2);
            label3.setPosition(label2.getContentSize().width + label2.getPosition().x, layout1.getContentSize().height/2 - label2.getContentSize().height/2);

            var layout2 = new ccui.Layout();
            layout2.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            layout2.setBackGroundColor(cc.color(255,243,191,255));
            layout2.setContentSize(cc.winSize.width, cc.winSize.height - 100 - 107 - 30 - 30 - 80 - 8);
            layout2.setAnchorPoint(0, 0);
            layout2.setPosition(0, 30 + 80 + 30 + 8);
            this.addChild(layout2);

            var name_women = new cc.LabelTTF(pairs.get(0).women.name);
            name_women.setFontSize(32);
            name_women.setFontFillColor(new cc.Color(111,205,193,255));
            name_women.setFontName(GAME_FONT.PRO_W6);
            name_women.setScanPhixelRGB();
            name_women.setAnchorPoint(0.5, 0);
            name_women.setPosition(layout2.getContentSize().width>>1, layout2.getContentSize().height/2 + 100 + 10);
            layout2.addChild(name_women);

            var heart = new cc.Sprite(LoveRedLineRes.heart);
            heart.setAnchorPoint(0.5, 0);
            heart.setPosition(layout2.getContentSize().width>>1, name_women.getPosition().y + name_women.getContentSize().height + 10);
            layout2.addChild(heart);

            var name_male = new cc.LabelTTF(pairs.get(0).male.name);
            name_male.setFontSize(32);
            name_male.setFontFillColor(new cc.Color(111,205,193,255));
            name_male.setFontName(GAME_FONT.PRO_W6);
            name_male.setScanPhixelRGB();
            name_male.setAnchorPoint(0.5, 0);
            name_male.setPosition(layout2.getContentSize().width>>1, heart.getPosition().y + heart.getContentSize().height + 10);
            layout2.addChild(name_male);

            var charactor = new cc.Sprite();
            charactor.setAnchorPoint(0, 1);
            charactor.setPosition(0, layout2.getContentSize().height/2 + 100 -10);
            layout2.addChild(charactor);
            var frames = [];
            for(var k = 1 ; k < 4; k++){
                frames.push(new cc.SpriteFrame("res/Global/motion/motion_" + pairs.get(0).male.icon + "_" + k +".png", new cc.Rect(0, 0, 216, 480)));
            }
            var animation = new cc.Animation(frames, 0.15);
            var animate = cc.animate(animation);
            charactor.runAction(new cc.Sequence(animate).repeatForever());

            var char2 = new cc.Sprite();
            char2.setAnchorPoint(0, 1);
            char2.setPosition(layout2.getContentSize().width, layout2.getContentSize().height/2 + 100 -10);
            char2.setScaleX(-1);
            layout2.addChild(char2);
            var frames = [];
            for(var k = 1 ; k < 4; k++){
                frames.push(new cc.SpriteFrame("res/Global/motion/motion_" + convert["G" + pairs.get(0).women.icon] + "_" + k +".png", new cc.Rect(0, 0, 216, 480)));
            }
            var animation = new cc.Animation(frames, 0.15);
            var animate = cc.animate(animation);
            char2.runAction(new cc.Sequence(animate).repeatForever());

            var arrow = new cc.Sprite(LoveRedLineRes.triangle_green);
            arrow.setAnchorPoint(0.5, 1);
            arrow.setPosition(layout2.getContentSize().width/2, layout2.getContentSize().height);
            layout2.addChild(arrow);

        }else{
            SoundManager.instance().playEffect(LoveRedLineRes.couple);
            var topLayout = new ccui.Layout();
            topLayout.setContentSize(cc.winSize.width, 208);
            titleLayout.removeFromParent();
            titleLayout.setPosition(0, topLayout.getContentSize().height);
            topLayout.addChild(titleLayout);

            var layout1 = new ccui.Layout();
            layout1.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            layout1.setBackGroundColor(cc.color(111,205,193,255));
            layout1.setContentSize(cc.winSize.width, 108);
            layout1.setAnchorPoint(0, 1);
            layout1.setPosition(0, topLayout.getContentSize().height - 100);
            topLayout.addChild(layout1);

            var label1 = new cc.LabelTTF("成立したカップルは");
            label1.setFontSize(32);
            label1.setFontFillColor(new cc.Color(255,243,191,255));
            label1.setFontName(GAME_FONT.PRO_W6);
            label1.setScanPhixelRGB();
            label1.setAnchorPoint(0, 0);
            layout1.addChild(label1);

            var label2 = new cc.LabelTTF(PAD(pairs.size(), 2));
            label2.setFontSize(48);
            label2.setFontFillColor(new cc.Color(255,243,191,255));
            label2.setFontName(GAME_FONT.PRO_W6);
            label2.setScanPhixelRGB();
            label2.setAnchorPoint(0, 0.5);
            layout1.addChild(label2);

            var label3 = new cc.LabelTTF("組です！");
            label3.setFontSize(32);
            label3.setFontFillColor(new cc.Color(255,243,191,255));
            label3.setFontName(GAME_FONT.PRO_W6);
            label3.setScanPhixelRGB();
            label3.setAnchorPoint(0, 0);
            layout1.addChild(label3);

            var label_width = label1.getContentSize().width + label2.getContentSize().width + label3.getContentSize().width;
            label1.setPosition(layout1.getContentSize().width/2 - label_width/2, layout1.getContentSize().height/2 - label2.getContentSize().height/2);
            label2.setPosition(label1.getContentSize().width + label1.getPosition().x, layout1.getContentSize().height/2);
            label3.setPosition(label2.getContentSize().width + label2.getPosition().x, layout1.getContentSize().height/2 - label2.getContentSize().height/2);

            //组列表
            var listView = new ccui.ListView();
            // set list view ex direction
            listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
            listView.setTouchEnabled(true);
            listView.setBounceEnabled(false);
            listView.setContentSize(cc.winSize.width, cc.winSize.height- 30 - 30 - 80 - 8);
            listView.setAnchorPoint(0, 0);
            listView.setPosition(0, 30 + 80 + 30 + 8);
            this.addChild(listView);

            listView.pushBackDefaultItem();
            listView.pushBackCustomItem(topLayout);

            for(var i = 0, is = true; i < pairs.size(); i++, is = !is){
                var layout2 = new ccui.Layout();
                layout2.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                layout2.setBackGroundColor(is ? cc.color(255,243,191,255) : cc.color(111,205,193,255));
                layout2.setContentSize(cc.winSize.width, 500);

                var name_women = new cc.LabelTTF(pairs.get(i).women.name);
                name_women.setFontSize(32);
                name_women.setFontFillColor(is ? cc.color(111,205,193,255) : cc.color(255,243,191,255));
                name_women.setFontName(GAME_FONT.PRO_W6);
                name_women.setScanPhixelRGB();
                name_women.setAnchorPoint(0.5, 0);
                name_women.setPosition(layout2.getContentSize().width>>1, layout2.getContentSize().height/2 - 50);
                layout2.addChild(name_women);

                var heart = new cc.Sprite(LoveRedLineRes.heart);
                heart.setAnchorPoint(0.5, 0);
                heart.setPosition(layout2.getContentSize().width>>1, name_women.getPosition().y + name_women.getContentSize().height + 10);
                layout2.addChild(heart);

                var name_male = new cc.LabelTTF(pairs.get(i).male.name);
                name_male.setFontSize(32);
                name_male.setFontFillColor(is ? cc.color(111,205,193,255) : cc.color(255,243,191,255));
                name_male.setFontName(GAME_FONT.PRO_W6);
                name_male.setScanPhixelRGB();
                name_male.setAnchorPoint(0.5, 0);
                name_male.setPosition(layout2.getContentSize().width>>1, heart.getPosition().y + heart.getContentSize().height + 10);
                layout2.addChild(name_male);

                var charactor = new cc.Sprite();
                charactor.setAnchorPoint(0, 0);
                charactor.setPosition(0, 10);
                layout2.addChild(charactor);
                var frames = [];
                for(var k = 1 ; k < 4; k++){
                    frames.push(new cc.SpriteFrame("res/Global/motion/motion_" + pairs.get(i).male.icon + "_" + k +".png", new cc.Rect(0, 0, 216, 480)));
                }
                var animation = new cc.Animation(frames, 0.15);
                var animate = cc.animate(animation);
                charactor.runAction(new cc.Sequence(animate).repeatForever());

                var char2 = new cc.Sprite();
                char2.setAnchorPoint(0, 0);
                char2.setPosition(layout2.getContentSize().width, 10);
                char2.setScaleX(-1);
                layout2.addChild(char2);
                var frames = [];
                for(var k = 1 ; k < 4; k++){
                    frames.push(new cc.SpriteFrame("res/Global/motion/motion_" + convert["G" + pairs.get(i).women.icon] + "_" + k +".png", new cc.Rect(0, 0, 216, 480)));
                }
                var animation = new cc.Animation(frames, 0.15);
                var animate = cc.animate(animation);
                char2.runAction(new cc.Sequence(animate).repeatForever());

                var arrow = new cc.Sprite(is ? LoveRedLineRes.triangle_green : LoveRedLineRes.triangle_beige);
                arrow.setAnchorPoint(0.5, 1);
                arrow.setPosition(layout2.getContentSize().width/2, layout2.getContentSize().height);
                layout2.addChild(arrow);

                listView.pushBackDefaultItem();
                listView.pushBackCustomItem(layout2);
            }
        }

        var history = {};
        history.mode = "line";
        history.male = [];
        for(var i = 0 ; i < this.m_male.size(); i++){
            history.male.push(this.m_male.get(i));
        }
        history.women = [];
        for(var i = 0 ; i < this.m_women.size(); i++){
            history.women.push(this.m_women.get(i));
        }

        var next_btn_touchevent = function(){
            mask.open();
            var pop_layout = new ccui.Layout();
            pop_layout.setAnchorPoint(0.5, 0.5);
            pop_layout.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            pop_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            pop_layout.setBackGroundColor(cc.color(255,255,255,255));
            _this.addChild(pop_layout, 999);

            var label = new cc.LabelTTF("結果を保存しますか？");
            label.setFontName(GAME_FONT.PRO_W3);
            label.setFontSize(30);
            label.setFontFillColor(new cc.Color(111,205,193,255));
            label.setScanPhixelRGB();
            label.setAnchorPoint(0, 1);
            pop_layout.setContentSize(570, 40+30+60+40+100+label.getContentSize().height);
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
            for(var i = 0 ; i < _this.m_male.size(); i++){
                name += _this.m_male.get(i).name;
                name+="、";
            }
            for(var i = 0 ; i < _this.m_women.size(); i++){
                name += _this.m_women.get(i).name;
                if(i != _this.m_women.size()-1){
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
                    alert("タイトルに入力してください");
                    return;
                }
                history.title = input.getString();
                DataManager.instance().createHistory(GAME_TYPE.LoveRedLine, history);
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

        this.m_func_isbacktomain = next_btn_touchevent
        var mask = new Mask();
        this.addChild(mask, 99);
        mask.close();
    },

    loadRedLineResultView2:function(ishistory){
        this.m_state = this.STATE_REDLINERESULTVIEW2;
        this.m_history = ishistory;
        var _this = this;

        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255,255,255,255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(cc.p(0, 1));
        title.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("運命の赤い糸結果");
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-50));
        this.addChild(titleName);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setAnchorPoint(0, 0);
        cutoff.setPosition(0,30+80+30);
        cutoff.setScaleX(cc.winSize.width);
        this.addChild(cutoff);


        var history = {};
        history.mode = "line";
        history.male = [];
        for(var i = 0 ; i < this.m_male.size(); i++){
            history.male.push(this.m_male.get(i));
        }
        history.women = [];
        for(var i = 0 ; i < this.m_women.size(); i++){
            history.women.push(this.m_women.get(i));
        }

        if(ishistory){
            var next_layout = new ccui.Layout();
            next_layout.setContentSize(250, 80);
            next_layout.setAnchorPoint(0, 0);
            next_layout.setPosition(cc.winSize.width/2 - (250 + 350 + 10)/2 - 5, 30);
            this.addChild(next_layout);

            var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            next_btn.setScale(250, 80);
            next_btn.setAnchorPoint(0, 0);
            next_btn.setTouchEnabled(true);
            var next_btn_touchevent = function(){
                for(var i = 0 ; i < _this.m_male.size(); i++){
                    if(_this.m_male.get(i).select){
                        delete _this.m_male.get(i).select;
                    }
                }
                for(var i = 0 ; i < _this.m_women.size(); i++){
                    if(_this.m_women.get(i).select){
                        delete _this.m_women.get(i).select;
                    }
                }
                _this.loadMemberSettingView(true);
            };
            next_btn.addClickEventListener(next_btn_touchevent);
            next_layout.addChild(next_btn);

            var next_text = new cc.LabelTTF("データ読み込み");
            next_text.setFontName(GAME_FONT.PRO_W3);
            next_text.setFontSize(26);
            next_text.setFontFillColor(cc.color(255,255,255,255));
            next_text.setScanPhixelRGB();
            next_text.setAnchorPoint(0.5, 0.5);
            next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
            next_layout.addChild(next_text);

            var next_layout = new ccui.Layout();
            next_layout.setContentSize(350, 80);
            next_layout.setAnchorPoint(0, 0);
            next_layout.setPosition(cc.winSize.width/2 - (250 + 350 + 10)/2+255, 30);
            this.addChild(next_layout);

            var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            next_btn.setScale(350, 80);
            next_btn.setAnchorPoint(0, 0);
            next_btn.setTouchEnabled(true);
            var next_btn_touchevent = function(){
                for(var i = 0 ; i < _this.m_male.size(); i++){
                    if(_this.m_male.get(i).select){
                        delete _this.m_male.get(i).select;
                    }
                }
                for(var i = 0 ; i < _this.m_women.size(); i++){
                    if(_this.m_women.get(i).select){
                        delete _this.m_women.get(i).select;
                    }
                }
                _this.loadEnvironmentSetting();
            };
            next_btn.addClickEventListener(next_btn_touchevent);
            next_layout.addChild(next_btn);

            var next_text = new cc.LabelTTF("同じメンバーで席決めへGo!");
            next_text.setFontName(GAME_FONT.PRO_W3);
            next_text.setFontSize(26);
            next_text.setFontFillColor(cc.color(255,255,255,255));
            next_text.setScanPhixelRGB();
            next_text.setAnchorPoint(0.5, 0.5);
            next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
            next_layout.addChild(next_text);
        }else{
            var next_layout = new ccui.Layout();
            next_layout.setContentSize(350, 80);
            next_layout.setAnchorPoint(0, 0);
            next_layout.setPosition(cc.winSize.width/2 - (200 + 350 + 10)/2+205, 30);
            this.addChild(next_layout);

            var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            next_btn.setScale(350, 80);
            next_btn.setAnchorPoint(0, 0);
            next_btn.setTouchEnabled(true);
            var next_btn_touchevent = function(){
                for(var i = 0 ; i < _this.m_male.size(); i++){
                    if(_this.m_male.get(i).select){
                        delete _this.m_male.get(i).select;
                    }
                }
                for(var i = 0 ; i < _this.m_women.size(); i++){
                    if(_this.m_women.get(i).select){
                        delete _this.m_women.get(i).select;
                    }
                }
                _this.loadEnvironmentSetting();
            };
            next_btn.addClickEventListener(next_btn_touchevent);
            next_layout.addChild(next_btn);

            var next_text = new cc.LabelTTF("同じメンバーで席決めへGo!");
            next_text.setFontName(GAME_FONT.PRO_W3);
            next_text.setFontSize(26);
            next_text.setFontFillColor(cc.color(255,255,255,255));
            next_text.setScanPhixelRGB();
            next_text.setAnchorPoint(0.5, 0.5);
            next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
            next_layout.addChild(next_text);

            var next_layout = new ccui.Layout();
            next_layout.setContentSize(200, 80);
            next_layout.setAnchorPoint(0, 0);
            next_layout.setPosition(cc.winSize.width/2 - (200 + 350 + 10)/2 - 5, 30);
            this.addChild(next_layout);

            var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
            next_btn.setScale(200, 80);
            next_btn.setAnchorPoint(0, 0);
            next_btn.setTouchEnabled(true);
            var next_btn_touchevent = function(){
                mask.open();
                var pop_layout = new ccui.Layout();
                pop_layout.setAnchorPoint(0.5, 0.5);
                pop_layout.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                pop_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                pop_layout.setBackGroundColor(cc.color(255,255,255,255));
                _this.addChild(pop_layout, 999);

                var label = new cc.LabelTTF("結果を保存しますか？");
                label.setFontName(GAME_FONT.PRO_W3);
                label.setFontSize(30);
                label.setFontFillColor(new cc.Color(111,205,193,255));
                label.setScanPhixelRGB();
                label.setAnchorPoint(0, 1);
                pop_layout.setContentSize(570, 40+30+60+40+100+label.getContentSize().height);
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
                for(var i = 0 ; i < _this.m_male.size(); i++){
                    name += _this.m_male.get(i).name;
                    name+="、";
                }
                for(var i = 0 ; i < _this.m_women.size(); i++){
                    name += _this.m_women.get(i).name;
                    if(i != _this.m_women.size()-1){
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
                        alert("タイトルに入力してください");
                        return;
                    }
                    history.title = input.getString();
                    DataManager.instance().createHistory(GAME_TYPE.LoveRedLine, history);
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
            _this.m_func_isbacktomain = next_btn_touchevent;
            next_btn.addClickEventListener(next_btn_touchevent);
            next_layout.addChild(next_btn);

            var next_text = new cc.LabelTTF("ホーム");
            next_text.setFontName(GAME_FONT.PRO_W3);
            next_text.setFontSize(26);
            next_text.setFontFillColor(cc.color(255,255,255,255));
            next_text.setScanPhixelRGB();
            next_text.setAnchorPoint(0.5, 0.5);
            next_text.setPosition(next_layout.getContentSize().width/2, next_layout.getContentSize().height/2);
            next_layout.addChild(next_text);

            var mask = new Mask();
            this.addChild(mask, 99);
            mask.close();
        }

        var contentH = 50;
        //组列表
        var listView_male = new ccui.ListView();
        // set list view ex direction
        listView_male.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView_male.setTouchEnabled(true);
        listView_male.setBounceEnabled(false);
        listView_male.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - 100 - 50 - 80 - 30 - 30 - 8 + contentH));
        listView_male.setAnchorPoint(0, 1);
        listView_male.setPosition(0, cc.winSize.height-100-100 -50 + contentH);
        listView_male.setVisible(true);
        this.addChild(listView_male);

        var listView_both = new ccui.ListView();
        // set list view ex direction
        listView_both.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView_both.setTouchEnabled(true);
        listView_both.setBounceEnabled(false);
        listView_both.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - 100 - 50 - 80 - 30 - 30 - 8 + contentH));
        listView_both.setAnchorPoint(0, 1);
        listView_both.setPosition(0, cc.winSize.height-100-100 -50 + contentH);
        listView_both.setVisible(false);
        this.addChild(listView_both);

        var listView_women = new ccui.ListView();
        // set list view ex direction
        listView_women.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView_women.setTouchEnabled(true);
        listView_women.setBounceEnabled(false);
        listView_women.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - 100 - 50 - 80 - 30 - 30 - 8 + contentH));
        listView_women.setAnchorPoint(0, 1);
        listView_women.setPosition(0, cc.winSize.height-100-100 -50 + contentH);
        listView_women.setVisible(false);
        this.addChild(listView_women);

        var male_radio_text = new cc.LabelTTF("♂男性");
        male_radio_text.setAnchorPoint(0.5, 0.5);
        male_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
        male_radio_text.setFontName(GAME_FONT.PRO_W3);
        male_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
        male_radio_text.setScanPhixelRGB();
        male_radio_text.setFontSize(32);

        var male_radio_selected = new ccui.Layout();
        male_radio_selected.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        male_radio_selected.setBackGroundColor(cc.color(111,205,193,255));
        male_radio_selected.setContentSize(cc.winSize.width/3, 6);
        male_radio_selected.setAnchorPoint(0, 0);
        male_radio_selected.setPosition(0, 0);

        var male_radio = new ccui.Layout();
        male_radio.setContentSize(cc.winSize.width/3, 100);
        male_radio.setAnchorPoint(0, 1);
        male_radio.setPosition(0, cc.winSize.height-100);
        male_radio.setTouchEnabled(true);
        male_radio.addChild(male_radio_text);
        male_radio.addChild(male_radio_selected);
        male_radio.radiotext = male_radio_text;
        male_radio.isSelected = male_radio_selected;
        male_radio.selected = function(is){
            if(is){
                _this.m_sex = 0;
                this.radiotext.removeFromParent();
                var male_radio_text = new cc.LabelTTF("♂男性");
                male_radio_text.setAnchorPoint(0.5, 0.5);
                male_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                male_radio_text.setFontName(GAME_FONT.PRO_W3);
                male_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
                male_radio_text.setScanPhixelRGB();
                male_radio_text.setFontSize(32);
                this.radiotext = male_radio_text;
                this.addChild(male_radio_text);
                this.isSelected.setVisible(true);
                listView_male.setVisible(true);
            }else{
                this.radiotext.removeFromParent();
                var male_radio_text = new cc.LabelTTF("♂男性");
                male_radio_text.setAnchorPoint(0.5, 0.5);
                male_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                male_radio_text.setFontName(GAME_FONT.PRO_W3);
                male_radio_text.setFontFillColor(new cc.Color(200,200,200,255));
                male_radio_text.setScanPhixelRGB();
                male_radio_text.setFontSize(32);
                this.radiotext = male_radio_text;
                this.addChild(male_radio_text);
                this.isSelected.setVisible(false);
                listView_male.setVisible(false);
            }
        };
        male_radio.selected(false);
        this.addChild(male_radio);

        var both_radio_text = new cc.LabelTTF("♡カップル");
        both_radio_text.setAnchorPoint(0.5, 0.5);
        both_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
        both_radio_text.setFontName(GAME_FONT.PRO_W3);
        both_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
        both_radio_text.setScanPhixelRGB();
        both_radio_text.setFontSize(32);

        var both_radio_selected = new ccui.Layout();
        both_radio_selected.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        both_radio_selected.setBackGroundColor(cc.color(111,205,193,255));
        both_radio_selected.setContentSize(cc.winSize.width/3, 6);
        both_radio_selected.setAnchorPoint(0, 0);
        both_radio_selected.setPosition(0, 0);

        var both_radio = new ccui.Layout();
        both_radio.setContentSize(cc.winSize.width/2, 100);
        both_radio.setAnchorPoint(0, 1);
        both_radio.setPosition(cc.winSize.width/3, cc.winSize.height-100);
        both_radio.setTouchEnabled(true);
        both_radio.addChild(both_radio_text);
        both_radio.addChild(both_radio_selected);
        both_radio.radiotext = both_radio_text;
        both_radio.isSelected = both_radio_selected;
        both_radio.selected = function(is){
            if(is){
                _this.m_sex = 2;
                this.radiotext.removeFromParent();
                var both_radio_text = new cc.LabelTTF("♡カップル");
                both_radio_text.setAnchorPoint(0.5, 0.5);
                both_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                both_radio_text.setFontName(GAME_FONT.PRO_W3);
                both_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
                both_radio_text.setScanPhixelRGB();
                both_radio_text.setFontSize(32);
                this.radiotext = both_radio_text;
                this.addChild(both_radio_text);
                this.isSelected.setVisible(true);
                listView_both.setVisible(true);
            }else{
                this.radiotext.removeFromParent();
                var both_radio_text = new cc.LabelTTF("♡カップル");
                both_radio_text.setAnchorPoint(0.5, 0.5);
                both_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                both_radio_text.setFontName(GAME_FONT.PRO_W3);
                both_radio_text.setFontFillColor(new cc.Color(200,200,200,255));
                both_radio_text.setScanPhixelRGB();
                both_radio_text.setFontSize(32);
                this.radiotext = both_radio_text;
                this.addChild(both_radio_text);
                this.isSelected.setVisible(false);
                listView_both.setVisible(false);
            }
        };
        both_radio.selected(true);
        this.addChild(both_radio);

        var women_radio_text = new cc.LabelTTF("♀女性");
        women_radio_text.setAnchorPoint(0.5, 0.5);
        women_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
        women_radio_text.setFontName(GAME_FONT.PRO_W3);
        women_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
        women_radio_text.setScanPhixelRGB();
        women_radio_text.setFontSize(32);

        var women_radio_selected = new ccui.Layout();
        women_radio_selected.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        women_radio_selected.setBackGroundColor(cc.color(111,205,193,255));
        women_radio_selected.setContentSize(cc.winSize.width/3, 6);
        women_radio_selected.setAnchorPoint(0, 0);
        women_radio_selected.setPosition(0, 0);

        var women_radio = new ccui.Layout();
        women_radio.setContentSize(cc.winSize.width/2, 100);
        women_radio.setAnchorPoint(0, 1);
        women_radio.setPosition(cc.winSize.width/3*2, cc.winSize.height-100);
        women_radio.setTouchEnabled(true);
        women_radio.addChild(women_radio_text);
        women_radio.addChild(women_radio_selected);
        women_radio.radiotext = women_radio_text;
        women_radio.isSelected = women_radio_selected;
        women_radio.selected = function(is){
            if(is){
                _this.m_sex = 1;
                this.radiotext.removeFromParent();
                var women_radio_text = new cc.LabelTTF("♀女性");
                women_radio_text.setAnchorPoint(0.5, 0.5);
                women_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                women_radio_text.setFontName(GAME_FONT.PRO_W3);
                women_radio_text.setFontFillColor(new cc.Color(111,205,193,255));
                women_radio_text.setScanPhixelRGB();
                women_radio_text.setFontSize(32);
                this.radiotext = women_radio_text;
                this.addChild(women_radio_text);
                this.isSelected.setVisible(true);
                listView_women.setVisible(true);
                cc.log("aa");
            }else{
                this.radiotext.removeFromParent();
                var women_radio_text = new cc.LabelTTF("♀女性");
                women_radio_text.setAnchorPoint(0.5, 0.5);
                women_radio_text.setPosition(cc.winSize.width/3/2, (100-6)/2);
                women_radio_text.setFontName(GAME_FONT.PRO_W3);
                women_radio_text.setFontFillColor(new cc.Color(200,200,200,255));
                women_radio_text.setScanPhixelRGB();
                women_radio_text.setFontSize(32);
                this.radiotext = women_radio_text;
                this.addChild(women_radio_text);
                this.isSelected.setVisible(false);
                listView_women.setVisible(false);
            }
        };
        women_radio.selected(false);
        this.addChild(women_radio);

        male_radio.addClickEventListener(function(){
            if(_this.m_sex != 0){
            }
            male_radio.selected(true);
            women_radio.selected(false);
            both_radio.selected(false);
            //label1.setVisible(false);
        });

        both_radio.addClickEventListener(function(){
            if(_this.m_sex != 2){
            }
            both_radio.selected(true);
            male_radio.selected(false);
            women_radio.selected(false);
            //label1.setVisible(false);
        });

        women_radio.addClickEventListener(function(){
            if(_this.m_sex != 1){
            }
            male_radio.selected(false);
            women_radio.selected(true);
            both_radio.selected(false);
            //label1.setVisible(false);
        });

        //var label1 = new cc.LabelTTF("意中の相手が表示されます");
        //label1.setAnchorPoint(0.5, 0.5);
        //label1.setPosition(cc.winSize.width/2, cc.winSize.height-200-25);
        //label1.setFontName(GAME_FONT.PRO_W3);
        //label1.setFontFillColor(new cc.Color(200,200,200,255));
        //label1.setScanPhixelRGB();
        //label1.setFontSize(24);
        //this.addChild(label1);

        var temp = [];
        for(var i = 0 ;i < 3; i++){
            var layout = new ccui.Layout();
            var memberNode = ccui.helper.seekWidgetByName(ccs.load(LoveRedLineRes["member_json"]).node, "Panel");
            memberNode.removeFromParent();
            var contentSize = {width:memberNode.getContentSize().width, height:memberNode.getContentSize().height};
            var count = (this.m_male.size()>this.m_women.size()?this.m_male.size():this.m_women.size());
            layout.setContentSize(cc.winSize.width, 100 + contentSize.height*count + 10*(count-1));
            for(var j = 0 ; j < this.m_male.size(); j++){
                memberNode = ccui.helper.seekWidgetByName(ccs.load(LoveRedLineRes["member_json"]).node, "Panel");
                memberNode.removeFromParent();
                ccui.helper.seekWidgetByName(memberNode, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + this.m_male.get(j).icon + ".png");
                ccui.helper.seekWidgetByName(memberNode, "name").setString(this.m_male.get(j).name);
                memberNode.setAnchorPoint(0, 1);
                memberNode.setPosition(0, layout.getContentSize().height - 50 - (memberNode.getContentSize().height+10)*j);
                layout.addChild(memberNode);
            }

            for(var j = 0 ; j < this.m_women.size(); j++){
                memberNode = ccui.helper.seekWidgetByName(ccs.load(LoveRedLineRes["member_json"]).node, "Panel");
                memberNode.removeFromParent();
                ccui.helper.seekWidgetByName(memberNode, "icon").setTexture("res/Global/cha_pop/cha_thumb_" + this.m_women.get(j).icon + ".png");
                ccui.helper.seekWidgetByName(memberNode, "name").setString(this.m_women.get(j).name);
                memberNode.setAnchorPoint(1, 1);
                memberNode.setPosition(layout.getContentSize().width, layout.getContentSize().height - 50 - (memberNode.getContentSize().height+10)*j);
                layout.addChild(memberNode);
            }

            if(i == 0){
                for(var j = 0 ; j < this.m_male.size(); j++){
                    if(this.m_male.get(j).select){
                        for(var k = 0 ; k < this.m_women.size(); k++){
                            if(this.m_male.get(j).select === "" + this.m_women.get(k).name + this.m_women.get(k).icon){
                                var posMale = {x:contentSize.width, y:50 + 62 + (contentSize.height+10)*j};
                                var posWomen = {x:cc.winSize.width-contentSize.width, y:50 + 62 + (contentSize.height+10)*k};
                                var xdiff = posMale.x - posWomen.x;
                                var ydiff = posMale.y - posWomen.y;
                                var length = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
                                var arrow_line = new ccui.Layout();
                                arrow_line.setContentSize(length, 24);
                                arrow_line.setAnchorPoint(0, 0.5);
                                arrow_line.setPosition(posMale.x, layout.getContentSize().height - posMale.y);
                                layout.addChild(arrow_line);
                                for(var q = 0; q < (length)/16-1; q++){
                                    var dot = new cc.Sprite(LoveRedLineRes.line_dot);
                                    dot.setAnchorPoint(0, 0.5);
                                    dot.setPosition(q*16, arrow_line.getContentSize().height/2);
                                    arrow_line.addChild(dot);
                                }
                                var arrow = new cc.Sprite(LoveRedLineRes.arrow_head);
                                arrow.setAnchorPoint(1, 0.5);
                                arrow.setPosition(arrow_line.getContentSize().width, arrow_line.getContentSize().height/2);
                                arrow_line.addChild(arrow);

                                arrow_line.setRotation(-(this.ANAGLE(posMale.x, posMale.y, posWomen.x, posWomen.y)));
                            }
                        }
                    }
                }
            }else if(i == 1){
                for(var j = 0 ; j < this.m_male.size(); j++){
                    if(this.m_male.get(j).select){
                        for(var k = 0 ; k < this.m_women.size(); k++){
                            if(this.m_male.get(j).select === "" + this.m_women.get(k).name + this.m_women.get(k).icon && this.m_women.get(k).select === "" + this.m_male.get(j).name + this.m_male.get(j).icon){
                                var posMale = {x:contentSize.width, y:50 + 62 + (contentSize.height+10)*j};
                                var posWomen = {x:cc.winSize.width-contentSize.width, y:50 + 62 + (contentSize.height+10)*k};
                                var xdiff = posMale.x - posWomen.x;
                                var ydiff = posMale.y - posWomen.y;
                                var length = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
                                var arrow_line = new ccui.Layout();
                                arrow_line.setContentSize(length, 24);
                                arrow_line.setAnchorPoint(0, 0.5);
                                arrow_line.setPosition(posMale.x, layout.getContentSize().height - posMale.y);
                                layout.addChild(arrow_line);

                                var line = new cc.Sprite(LoveRedLineRes.arrow_line);
                                line.setScaleX(length-16-16);
                                line.setAnchorPoint(0, 0.5);
                                line.setPosition(16, arrow_line.getContentSize().height/2);
                                arrow_line.addChild(line);

                                var arrow1 = new cc.Sprite(LoveRedLineRes.arrow_head);
                                arrow1.setAnchorPoint(1, 0.5);
                                arrow1.setPosition(arrow_line.getContentSize().width, arrow_line.getContentSize().height/2);
                                arrow_line.addChild(arrow1);
                                var arrow2 = new cc.Sprite(LoveRedLineRes.arrow_head);
                                arrow2.setAnchorPoint(1, 0.5);
                                arrow2.setScaleX(-1);
                                arrow2.setPosition(0, arrow_line.getContentSize().height/2);
                                arrow_line.addChild(arrow2);

                                arrow_line.setRotation(-(this.ANAGLE(posMale.x, posMale.y, posWomen.x, posWomen.y)));
                            }
                        }
                    }
                }
            }else if(i == 2){
                for(var j = 0 ; j < this.m_women.size(); j++){
                    if(this.m_women.get(j).select){
                        for(var k = 0 ; k < this.m_male.size(); k++){
                            if(this.m_women.get(j).select === "" + this.m_male.get(k).name + this.m_male.get(k).icon){
                                var posMale = {x:contentSize.width, y:50 + 62 + (contentSize.height+10)*k};
                                var posWomen = {x:cc.winSize.width-contentSize.width, y:50 + 62 + (contentSize.height+10)*j};
                                var xdiff = posMale.x - posWomen.x;
                                var ydiff = posMale.y - posWomen.y;
                                var length = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
                                var arrow_line = new ccui.Layout();
                                arrow_line.setContentSize(length, 24);
                                arrow_line.setAnchorPoint(0, 0.5);
                                arrow_line.setPosition(posMale.x, layout.getContentSize().height - posMale.y);
                                layout.addChild(arrow_line);
                                for(var q = 0; q < (length)/16-1; q++){
                                    var dot = new cc.Sprite(LoveRedLineRes.line_dot);
                                    dot.setAnchorPoint(0, 0.5);
                                    dot.setPosition(q*16+16, arrow_line.getContentSize().height/2);
                                    arrow_line.addChild(dot);
                                }
                                var arrow = new cc.Sprite(LoveRedLineRes.arrow_head);
                                arrow.setAnchorPoint(1, 0.5);
                                arrow.setScaleX(-1);
                                arrow.setPosition(0, arrow_line.getContentSize().height/2);
                                arrow_line.addChild(arrow);

                                arrow_line.setRotation(-(this.ANAGLE(posMale.x, posMale.y, posWomen.x, posWomen.y)));
                            }
                        }
                    }
                }
            }

            temp.push(layout);
        }

        listView_male.pushBackDefaultItem();
        listView_male.pushBackCustomItem(temp[0]);
        listView_both.pushBackDefaultItem();
        listView_both.pushBackCustomItem(temp[1]);
        listView_women.pushBackDefaultItem();
        listView_women.pushBackCustomItem(temp[2]);

    },


    editBoxTextChanged: function (editBox, text) {
        if(editBox.getMaxLength())
            if(editBox.getString().length>editBox.getMaxLength())
                editBox.setString(editBox.getString().substring(0,editBox.getMaxLength()));
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
            case context.STATE_MEMBERSETTING:
                context.loadMainView();
                break;
            case context.STATE_ENVIRONMENTSETTING:
                context.loadMemberSettingView(false);
                break;
            case context.STATE_CHOOSEVIEW:
                context.loadMemberSettingView(true);
                break;
            case context.STATE_TAGBELRESULT:
            case context.STATE_REDLINERESULTVIEW2:
                if(context.m_history){
                    context.loadMainView();
                    return;
                }
                context.m_func_isbacktomain();
                break;
            case context.STATE_REDLINERESULTVIEW:
                context.m_func_isbacktomain();
                break;
        }
    },

    ANAGLE: function(startx, starty, endx, endy){
        //除数不能为0
        var tan = Math.atan(Math.abs((endy - starty) / (endx - startx))) * 180 / 3.1415926;
        if (endx >= startx && endy >= starty)//第一象限
        {
            return -tan;
        }
        else if (endx >= startx && endy < starty)//第二象限
        {
            return tan;
        }
        else if (endx < startx && endy >= starty)//第三象限
        {
            return tan - 180;
        }
        else
        {
            return 180 - tan;
        }

    }

});

var LoveRedLineScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LoveRedLineLayer();
        this.addChild(layer);
    }
});