/**
 * Created by dyfox on 15-10-19.
 */


var MainLayer = cc.LayerColor.extend({
    ctor:function () {
        this._super(cc.color(255,255,255,255));

        var fontDef = new cc.FontDefinition();
        fontDef.fontName = GAME_FONT.PRO_W6;//"ヒラギノ角ゴ　Pro W3"
        fontDef.fontSize = "32";
        fontDef.fillStyle = cc.color(0, 0, 0, 255);

        var margin = 5;

        var leftBottomLavel = new cc.LabelTTF("LeftBottom", fontDef);
        leftBottomLavel.setAnchorPoint(cc.p(0,0));
        leftBottomLavel.setPosition(margin, margin);
        this.addChild(leftBottomLavel);

        var leftTopLavel = new cc.LabelTTF("LeftTop", fontDef);
        leftTopLavel.setAnchorPoint(cc.p(0,1));
        leftTopLavel.setPosition(margin, cc.director.getWinSize().height - margin);
        this.addChild(leftTopLavel);

        var RightBottomLavel = new cc.LabelTTF("RightBottom", fontDef);
        RightBottomLavel.setAnchorPoint(cc.p(1,0));
        RightBottomLavel.setPosition(cc.director.getWinSize().width - margin, margin);
        this.addChild(RightBottomLavel);

        var leftTopLavel = new cc.LabelTTF("RightTop", fontDef);
        leftTopLavel.setAnchorPoint(cc.p(1,1));
        leftTopLavel.setPosition(cc.director.getWinSize().width - margin, cc.director.getWinSize().height - margin);
        this.addChild(leftTopLavel);

        var groupLabel = new cc.LabelTTF("팀 나누기(分组)", fontDef);
        var group = new cc.MenuItemLabel(groupLabel, this.gotoScene, this);
        group.setUserData(GAME_TYPE.Grouping);
        group.setPosition(0, 0);

        var russianLabel = new cc.LabelTTF("러시안 룰렛(俄罗斯轮盘)", fontDef);
        var russian = new cc.MenuItemLabel(russianLabel, this.gotoScene, this);
        russian.setUserData(GAME_TYPE.RussianRoulette);
        russian.setPosition(0, group.getContentSize().height + 20);


        var SortilegeLabel = new cc.LabelTTF("제비뽑기(抽签)", fontDef);
        var sortilege = new cc.MenuItemLabel(SortilegeLabel, this.gotoScene, this);
        sortilege.setUserData(GAME_TYPE.Sortilege);
        sortilege.setPosition(0, 2*(group.getContentSize().height + 20));

        var MajorityVoteLabel = new cc.LabelTTF("다수결(多数决)", fontDef);
        var majorityVote = new cc.MenuItemLabel(MajorityVoteLabel, this.gotoScene, this);
        majorityVote.setUserData(GAME_TYPE.MajorityVote);
        majorityVote.setPosition(0, 3*(group.getContentSize().height + 20));

        var GhostLegLabel = new cc.LabelTTF("사다리타기(阶梯游戏)", fontDef);
        var ghostLeg = new cc.MenuItemLabel(GhostLegLabel, this.gotoScene, this);
        ghostLeg.setUserData(GAME_TYPE.GhostLeg);
        ghostLeg.setPosition(0, 4*(group.getContentSize().height + 20));

        var LoveredLineLabel = new cc.LabelTTF("사랑의 붉은실(爱情红线)", fontDef);
        var loveredLine = new cc.MenuItemLabel(LoveredLineLabel, this.gotoScene, this);
        loveredLine.setUserData(GAME_TYPE.LoveRedLine);
        loveredLine.setPosition(0, -1*(group.getContentSize().height + 20));

        var PolygraphLabel = new cc.LabelTTF("거짓말 탐지기(测谎仪)", fontDef);
        var polygraph = new cc.MenuItemLabel(PolygraphLabel, this.gotoScene, this);
        polygraph.setUserData(GAME_TYPE.Polygraph);
        polygraph.setPosition(0, -2*(group.getContentSize().height + 20));

        var ADDutchpayLabel = new cc.LabelTTF("천사와 악마의 더치페이(天使与恶魔的AA制)", fontDef);
        var aDDutchpay = new cc.MenuItemLabel(ADDutchpayLabel, this.gotoScene, this);
        aDDutchpay.setUserData(GAME_TYPE.ADDutchpay);
        aDDutchpay.setPosition(0, -3*(group.getContentSize().height + 20));

        var commonLabel = new cc.LabelTTF("Test For Common", fontDef);
        var common = new cc.MenuItemLabel(commonLabel, this.gotoScene, this);
        common.setUserData(GAME_TYPE.Test);
        common.setPosition(0, -4*(group.getContentSize().height + 20));

        var menu = new cc.Menu(common,group, russian,sortilege,majorityVote,ghostLeg,loveredLine,polygraph,aDDutchpay);
        this.addChild(menu);

        var message = {"Type":"image", "time":"10", "strength":"20"};

        var Get_PhotoMaxCount = 0;
        if(typeof(message) == "object"){
            Get_PhotoMaxCount++;
        }
        if(Object.prototype.toString.call(message).toLowerCase() == "[object object]"){
            Get_PhotoMaxCount++;
        }
        if(!message.length){
            Get_PhotoMaxCount++;
        }

        console.log(Get_PhotoMaxCount);

        
        return true;
    },

    gotoScene:function(node){
        var _sSize = cc.director.getWinSize();
        var _sScale = _sSize.width/_sSize.height; //0.6
        var _hScale = window.innerWidth/window.innerHeight;
        //cc.view.setFrameSize(320,460);

        var width = cc.view.getFrameSize().width;
        var height = cc.view.getFrameSize().height;

        //node.setString(""+cc.sys.os+"::"+window.screen.height+"::"+"::"+window.innerWidth+"::"+window.innerHeight);
        SceneController.instance().gotoScene(node.getUserData());
    }

});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});
