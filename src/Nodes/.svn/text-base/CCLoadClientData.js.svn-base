/**
 * Created by nhnst on 11/13/15.
 */
/**
 * @class
 * @extends cc.Class
 */
cc.LoadClientDataDelegate = cc.Class.extend({
    /**
     * This method is called when the file was changed.
     * @param {cc.LoadClientData} sender
     * @param {String} text
     */
    loadClientDataChanged: function (sender, text, oText, iType) {
    }
});

/**
 * <p>cc.LoadClientData is a brief Class for LoadClientData.<br/>
 * You can use this widget to gather small amounts of text from the user.</p>
 *
 * @class
 * @extends cc.ControlButton
 *
 * @property {Object}   delegate                - <@writeonly> Delegate of LoadClientData
 *
 */
cc.LoadClientData = cc.ControlButton.extend({
    _domInputSprite: null,

    _delegate: null,

    _maxFileCount: 4,

    _text: "",
    _textColor: null,
    _maxLength: 50,
    _adjustHeight: 18,

    _edTxt: null,
    _edFontSize: 14,
    _edFontName: "Arial",

    _tooltip: false,
    _className: "LoadClientData",
    _canvas: null,
    _ctx: null,
    _this:null,
    /**
     * constructor of cc.LoadClientData
     * @param {cc.Size} size
     * @param {cc.Scale9Sprite} normal9SpriteBg
     * @param {cc.Scale9Sprite} press9SpriteBg
     * @param {cc.Scale9Sprite} disabled9SpriteBg
     */
    ctor: function (size,max, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) {
        cc.ControlButton.prototype.ctor.call(this);
        var _this = this;
        //this._textColor = cc.color.WHITE;
        //this._placeholderColor = cc.color.GRAY;
        this.setContentSize(size);
        var tmpDOMSprite = this._domInputSprite = new cc.Sprite();
        tmpDOMSprite.draw = function () {};  //redefine draw function
        this.addChild(tmpDOMSprite);
        var selfPointer = this;
        var tmpEdTxt = this._edTxt = cc.newElement("input");
        tmpEdTxt.type = "file";
        //tmpEdTxt.capture = "camera";
        tmpEdTxt.accept = "image/*";//image/png,image/gif,image/tga
        selfPointer._maxFileCount = max;
        if(max > 1)
            tmpEdTxt.multiple="multiple";


        tmpEdTxt.style.opacity = 0;
        tmpEdTxt.style.zIndex = 1;
        tmpEdTxt.style.width = "100%";
        tmpEdTxt.style.height = "100%";

        var onCanvasClick = function() {
            //console.log("onCanvasClick");
            _this._isPushed = true;
            _this.setHighlighted(true);
        };

        var onCanvasClickUp = function() {
            //console.log("onCanvasClickUp");
            _this._isPushed = false;
            _this.setHighlighted(false);
        };

        //cc._addEventListener(tmpEdTxt, "focus", function () {
        //
        //    console.log("focus");
        //        //this.style.fontSize = selfPointer._edFontSize + "px";
        //    //tmpDOMSprite.dom.style.color = cc.colorToHex(cc.color.GRAY);
        //    //if (this.value === selfPointer._placeholderText) {
        //    //    this.value = "";
        //    //    this.style.fontSize = selfPointer._edFontSize + "px";
        //    //    this.style.color = cc.colorToHex(selfPointer._textColor);
        //    //    if (selfPointer._editBoxInputFlag === cc.EDITBOX_INPUT_FLAG_PASSWORD)
        //    //        selfPointer._edTxt.type = "password";
        //    //    else
        //    //        selfPointer._edTxt.type = "text";
        //    //}
        //    //if (selfPointer._delegate && selfPointer._delegate.editBoxEditingDidBegin)
        //    //    selfPointer._delegate.editBoxEditingDidBegin(selfPointer);
        //
        //});

        //cc._addEventListener(tmpEdTxt, "drag", onCanvasClick);
        //cc._addEventListener(tmpEdTxt, "mouseup", onCanvasClickUp);
        //cc._addEventListener(tmpEdTxt, "mouseout", onCanvasClickUp);
        //屏蔽window上下滚动
        cc._addEventListener(tmpEdTxt, "touchmove", function (event) {
            event.preventDefault();
        });

        cc._addEventListener(tmpEdTxt, "change", function () {
            Utility.siLoadingFile = true;
            var cuCount = 0;
            var dataURL = [];
            var dataURLOri = [];
            var count = this.files.length;
            var type;
            var size;
            //if(count > selfPointer._maxFileCount){
            //    window.alert('최고 선택갯수를 초과하였습니다.:'+selfPointer._maxFileCount);
            //    return;
            //}
            for(var i = 0; i < count; i++){
                var reader = new FileReader();
                type = this.files[i].type;
                size = this.files[i].size;

                reader.onload = function (e) {
                    var rStr = e.target.result;
                    if(type == null || type == ""){//读不到类型时，强行添加类型l36h
                        var s1 = rStr.substring(0,5);
                        var s2 = rStr.substring(5,rStr.length);
                        rStr = s1 + "image/png;" +s2;
                    }
                    cuCount++;
                    //if(size > 1000000){//1M 以下开始进行压缩
                        var quality = 100;
                        if(size < 1000000)//1M
                            quality = 100;
                        else if(size < 5000000)//5M
                            quality = 50;
                        else if(size < 10000000)//10M
                            quality = 30;
                        else if(size < 50000000)//50M
                            quality = 20;
                        else//50M+
                            quality = 10;
                        selfPointer.compress(rStr,count,cuCount,dataURL,dataURLOri,type,quality);
                    //}else{
                    //    dataURLOri.push(e.target.result);
                    //    cc.loader.loadImg(e.target.result, {isCrossOrigin : false }, function(err, img){
                    //        dataURL.push(img);
                    //        if(dataURL.length == count){
                    //            if (_this._delegate && _this._delegate.loadClientDataChanged)
                    //                _this._delegate.loadClientDataChanged(_this, dataURL,dataURLOri);
                    //        }
                    //
                    //    });
                    //}
                };
                reader.readAsDataURL(this.files[i]);
            }

        });

        cc.DOM.convert(tmpDOMSprite);
        tmpDOMSprite.dom.appendChild(tmpEdTxt);
        tmpDOMSprite.dom.showTooltipDiv = false;
        tmpDOMSprite.dom.style.left = -6 + "px";
        tmpDOMSprite.dom.style.bottom = -6 + "px";
        tmpDOMSprite.dom.style.width = (size.width) + "px";
        tmpDOMSprite.dom.style.height = (size.height) + "px";
        _this._canvas = tmpDOMSprite.canvas;
        tmpDOMSprite.canvas.remove();
        //this._domInputSprite.dom.style.borderStyle = "solid";


        if (this.initWithSizeAndBackgroundSprite(size, normal9SpriteBg)) {
            if (press9SpriteBg)
                this.setBackgroundSpriteForState(press9SpriteBg, cc.CONTROL_STATE_HIGHLIGHTED);
            if (disabled9SpriteBg)
                this.setBackgroundSpriteForState(disabled9SpriteBg, cc.CONTROL_STATE_DISABLED);
        }
    },

    compress: function (src,mCount,cCount,dataURL,dataURLOri,output_format,quality) {
        var _this = this;
        var mime_type = "image/jpeg";
        if(output_format!=undefined && output_format=="image/png"){
            mime_type = "image/png";
        }
        // 参数，最大高度
        var square = 180;

// 创建一个 Image 对象
        var image = new Image();
// 绑定 load 事件处理器，加载完成后执行
        image.onload = function(){
            var step = _this.ifPhoto(this,mime_type == "image/jpeg");
            var offsetX = 0;
            var offsetY = 0;
            var imageWidth = this.width*(quality/100);
            var imageHeight = this.height*(quality/100);
            if(step == 1){
                var square = this.height;
                imageWidth = this.height*(quality/100);
                imageHeight = this.width*(quality/100);
                if (this.width > this.height) {
                    imageWidth = Math.round(square * this.height / this.width);
                    imageHeight = square;
                    offsetX = - Math.round((imageWidth - square) / 2);
                    //imageWidth = imageWidth + 2*offsetX;
                    //offsetX = 0;
                }
                else
                {
                    imageHeight = Math.round(square * this.width / this.height);
                    imageWidth = square;
                    offsetY = - Math.round((imageHeight - square) / 2);
                    //imageHeight = imageHeight + 2*offsetY;
                    //offsetY = 0;
                }
            }
            //else{
            //    if (this.width > this.height) {
            //        imageWidth = Math.round(square * this.width / this.height);
            //        imageHeight = square;
            //        offsetX = - Math.round((imageWidth - square) / 2);
            //        //imageWidth = imageWidth + 2*offsetX;
            //        //offsetX = 0;
            //    }
            //    else
            //    {
            //        imageHeight = Math.round(square * this.height / this.width);
            //        imageWidth = square;
            //        offsetY = - Math.round((imageHeight - square) / 2);
            //        //imageHeight = imageHeight + 2*offsetY;
            //        //offsetY = 0;
            //    }
            //}


            var degree = step * 90 * Math.PI / 180;
            var canvas = _this._canvas;
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, imageWidth, imageHeight);
            switch (step) {
                case 0:
                    context.drawImage(this, 0, 0, imageWidth, imageHeight);
                    break;
                case 1:
                    context.rotate(degree);
                    context.drawImage(this, 0, 0, imageWidth + 2*offsetX, -imageHeight + 2*offsetX);
                    break;
                case 2:
                    context.rotate(degree);
                    context.drawImage(this, offsetX, offsetY, -imageWidth, -imageHeight);
                    break;
                case 3:
                    context.rotate(degree);
                    context.drawImage(this, offsetX, offsetY, -imageWidth, imageHeight);
                    break;
            }

            var ret = canvas.toDataURL(mime_type,quality/100);
            var type = {canvas:canvas,image:this};
            //cc.log(ret.length);
            //ret = ret.substring(0,125427);
            //cc.sys.localStorage.setItem("photoMaxNumTest",ret);
            //var testKey = 'test', storage = window.localStorage;
            //try {
            //    storage.setItem(testKey, ret);
            //    //storage.removeItem(testKey);
            //    //return true;
            //    cc.log(":::"+ret.length);
            //} catch (error) {
            //    cc.log(ret);
            //    //return false;
            //}
            //var _w = 1;
            //_this._canvas.width = this.width*_w;
            //_this._canvas.height = this.height*_w;
            //var context = _this._canvas.getContext('2d');
            //context.clearRect(0, 0, _this._canvas.width, _this._canvas.height);
            //context.drawImage(this, 0, 0);
            //ret = _this._canvas.toDataURL(mime_type,quality/100);

            dataURLOri.push(ret);
            cc.loader.loadImg(ret, {isCrossOrigin : false }, function(err, img){
                dataURL.push(img);
                if(mCount == dataURL.length){
                    if (_this._delegate && _this._delegate.loadClientDataChanged)
                        _this._delegate.loadClientDataChanged(_this, dataURL,dataURLOri,type);
                }
            });
        };
        image.src = src;
        image = null;
    },

    ifPhoto:function(target,isJpeg){
        var step = 0;
        if(target.width > target.height){
            var arry = [
                4224,3168,//6+
                3264,2448,//5,6
                2594,1936,//iphone4

                1280,960//6front
            ];
            for(var i = 0; i <arry.length/2;i++){
                if(target.width == arry[2*i] &&target.height == arry[2*i + 1]){
                    step = 1;
                    break;
                }
            }
            if(cc.sys.os == cc.sys.OS_ANDROID  && isJpeg){
                step = 1;
            }
        }
        return step;
    },
/**
     * Set the font.
     * @param {String} fontName  The font name.
     * @param {Number} fontSize  The font size.
     */
    setFont: function (fontName, fontSize) {
        this._edFontSize = fontSize;
        this._edFontName = fontName;
        this._setFontToEditBox();
    },

    _setFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        if (res) {
            this._edFontSize = parseInt(res[1]);
            this._edFontName = res[2];
            this._setFontToEditBox();
        }
    },

    /**
     * set fontName
     * @param {String} fontName
     */
    setFontName: function (fontName) {
        this._edFontName = fontName;
        this._setFontToEditBox();
    },

    /**
     * set fontSize
     * @param {Number} fontSize
     */
    setFontSize: function (fontSize) {
        this._edFontSize = fontSize;
        this._setFontToEditBox();
    },

    _setFontToEditBox: function () {
            this._edTxt.style.fontFamily = this._edFontName;
            this._edTxt.style.fontSize = this._edFontSize + "px";
    },

    /**
     *  Set the text entered in the edit box.
     * @deprecated
     * @param {string} text The given text.
     */
    setText: function (text) {
        cc.log("Please use the setString");
        this.setString(text);
    },

    /**
     *  Set the text entered in the edit box.
     * @param {string} text The given text.
     */
    setString: function (text) {
        if (text != null) {
                this._edTxt.value = text;
                this._edTxt.style.color = cc.colorToHex(this._textColor);
        }
    },

    /**
     * Set the font color of the widget's text.
     * @param {cc.Color} color
     */
    setFontColor: function (color) {
        this._textColor = color;
        //if (this._edTxt.value !== this._placeholderText) {
        //    this._edTxt.style.color = cc.colorToHex(color);
        //}
    },

    /**
     * Gets the  input string of the edit box.
     * @deprecated
     * @return {string}
     */
    getText: function () {
        cc.log("Please use the getString");
        return this._edTxt.value;
    },

    /**
     * Gets the  input string of the edit box.
     * @return {string}
     */
    getString: function () {
        //if(this._edTxt.value === this._placeholderText)
        //    return "";
        return this._edTxt.value;
    },

    /**
     * Init edit box with specified size.
     * @param {cc.Size} size
     * @param {cc.Color | cc.Scale9Sprite} normal9SpriteBg
     */
    initWithSizeAndBackgroundSprite: function (size, normal9SpriteBg) {
        if (this.initWithBackgroundSprite(normal9SpriteBg)) {
            this._domInputSprite.x = 3;
            this._domInputSprite.y = 3;

            this.setZoomOnTouchDown(false);
            this.setPreferredSize(size);
            this.x = 0;
            this.y = 0;
            this._addTargetWithActionForControlEvent(this, this.touchDownAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            return true;
        }
        return false;
    },

    /* override functions */
    /**
     * Set the delegate for edit box.
     * @param {cc.LoadClientDataDelegate} delegate
     */
    setDelegate: function (delegate) {
        this._delegate = delegate;
    },

    setMaxImageCount: function (max) {
        this._maxFileCount = max;
    },


    touchDownAction: function (sender, controlEvent) {

    },

    /**
     * @warning HTML5 Only
     * @param {cc.Size} size
     * @param {cc.color} bgColor
     */
    initWithBackgroundColor: function (size, bgColor) {
        this._edWidth = size.width;
        this.dom.style.width = this._edWidth.toString() + "px";
        this._edHeight = size.height;
        this.dom.style.height = this._edHeight.toString() + "px";
        this.dom.style.backgroundColor = cc.colorToHex(bgColor);
    }
});

var _p = cc.LoadClientData.prototype;

// Extended properties
/** @expose */
_p.font;
cc.defineGetterSetter(_p, "font", null, _p._setFont);
/** @expose */
_p.fontName;
cc.defineGetterSetter(_p, "fontName", null, _p.setFontName);
/** @expose */
_p.fontSize;
cc.defineGetterSetter(_p, "fontSize", null, _p.setFontSize);
/** @expose */
_p.fontColor;
cc.defineGetterSetter(_p, "fontColor", null, _p.setFontColor);
/** @expose */
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
/** @expose */
_p.delegate;
cc.defineGetterSetter(_p, "delegate", null, _p.setDelegate);
/** @expose */
_p.delegate;
cc.defineGetterSetter(_p, "maxImageCount", null, _p.setMaxImageCount);

_p = null;

/**
 * get the rect of a node in world coordinate frame
 * @function
 * @param {cc.Node} node
 * @return {cc.Rect}
 */
cc.LoadClientData.getRect = function (node) {
    var contentSize = node.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    return cc.rectApplyAffineTransform(rect, node.getNodeToWorldTransform());
};

/**
 * create a edit box with size and background-color or
 * @deprecated since v3.0, please use new cc.LoadClientData(size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) instead
 * @param {cc.Size} size
 * @param {cc.Scale9Sprite } normal9SpriteBg
 * @param {cc.Scale9Sprite } [press9SpriteBg]
 * @param {cc.Scale9Sprite } [disabled9SpriteBg]
 * @return {cc.LoadClientData}
 */
cc.LoadClientData.create = function (size, max, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) {
    return new cc.LoadClientData(size, max, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg);
};




