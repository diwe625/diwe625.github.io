/**
 * Created by dyfox on 16-1-18.
 */


var ScaleMotionNode = cc.Node.extend(/** @lends ccui.ScrollView# */{

    m_multiTouch : false,
    m_dis : 0,
    m_zoomOut : null,
    m_zoomIn : null,
    m_onEnter : null,
    m_touchCount : 0,

    ctor: function () {
        this._super();

        //this.setTouchable(true);

        var touch = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //swallowTouches: true,
            onTouchBegan : this.checkTouches.bind(this),
            onTouchEnded : this._onTouchEnded.bind(this)
        });
        cc.eventManager.addListener(touch, -1);

        var touchs = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            //swallowTouches: true,
            onTouchesBegan: this._onTouchesBegan.bind(this),
            onTouchesMoved: this._onTouchesMoved.bind(this),
            onTouchesEnded: this._onTouchesEnded.bind(this),
            onTouchesCancelled: this._onTouchesCancelled.bind(this)
        });

        cc.eventManager.addListener(touchs, this);
    },

    checkTouches: function(touches, event){
        if(touches.getID() > 0){
            this.m_multiTouch = true;
        }else{
            this.m_multiTouch = false;
        }
        this.m_touchCount++;
        if(this.m_touchCount>=2){
            this.m_onEnter(true);
        }else{
            this.m_onEnter(false);
        }
        return true;
    },

    _onTouchEnded : function(touches, event){
        this.m_touchCount--;
        if(this.m_touchCount<2){
            this.m_onEnter(false);
        }
    },

    _onTouchesBegan : function(touches, event){
        if(touches.length==2 && this.m_dis==0){
            var point1 = touches[0].getLocation(),point2 = touches[1].getLocation();
            this.m_dis = cc.pDistance(point1,point2);
        }

        return true;
    },

    _onTouchesMoved : function(touches, event){
        if(this.m_dis!=0){
            var point1 = touches[0].getLocation(),point2 = touches[1].getLocation();
            var dis = cc.pDistance(point1,point2);
            if(dis > this.m_dis){
                this.m_zoomOut();
            }else{
                this.m_zoomIn();
            }
            this.m_dis = dis;
        }
        //return this.m_multiTouch;
    },

    _onTouchesEnded : function(touches, event){
        if(touches<2){
            this.m_dis = 0;
        }
        //return this.m_multiTouch;
    },

    _onTouchesCancelled : function(touches, event){

        return this.m_multiTouch;
    },

    setZoomOut : function(zoomout){
        this.m_zoomOut = zoomout;
    },

    setZoomIn : function(zoomin){
        this.m_zoomIn = zoomin;
    },

    setOnEnter : function(cb){
        this.m_onEnter = cb;
    }

});