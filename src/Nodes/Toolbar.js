/**
 * Created by dyfox on 15-11-3.
 */

var Toolbar = cc.Node.extend({
    m_tabs:[],
    m_isRunning:false,
    label_layout:null,

    ctor:function (type) {
        var _this = this;
        this._super();
        this.setContentSize(cc.winSize);

        var bg = new ccui.Layout();
        bg.setContentSize(this.getContentSize().width, 100);
        bg.setAnchorPoint(0, 1);
        bg.setPosition(0, this.getContentSize().height);
        bg.setTouchEnabled(true);
        bg.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        bg.setBackGroundColor(cc.color(111,205,193,255));
        this.addChild(bg, 99);

        var mask = new Mask();
        mask.close();
        this.addChild(mask);

        var bg1 = new ccui.Layout();
        bg1.setContentSize(this.getContentSize().width, this.getContentSize().height-100);
        bg1.setAnchorPoint(0, 1);
        bg1.setPosition(0, this.getContentSize().height-100);
        bg1.setTouchEnabled(true);
        bg1.setTag(100);
        bg1.setVisible(false);
        this.addChild(bg1, 100);
        var callback = function(){
            if(_this.m_isRunning){
                return;
            }
            if(mask.isVisible()){
                for(var i = 0 ; i < _this.m_tabs.length; i++){
                    var action = new cc.MoveTo(0.2, cc.p(0, _this.m_tabs[i].getParent().getContentSize().height));
                    if(i == _this.m_tabs.length-1){
                        var func = function(){
                            mask.close();
                            _this.removeChildByTag(999, true);
                            _this.removeChildByTag(1000, true);
                            _this.m_isRunning = false;
                            _this.m_tabs = [];
                        };
                        action = new cc.Sequence(new cc.MoveTo(0.2, cc.p(0, _this.m_tabs[i].getParent().getContentSize().height)), new cc.CallFunc(func));
                    }
                    _this.m_tabs[i].runAction(action);
                    _this.m_isRunning = true;
                }
                bg1.setVisible(false);
            }
        };
        bg1.addClickEventListener(callback);

        var back = new ccui.Button(GlobalRes.top_menu);
        back.setAnchorPoint(0, 0.5);
        back.setPosition(30, bg.getContentSize().height/2);
        back.addClickEventListener(function(){
            var currentUrl = window.location.href;
            if(currentUrl.indexOf("alpha-") != -1){
                window.location.href = "http://alpha-game.touch.hangame.co.jp/benriya/index.nhn";
            }else if(currentUrl.indexOf("beta-") != -1){
                window.location.href = "http://beta-game.touch.hangame.co.jp/benriya/index.nhn";
            }else if(currentUrl.indexOf("Bennriya") != -1){
                window.location.href = "http://alpha-game.touch.hangame.co.jp/benriya/index.nhn";
            }else{
                window.location.href = "http://game.touch.hangame.co.jp/benriya/index.nhn";
            }
        });
        bg.addChild(back);
/*
        var loginBtn = new ccui.Button(GlobalRes.top_login, GlobalRes.top_login);
        loginBtn.setAnchorPoint(1, 0.5);
        //loginBtn.loadTextureNormal(GlobalRes.history_delete_btn);
        //loginBtn.loadTexturePressed(GlobalRes.history_delete_btn);
        var py = 28;
        if(loginBtn.getContentSize().width > 30){
            py = 12;
            if(loginBtn.getContentSize().width > 66)
                loginBtn.setScaleX(66/loginBtn.getContentSize().width);
            if(loginBtn.getContentSize().height > 66)
                loginBtn.setScaleY(66/loginBtn.getContentSize().height);
        }
        loginBtn.setPosition(bg.getContentSize().width-30, bg.getContentSize().height/2);
        bg.addChild(loginBtn);
*/
        var _width = 400;
        this.label_layout = new ccui.Layout();
        this.label_layout.setContentSize(_width, bg.getContentSize().height);
        //this.label_layout.setBackGroundColor(cc.color.GREEN);
        //this.label_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID;
        this.label_layout.setAnchorPoint(0.5, 0.5);
        this.label_layout.setPosition(bg.getContentSize().width>>1, bg.getContentSize().height/2);
        this.label_layout.setTouchEnabled(true);
        bg.addChild(this.label_layout,1);

        var label = new cc.LabelTTF(type.name);
        label.setFontName(GAME_FONT.PRO_W3);
        label.setFontSize(36);
        label.setFontFillColor(cc.color(255,243,191,255));
        label.setScanPhixelRGB();
        label.setAnchorPoint(0.5, 0.5);
        label.setPosition(this.label_layout.getContentSize().width>>1, this.label_layout.getContentSize().height/2);
        this.label_layout.addChild(label);

        var navi_btn = new ccui.Button(GlobalRes.top_navi_btn, GlobalRes.top_navi_btn);
        navi_btn.setAnchorPoint(0,0.5);
        navi_btn.setPosition(this.label_layout.getPosition().x + label.getContentSize().width/2 + 15, bg.getContentSize().height/2);
        bg.addChild(navi_btn);

        var label_layout_event = function(){
            if(_this.m_isRunning){
                return;
            }
            if(mask.isVisible()){
                for(var i = 0 ; i < _this.m_tabs.length; i++){
                    var action = new cc.MoveTo(0.2, cc.p(0, _this.m_tabs[i].getParent().getContentSize().height));
                    if(i == _this.m_tabs.length-1){
                        var func = function(){
                            mask.close();
                            _this.removeChildByTag(999, true);
                            _this.removeChildByTag(1000, true);
                            _this.m_isRunning = false;
                            _this.m_tabs = [];
                        };
                        action = new cc.Sequence(new cc.MoveTo(0.2, cc.p(0, _this.m_tabs[i].getParent().getContentSize().height)), new cc.CallFunc(func));
                    }
                    _this.m_tabs[i].runAction(action);
                    _this.m_isRunning = true;
                }
                _this.getChildByTag(100).setVisible(false);
            }else{
                mask.open();
                var typelist = [];
                for(var i in GAME_TYPE){
                    typelist.push(GAME_TYPE[i]);
                }

                _this.getChildByTag(100).setVisible(true);

                var popup = new cc.Sprite(GlobalRes.popup);
                popup.setAnchorPoint(0.5,0);
                popup.setPosition(_this.getContentSize().width/2, _this.getContentSize().height-bg.getContentSize().height);
                popup.setTag(1000);
                _this.addChild(popup, 999);

                var listView = new ccui.ListView();
                listView.setDirection(ccui.ScrollView.DIR_VERTICAL);
                listView.setTouchEnabled(true);
                listView.setBounceEnabled(false);
                listView.setContentSize(cc.size(_width + 30, (typelist.length*101)<=(cc.winSize.height-bg.getContentSize().height)? (typelist.length*101) : (cc.winSize.height-bg.getContentSize().height)));
                listView.setAnchorPoint(0.5, 1);
                listView.setPosition(_this.getContentSize().width/2, _this.getContentSize().height-bg.getContentSize().height);
                listView.setTag(999);
                _this.addChild(listView, 999);

                var list_layout = new ccui.Layout();
                list_layout.setContentSize(_width + 30, typelist.length*101);
                listView.pushBackDefaultItem();
                listView.pushBackCustomItem(list_layout);

                for(i = 0 ; i < typelist.length; i++){
                    var tab_layout = new ccui.Layout();
                    tab_layout.setContentSize(list_layout.getContentSize().width, 101);
                    tab_layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                    tab_layout.setBackGroundColor(cc.color(255,255,255,255));
                    tab_layout.setAnchorPoint(0, 1);
                    tab_layout.setPosition(0, list_layout.getContentSize().height);
                    list_layout.addChild(tab_layout);

                    var line = new ccui.Layout();
                    line.setContentSize(tab_layout.getContentSize().width, 1);
                    line.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                    line.setBackGroundColor(cc.color(220,220,220,255));
                    line.setAnchorPoint(0, 0);
                    tab_layout.addChild(line);

                    var text = new cc.LabelTTF(typelist[i].name);
                    text.setFontName(GAME_FONT.PRO_W3);
                    text.setFontSize(30);
                    text.setFontFillColor(typelist[i].enable? (typelist[i].name === type.name? cc.color(111,205,193,255) : cc.color(50,51,52,255)) : cc.color(200,200,200,255));
                    if(typelist[i].enable && typelist[i].name === type.name){
                        text.setScanPhixelRGB();
                    }
                    text.setAnchorPoint(0, 0.5);
                    text.setPosition(40, (tab_layout.getContentSize().height-1)/2);
                    tab_layout.addChild(text);

                    if(typelist[i].name === type.name){
                        var selected = new cc.Sprite(GlobalRes.navi_selected_btn);
                        selected.setAnchorPoint(1, 0.5);
                        selected.setPosition(tab_layout.getContentSize().width-40, (tab_layout.getContentSize().height-1)/2);
                        tab_layout.addChild(selected);
                    }else{
                        var gotoScene = function(node){
                            SceneController.instance().gotoScene(node.getUserData());
                        };
                        tab_layout.addClickEventListener(gotoScene);
                        tab_layout.setTouchEnabled(true);
                        tab_layout.setUserData(typelist[i]);
                    }

                    action = new cc.MoveTo(0.2, cc.p(0, list_layout.getContentSize().height-i*101));
                    if(i == typelist.length-1){
                        func = function(){
                            _this.m_isRunning = false;
                        };
                        action = new cc.Sequence(new cc.MoveTo(0.2, cc.p(0, list_layout.getContentSize().height-i*101)), new cc.CallFunc(func));
                    }
                    tab_layout.runAction(action);
                    _this.m_isRunning = true;
                    _this.m_tabs[i] = tab_layout;
                }
            }

        };
        this.label_layout.addClickEventListener(label_layout_event);

        return true;
    },

    setToolbarTouchEnable:function(check){
        this.label_layout.setTouchEnabled(check);
    },

    getToolbarTouchEnable:function(check){
        if(this.label_layout.isTouchEnabled())
            return true;
        else
            return false;
    }


});