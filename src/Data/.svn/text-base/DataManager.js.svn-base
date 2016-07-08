/**
 * Created by nhnst on 10/27/15.
 */


(function (){

    var LS = cc.sys.localStorage;

    function DataManager(){

    }

    DataManager.instance = function(){
        if(!window.dataManager){
            window.dataManager = new DataManager();
        }
        return window.dataManager;
    };

    DataManager.prototype.saveData =  function (key,data) {
        LS.setItem(key,data);
    };

    DataManager.prototype.getData = function (key) {
        var r = LS.getItem(key);
        return r;
    };

    DataManager.prototype.removeData = function (key) {
        LS.removeItem(key);
    };

    DataManager.prototype.deletePhotoHistory = function(name){
        DataManager.instance().removeData(name);
    };

    DataManager.prototype.getPhotoHistory = function(name, index){
        var historys = DataManager.instance().getData(name);
        if(historys){
            historys = JSON.parse(historys);
            var _array = historys.array;
            return _array[index];
        }else{
            return null;
        }
    };

    DataManager.prototype.createPhotoHistory = function(type,obj,isAddKey){
        var photoMaxNum = DataManager.instance().getData("photoMaxNum");
        if(photoMaxNum){
            var num = parseInt(photoMaxNum);
            if(isAddKey){
                ++num;
                DataManager.instance().saveData("photoMaxNum",num);
            }
            var name = type.name + "_photo" + (num);
        }else{
            name = type.name + "_photo" + 0;
            DataManager.instance().saveData("photoMaxNum",0);
        }

        var historys = DataManager.instance().getData(name);
        if(historys){
            historys = JSON.parse(historys);
            historys.array.push(obj);
        }else{
            historys = {};
            var _array = [];
            _array.push(obj);
            historys.array =_array;
        }
        DataManager.instance().saveData(name, JSON.stringify(historys));

        return name;
    };


    DataManager.prototype.createHistory = function(type, obj){
        var history = {};
        var date = new Date();
        history.year = date.getFullYear();
        history.month = (date.getMonth() + 1) < 10?("0" + (date.getMonth() + 1)):(date.getMonth() + 1);
        history.day = date.getDate() < 10?("0" + date.getDate()):date.getDate();
        history.time = date.getTime();
        history.data = obj;

        var historys = DataManager.instance().getData(type.name + "_history");
        if(historys){
            historys = JSON.parse(historys);
            var _array = historys.array;
            if(_array.length>=5){
                var index = 0;
                var time = _array[0].time;
                for(var i = 1; i < 5; i++){
                    if(_array[i].time<time){
                        time = _array[i].time;
                        index = i;
                    }
                }
                _array[index] = history;
            }else{
                _array.push(history);
            }
        }else{
            historys = {};
            _array = [];
            _array.push(history);
            historys.array =_array;
        }
        DataManager.instance().saveData(type.name + "_history", JSON.stringify(historys));
    };

    DataManager.prototype.deleteHistory = function (type, time){
        var historys = DataManager.instance().getData(type.name + "_history");
        if(historys){
            historys = JSON.parse(historys);
            var _array = historys.array;
            var result = new ArrayList();
            for(var i = 0; i < _array.length; i++){
                if(time != _array[i].time){
                    result.add(_array[i]);
                }
            }
            if(result.isEmpty()){
                DataManager.instance().removeData(type.name + "_history");
            }else{
                historys.array = result.arr;
                DataManager.instance().saveData(type.name + "_history", JSON.stringify(historys));
            }
        }
    };

    DataManager.prototype.getHistory = function (type){
        var historys = DataManager.instance().getData(type.name + "_history");
        if(historys){
            historys = JSON.parse(historys);
            var _array = historys.array;
            var result = new ArrayList();
            for(var i = 0; i < _array.length; i++){
                var is = true;
                if(result.size()==0){
                    result.add(_array[i]);
                }else{
                    for(var j = 0; j < result.size();j++){
                        if(_array[i].time < result.get(j).time){
                            result.add(j, _array[i]);
                            is = false;
                            break;
                        }
                    }
                    if(is){
                        result.add(_array[i]);
                    }
                }
            }
            return result;
        }else{
            return null;
        }
    };

    DataManager.prototype.createArrayData = function(key,array){
        var historys = {};
        var _array = [];
        for (var i in array) {
            _array.push(array[i]);
        }
        historys.array =_array;
        DataManager.instance().saveData(key, JSON.stringify(historys));
    };

    DataManager.prototype.getArrayData = function(key){
        var historys = DataManager.instance().getData(key);
        if(historys){
            historys = JSON.parse(historys);
            return historys.array;
        }else{
            return null;
        }
    };

    window.DataManager = DataManager;

})();