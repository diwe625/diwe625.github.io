/**
 * Created by nhnst on 10/20/15.
 */



var TestLayer = cc.LayerColor.extend({
    ctor:function () {
        this._super(cc.color(0,0,255,255));

        var count = 100;

        var text = new cc.LabelTTF(""+count);
        text.setFontSize(30);
        text.setAnchorPoint(0,1);
        text.setPosition(0, cc.winSize.height);
        this.addChild(text);

        var touch = new ScaleMotionNode();
        touch.setContentSize(cc.winSize);
        touch.setAnchorPoint(0,0);
        this.addChild(touch);

        touch.setZoomOut(function(){
            count ++;
            text.setString(""+count);
        });

        touch.setZoomIn(function(){
            count --;
            text.setString(""+count);
        });

    }



});

var TestScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new TestLayer();
        this.addChild(layer);
    }
});