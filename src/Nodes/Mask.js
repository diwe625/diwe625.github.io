/**
 * Created by dyfox on 15-11-9.
 */

var Mask = cc.LayerColor.extend({

    masklistener1:null,

    ctor:function(){
        this._super(cc.color(0,0,0,191));
        this.setPosition(0,-400);
        this.setContentSize(cc.winSize.width,cc.winSize.height + 800);
        this.masklistener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
            onTouchBegan:function(pTouches, event){
                return true;
            },

            onTouchMoved:function(pTouches, event){
                return true;
            },

            onTouchEnded:function(pTouches, event){
                return true;
            },

            onTouchCancelled:function(pTouches, event){
                return true;
            }
        });
    },

    setTouchable:function(able){
       if(!able){
           cc.eventManager.addListener(this.masklistener1, this);
       }else{
           cc.eventManager.removeListener(this.masklistener1, this);
       }
    },

    open:function(){
        this.setVisible(true);
        this.setTouchable(false);
    },

    close:function(){
        this.setVisible(false);
        this.setTouchable(true);
    }

});