/**
 * Created by nhnst on 11/5/15.
 */
var ScrollNum = cc.Node.extend({
    listView:null,
    selectNum:null,
    contentSize:null,
    selWidth:null,
    selWidth1:null,
    minNum:null,
    maxNum:null,
    numViewArray:null,
    isStart:null,
    type:null,
    /*
    *
    * type  default: RR  1: SorilegeNumber
    * */
    ctor:function (min,max,defaultNum,type) {
        this._super();

        this.init(min,max,defaultNum,type);

        this.listView = new ccui.ListView();
        // set list view ex direction
        this.listView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.listView.setAnchorPoint(cc.p(0.5,0.5));
        this.listView.setTouchEnabled(true);
        this.listView.setBounceEnabled(false);
        if(type == 1)
            this.listView.setBackGroundColor(cc.color(111,205,192,255));
        else
            this.listView.setBackGroundColor(cc.color.WHITE);
        this.listView.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.listView.setContentSize(this.contentSize);
        this.listView.addEventListener(this.selectedItemEvent, this);

        for (var i = this.minNum; i < this.maxNum; ++i) {
            this.listView.pushBackDefaultItem();
        }

        for (i = this.minNum; i < this.maxNum; ++i) {
            var custom_button = new ccui.Button();
            custom_button.setName("TextButton");
            custom_button.setTouchEnabled(false);
            custom_button.setScale9Enabled(true);
            var _w = this.selWidth;
            if(i >= 100)
                _w = this.selWidth + this.selWidth1;
            else if(i >= 10)
                _w = this.selWidth + this.selWidth1/2;
            custom_button.setContentSize(cc.size(_w, this.contentSize.height));

            var custom_num = new ccui.Text();
            custom_num.setTag(this.TAG_NUMBER);
            custom_num.attr({
                textAlign: cc.TEXT_ALIGNMENT_CENTER,
                string: i.toString(),
                x: custom_button.width / 2,
                y: custom_button.height / 2
            });
            if(i == this.selectNum)
                this.setBigFont(custom_num);
            else
                this.setSmailFont(custom_num);

            if(i == this.minNum || i == this.minNum + 1 || i == this.maxNum - 1 || i == this.maxNum - 2)
                custom_num.setString("");
            this.numViewArray.push(custom_num);
            var custom_item = new ccui.Layout();
            custom_item.setContentSize(cc.size(_w, this.contentSize.height));
            custom_button.x = custom_item.width / 2;
            custom_button.y = custom_item.height / 2;
            custom_button.addChild(custom_num);
            custom_item.addChild(custom_button);

            this.listView.pushBackCustomItem(custom_item);

        }
        this.listView.setVisible(false);
        this.addChild(this.listView);

        var resLeft = GlobalRes.arrow_left;
        var resRight = GlobalRes.arrow_right;
        if(type == 1){
            resLeft = GlobalRes.arrow_left2;
            resRight = GlobalRes.arrow_right2;
        }
        var Btn_Left = new ccui.Button(resLeft);
        Btn_Left.setPosition(-this.contentSize.width/2 - 10,3);
        Btn_Left.setName("Btn_Left");
        Btn_Left.addTouchEventListener(this.touchEvent, this);
        Btn_Left.setTouchEnabled(false);
        this.addChild(Btn_Left);

        var Btn_Right = new ccui.Button(resRight);
        Btn_Right.setPosition(this.contentSize.width/2 + 10,3);
        Btn_Right.setName("Btn_Right");
        Btn_Right.addTouchEventListener(this.touchEvent, this);
        Btn_Right.setTouchEnabled(false);
        this.addChild(Btn_Right);

        this.schedule(this.setTimer,0);

        return true;
    },

    init:function (min,max,dNum,type) {
        this.isStart = true;
        this.selectNum = dNum;
        if(type == 1){
            this.selWidth1 = this.selWidth = 80.0;
        }else{
            this.selWidth1 = this.selWidth = 90.0;
        }
        this.contentSize = cc.size(this.selWidth*5, 100.0);
        this.type = type;
        this.minNum = min - 2;
        this.maxNum = max + 2;
        this.numViewArray = [];
    },

    setTimer:function () {

        if(this.isStart)
            this.seVisibleListView();
        else
            this.setSelectPersonNumber(this.listView,this.numViewArray);
    },

    seVisibleListView:function(){
        var tempSel = 0;
        var dis = 0;
        for (var i in this.numViewArray) {
            if(i > 2) {
                if (tempSel == this.selectNum - this.minNum - 2)break;
                tempSel++;
                dis += this.numViewArray[i].getParent().getContentSize().width;
            }
        }
        this.listView.setContainerPosition(-dis,0);
        this.listView.setVisible(true);
        this.isStart = false;
    },

    setSelectPersonNumber:function(listView,numArray){
        if(listView == null) return -1;

        this.setFontColor(listView,numArray);

        if(!listView.isScroll())
            return this.autoScrollToNumber(listView,numArray);


        return -1;
    },

    selectedItemEvent: function (sender, type) {
        switch (type) {
            case ccui.ListView.EVENT_SELECTED_ITEM:
                //cc.log("select child index = " + sender.getCurSelectedIndex());
                break;
            case ccui.ListView.ON_SELECTED_ITEM_END:
                //cc.log("select child index end= " + sender.getCurSelectedIndex());
                //sender.jumpToRight();
                //sender.scrollToPercentHorizontal((100/50)*28,1.0,true);
                break;
            default:
                break;
        }
    },

    setFontColor:function(listView,numArray){
        var minWidth = this.numViewArray[2].getParent().getContentSize().width;
        var maxWidth = this.numViewArray[numArray.length - 2].getParent().getContentSize().width;
        var mdis = 0;
        for (var i in numArray) {
            if(i > 2 && i < numArray.length - 2) {
                mdis += this.numViewArray[i].getParent().getContentSize().width;
            }
        }

        if(listView.getContainerPosition().x < minWidth/2 &&
            listView.getContainerPosition().x > -(mdis + maxWidth/2)){
            var num = 0;
            var cuWidth = this.selWidth;
            if(this.selectNum >= 100)
                cuWidth = this.selWidth + this.selWidth1;
            else if(this.selectNum >= 10)
                cuWidth = this.selWidth + this.selWidth1/2;
            var dis = listView.getContainerPosition().x - cuWidth/2;
            for (var i in numArray) {
                if(i > 2) {
                    dis += this.numViewArray[i].getParent().getContentSize().width;
                    if (dis >= 0) {
                        break;
                    } else
                        num++;
                }
            }

            var num1 = num + 2;
            for(var i = 0; i <numArray.length; i++){
                if(num1 == i)
                    this.setBigFont(numArray[i]);
                else
                    this.setSmailFont(numArray[i]);
            }

        }

        //if(listView.getContainerPosition().x < this.selWidth/2 &&
        //    listView.getContainerPosition().x > -(this.selWidth*(this.maxNum - this.minNum - 4)-this.selWidth/2)){
        //    var kk = listView.getContainerPosition().x - this.selWidth/2;
        //    var num1 = parseInt(Math.abs(kk/this.selWidth)) + 2;
        //    for(var i = 0; i <numArray.length; i++){
        //        if(num1 == i)
        //            this.setBigFont(numArray[i]);
        //        else
        //            this.setSmailFont(numArray[i]);
        //    }
        //}

    },

    autoScrollToNumber:function(listView,numArray){
        var num = 0;
        var isplus = 0;
        var dis = listView.getContainerPosition().x;
        var sWidth = this.selWidth;
        for (var i in numArray) {
            if(i > 2) {
                dis += this.numViewArray[i].getParent().getContentSize().width;
                if (dis >= 0) {
                    isplus = parseInt(Math.abs(dis - this.numViewArray[i].getParent().getContentSize().width));
                    sWidth = this.numViewArray[i].getParent().getContentSize().width;
                    break;
                } else
                    num++;
            }
        }


        //var num = parseInt(Math.abs(listView.getContainerPosition().x/this.selWidth));
        //var isplus = parseInt(Math.abs(listView.getContainerPosition().x % this.selWidth));
        var sLine = 5 + this.minNum;
        if(isplus > sLine && isplus < sWidth/2){
            this.setNumber(this.listView,num,0.5);
        }else if(isplus >= sWidth/2){
            num = num + 1;
            if(isplus < sWidth - sLine){
                this.setNumber(this.listView,num,0.5);
            }
        }
        return (num + this.minNum + 2);
    },

    setBigFont:function(text){
        if(text.getFontName() === GAME_FONT.PRO_W6) return;
        if(this.type == 1) {
            text.setColor(cc.color(255,244,189,255));

        }else{
            text.setColor(cc.color(107,205,194,255));
        }
        text.setFontSize(60);
        text.setFontName(GAME_FONT.PRO_W6);
        this.selectNum = parseInt(text.getString());

    },

    setSmailFont:function(text){
        if(text.getFontName() === GAME_FONT.PRO_W3) return;
        if(this.type == 1){
            text.setColor(cc.color(205,230,190,255));
        }else{
            text.setColor(cc.color(213,227,228,255));
        }
        text.setFontSize(50);
        text.setFontName(GAME_FONT.PRO_W3);
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.log("touchEvent " + sender.getName());
                if(sender.getName() == "Btn_Left"){
                    if(this.selectNum - 2 == this.minNum)return;
                    this.selectNum--;
                }else if(sender.getName() == "Btn_Right"){
                    if(this.selectNum == this.maxNum - 3)return;
                    this.selectNum++;
                }
                var num = this.selectNum - 2 - this.minNum;
                this.setNumber(this.listView,num,0.2);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;
            default:
                break;
        }
    },

    getNumber:function () {
        return this.selectNum;
    },

    setNumber:function (list,num,dTime) {
        if(arguments.length == 3){
            var tempSel = 0;
            var dis = 0;
            for (var i in this.numViewArray) {
                if(i > 2 && i < this.numViewArray.length - 2){
                    if(tempSel == num)break;
                    tempSel++;
                    dis += this.numViewArray[i].getParent().getContentSize().width;
                    //cc.log("x::"+this.numViewArray[i].getParent().getContentSize().width+"::"+i);
                }
            }
            if(this.selectNum >= 100)
                dis -= this.selWidth1/2;
            else if(this.selectNum >= 10)
                dis -= this.selWidth1/4;
            list.scrollToWidthHorizontal(dis,dTime,true);

            //list.scrollToPercentHorizontal((100/(this.maxNum - 5 - this.minNum))*(num),dTime,true);
        }else{
            var tempSel = 0;
            var dis = 0;
            for (var i in this.numViewArray) {
                if(i > 2 && i < this.numViewArray.length - 2){
                    if(tempSel == arguments[0])break;
                    tempSel++;
                    dis += this.numViewArray[i].getParent().getContentSize().width;
                    //cc.log("x::"+this.numViewArray[i].getParent().getContentSize().width+"::"+i);
                }
            }
            if(this.selectNum >= 100)
                dis -= this.selWidth1/2;
            else if(this.selectNum >= 10)
                dis -= this.selWidth1/4;
            this.listView.jumpToPercentHorizontal(dis);
        }
    }

});