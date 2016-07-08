/**
 * Created by nhnst on 12/16/15.
 */
var HistorysListView = cc.Node.extend({
    listView:null,
    /*
    * type:  1: MajorityVoteScene     defalut: other
    * */
    ctor:function(height,data,resOne,resTwo,returnReplay,returnResult,type){
        this._super();

        var mThis = this;

        this.listView = new ccui.ListView();
        this.listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.listView.setTouchEnabled(true);
        this.listView.setBounceEnabled(true);
        this.listView.setContentSize(cc.size(cc.winSize.width, height));
        this.listView.setAnchorPoint(0, 1);
        this.listView.setPosition(0, height);
        this.listView.setBreakPoint(100);
        //listView.setAutoScrollEnable(false);
        this.addChild(this.listView);

        var historys = DataManager.instance().getHistory(data);
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

                var btnImage = historys.get(i).data.mode === 1 ? resOne : resTwo;
                var list_sprite = new cc.Sprite(btnImage);
                list_sprite.setAnchorPoint(0, 1);
                list_sprite.setPosition(30, layout.getContentSize().height - topY);
                layout.addChild(list_sprite);

                var spriteWidth = 55;//list_sprite.getContentSize().width;

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
                gourpname.setContentSize(layout.getContentSize().width - spriteWidth - 30 - 30 - 30 - 30 - date.getContentSize().width, gourpname.getContentSize().height);
                gourpname.setAnchorPoint(0, 1);
                gourpname.setPosition(spriteWidth + 30 + 30, layout.getContentSize().height - topY);
                gourpname.setTextWidth(layout.getContentSize().width - spriteWidth - 30 - 30 - 30 - 30 - date.getContentSize().width);
                layout.addChild(gourpname);

                str = "";
                var idxforSprite = 0;
                for(j = 0; j < historys.get(i).data.groups.length; j++){
                    idxforSprite = 0;
                    for(var k = 0; k < historys.get(i).data.groups[j].members.length; k++){
                        if(historys.get(i).data.mode == 1 && type == 1){
                            var file = DataManager.instance().getPhotoHistory(historys.get(i).data.groups[j].members[k].name,k);
                            if(file != null && file != ""){
                                this.setPhotoView(file,spriteWidth,layout,idxforSprite,gourpname.getPositionY() - gourpname.getFontSize() - 10);
                                idxforSprite++;
                            }

                        }
                        var tempMember = historys.get(i).data.groups[j].members[k];
                        if(tempMember.rStr){
                            if(historys.get(i).data.mode == 1){
                                var tempResultStr = [];
                                for(var n = 0; n < historys.get(i).data.groups.length; n++){
                                    for(var m = 0; m < historys.get(i).data.groups[n].members.length; m++){
                                        tempResultStr.push(historys.get(i).data.groups[n].members[m].rStr);
                                    }
                                }
                                if(j == historys.get(i).data.groups.length-1 && k == historys.get(i).data.groups[j].members.length-1){
                                    str += tempResultStr[tempMember.rStrWithP];
                                    tempResultStr = null;
                                    break;
                                }
                                    str += tempResultStr[tempMember.rStrWithP] + "、";
                            }

                        }else{
                            if(j == historys.get(i).data.groups.length-1 && k == historys.get(i).data.groups[j].members.length-1){
                                str += tempMember.name;
                                break;
                            }
                                str += tempMember.name + "、";
                        }

                    }
                }

                if(!(historys.get(i).data.mode == 1 && type == 1)){
                    var membername = new cc.LabelTTF(str);
                    membername.setFontName(GAME_FONT.PRO_W3);
                    membername.setFontSize(30);
                    membername.setFontFillColor(cc.color(255, 243, 191));
                    membername.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                    membername.setScanPhixelRGB();
                    membername.setContentSize(layout.getContentSize().width - spriteWidth - 30 - 30 - 30 - 30 - date.getContentSize().width, membername.getContentSize().height);
                    membername.setAnchorPoint(0, 1);
                    membername.setPosition(spriteWidth + 30 + 30, gourpname.getPositionY() - gourpname.getFontSize() - 10);
                    membername.setTextWidth(layout.getContentSize().width - spriteWidth - 30 - 30 - 30 - 30 - date.getContentSize().width);
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
                var mode = historys.get(i).data.mode;
                var members = [];
                for(j = 0; j < historys.get(i).data.groups.length; j++){
                    members = members.concat(historys.get(i).data.groups[j].members);
                }
                replay_btn.setUserData({members:members, mode:mode});
                var replay_event = function(node){
                    returnReplay(layout.getUserData().data.groups, node.getUserData().mode);
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
                delete_btn.setUserData({time:historys.get(i).time, item:all_layout,mode:historys.get(i).data.mode,name:historys.get(i).data.groups[0].members[0].name});
                var delete_event = function(node){
                    DataManager.instance().deleteHistory(data, node.getUserData().time);
                    mThis.listView.removeLastItem();
                    mThis.listView.removeItem(mThis.listView.getIndex(node.getUserData().item));
                    var empty = new ccui.Layout();
                    empty.setContentSize(cc.winSize.width, mThis.listView.getItems().length>=3 ? 250 : 0);
                    mThis.listView.pushBackCustomItem(empty);
                    if(node.getUserData().mode == 1 && type == 1)
                        DataManager.instance().deletePhotoHistory(node.getUserData().name);
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
                                var title = year + "," + month + "," + day + " " + gourpname.getString();
                                returnResult(arm, title, sender.getUserData().data.mode);
                                //_this.loadResult2View(arm, year, month, day, sender.getUserData().data.mode);
                            }
                            break;
                    }
                };
                layout.addTouchEventListener(listener1);
                layout.pos = 0;
                layout.isAction = false;

                this.listView.pushBackDefaultItem();
                this.listView.pushBackCustomItem(all_layout);
            }

            var empty = new ccui.Layout();
            empty.setContentSize(cc.winSize.width, historys.size()>=3 ? 250 : 0);
            this.listView.pushBackCustomItem(empty);
        }

        return true;
    },

    setPhotoView:function(file,spriteWidth,layout,idx,spy){

        cc.loader.loadImg(file, {isCrossOrigin : false }, function(err, img){
            //var num = k;
            if(file == "" || file == null){

            }else{
                var imgWH = 50;
                var texture2d = new cc.Texture2D();
                texture2d.initWithElement(img);
                texture2d.handleLoadedTexture();
                var sprite = new cc.Sprite();
                sprite.initWithTexture(texture2d);
                sprite.setAnchorPoint(cc.p(0, 1));
                sprite.setPosition(spriteWidth + 30 + 30 + 80*idx, spy);
                sprite.setScale(imgWH/img.width,imgWH/img.height);
                layout.addChild(sprite);
            }
        });
    }


});