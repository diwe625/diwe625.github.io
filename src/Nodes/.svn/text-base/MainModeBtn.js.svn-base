/**
 * Created by nhnst on 11/27/15.
 */
var MainModeBtn = cc.Node.extend({
    TAG_MASK:1,
    TAG_Sim:2,
    TAG_Setting:3,

    btn1MoveY:222,
    btn2MoveY:380,
    btn3MoveY:538,

    Button1Info:{selector:null, img:null,str:"",subStr:""},
    Button2Info:{selector:null, img:null,str:"",subStr:""},
    Button3Info:{selector:null, img:null,str:"",subStr:""},
    ctor:function(resMain,objBtn1,objBtn2,objBtn3){
        this._super();

        this.Button1Info = objBtn1;
        this.Button2Info = objBtn2;
        if(objBtn3)
            this.Button3Info = objBtn3;

        var mask = new Mask();
        mask.setTag(this.TAG_MASK);
        mask.close();
        this.addChild(mask);

        var _this = this;

        var close_layout = new ccui.Layout();
        close_layout.setContentSize(cc.winSize.width, cc.winSize.height);
        close_layout.setAnchorPoint(0, 0);
        close_layout.setTag(4);
        close_layout.setTouchEnabled(false);
        close_layout.addTouchEventListener(function(){
                if(mode_Btn.getChildrenCount() != 0)
                    _this.closeAnim(mode_Btn);
        });
        this.addChild(close_layout);

        var mode_Btn = new ccui.Button(resMain,resMain);
        mode_Btn.setAnchorPoint(cc.p(1, 0));
        mode_Btn.setPosition(cc.p(cc.winSize.width - 22, 30));
        var _this = this;
        mode_Btn.addClickEventListener(function(){_this.settingBtnAnim(mode_Btn);});
        this.addChild(mode_Btn);

        return true;
    },

    settingBtnAnim:function(node){

        if(node.getChildrenCount() == 0){
            node.getParent().getChildByTag(4).setTouchEnabled(true);
            node.setTouchEnabled(false);
            this.getChildByTag(this.TAG_MASK).open();

            this.openAnim(node,1,this.btn1MoveY,this.Button1Info);
            this.openAnim(node,2,this.btn2MoveY,this.Button2Info);
            this.openAnim(node,3,this.btn3MoveY,this.Button3Info);
        }else{
            this.closeAnim(node);
        }
    },

    openAnim:function(node,tag,movey,btnInfo){
        if(!btnInfo) return;
        if(btnInfo.img == null) return;
        var _w = node.getBoundingBox().width;
        var _h = node.getBoundingBox().height;
        var play_btn = new ccui.Button(btnInfo.img);
        play_btn.setTag(tag);
        play_btn.setAnchorPoint(cc.p(0.5, 0.5));
        play_btn.setPosition(_w/2, _h/2);
        play_btn.addClickEventListener(btnInfo.selector);

        var simple_play_text = new cc.LabelTTF(btnInfo.str);
        simple_play_text.setFontName(GAME_FONT.PRO_W3);
        simple_play_text.setFontSize(36);
        simple_play_text.setFontFillColor(cc.color(255,243,191));
        simple_play_text.setScanPhixelRGB();
        if(btnInfo.subStr == "")
            simple_play_text.setAnchorPoint(1, 0.5);
        else
            simple_play_text.setAnchorPoint(1, 0);
        simple_play_text.setPosition(-20, (play_btn.getContentSize().height>>1) == 0 ? 72 : (play_btn.getContentSize().height>>1));
        play_btn.addChild(simple_play_text);
        var simple_play_text_p = new cc.LabelTTF(btnInfo.subStr);
        simple_play_text_p.setFontName(GAME_FONT.PRO_W3);
        simple_play_text_p.setFontSize(28);
        simple_play_text_p.setFontFillColor(cc.color("#6fcdc1"));
        simple_play_text_p.setScanPhixelRGB();
        simple_play_text_p.setAnchorPoint(1, 1);
        simple_play_text_p.setPosition(-20, (play_btn.getContentSize().height>>1) == 0 ? 72 : (play_btn.getContentSize().height>>1));
        play_btn.addChild(simple_play_text_p);
        action = new cc.Sequence(new cc.MoveBy(0.2,cc.p(0, movey)),
        new cc.callFunc(function(){node.setTouchEnabled(true);}, this));
        play_btn.runAction(action);
        node.addChild(play_btn);
    },

    closeAnim:function(node){
        node.getParent().getChildByTag(4).setTouchEnabled(false);
        var func = function(){
            node.removeAllChildrenWithCleanup(true);
            node.getParent().getChildByTag(node.getParent().TAG_MASK).close();
        };
        node.getChildByTag(1).runAction(new cc.Sequence(new cc.MoveBy(0.2,cc.p(0, -this.btn1MoveY/2)), new cc.callFunc(func, this)));
        node.getChildByTag(2).runAction(new cc.MoveBy(0.2,cc.p(0, -this.btn2MoveY/2)));
        if(node.getChildByTag(3))
            node.getChildByTag(3).runAction(new cc.MoveBy(0.2,cc.p(0, -this.btn3MoveY/2)));
    }



});