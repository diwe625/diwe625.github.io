/**
 * Created by nhnst on 5/6/16.
 */
var SoundEffectsLayer = cc.LayerColor.extend({

    soundMaxNum:30,//最大声音数
    soundItemRow:3,//最大行数
    currentLoop:false,
    soundEditMode:false,//编辑模式开关
    maxModeNum:4,//放入编辑模式的最大值
    soundArrayNote:null,//所有声音节点
    soundArrayFavParNote:null,//父节点
    soundArrayFavNum:null,//永久保存和读取
    currentPlayNum:null,

    gameStage:0,
    TAG_MAIN:0,
    TAG_SETTING:200,
    TAG_READY:201,
    TAG_MASK:205,
    TAG_RESULT:206,

    ORDER_Z_MAIN:10,
    ORDER_Z_SETTING:20,
    ORDER_Z_TUTORIAL:50,
    ORDER_Z_EFFECT:60,

    resoff:[
        SoundEffectsRes.main_01,SoundEffectsRes.main_02,SoundEffectsRes.main_03,SoundEffectsRes.main_04,SoundEffectsRes.main_05,
        SoundEffectsRes.main_06,SoundEffectsRes.main_07,SoundEffectsRes.main_08,SoundEffectsRes.main_09,SoundEffectsRes.main_10,
        SoundEffectsRes.main_11,SoundEffectsRes.main_12,SoundEffectsRes.main_13,SoundEffectsRes.main_14,SoundEffectsRes.main_15,
        SoundEffectsRes.main_16,SoundEffectsRes.main_17,SoundEffectsRes.main_18,SoundEffectsRes.main_19,SoundEffectsRes.main_20,
        SoundEffectsRes.main_21,SoundEffectsRes.main_22,SoundEffectsRes.main_23,SoundEffectsRes.main_24,SoundEffectsRes.main_25,
        SoundEffectsRes.main_26,SoundEffectsRes.main_27,SoundEffectsRes.main_28,SoundEffectsRes.main_29,SoundEffectsRes.main_30
    ],
    reson:[
        SoundEffectsRes.main_01_b,SoundEffectsRes.main_02_b,SoundEffectsRes.main_03_b,SoundEffectsRes.main_04_b,SoundEffectsRes.main_05_b,
        SoundEffectsRes.main_06_b,SoundEffectsRes.main_07_b,SoundEffectsRes.main_08_b,SoundEffectsRes.main_09_b,SoundEffectsRes.main_10_b,
        SoundEffectsRes.main_11_b,SoundEffectsRes.main_12_b,SoundEffectsRes.main_13_b,SoundEffectsRes.main_14_b,SoundEffectsRes.main_15_b,
        SoundEffectsRes.main_16_b,SoundEffectsRes.main_17_b,SoundEffectsRes.main_18_b,SoundEffectsRes.main_19_b,SoundEffectsRes.main_20_b,
        SoundEffectsRes.main_21_b,SoundEffectsRes.main_22_b,SoundEffectsRes.main_23_b,SoundEffectsRes.main_24_b,SoundEffectsRes.main_25_b,
        SoundEffectsRes.main_26_b,SoundEffectsRes.main_27_b,SoundEffectsRes.main_28_b,SoundEffectsRes.main_29_b,SoundEffectsRes.main_30_b
    ],

    resSound:[
        SoundEffectsRes.sound_101_drum,SoundEffectsRes.sound_102_cymbal,SoundEffectsRes.sound_103_fall,SoundEffectsRes.sound_104_scream,SoundEffectsRes.sound_105_fart,
        SoundEffectsRes.sound_106_punchline,SoundEffectsRes.sound_107_explosion,SoundEffectsRes.sound_108_ovation_stereo,SoundEffectsRes.sound_109_greatcheer_stereo,SoundEffectsRes.sound_110_booing_stereo,
        SoundEffectsRes.sound_111_chicken,SoundEffectsRes.sound_112_katana,SoundEffectsRes.sound_113_straightman,SoundEffectsRes.sound_114_glass,SoundEffectsRes.sound_115_fanfare_stereo,
        SoundEffectsRes.sound_116_chimeschool,SoundEffectsRes.sound_117_chimestart,SoundEffectsRes.sound_118_chimeend,SoundEffectsRes.sound_119_regulationp,SoundEffectsRes.sound_120_regulationgun,
        SoundEffectsRes.sound_121_correct,SoundEffectsRes.sound_122_incorrect,SoundEffectsRes.sound_123_gong,SoundEffectsRes.sound_124_spring,SoundEffectsRes.sound_125_gongchinese,
        SoundEffectsRes.sound_126_train,SoundEffectsRes.sound_127_horn,SoundEffectsRes.sound_128_noisecity_stereo,SoundEffectsRes.sound_129_laughterm,SoundEffectsRes.sound_130_laughterf
    ],
    soundState:null,
    ctor:function () {
        this._super(cc.color(111,205,192,255));

        mainView = this;

        this.initMain();

        ADD_CHANGESTATE_CALLBACK(this.stateBack, this);

        this.scheduleUpdate();

        Utility.setTitle_thumbnails(GAME_TYPE.SoundEffects);

        Utility.sendXhr(GAME_TYPE.SoundEffects.gameid);

        return true;
    },

    onExit:function(){
        SoundManager.instance().stopSong();
    },

    update:function(){
        var context = this;
        if(Utility.checkRfresh){
            switch (context.gameStage){
                case context.TAG_MAIN:
                    context.getChildByName("mainBack").setContentSize(cc.winSize);//大小修改
                    context.getChildByName("mainBack").setPosition(0, 0);
                    var sView = context.getChildByName("mainBack").getChildByName("scrollView");
                    if(sView){
                        var EditH = 0;
                        sView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - EditH));
                        sView.setPosition(0, cc.winSize.height - 100);
                    }
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
                break;
            case context.TAG_READY:
                break;
            case context.TAG_RESULT:
                break;
        }
    },

    initMain:function() {
        this.gameStage = this.TAG_MAIN;
        this.initData();
        this.loadData();
        var isHaveEditMode = false;
        var EditH = 0;
        if(isHaveEditMode) EditH = 200;
        var toolbar = new Toolbar(GAME_TYPE.SoundEffects);
        toolbar.setAnchorPoint(cc.p(0,1));
        toolbar.setName("toolBar");
        toolbar.setPosition(cc.p(0, cc.winSize.height));
        this.addChild(toolbar,this.ORDER_Z_MAIN);

        var aeBack = new cc.LayerColor(cc.color(111,205,192,255), cc.winSize.width,cc.winSize.height);
        aeBack.setPosition(0, 0);
        aeBack.setName("mainBack");
        this.addChild(aeBack);

        var sView = new ccui.ScrollView();
        sView.setDirection(ccui.ScrollView.DIR_BOTH);
        sView.setName("scrollView");
        sView.setBackGroundColor(cc.color(111,205,192,255));
        sView.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        sView.setTouchEnabled(true);
        sView.setBounceEnabled(false);
        sView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height - 100 - EditH));
        sView._setInnerHeight((this.soundItemHeight * (parseInt(this.soundMaxNum/this.soundItemRow))) + ((this.soundMaxNum%this.soundItemRow) > 0 ? this.soundItemHeight:0));
        sView.setAnchorPoint(0, 1);
        sView.setPosition(0, cc.winSize.height - 100);
        aeBack.addChild(sView);

        for(var i = 0; i < this.soundMaxNum; i++){
            sView.addChild(this.itemLayout(i,this.soundItemHeight*(i%3),sView._getInnerHeight() - this.soundItemHeight*(parseInt(i/3))));
        }
//////EditView///
        if(isHaveEditMode){
            var editBtnW = 100;

            var editBackColor = new ccui.Layout();
            editBackColor.setAnchorPoint(0, 0);
            editBackColor.setPosition(0, 0);
            editBackColor.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            editBackColor.setBackGroundColor(cc.color("#568f96"));
            editBackColor.setContentSize(cc.winSize.width, EditH);
            aeBack.addChild(editBackColor);


            var eLayoutL = new ccui.Layout();
            eLayoutL.setAnchorPoint(0, 0);
            eLayoutL.setPosition(0, 0);
            //eLayoutL.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
            //eLayoutL.setBackGroundColor(cc.color("#568f96"));
            eLayoutL.setContentSize(editBtnW, EditH);
            aeBack.addChild(eLayoutL);
            var editOnOff = new ccui.Button(SoundEffectsRes.setting_off);
            editOnOff.setAnchorPoint(0.5, 0.5);
            editOnOff.setPosition(eLayoutL.getContentSize().width>>1, eLayoutL.getContentSize().height>>1);
            editOnOff.addClickEventListener(function(note){
                if(mainView.soundEditMode){
                    DataManager.instance().createArrayData(GAME_TYPE.SoundEffects.name,mainView.soundArrayFavNum);
                    mainView.soundEditMode = false;
                    mainView.clearDefaultSoundImage("off");
                    note.loadTextures(SoundEffectsRes.setting_off);
                }else{
                    SoundManager.instance().stopSong();
                    mainView.soundEditMode = true;
                    mainView.setCurrentSoundNum(-1,1);
                    mainView.clearDefaultSoundImage("disable");
                    note.loadTextures(SoundEffectsRes.setting_on);
                }
            });
            eLayoutL.addChild(editOnOff);

            var eLayoutR = new ccui.Layout();
            eLayoutR.setAnchorPoint(0, 0);
            eLayoutR.setPosition(editBtnW, 0);
            eLayoutR.setContentSize(cc.winSize.width - editBtnW, EditH);
            aeBack.addChild(eLayoutR);

            var draw = new cc.DrawNode();
            var vertices = [cc.p(editBtnW, 0), cc.p(editBtnW, EditH) ];
            aeBack.addChild(draw);
            draw.drawPoly(vertices, null, 2, cc.color("#6fcdc1"));

            var startX = eLayoutR.getContentSize().width/this.maxModeNum/2;

            for(var i = 0; i < this.maxModeNum; i++){

                var eLayout = new ccui.Layout();
                eLayout.setAnchorPoint(0.5, 0.5);
                eLayout.setPosition(startX + (eLayoutR.getContentSize().width/this.maxModeNum)*i, EditH>>1);
                //eLayout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
                //eLayout.setBackGroundColor(cc.color("#568f96"));
                eLayout.setContentSize(eLayoutR.getContentSize().width/this.maxModeNum + 1, EditH);
                eLayoutR.addChild(eLayout);

                var draw = new cc.DrawNode();
                draw.setName("noneBack");
                draw.drawDot(cc.p(startX, eLayout.getPositionY() + 20), 68, cc.color(255, 255, 255, 255));
                eLayout.addChild(draw);

                var text = new ccui.Text("なし",GAME_FONT.PRO_W3,23);
                text.setName("noneBackText");
                text.setAnchorPoint(cc.p(0.5,0.5));
                text.setColor(cc.color(250, 243, 188, 255));
                text.setPosition(startX, eLayout.getPositionY() - 80);
                eLayout.addChild(text);

                this.soundArrayFavParNote[i] = eLayout;
                if(this.soundArrayFavNum[i] > -1){//Load Data
                    this.editItemLayout(this.soundArrayFavNum[i],true,i);
                    this.setVisibleEditBack(this.soundArrayFavParNote[i],false);
                }
            }
        }
    },

    setVisibleEditBack:function(note,visible) {
        note.getChildByName("noneBack").setVisible(visible);
        note.getChildByName("noneBackText").setVisible(visible);
    },

    initData:function() {
        this.soundItemHeight = cc.winSize.width/this.soundItemRow;
        this.soundEditMode = false;
        this.soundArrayNote = new Array(this.soundMaxNum);
        this.soundArrayFavParNote = new Array(this.maxModeNum);
        this.soundArrayFavNum = [];
        for(var i = 0; i < this.maxModeNum; i++)
            this.soundArrayFavNum.push(-1);
        this.currentPlayNum = {num:-1,type:0};//type 0:nomorl 1:fav
    },

    loadData:function() {
        var array = DataManager.instance().getArrayData(GAME_TYPE.SoundEffects.name);
        if(array != null){
            this.soundArrayFavNum = [];
            for (var i in array) {
                this.soundArrayFavNum.push(array[i]);
            }
        }
    },

    itemLayout:function(tag,x,y){
        var _this = this;
        var layout = new ccui.Layout();
        layout.setAnchorPoint(0, 1);
        layout.setPosition(x, y);
        //layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        //layout.setBackGroundColor(cc.color(255,255,0,255));
        layout.setContentSize(this.soundItemHeight, this.soundItemHeight);

        //var text = new ccui.Text(tag,GAME_FONT.PRO_W3,34);
        //text.setAnchorPoint(cc.p(0.5,0.5));
        //text.setColor(cc.color("#dbf2ef"));
        //text.setPosition(layout.getContentSize().width/2, layout.getContentSize().height/2);
        //layout.addChild(text);

        var onOff = new ccui.Button(this.resoff[tag],this.resoff[tag]);
        onOff.setAnchorPoint(0.5, 0.5);
        onOff.setTag(tag);
        onOff.setName("off");
        onOff.setPosition(layout.getContentSize().width/2, layout.getContentSize().height/2);
        onOff.addClickEventListener(function(note){
            if(_this.soundEditMode){
                if(note.getName() != "disable"){
                    var index = _this.editItemLayout(note.getTag());
                    if(index != -1){
                        note.setName("disable");
                        note.loadTextures(_this.reson[note.getTag()],_this.reson[note.getTag()]);
                        _this.setVisibleEditBack(_this.soundArrayFavParNote[index],false);
                    }
                }
            }else{

                var index = note.getTag();
                if(note.getName() == "off"){
                    var loop = false;
                    if(index == 0 || index == 7 || index == 8 || index == 9 || index == 25 || index == 27) loop = true;
                    if(loop){
                        _this.currentLoop = true;
                        SoundManager.prototype.playMusic(_this.resSound[index],loop);
                    }else{
                        _this.currentLoop = false;
                        SoundManager.instance().playSong(mainView.soundEndSelector,_this.resSound[index],loop);
                    }

                    _this.setCurrentSoundNum(tag,0);
                    _this.changeSoundImage(note,"on");//_this.reson[note.getTag()]
                    note.getParent().getChildByName("sound_stop").setVisible(true);
                }else{
                    SoundManager.instance().stopSong();
                    _this.setCurrentSoundNum(-1,0);
                    _this.changeSoundImage(note,"off");
                    note.getParent().getChildByName("sound_stop").setVisible(false);
                }
            }

        });
        layout.addChild(onOff);

        var sound_stop = new cc.Sprite(SoundEffectsRes.sound_stop);
        sound_stop.setName("sound_stop");
        sound_stop.setAnchorPoint(0.5, 0.5);
        sound_stop.setPosition(layout.getContentSize().width/2,layout.getContentSize().height/2);
        layout.addChild(sound_stop);
        sound_stop.setVisible(false);

        this.soundArrayNote[tag] = onOff;
        return layout;
    },

    changeSoundImage:function(note,str,img){
        note.setName(str);
        if(img)
            note.loadTextures(img,img);
    },

    editItemLayout:function(tag,isLoad,index){
        var _this = this;
        var i = 0;
        if(isLoad){
            i = index;
        }else{
            for(i = 0; i < this.maxModeNum; i++){
                if(this.soundArrayFavNum[i] > -1)
                    continue;
                else
                    break;
            }
            if(i >= this.maxModeNum) return -1;
        }


        var onOff = new ccui.Button(SoundEffectsRes.setting_delete,SoundEffectsRes.setting_delete);
        onOff.setAnchorPoint(0.5, 0.5);
        onOff.setTag(tag);
        onOff.setName("disable");
        onOff.setPosition(this.soundArrayFavParNote[0].getPositionX(),this.soundArrayFavParNote[0].getPositionY());
        onOff.addClickEventListener(function(note){
            if(mainView.soundEditMode){
                var index = mainView.getNumberFromFavArray(note.getTag());
                if(index != -1){
                    note.removeFromParent();
                    _this.soundArrayFavParNote[index].getChildByName("editBack").removeFromParent();
                    mainView.changeSoundImage(mainView.soundArrayNote[mainView.soundArrayFavNum[index]],"off",_this.resoff[note.getTag()]);
                    mainView.soundArrayFavNum[index] = -1;
                    _this.setVisibleEditBack(_this.soundArrayFavParNote[index],true);
                }
            }else{
                if(note.getName() == "off"){
                    SoundManager.instance().playSong(mainView.soundEndSelector,_this.resSound[note.getTag()]);
                    mainView.setCurrentSoundNum(note.getTag(),1);
                    mainView.changeSoundImage(note,"on",_this.reson[note.getTag()]);
                }else{
                    SoundManager.instance().stopSong();
                    mainView.setCurrentSoundNum(-1,1);
                    mainView.changeSoundImage(note,"off",_this.resoff[note.getTag()]);
                }
            }
        });

        var bg = new cc.Sprite(this.resoff[tag]);
        bg.setAnchorPoint(0.5, 0.5);
        bg.setName("editBack");
        bg.setPosition(onOff.getPositionX(),onOff.getPositionY());
        this.soundArrayFavParNote[i].addChild(bg);

        this.soundArrayFavNum[i] = tag;
        this.soundArrayFavParNote[i].addChild(onOff);

        if(isLoad){
            this.changeSoundImage(onOff,"off",_this.resoff[tag]);
            bg.setVisible(false);
        }

        return i;
    },

    setCurrentSoundNum:function(num,type){
        this.stopCurrentPlayingSound();
        this.currentPlayNum.num = num;
        this.currentPlayNum.type = type;
    },

    getNumberFromFavArray:function(tag){
        for(var i = 0; i < this.soundArrayFavNum.length; i++){
            if(this.soundArrayFavNum[i] == tag)
                return i;
        }
        cc.error("cannot find Favorite num from array");
        return -1;
    },

    clearDefaultSoundImage:function(str){
        for(var i = 0; i < this.soundArrayFavNum.length; i++){
            if(this.soundArrayFavNum[i] > -1){
                if(str == "off")//设置默认声音图片
                    this.changeSoundImage(this.soundArrayNote[this.soundArrayFavNum[i]],str,this.resoff[this.soundArrayFavNum[i]]);
                else
                    this.changeSoundImage(this.soundArrayNote[this.soundArrayFavNum[i]],str,this.reson[this.soundArrayFavNum[i]]);
                var index = this.getNumberFromFavArray(this.soundArrayFavNum[i]);//获得收藏的声音索引
                if(index != -1){
                    var bg = this.soundArrayFavParNote[index].getChildByName("editBack");
                    var onOff = this.soundArrayFavParNote[index].getChildByTag(this.soundArrayFavNum[i]);
                    if(str == "off"){
                        bg.setVisible(false);
                        this.changeSoundImage(onOff,"off",this.resoff[this.soundArrayFavNum[i]]);
                    }else{
                        bg.setVisible(true);
                        this.changeSoundImage(onOff,str,SoundEffectsRes.setting_delete);
                    }
                }

            }

        }
    },

    soundEndSelector:function(node){
        if(mainView.currentLoop) return;
        if(mainView.stopCurrentPlayingSound)
            mainView.stopCurrentPlayingSound();
    },

    stopCurrentPlayingSound:function(){
        if(this.currentPlayNum.num != -1){//暂停正在播放的声音
            if(this.currentPlayNum.type == 0){
                this.changeSoundImage(this.soundArrayNote[this.currentPlayNum.num],"off");
                this.soundArrayNote[this.currentPlayNum.num].getParent().getChildByName("sound_stop").setVisible(false);
            }else{//editmode
                var index = this.getNumberFromFavArray(this.currentPlayNum.num);
                if(index != -1)
                    this.changeSoundImage(this.soundArrayFavParNote[index].getChildByTag(this.currentPlayNum.num),"off",this.resoff[this.currentPlayNum.num]);
            }
        }
    }



});

var SoundEffectsScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SoundEffectsLayer();
        this.addChild(layer);
    }
});