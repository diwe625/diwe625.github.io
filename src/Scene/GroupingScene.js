/**
 * Created by dyfox on 15-10-16.
 * 팀 나누기 （分组）
 */

var GroupingLayer = cc.LayerColor.extend({

    m_groupdata:null,
    m_memberdata:null,
    m_mode:null,
    m_state:-1,
    STATE_MAIN:0,
    STATE_QUICKSETTING:1,
    STATE_MEMBERSETTING:2,
    STATE_GROUPSETTING:3,
    STATE_REPLAY:4,
    STATE_RESULT1:5,
    STATE_RESULT2:6,
    m_func_isbacktomain:null,

    ctor:function () {
        this._super(cc.color(255,255,255,255));

        this.m_groupdata = new ArrayList();
        this.m_memberdata = new ArrayList();

        this.loadMainView();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.Grouping);

        Utility.sendXhr(GAME_TYPE.Grouping.gameid);

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
                case context.STATE_RESULT2:
                    if(context.result2)
                        context.loadResult2View(context.result2[0], context.result2[1], context.result2[2], context.result2[3], context.result2[4]);
                    break;
            }
            Utility.checkRfresh = false;
        }
    },

    loadMainView:function(){
        this.m_memberdata.clear();
        this.m_groupdata.clear();
        this.m_state = this.STATE_MAIN;
        this.removeAllChildren();
        var toolbar = new Toolbar(GAME_TYPE.Grouping);
        toolbar.setTag(4);
        toolbar.setName("toolBar");
        toolbar.setAnchorPoint(cc.p(0,1));
        toolbar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolbar, 9999);

        var bg1 = new cc.Sprite(GroupingRes.bg);
        bg1.setAnchorPoint(cc.p(0, 0));
        bg1.setPosition(cc.p(0, 0));
        this.addChild(bg1);

        var top_000 = new cc.Sprite();
        top_000.setAnchorPoint(0, 1);
        top_000.setPosition(0, cc.winSize.height-100);
        var frames = [];
        for(var i = 0 ; i < 7; i++){
            frames.push(new cc.SpriteFrame("res/Scene/Grouping/top_00" + (i+1) + ".png", new cc.Rect(0, 0, 750, 450)));
        }
        var animation = new cc.Animation(frames, 0.15);
        var animate = cc.animate(animation);

        frames = [];
        frames.push(new cc.SpriteFrame("res/Scene/Grouping/top_008.png", new cc.Rect(0, 0, 750, 450)));
        animation = new cc.Animation(frames, 1);

        var animate1 = cc.animate(animation);
        frames = [];
        frames.push(new cc.SpriteFrame("res/Scene/Grouping/top_009.png", new cc.Rect(0, 0, 750, 450)));
        animation = new cc.Animation(frames, 0.15);

        var animate2 = cc.animate(animation);
        top_000.runAction(new cc.Sequence(animate, animate1, animate2).repeatForever());
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

        var historys = DataManager.instance().getHistory(GAME_TYPE.Grouping);
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
                var btnImage = historys.get(i).data.mode === "quick"? GroupingRes.simple_list_btn : GroupingRes.setting_list_btn;
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
                for(j = 0; j < historys.get(i).data.groups.length; j++){
                    for(var k = 0; k < historys.get(i).data.groups[j].members.length; k++){
                        if(j == historys.get(i).data.groups.length-1 && k == historys.get(i).data.groups[j].members.length-1){
                            str += historys.get(i).data.groups[j].members[k].name;
                            break;
                        }
                        str += historys.get(i).data.groups[j].members[k].name + "、";
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
                var members = [];
                for(j = 0; j < historys.get(i).data.groups.length; j++){
                    members = members.concat(historys.get(i).data.groups[j].members);
                }
                replay_btn.setUserData({members:members, mode:mode});
                var replay_event = function(node){
                    _this.loadReplayView(node.getUserData().members, node.getUserData().mode);
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
                    DataManager.instance().deleteHistory(GAME_TYPE.Grouping, node.getUserData().time);
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
                                _this.result2 = [];
                                _this.result2.push(arm);
                                _this.result2.push(year);
                                _this.result2.push(month);
                                _this.result2.push(day);
                                _this.result2.push(sender.getUserData().data.mode);
                                _this.loadResult2View(arm, year, month, day, sender.getUserData().data.mode);
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

        var mode_Btn = new ccui.Button(GroupingRes.start_btn, GroupingRes.start_btn);
        mode_Btn.setTag(0);
        mode_Btn.setAnchorPoint(cc.p(1, 0));
        mode_Btn.setPosition(cc.p(cc.winSize.width-22, 30));
        var _this = this;
        mode_Btn.addClickEventListener(function(){_this.modeBtnCallback(mode_Btn);});
        this.addChild(mode_Btn, 999);
    },

    loadQuickSettingView:function(){
        this.m_state = this.STATE_QUICKSETTING;
        this.m_mode = "quick";
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
        var titleName = new cc.LabelTTF("参加者登錄");
        titleName.setFontName(GAME_FONT.PRO_W6);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-50));
        this.addChild(titleName);

        //分割线
        var grayLine = new cc.Sprite(GlobalRes.line_50);
        grayLine.setScaleX(cc.winSize.width);
        grayLine.setAnchorPoint(cc.p(0, 1));
        grayLine.setPosition(cc.p(0, cc.winSize.height-100-120));
        this.addChild(grayLine);

        var lineH = 50;

        var count_label1 = new cc.LabelTTF("3人以上登録してください");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        count_label1.setAnchorPoint(0.5, 0.5);
        count_label1.setPosition(cc.winSize.width/2, grayLine.getPosition().y - 30);
        this.addChild(count_label1);

        var addition_btn = new ccui.Button(GlobalRes.addition_btn, GlobalRes.addition_btn);
        addition_btn.setAnchorPoint(1, 0.5);
        addition_btn.setPosition(cc.winSize.width - 30, cc.winSize.height - 100 - 120/2);
        addition_btn.setVisible(false);
        var addition_btn_touchevent = function(){
            if(listView.getItems().length==30){
                return;
            }
            if(name_random_field.getString() && name_random_field.getString() !== ""){
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
                    count_label2.setString(""+listView.getItems().length);
                    if(listView.getItems().length>=3 && listView.getItems().length<=30){
                        next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                        next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                        next_btn.setTouchEnabled(true);
                    }else{
                        next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                        next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                        next_btn.setTouchEnabled(false);
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
                count_label2.setString(""+listView.getItems().length);
                if(listView.getItems().length>=3 && listView.getItems().length<=30){
                    next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                    next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                    next_btn.setTouchEnabled(true);
                }else{
                    next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                    next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                    next_btn.setTouchEnabled(false);
                }

                if(1){
                    name_random_field.removeFromParent();
                    name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - addition_btn.getContentSize().width , 120),new cc.Scale9Sprite());
                    name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                    name_random_field.setPlaceholderFontSize(36);
                    name_random_field.setPlaceHolder("    参加者を登録してください");
                    name_random_field.setAdd(true);
                    name_random_field.setAnchorPoint(cc.p(0,0.5));
                    name_random_field.setPosition(30 + 30, cc.winSize.height - 100 - 120/2);
                    name_random_field.setDelegate(_this);
                    name_random_field.setFontName(GAME_FONT.PRO_W3);
                    name_random_field.setFontColor(cc.color(111,205,193,255));
                    name_random_field.setFontSize(36);
                    name_random_field.setMaxLength(16);
                    _this.addChild(name_random_field);
                    name_random_field.schedule(isaddbtnvisible, 0 ,cc.REPEAT_FOREVER);
                }else{
                    name_random_field.setString("");
                    name_random_field.setInputblur();
                }
            }else{
                alert("参加者を登録してください");
            }
        };
        addition_btn.addClickEventListener(addition_btn_touchevent);
        var addition_btn_sub = new ccui.Layout();
        addition_btn_sub.setContentSize(115+30, 120);
        addition_btn_sub.setTouchEnabled(true);
        addition_btn_sub.addClickEventListener(addition_btn_touchevent);
        addition_btn_sub.setAnchorPoint(0.5, 0.5);
        addition_btn_sub.setPosition(addition_btn.getContentSize().width>>1, addition_btn.getContentSize().height>>1);
        addition_btn.addChild(addition_btn_sub);
        this.addChild(addition_btn);

        //名字输入框
        var name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - addition_btn.getContentSize().width , 120),new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    参加者を登録してください");
        name_random_field.setAdd(true);
        name_random_field.setAnchorPoint(cc.p(0,0.5));
        name_random_field.setPosition(30 + 30, cc.winSize.height - 100 - 120/2);
        name_random_field.setDelegate(this);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111,205,193,255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        this.addChild(name_random_field);

        var isaddbtnvisible = function(){
            if(name_random_field.getString() === ""){
                addition_btn.setVisible(false);
            }else{
                addition_btn.setVisible(true);
            }
        };
        name_random_field.schedule(isaddbtnvisible, 0 ,cc.REPEAT_FOREVER);

        //组列表
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(750, cc.winSize.height - 100 - 120 - 8 - 200 - lineH));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height-100-120-lineH);
        this.addChild(listView);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - listView.getContentSize().height - lineH);
        this.addChild(cutoff);

        var count_label1 = new cc.LabelTTF(" 人が参加登録されています");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        count_label1.setAnchorPoint(0.5, 1);
        count_label1.setPosition(cc.winSize.width/2, cutoff.getPosition().y - 8 - 30);
        this.addChild(count_label1);

        var count_label2 = new cc.LabelTTF("0");
        count_label2.setFontName(GAME_FONT.PRO_W3);
        count_label2.setFontSize(26);
        count_label2.setFontFillColor(cc.color(111,205,193,255));
        count_label2.setAnchorPoint(1, 1);
        count_label2.setPosition(count_label1.getPosition().x - count_label1.getContentSize().width/2, cutoff.getPosition().y - 8 - 30);
        this.addChild(count_label2);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(200, 80);
        next_layout.setAnchorPoint(0.5, 1);
        next_layout.setPosition(cc.winSize.width/2, count_label2.getPosition().y - count_label2.getContentSize().height-30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_c8c8c8, GlobalRes.color_c8c8c8);
        next_btn.setScale(200, 80);
        next_btn.setAnchorPoint(0, 0);
        next_btn.setTouchEnabled(false);
        var next_btn_touchevent = function(){
            var items = listView.getItems();
            for(var i = 0; i < items.length ; i++){
                _this.m_memberdata.add(items[i].getUserData());
            }
            _this.m_groupdata.add({icon:"01", name:"ブニャ"});
            _this.m_groupdata.add({icon:"02", name:"ばにら"});
            _this.loadResult1View();
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

        var fineInput = new cc.LabelTTF("参加者入力完了");
        fineInput.setFontName(GAME_FONT.PRO_W3);
        fineInput.setFontSize(36);
        fineInput.setFontFillColor(cc.color.GRAY);
        fineInput.setAnchorPoint(0, 1);
        fineInput.setPosition(50, cc.winSize.height - 100 - 40);
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
        };

        title.schedule(callback, 0 ,cc.REPEAT_FOREVER);

    },

    loadGroupsSettingView:function(){
        this.m_state = this.STATE_GROUPSETTING;
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

        this.m_mode = "normal";
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
        var titleName = new cc.LabelTTF("チーム登録");
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setScanPhixelRGB();
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-50));
        this.addChild(titleName);

        //分割线
        var grayLine = new cc.Sprite(GlobalRes.line_50);
        grayLine.setScaleX(cc.winSize.width);
        grayLine.setAnchorPoint(cc.p(0, 1));
        grayLine.setPosition(cc.p(0, cc.winSize.height-280));
        this.addChild(grayLine);

        var lineH = 50;

        var count_label1 = new cc.LabelTTF("登録者数によってチーム数は制限があります");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        count_label1.setAnchorPoint(0.5, 0.5);
        count_label1.setPosition(cc.winSize.width/2, grayLine.getPosition().y - 30);
        this.addChild(count_label1);

        //组列表
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(750, cc.winSize.height - 100 - 180 - 8 - lineH - 200));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height-100-180-lineH);
        //listView.pushBackDefaultItem();
        this.addChild(listView);


        var searchIndex = function(list, index){
            var items = [];
            for(var i = 0 ; i < list.getItems().length; i++){
                if(list.getItem(i).getUserData().index == index){
                    items.push(list.getItem(i));
                }
            }
            return items;
        };

        var _this = this;
        //“点击添加”按钮回调
        var cha_random_btn_event = function(){
            if(_this.m_memberdata.size() == 3){
                if(listView.getItems().length==2){
                    return;
                }
            }else{
                if(listView.getItems().length==_this.m_memberdata.size()-1/*Math.floor(_this.m_memberdata.size()/2)*/){
                    return;
                }
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
            var israndomblock = 0;
            for(var i = 0 ; i < 16; i++){
                var flag = searchIndex(listView, i).length;
                var image = "res/Global/cha_pop/cha_pop_" + PAD(i+1, 2) + "_off.png";
                var radio = new ccui.Button(image, image);
                radio.setAnchorPoint(0, 1);
                radio.setPosition(55 + (radio.getContentSize().width + 40)*parseInt(i%4), cha_pop_layout.getContentSize().height - 60 - (radio.getContentSize().height + 40)*parseInt(i/4) );
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
                    SoundManager.instance().playEffect(GroupingRes.sound_normal_1);
                    //if(node.getUserData().name == cha_names[14])
                    //    SoundManager.instance().playEffect(GroupingRes.sound_character_selected_1);
                    //else if(node.getUserData().name == cha_names[0] ||
                    //    node.getUserData().name == cha_names[1] ||
                    //    node.getUserData().name == cha_names[8] ||
                    //    node.getUserData().name == cha_names[4])
                    //    SoundManager.instance().playEffect(GroupingRes.sound_character_selected_2);
                    //else if(node.getUserData().name == cha_names[7] ||
                    //    node.getUserData().name == cha_names[6] ||
                    //    node.getUserData().name == cha_names[11] ||
                    //    node.getUserData().name == cha_names[2] ||
                    //    node.getUserData().name == cha_names[3])
                    //    SoundManager.instance().playEffect(GroupingRes.sound_character_selected_3);
                    //else if(node.getUserData().name == cha_names[9] ||
                    //    node.getUserData().name == cha_names[5] ||
                    //    node.getUserData().name == cha_names[10] ||
                    //    node.getUserData().name == cha_names[12] ||
                    //    node.getUserData().name == cha_names[13])
                    //    SoundManager.instance().playEffect(GroupingRes.sound_character_selected_4);
                };
                if(i == 15 && israndomblock == 15)flag = 2;
                if(flag < 2)
                    radio.addClickEventListener(radio_touchevent);
                cha_pop_layout.addChild(radio);
                if(flag >= 2){
                    israndomblock++;
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
            ok_btn.setTouchEnabled(true);
            ok_btn.setAnchorPoint(0,0);
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
                      while(searchIndex(listView, index).length == 2){
                          index = Math.floor(Math.random()*15);
                      }
                      if(searchIndex(listView, index).length == 1){
                          if(searchIndex(listView, index)[0].getUserData().icon.indexOf("_b") == -1){
                              obj.icon = ""+PAD(index+1, 2)+"_b";
                          }else{
                              obj.icon = ""+PAD(index+1, 2);
                          }
                      }else{
                          obj.icon = searchIndex(listView, index).length == 0 ? ""+PAD(index+1, 2) : ""+PAD(index+1, 2)+"_b";
                      }
                      obj.name = cha_names[index];
                      obj.index = index;
                  }else{
                      obj.index = radioList.current.getUserData().index;
                      if(searchIndex(listView, obj.index).length == 1){
                          if(searchIndex(listView, obj.index)[0].getUserData().icon.indexOf("_b") == -1){
                              obj.icon = ""+PAD(obj.index+1, 2)+"_b";
                          }else{
                              obj.icon = ""+PAD(obj.index+1, 2);
                          }
                      }else{
                          obj.icon = searchIndex(listView, obj.index).length == 0 ? ""+PAD(obj.index+1, 2) : ""+PAD(obj.index+1, 2)+"_b";
                      }
                      obj.name = radioList.current.getUserData().name;
                  }
                  cha_random_btn.loadTextureNormal("res/Global/cha_pop/cha_thumb_" + obj.icon + ".png");
                  cha_random_btn.loadTexturePressed("res/Global/cha_pop/cha_thumb_" + obj.icon + ".png");
                  cha_random_btn.setUserData(obj);
                  cha_random_btn.setAnchorPoint(0, 1);
                  cha_random_btn.setPosition(30, cc.winSize.height-100-(180-cha_random_btn.getContentSize().height)/2);
                  addition_btn.setVisible(true);

                  if(1) {
                      //直接获得焦点
                      name_random_field.removeFromParent();
                      name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - cha_random_btn.getContentSize().width - addition_btn.getContentSize().width, 180),
                          new cc.Scale9Sprite(), null, null, true);
                      name_random_field.setBodyStyle(1);
                      //name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                      name_random_field.setPlaceholderFontSize(36);
                      name_random_field.setPlaceHolder("");
                      name_random_field.setAnchorPoint(cc.p(0, 0.5));
                      name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30, cc.winSize.height - 100 - 180 / 2);
                      name_random_field.setDelegate(_this);
                      name_random_field.setFontName(GAME_FONT.PRO_W3);
                      name_random_field.setFontColor(cc.color(111, 205, 193, 255));
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
        var cha_random_btn = new ccui.Button(GroupingRes.cha_thumb_random, GroupingRes.cha_thumb_random);
        cha_random_btn.setAnchorPoint(0, 1);
        cha_random_btn.setPosition(30, cc.winSize.height-100-(180-cha_random_btn.getContentSize().height)/2);
        cha_random_btn.setUserData("");
        cha_random_btn.addClickEventListener(cha_random_btn_event);
        this.addChild(cha_random_btn);

        //添加按钮
        var addition_btn = new ccui.Button(GlobalRes.addition_btn, GlobalRes.addition_btn);
        addition_btn.setAnchorPoint(1, 0.5);
        addition_btn.setPosition(cc.winSize.width - 30, cc.winSize.height - 100 - 180/2);
        addition_btn.setVisible(false);
        var addition_btn_touchevent = function(){
            if(_this.m_memberdata.size() == 3){
                if(listView.getItems().length==2){
                    return;
                }
            }else{
                if(listView.getItems().length==_this.m_memberdata.size()-1/*Math.floor(_this.m_memberdata.size()/2)*/){
                    return;
                }
            }
            if(name_random_field.getString() && name_random_field.getString() !== ""){
                var data = {};
                data.icon = cha_random_btn.getUserData().icon;
                data.index = cha_random_btn.getUserData().index;
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
                name.setAnchorPoint(0,0);
                name.setPosition(icon.getPosition().x + icon.getContentSize().width + 30, icon.getPosition().y+2);
                layout.addChild(name);
                var flag = new cc.LabelTTF("チーム");
                flag.setFontName(GAME_FONT.PRO_W3);
                flag.setFontSize(22);
                flag.setFontFillColor(cc.color(111,205,193,255));
                flag.setScanPhixelRGB();
                flag.setAnchorPoint(0,1);
                flag.setPosition(icon.getPosition().x + icon.getContentSize().width + 30, icon.getPosition().y-2);
                layout.addChild(flag);
                var delete_btn = new ccui.Button(GlobalRes.delete_png, GlobalRes.delete_png);
                delete_btn.setAnchorPoint(1, 0.5);
                delete_btn.setPosition(layout.getContentSize().width-30, icon.getPosition().y);
                var delete_btn_touchevent = function(){
                    listView.removeItem(listView.getIndex(layout));
                    count_label2.setString(""+listView.getItems().length);
                    if(_this.m_memberdata.size() == 3){
                        if(listView.getItems().length==2){
                            next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                            next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                            next_btn.setTouchEnabled(true);
                        }else{
                            next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                            next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                            next_btn.setTouchEnabled(false);
                        }
                    }else if(_this.m_memberdata.size() >3){
                        if(listView.getItems().length<=_this.m_memberdata.size()-1/*Math.floor(_this.m_memberdata.size()/2)*/ && listView.getItems().length>=2){
                            next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                            next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                            next_btn.setTouchEnabled(true);
                        }else{
                            next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                            next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                            next_btn.setTouchEnabled(false);
                        }
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
                count_label2.setString(""+listView.getItems().length);

                if(_this.m_memberdata.size() == 3){
                    if(listView.getItems().length==2){
                        next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                        next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                        next_btn.setTouchEnabled(true);
                    }else{
                        next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                        next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                        next_btn.setTouchEnabled(false);
                    }
                }else if(_this.m_memberdata.size() >3){
                    if(listView.getItems().length<=_this.m_memberdata.size()-1/*Math.floor(_this.m_memberdata.size()/2)*/ && listView.getItems().length>=2){
                        next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                        next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                        next_btn.setTouchEnabled(true);
                    }else{
                        next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                        next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                        next_btn.setTouchEnabled(false);
                    }
                }
                name_random_field.setString("");
                name_random_field.setInputblur();
                addition_btn.setVisible(false);
                cha_random_btn.loadTextureNormal(GroupingRes.cha_thumb_random);
                cha_random_btn.loadTexturePressed(GroupingRes.cha_thumb_random);
                cha_random_btn.setUserData("");
            }else{
                alert("参加者を登録してください");
            }
        };
        addition_btn.addClickEventListener(addition_btn_touchevent);
        var addition_btn_sub = new ccui.Layout();
        addition_btn_sub.setContentSize(115+30, 120);
        addition_btn_sub.setTouchEnabled(true);
        addition_btn_sub.addClickEventListener(addition_btn_touchevent);
        addition_btn_sub.setAnchorPoint(0.5, 0.5);
        addition_btn_sub.setPosition(addition_btn.getContentSize().width>>1, addition_btn.getContentSize().height>>1);
        addition_btn.addChild(addition_btn_sub);
        this.addChild(addition_btn);
        addition_btn.setTag(7);

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
        name_random_field.setPlaceHolder("");
        name_random_field.setAnchorPoint(cc.p(0,0.5));
        name_random_field.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30, cc.winSize.height - 100 - 180/2);
        name_random_field.setDelegate(this);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111,205,193,255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(12);
        this.addChild(name_random_field);
        name_random_field.setVisible(false);
        name_random_field.setTag(6);
        name_random_field.setDisFocusCallback(isPlaceholder);

        var placeholder = new cc.LabelTTF("チームを登録してください");
        placeholder.setFontName(GAME_FONT.PRO_W3);
        placeholder.setFontSize(36);
        placeholder.setFontFillColor(cc.color.GRAY);
        var placeLayout = new ccui.Layout();
        placeLayout.setTouchEnabled(true);
        placeLayout.setContentSize(placeholder.getContentSize());
        placeLayout.setAnchorPoint(0, 0.5);
        placeLayout.setPosition(cha_random_btn.getPosition().x + cha_random_btn.getContentSize().width + 30, cc.winSize.height - 100 - 180/2);
        this.addChild(placeLayout);
        placeholder.setAnchorPoint(0, 0.5);
        placeholder.setPosition(0, placeLayout.getContentSize().height/2);
        placeLayout.addChild(placeholder);
        placeLayout.setTag(5);
        placeLayout.addClickEventListener(cha_random_btn_event);


        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 180 - lineH- listView.getContentSize().height);
        this.addChild(cutoff);

        var count_label1 = new cc.LabelTTF(" つのチームが登録されています");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        count_label1.setAnchorPoint(0.5, 1);
        count_label1.setPosition(cc.winSize.width/2, cutoff.getPosition().y - 8 - 30);
        this.addChild(count_label1);

        var count_label2 = new cc.LabelTTF("0");
        count_label2.setFontName(GAME_FONT.PRO_W3);
        count_label2.setFontSize(26);
        count_label2.setFontFillColor(cc.color(111,205,193,255));
        count_label2.setAnchorPoint(1, 1);
        count_label2.setPosition(count_label1.getPosition().x - count_label1.getContentSize().width/2, cutoff.getPosition().y - 8 - 30);
        this.addChild(count_label2);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(200, 80);
        next_layout.setAnchorPoint(0.5, 1);
        next_layout.setPosition(cc.winSize.width/2, count_label2.getPosition().y - count_label2.getContentSize().height-30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_c8c8c8, GlobalRes.color_c8c8c8);
        next_btn.setScale(200, 80);
        next_btn.setAnchorPoint(0, 0);
        next_btn.setTouchEnabled(false);
        var next_btn_touchevent = function(){
            var items = listView.getItems();
            for(var i = 0; i < items.length ; i++){
                _this.m_groupdata.add(items[i].getUserData());
            }
            _this.loadResult1View();
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

        //var callback = function(){
        //    if(_this.m_memberdata.size() == 3){
        //        if(listView.getItems().length==2){
        //            name_random_field.setVisible(false);
        //        }else{
        //            name_random_field.setVisible(true);
        //        }
        //    }else{
        //        if(listView.getItems().length==Math.floor(_this.m_memberdata.size()/2)){
        //            name_random_field.setVisible(false);
        //        }else{
        //            name_random_field.setVisible(true);
        //        }
        //    }
        //};
        //
        //title.schedule(callback, 0 ,cc.REPEAT_FOREVER);
    },

    loadMemberSettingView : function(){
        this.m_state = this.STATE_MEMBERSETTING;
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
        var titleName = new cc.LabelTTF("参加者登錄");
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-50));
        this.addChild(titleName);

        //分割线
        var grayLine = new cc.Sprite(GlobalRes.line_50);
        grayLine.setScaleX(cc.winSize.width);
        grayLine.setAnchorPoint(cc.p(0, 1));
        grayLine.setPosition(cc.p(0, cc.winSize.height-100-120));
        this.addChild(grayLine);


        var lineH = 50;

        var count_label1 = new cc.LabelTTF("3人以上登録してください");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        count_label1.setAnchorPoint(0.5, 0.5);
        count_label1.setPosition(cc.winSize.width/2, grayLine.getPosition().y - 30);
        this.addChild(count_label1);

        var add = function(_name){
            var data = {};
            data.name = _name;
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
                count_label2.setString(""+listView.getItems().length);
                if(listView.getItems().length>=3 && listView.getItems().length<=30){
                    next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                    next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                    next_btn.setTouchEnabled(true);
                }else{
                    next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                    next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                    next_btn.setTouchEnabled(false);
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
            count_label2.setString(""+listView.getItems().length);
            if(listView.getItems().length>=3 && listView.getItems().length<=30){
                next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                next_btn.setTouchEnabled(true);
            }else{
                next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                next_btn.setTouchEnabled(false);
            }
        };

        var addition_btn = new ccui.Button(GlobalRes.addition_btn, GlobalRes.addition_btn);
        addition_btn.setAnchorPoint(1, 0.5);
        addition_btn.setPosition(cc.winSize.width - 30, cc.winSize.height - 100 - 120/2);
        addition_btn.setVisible(false);
        var addition_btn_touchevent = function(){
            if(listView.getItems().length==30){
                return;
            }
            if(name_random_field.getString() && name_random_field.getString() !== ""){
                //cc._canvas.focus();
                add(name_random_field.getString());
                if(1){
                    name_random_field.removeFromParent();
                    name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - addition_btn.getContentSize().width , 120),new cc.Scale9Sprite());
                    name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                    name_random_field.setPlaceholderFontSize(36);
                    name_random_field.setPlaceHolder("    参加者を登録してください");
                    name_random_field.setAdd(true);
                    name_random_field.setAnchorPoint(cc.p(0,0.5));
                    name_random_field.setPosition(30 + 30, cc.winSize.height - 100 - 120/2);
                    name_random_field.setDelegate(_this);
                    name_random_field.setFontName(GAME_FONT.PRO_W3);
                    name_random_field.setFontColor(cc.color(111,205,193,255));
                    name_random_field.setFontSize(36);
                    name_random_field.setMaxLength(16);
                    _this.addChild(name_random_field);
                    name_random_field.schedule(isaddbtnvisible, 0 ,cc.REPEAT_FOREVER);
                }else{
                    name_random_field.setString("");
                    name_random_field.setInputblur();
                }
            }else{
                alert("参加者を登録してください");
            }
        };
        addition_btn.addClickEventListener(addition_btn_touchevent);
        var addition_btn_sub = new ccui.Layout();
        addition_btn_sub.setContentSize(115+30, 120);
        addition_btn_sub.setTouchEnabled(true);
        addition_btn_sub.addClickEventListener(addition_btn_touchevent);
        addition_btn_sub.setAnchorPoint(0.5, 0.5);
        addition_btn_sub.setPosition(addition_btn.getContentSize().width>>1, addition_btn.getContentSize().height>>1);
        addition_btn.addChild(addition_btn_sub);
        this.addChild(addition_btn);

        //名字输入框
        var name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - addition_btn.getContentSize().width , 120),new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    参加者を登録してください");
        name_random_field.setAdd(true);
        name_random_field.setAnchorPoint(cc.p(0,0.5));
        name_random_field.setPosition(30 + 30, cc.winSize.height - 100 - 120/2);
        name_random_field.setDelegate(this);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111,205,193,255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        this.addChild(name_random_field);

        var isaddbtnvisible = function(){
            if(name_random_field.getString() === ""){
                addition_btn.setVisible(false);
            }else{
                addition_btn.setVisible(true);
            }
        };
        name_random_field.schedule(isaddbtnvisible, 0 ,cc.REPEAT_FOREVER);

        //组列表
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(750, cc.winSize.height - 100 - 120 - 8 - lineH - 200));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height-100-120-lineH);
        this.addChild(listView);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - lineH - listView.getContentSize().height);
        this.addChild(cutoff);

        var count_label1 = new cc.LabelTTF(" 人が参加登録されています");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        count_label1.setAnchorPoint(0.5, 1);
        count_label1.setPosition(cc.winSize.width/2, cutoff.getPosition().y - 8 - 30);
        this.addChild(count_label1);

        var count_label2 = new cc.LabelTTF("0");
        count_label2.setFontName(GAME_FONT.PRO_W3);
        count_label2.setFontSize(26);
        count_label2.setFontFillColor(cc.color(111,205,193,255));
        count_label2.setAnchorPoint(1, 1);
        count_label2.setPosition(count_label1.getPosition().x - count_label1.getContentSize().width/2, cutoff.getPosition().y - 8 - 30);
        this.addChild(count_label2);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(200, 80);
        next_layout.setAnchorPoint(0.5, 1);
        next_layout.setPosition(cc.winSize.width/2, count_label2.getPosition().y - count_label2.getContentSize().height-30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_c8c8c8, GlobalRes.color_c8c8c8);
        next_btn.setScale(200, 80);
        next_btn.setAnchorPoint(0, 0);
        next_btn.setTouchEnabled(false);
        var next_btn_touchevent = function(){
            var items = listView.getItems();
            for(var i = 0; i < items.length ; i++){
                _this.m_memberdata.add(items[i].getUserData());
            }
            _this.loadGroupsSettingView();
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

        if(!_this.m_memberdata.isEmpty()){
            for(var i = 0 ;i < _this.m_memberdata.size(); i++){
                add(_this.m_memberdata.get(i).name);
            }
            _this.m_memberdata.clear();
        }
        var fineInput = new cc.LabelTTF("参加者入力完了");
        fineInput.setFontName(GAME_FONT.PRO_W3);
        fineInput.setFontSize(36);
        fineInput.setFontFillColor(cc.color.GRAY);
        fineInput.setAnchorPoint(0, 1);
        fineInput.setPosition(50, cc.winSize.height - 100 - 40);
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
        };

        title.schedule(callback, 0 ,cc.REPEAT_FOREVER);

    },

    loadReplayView : function(members, mode){
        this.m_state = this.STATE_REPLAY;
        this.m_mode = mode;
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
        var titleName = new cc.LabelTTF("参加者登錄");
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, cc.winSize.height-50));
        this.addChild(titleName);

        //分割线
        var grayLine = new cc.Sprite(GlobalRes.line_8);
        grayLine.setScaleX(cc.winSize.width);
        grayLine.setAnchorPoint(cc.p(0, 1));
        grayLine.setPosition(cc.p(0, cc.winSize.height-100-120));
        this.addChild(grayLine);


        var addition_btn = new ccui.Button(GlobalRes.addition_btn, GlobalRes.addition_btn);
        addition_btn.setAnchorPoint(1, 0.5);
        addition_btn.setPosition(cc.winSize.width - 30, cc.winSize.height - 100 - 120/2);
        addition_btn.setVisible(false);
        var addition_btn_touchevent = function(){
            if(listView.getItems().length==30){
                return;
            }
            if(name_random_field.getString() && name_random_field.getString() !== ""){
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
                    count_label2.setString(""+listView.getItems().length);
                    if(listView.getItems().length>=3 && listView.getItems().length<=30){
                        next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                        next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                        next_btn.setTouchEnabled(true);
                    }else{
                        next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                        next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                        next_btn.setTouchEnabled(false);
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
                count_label2.setString(""+listView.getItems().length);
                if(listView.getItems().length>=3 && listView.getItems().length<=30){
                    next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                    next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                    next_btn.setTouchEnabled(true);
                }else{
                    next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                    next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                    next_btn.setTouchEnabled(false);
                }
                if(1){
                    name_random_field.removeFromParent();
                    name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - addition_btn.getContentSize().width , 120),new cc.Scale9Sprite());
                    name_random_field.setPlaceholderFontColor(cc.color.GRAY);
                    name_random_field.setPlaceholderFontSize(36);
                    name_random_field.setPlaceHolder("    参加者を登録してください");
                    name_random_field.setAdd(true);
                    name_random_field.setAnchorPoint(cc.p(0,0.5));
                    name_random_field.setPosition(30 + 30, cc.winSize.height - 100 - 120/2);
                    name_random_field.setDelegate(_this);
                    name_random_field.setFontName(GAME_FONT.PRO_W3);
                    name_random_field.setFontColor(cc.color(111,205,193,255));
                    name_random_field.setFontSize(36);
                    name_random_field.setMaxLength(16);
                    _this.addChild(name_random_field);
                    name_random_field.schedule(isaddbtnvisible, 0 ,cc.REPEAT_FOREVER);
                }else{
                    name_random_field.setString("");
                    name_random_field.setInputblur();
                }

            }else{
                alert("参加者を登録してください");
            }
        };
        addition_btn.addClickEventListener(addition_btn_touchevent);
        var addition_btn_sub = new ccui.Layout();
        addition_btn_sub.setContentSize(115+30, 120);
        addition_btn_sub.setTouchEnabled(true);
        addition_btn_sub.addClickEventListener(addition_btn_touchevent);
        addition_btn_sub.setAnchorPoint(0.5, 0.5);
        addition_btn_sub.setPosition(addition_btn.getContentSize().width>>1, addition_btn.getContentSize().height>>1);
        addition_btn.addChild(addition_btn_sub);
        this.addChild(addition_btn);

        //名字输入框
        var name_random_field = new cc.EditBox(cc.size(cc.winSize.width - 30 - 30 - 30 - 30 - addition_btn.getContentSize().width , 120),new cc.Scale9Sprite());
        name_random_field.setPlaceholderFontColor(cc.color.GRAY);
        name_random_field.setPlaceholderFontSize(36);
        name_random_field.setPlaceHolder("    参加者を登録してください");
        name_random_field.setAdd(true);
        name_random_field.setAnchorPoint(cc.p(0,0.5));
        name_random_field.setPosition(30 + 30, cc.winSize.height - 100 - 120/2);
        name_random_field.setDelegate(this);
        name_random_field.setFontName(GAME_FONT.PRO_W3);
        name_random_field.setFontColor(cc.color(111,205,193,255));
        name_random_field.setFontSize(36);
        name_random_field.setMaxLength(16);
        this.addChild(name_random_field);

        var isaddbtnvisible = function(){
            if(name_random_field.getString() === ""){
                addition_btn.setVisible(false);
            }else{
                addition_btn.setVisible(true);
            }
        };
        name_random_field.schedule(isaddbtnvisible, 0 ,cc.REPEAT_FOREVER);

        //组列表
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(750, cc.winSize.height - 100 - 120 - 8 - 8 - 200));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height-100-120-8);
        this.addChild(listView);

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - 100 - 120 - 8 - listView.getContentSize().height);
        this.addChild(cutoff);

        var count_label1 = new cc.LabelTTF(" 人が参加登録されています");
        count_label1.setFontName(GAME_FONT.PRO_W3);
        count_label1.setFontSize(26);
        count_label1.setFontFillColor(cc.color(153,153,153,255));
        count_label1.setAnchorPoint(0.5, 1);
        count_label1.setPosition(cc.winSize.width/2, cutoff.getPosition().y - 8 - 30);
        this.addChild(count_label1);

        var count_label2 = new cc.LabelTTF("0");
        count_label2.setFontName(GAME_FONT.PRO_W3);
        count_label2.setFontSize(26);
        count_label2.setFontFillColor(cc.color(111,205,193,255));
        count_label2.setAnchorPoint(1, 1);
        count_label2.setPosition(count_label1.getPosition().x - count_label1.getContentSize().width/2, cutoff.getPosition().y - 8 - 30);
        this.addChild(count_label2);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(200, 80);
        next_layout.setAnchorPoint(0.5, 1);
        next_layout.setPosition(cc.winSize.width/2, count_label2.getPosition().y - count_label2.getContentSize().height-30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_c8c8c8, GlobalRes.color_c8c8c8);
        next_btn.setScale(200, 80);
        next_btn.setAnchorPoint(0, 0);
        next_btn.setTouchEnabled(false);
        var next_btn_touchevent = function(){
            var items = listView.getItems();
            for(var i = 0; i < items.length ; i++){
                _this.m_memberdata.add(items[i].getUserData());
            }
            if(mode == "quick"){
                _this.m_groupdata.add({icon:"01", name:"ブニャ"});
                _this.m_groupdata.add({icon:"02", name:"ばにら"});
                _this.loadResult1View();
            }else{
                _this.loadGroupsSettingView();
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

        for(var i = 0 ; i < members.length; i++){
            var data = {};
            data.name = members[i].name;
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
                var index = listView.getIndex(this.getParent());
                listView.removeItem(index);
                count_label2.setString(""+listView.getItems().length);
                if(listView.getItems().length>=3 && listView.getItems().length<=30){
                    next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                    next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                    next_btn.setTouchEnabled(true);
                }else{
                    next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                    next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                    next_btn.setTouchEnabled(false);
                }
            };
            delete_btn.addClickEventListener(delete_btn_touchevent);
            layout.addChild(delete_btn);

            cutoff = new cc.Sprite(GlobalRes.line_8);
            cutoff.setAnchorPoint(0, 0);
            cutoff.setScaleX(layout.getContentSize().width);
            cutoff.setScaleY(0.25);
            layout.addChild(cutoff);

            listView.pushBackDefaultItem();
            listView.pushBackCustomItem(layout);
            count_label2.setString(""+listView.getItems().length);
            if(listView.getItems().length>=3 && listView.getItems().length<=30){
                next_btn.loadTextureNormal(GlobalRes.color_6fcdc1);
                next_btn.loadTexturePressed(GlobalRes.color_6fcdc1);
                next_btn.setTouchEnabled(true);
            }else{
                next_btn.loadTextureNormal(GlobalRes.color_c8c8c8);
                next_btn.loadTexturePressed(GlobalRes.color_c8c8c8);
                next_btn.setTouchEnabled(false);
            }
        }

        var fineInput = new cc.LabelTTF("参加者入力完了");
        fineInput.setFontName(GAME_FONT.PRO_W3);
        fineInput.setFontSize(36);
        fineInput.setFontFillColor(cc.color.GRAY);
        fineInput.setAnchorPoint(0, 1);
        fineInput.setPosition(50, cc.winSize.height - 100 - 40);
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
        };

        title.schedule(callback, 0 ,cc.REPEAT_FOREVER);
    },

    loadResult1View : function(){
        SoundManager.instance().playEffect(GroupingRes.laughjingle);
        this.scheduleOnce(function(){
            SoundManager.instance().playEffect(GroupingRes.laugh_1);
        }, 2);

        this.m_state = this.STATE_RESULT1;
        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255,255,255,255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(0, 0);
        title.setPosition(0, 0);
        //this.addChild(title);

        //标题
        var titleName = new cc.LabelTTF("チーム分けの結果");
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setScanPhixelRGB();
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, 100-50));
        //this.addChild(titleName);

        //组列表
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(750, cc.winSize.height - 148));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height);
        this.addChild(listView);

        var titleLayout = new ccui.Layout();
        titleLayout.setContentSize(cc.winSize.width, 100);
        titleLayout.addChild(title);
        titleLayout.addChild(titleName);

        listView.pushBackDefaultItem();
        listView.pushBackCustomItem(titleLayout);

        var average = Math.floor(this.m_memberdata.size()/this.m_groupdata.size());
        var group = new ArrayList();
        for(var i = 0 ; i < this.m_groupdata.size(); i++){
            var result = {};
            result.name = this.m_groupdata.get(i).name;
            result.icon = this.m_groupdata.get(i).icon;
            result.members = [];
            for(var j = 0 ; j < average; j++){
                var index = Math.floor(Math.random()*this.m_memberdata.size());
                result.members[j] = this.m_memberdata.removeIndex(index);
            }
            group.add(result);
        }

        var flags = new ArrayList();
        while(!this.m_memberdata.isEmpty()){
            index = Math.floor(Math.random()*group.size());
            if(flags.isEmpty() || !flags.contains(index)){
                group.get(index).members.push(this.m_memberdata.removeIndex(0));
                flags.add(index);
            }
        }

        var history = {};
        history.mode = this.m_mode;
        history.groups = group.arr;


        for(i = 0 ; i < group.size(); i++){
            var height = 0;
            var members_layout = new ccui.Layout();
            var group_name_label = new cc.LabelTTF(group.get(i).name);
            group_name_label.setFontName(GAME_FONT.PRO_W6);
            group_name_label.setFontSize(50);
            group_name_label.setFontFillColor(i%2==0?cc.color(255,255,255,255):cc.color(111,205,193,255));
            group_name_label.setScanPhixelRGB();
            height += group_name_label.getContentSize().height;
            height += 40;
            var list = new ArrayList();
            for(j = 0 ; j < group.get(i).members.length; j++){
                var member_name_label = new cc.LabelTTF(group.get(i).members[j].name);
                member_name_label.setFontName(GAME_FONT.PRO_W6);
                member_name_label.setFontSize(32);
                member_name_label.setFontFillColor(i%2==0?cc.color(255,255,255,255):cc.color(111,205,193,255));
                member_name_label.setScanPhixelRGB();
                if(j==0){
                    height+=member_name_label.getContentSize().height;
                }else{
                    height+=member_name_label.getContentSize().height+35;
                }
                list.add(member_name_label);
            }
            members_layout.setContentSize(cc.winSize.width-216-60, height);
            group_name_label.setAnchorPoint(0.5, 1);
            group_name_label.setPosition(members_layout.getContentSize().width/2, members_layout.getContentSize().height);
            members_layout.addChild(group_name_label);
            height = 0;
            for(var k = 0 ; k < list.size(); k++){
                list.get(k).setAnchorPoint(0.5, 1);
                list.get(k).setPosition(members_layout.getContentSize().width/2, members_layout.getContentSize().height - group_name_label.getContentSize().height - 40 - 35*k - height);
                members_layout.addChild(list.get(k));
                height+=list.get(k).getContentSize().height;
            }

            var layout = new ccui.Layout();
            layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            layout.setBackGroundColor(i%2==0?cc.color(111,205,193,255):cc.color(255,251,224,255));
            if(members_layout.getContentSize().height+40+35>540){
                layout.setContentSize(cc.winSize.width, members_layout.getContentSize().height+40+35);
                members_layout.setAnchorPoint(1, 1);
                members_layout.setPosition(layout.getContentSize().width-60, layout.getContentSize().height-40);
            }else{
                layout.setContentSize(cc.winSize.width, 540);
                members_layout.setAnchorPoint(1, 0.5);
                members_layout.setPosition(layout.getContentSize().width-60, layout.getContentSize().height/2);
            }
            layout.addChild(members_layout);

            var charactor = new cc.Sprite();
            charactor.setAnchorPoint(0, 0);
            var frames = [];
            for(var k = 0 ; k < 3; k++){
                frames.push(new cc.SpriteFrame("res/Global/motion/motion_" + group.get(i).icon + "_" + (k+1) + ".png", new cc.Rect(0, 0, 216, 480)));
            }
            var animation = new cc.Animation(frames, 0.15);
            var animate = cc.animate(animation);
            charactor.runAction(new cc.Sequence(animate).repeatForever());
            layout.addChild(charactor);
            listView.pushBackDefaultItem();
            listView.pushBackCustomItem(layout);
        }

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - listView.getContentSize().height);
        this.addChild(cutoff);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(200, 80);
        next_layout.setAnchorPoint(0.5, 1);
        next_layout.setPosition(cc.winSize.width/2, cutoff.getPosition().y - cutoff.getContentSize().height-30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
        next_btn.setScale(200, 80);
        next_btn.setAnchorPoint(0, 0);
        var _this = this;
        var next_btn_touchevent = function(){
            mask.open();

            var pop_layout = new RoundRect(570, 40+30+60+40+100+30);
            pop_layout.setAnchorPoint(0.5, 0.5);
            pop_layout.setPosition(cc.winSize.width>>1, cc.winSize.height>>1);
            _this.addChild(pop_layout,999);

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
            for(var i = 0 ; i < group.size(); i++){
                name += group.get(i).name;
                if(i != group.size()-1){
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
                DataManager.instance().createHistory(GAME_TYPE.Grouping, history);
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
        next_btn.addClickEventListener(next_btn_touchevent);
        this.m_func_isbacktomain = next_btn_touchevent;
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
    },

    loadResult2View : function(groups, year, month, day, mode){
        this.m_state = this.STATE_RESULT2;
        this.removeAllChildren();
        this.addChild(new cc.LayerColor(cc.color(255,255,255,255)));
        var title = new cc.Sprite(GlobalRes.color_6fcdc1);
        title.setScaleX(cc.winSize.width);
        title.setScaleY(100);
        title.setAnchorPoint(0, 0);
        title.setPosition(0, 0);
        //this.addChild(title);

        //标题
        var str = "";
        for(var j = 0; j < groups.length; j++){
            for(var k = 0; k < groups[j].members.length; k++){
                if(j == groups.length-1 && k == groups[j].members.length-1){
                    str += groups[j].members[k].name;
                    break;
                }
                str += groups[j].members[k].name + "、";
            }
        }
        var titleName = new cc.LabelTTF(year + "." + month + "." + day + "  " + str);
        titleName.setFontName(GAME_FONT.PRO_W3);
        titleName.setFontSize(36);
        titleName.setFontFillColor(new cc.Color(255,243,191,255));
        titleName.setScanPhixelRGB();
        titleName.setTextWidth(cc.winSize.width/3*2);
        titleName.setAnchorPoint(cc.p(0.5, 0.5));
        titleName.setPosition(cc.p(cc.winSize.width>>1, 100-50));
        //this.addChild(titleName);

        //组列表
        var listView = new ccui.ListView();
        // set list view ex direction
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listView.setTouchEnabled(true);
        listView.setBounceEnabled(false);
        listView.setContentSize(cc.size(750, cc.winSize.height - 148));
        listView.setAnchorPoint(0, 1);
        listView.setPosition(0, cc.winSize.height);
        this.addChild(listView);

        var titleLayout = new ccui.Layout();
        titleLayout.setContentSize(cc.winSize.width, 100);
        titleLayout.addChild(title);
        titleLayout.addChild(titleName);

        listView.pushBackDefaultItem();
        listView.pushBackCustomItem(titleLayout);

        var group = new ArrayList();
        group.arr = groups;

        for(var i = 0 ; i < group.size(); i++){
            var height = 0;
            var members_layout = new ccui.Layout();
            var group_name_label = new cc.LabelTTF(group.get(i).name + "チーム");
            group_name_label.setFontName(GAME_FONT.PRO_W6);
            group_name_label.setFontSize(50);
            group_name_label.setFontFillColor(i%2==0?cc.color(255,255,255,255):cc.color(111,205,193,255));
            group_name_label.setScanPhixelRGB();
            height += group_name_label.getContentSize().height;
            height += 40;
            var list = new ArrayList();
            for(j = 0 ; j < group.get(i).members.length; j++){
                var member_name_label = new cc.LabelTTF(group.get(i).members[j].name);
                member_name_label.setFontName(GAME_FONT.PRO_W6);
                member_name_label.setFontSize(32);
                member_name_label.setFontFillColor(i%2==0?cc.color(255,255,255,255):cc.color(111,205,193,255));
                member_name_label.setScanPhixelRGB();
                if(j==0){
                    height+=member_name_label.getContentSize().height;
                }else{
                    height+=member_name_label.getContentSize().height+35;
                }
                list.add(member_name_label);
            }
            members_layout.setContentSize(cc.winSize.width-216-60, height);
            group_name_label.setAnchorPoint(0.5, 1);
            group_name_label.setPosition(members_layout.getContentSize().width/2, members_layout.getContentSize().height);
            members_layout.addChild(group_name_label);
            height = 0;
            for(var k = 0 ; k < list.size(); k++){
                list.get(k).setAnchorPoint(0.5, 1);
                list.get(k).setPosition(members_layout.getContentSize().width/2, members_layout.getContentSize().height - group_name_label.getContentSize().height - 40 - 35*k - height);
                members_layout.addChild(list.get(k));
                height+=list.get(k).getContentSize().height;
            }

            var layout = new ccui.Layout();
            layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            layout.setBackGroundColor(i%2==0?cc.color(111,205,193,255):cc.color(255,251,224,255));
            if(members_layout.getContentSize().height+40+35>540){
                layout.setContentSize(cc.winSize.width, members_layout.getContentSize().height+40+35);
                members_layout.setAnchorPoint(1, 1);
                members_layout.setPosition(layout.getContentSize().width-60, layout.getContentSize().height-40);
            }else{
                layout.setContentSize(cc.winSize.width, 540);
                members_layout.setAnchorPoint(1, 0.5);
                members_layout.setPosition(layout.getContentSize().width-60, layout.getContentSize().height/2);
            }
            layout.addChild(members_layout);

            var charactor = new cc.Sprite();
            charactor.setAnchorPoint(0, 0);
            var frames = [];
            for(var k = 0 ; k < 3; k++){
                frames.push(new cc.SpriteFrame("res/Global/motion/motion_" + group.get(i).icon + "_" + (k+1) + ".png", new cc.Rect(0, 0, 216, 480)));
            }
            var animation = new cc.Animation(frames, 0.15);
            var animate = cc.animate(animation);
            charactor.runAction(new cc.Sequence(animate).repeatForever());
            layout.addChild(charactor);
            listView.pushBackDefaultItem();
            listView.pushBackCustomItem(layout);
        }

        var cutoff = new cc.Sprite(GlobalRes.line_8);
        cutoff.setScaleX(cc.winSize.width);
        cutoff.setAnchorPoint(0, 1);
        cutoff.setPosition(0, cc.winSize.height - listView.getContentSize().height);
        this.addChild(cutoff);

        var next_layout = new ccui.Layout();
        next_layout.setContentSize(300, 80);
        next_layout.setAnchorPoint(0.5, 1);
        next_layout.setPosition(cc.winSize.width/2, cutoff.getPosition().y - cutoff.getContentSize().height-30);
        this.addChild(next_layout);

        var next_btn = new ccui.Button(GlobalRes.color_6fcdc1, GlobalRes.color_6fcdc1);
        next_btn.setScale(300, 80);
        next_btn.setAnchorPoint(0, 0);
        var _this = this;
        var next_btn_touchevent = function(){
            var members = [];
            for(var i = 0 ;i < groups.length ; i++){
                members = members.concat(groups[i].members);
            }
            _this.loadReplayView(members, mode);
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

            var simple_play_btn = new ccui.Button(GroupingRes.simple_play_btn, GroupingRes.simple_play_btn);
            simple_play_btn.setTag(1);
            simple_play_btn.setAnchorPoint(cc.p(1, 0));
            simple_play_btn.setPosition(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2);
            simple_play_btn.addClickEventListener(function(){_this.loadQuickSettingView();});
            var simple_play_text = new cc.LabelTTF("２チームに分ける");
            simple_play_text.setFontName(GAME_FONT.PRO_W3);
            simple_play_text.setFontSize(36);
            simple_play_text.setFontFillColor(cc.color(255,243,191));
            simple_play_text.setScanPhixelRGB();
            simple_play_text.setAnchorPoint(1, 0);
            simple_play_text.setPosition(-20, simple_play_btn.getContentSize().height/2);
            simple_play_btn.addChild(simple_play_text);
            var simple_play_text1 = new cc.LabelTTF("参加者を２つのチームに分ける");
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
            var setting_play_btn = new ccui.Button(GroupingRes.setting_play_btn, GroupingRes.setting_play_btn);
            setting_play_btn.setTag(2);
            setting_play_btn.setAnchorPoint(cc.p(1, 0));
            setting_play_btn.setPosition(cc.winSize.width-50, node.getPosition().y+node.getBoundingBox().height/2);
            setting_play_btn.addClickEventListener(function(){_this.loadMemberSettingView();});
            var setting_play_text = new cc.LabelTTF("チームの設定");
            setting_play_text.setFontName(GAME_FONT.PRO_W3);
            setting_play_text.setFontSize(36);
            setting_play_text.setFontFillColor(cc.color(255,243,191));
            setting_play_text.setScanPhixelRGB();
            setting_play_text.setAnchorPoint(1, 0);
            setting_play_text.setPosition(-20, setting_play_btn.getContentSize().height/2);
            setting_play_btn.addChild(setting_play_text);
            var setting_play_text1 = new cc.LabelTTF("チーム数と名前を自分で登録");
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
            case context.STATE_QUICKSETTING:
            case context.STATE_MEMBERSETTING:
            case context.STATE_REPLAY:
            case context.STATE_RESULT2:
                context.loadMainView();
                break;
            case context.STATE_GROUPSETTING:
                context.m_groupdata.clear();
                context.loadMemberSettingView();
                break;
            case context.STATE_RESULT1:
                context.m_func_isbacktomain();
                break;
        }
    }

});

var GroupingScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GroupingLayer();
        this.addChild(layer);
    }
});