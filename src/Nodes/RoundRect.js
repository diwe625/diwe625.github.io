/**
 * Created by dyfox on 16-01-15.
 */

var RoundRect = cc.Node.extend({

    ctor:function(width, height){
        this._super();

        this.setContentSize(width, height);

        var mask = new cc.Scale9Sprite(GlobalRes.radius1, cc.rect(0, 0, 20, 20), cc.rect(9, 9, 2, 2));
        mask.setPreferredSize(cc.size(width, height));
        mask.setAnchorPoint(0, 0);

        var layout = new ccui.Layout();
        layout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        layout.setBackGroundColor(cc.color(255,255,255,255));
        layout.setTouchEnabled(true);
        layout.setContentSize(width, height);
        layout.setAnchorPoint(0, 0);

        var clipNode = new cc.ClippingNode(mask);
        clipNode.setAnchorPoint(0, 0);
        clipNode.setPosition(0, 0);
        clipNode.addChild(layout);
        this.addChild(clipNode);

        this.addChild = function(node, zOder){
            if(zOder){
                layout.addChild(node, zOder);
            }else{
                layout.addChild(node);
            }
        };
    }

});