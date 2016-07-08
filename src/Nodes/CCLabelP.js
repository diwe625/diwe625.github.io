/**
 * Created by nhnst on 12/2/15.
 */

cc.LabelP = cc.ControlButton.extend({
    _domInputSprite: null,

    _text: "",
    _textColor: null,
    _maxLength: 50,
    _adjustHeight: 18,

    _edTxt: null,
    _edFontSize: 14,
    _edFontName: "Arial",

    _tooltip: false,
    _className: "LabelP",

    /**
     * constructor of cc.LabelP
     */
    ctor: function (txt,fSize,fColor,fName,alignment) {
        cc.ControlButton.prototype.ctor.call(this);
        this._edFontSize = fSize;
        this._textColor = cc.color.WHITE;
        if(txt){}else{txt = "";}
        var size = cc.size((txt.length)*this._edFontSize,fSize);
        this.setContentSize(size);
        var tmpDOMSprite = this._domInputSprite = new cc.Sprite();
        tmpDOMSprite.draw = function () {};  //redefine draw function
        this.addChild(tmpDOMSprite,-100);
        var selfPointer = this;
        var tmpEdTxt = this._edTxt = cc.newElement("p");
        tmpEdTxt.innerText = txt;
        if(alignment == cc.TEXT_ALIGNMENT_LEFT)
            tmpEdTxt.align = "left";//justify
        else if(alignment == cc.TEXT_ALIGNMENT_RIGHT)
            tmpEdTxt.align = "right";//justify
        else
            tmpEdTxt.align = "center";
        tmpEdTxt.style.fontSize = this._edFontSize + "px";
        tmpEdTxt.style.color = "#000000";
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = "transparent";
        //tmpEdTxt.style.paddingLeft = "10px";
        tmpEdTxt.style.width = "100%";
        tmpEdTxt.style.height = "100%";
        tmpEdTxt.style.active = 0;
        //tmpEdTxt.style.outline = "medium";
        tmpEdTxt.style.padding = "0px";
        tmpEdTxt.style.marginLeft = "0px";
        tmpEdTxt.style.marginRight = "0px";
        tmpEdTxt.style.marginTop = -(fSize/4)+"px";
        tmpEdTxt.style.marginBottom = "0px";

        if(fColor){
            this._textColor = fColor;
            this._edTxt.style.color = cc.colorToHex(fColor);
        }
        if(fName){
            this._edFontName = fName;
            this._setFontToLavelP();
        }


        cc.DOM.convert(tmpDOMSprite);
        tmpDOMSprite.dom.appendChild(tmpEdTxt);
        tmpDOMSprite.dom.showTooltipDiv = false;
        tmpDOMSprite.dom.style.width = (size.width) + "px";
        tmpDOMSprite.dom.style.height = (size.height) + "px";

        //this._domInputSprite.dom.style.borderWidth = "1px";
        //this._domInputSprite.dom.style.borderStyle = "solid";
        //this._domInputSprite.dom.style.borderRadius = "8px";
        tmpDOMSprite.canvas.remove();
    },

    /**
     * Set the font.
     * @param {String} fontName  The font name.
     * @param {Number} fontSize  The font size.
     */
    setFont: function (fontName, fontSize) {
        this._edFontSize = fontSize;
        this._edFontName = fontName;
        this._setFontToLavelP();
    },

    _setFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        if (res) {
            this._edFontSize = parseInt(res[1]);
            this._edFontName = res[2];
            this._setFontToLavelP();
        }
    },

    /**
     * set fontName
     * @param {String} fontName
     */
    setFontName: function (fontName) {
        this._edFontName = fontName;
        this._setFontToLavelP();
    },

    /**
     * set fontSize
     * @param {Number} fontSize
     */
    setFontSize: function (fontSize) {
        this._edFontSize = fontSize;
        this.setContentSize(cc.size((this._edTxt.innerText.length + 1)*this._edFontSize,this._edFontSize));
        this._setFontToLavelP();
    },

    getFontSize: function () {
        return this._edFontSize;
    },

    _setFontToLavelP: function () {
        this._edTxt.style.fontFamily = this._edFontName;
        this._edTxt.style.fontSize = this._edFontSize + "px";
    },

    /**
     *  Set the text entered in the lavel.
     * @deprecated
     * @param {string} text The given text.
     */
    setText: function (text) {
        cc.log("Please use the setString");
        this.setString(text);
    },

    /**
     *  Set the text entered in the lavel.
     * @param {string} text The given text.
     */
    setString: function (text) {
        this._edTxt.innerText = text;
        this._edTxt.style.color = cc.colorToHex(this._textColor);
    },

    /**
     * Set the font color of the widget's text.
     * @param {cc.Color} color
     */
    setFontColor: function (color) {
        this._textColor = color;
        this._edTxt.style.color = cc.colorToHex(color);
    },

    /**
     * Gets the maximum input length of the lavel.
     * @return {Number} Maximum input length.
     */
    getMaxLength: function () {
        return this._maxLength;
    },

    /**
     * Gets the  input string of the lavel.
     * @deprecated
     * @return {string}
     */
    getText: function () {
        cc.log("Please use the getString");
        return this._edTxt.innerText;
    },

    /**
     * Gets the  input string of the lavel.
     * @return {string}
     */
    getString: function () {
        return this._edTxt.innerText;
    },

    setTextWidth : function(width){
        var is = false;
        var dd = this.getContentSize().width;
        while(this.getContentSize().width > width){
            //this.setString(this.getString().substring(0, this.getString().length-2));
            is = true;
            break;
        }
        if(is){
            var lang = parseInt(width/this._edFontSize);
            this.setString(this.getString().substring(0, lang)+"...");
        }
    }

});

var _p = cc.LabelP.prototype;

// Extended properties
/** @expose */
_p.font;
cc.defineGetterSetter(_p, "font", null, _p._setFont);
/** @expose */
_p.fontName;
cc.defineGetterSetter(_p, "fontName", null, _p.setFontName);
/** @expose */
_p.fontSize;
cc.defineGetterSetter(_p, "fontSize", _p.getFontSize, _p.setFontSize);
/** @expose */
_p.fontColor;
cc.defineGetterSetter(_p, "fontColor", null, _p.setFontColor);
/** @expose */
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);;

_p = null;

/**
 * get the rect of a node in world coordinate frame
 * @function
 * @param {cc.Node} node
 * @return {cc.Rect}
 */
cc.LabelP.getRect = function (node) {
    var contentSize = node.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    return cc.rectApplyAffineTransform(rect, node.getNodeToWorldTransform());
};

/**
 * create a Lavel with size and background-color or
 * @deprecated since v3.0, please use new cc.LabelP(size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) instead
 * @return {cc.LabelP}
 */
cc.LabelP.create = function (size,fSize,fColor,fName,alignment) {
    return new cc.LabelP(size,fSize,fColor,fName,alignment);
};




