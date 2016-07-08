/**
 * Created by dyfox on 15-6-2.
 */

(function() {
    'use strict';

    function HashMap() {

        this.keys = [];
        this.data = {};

        this.put = function(key, value) {
            if(this.data[key] == null){
                this.keys.push(key);
            }
            this.data[key] = value;
        };

        this.get = function(key) {
            return this.data[key];
        };

        this.remove = function(key) {
            this.keys.remove(key);
            var result = this.data[key];
            this.data[key] = null;
            return result;
        };

        this.entrySet = function() {
            var len = this.keys.length;
            var entry = new Array(len);
            for (var i = 0; i < len; i++) {
                entry[i] = {
                    key : this.keys[i],
                    value : this.data[this.keys[i]]
                };
            }
            return entry;
        };

        this.keySet = function(){
            return this.keys;
        };

        this.dataSet = function(){
            var len = this.keys.length;
            var entry = new Array(len);
            for (var i = 0; i < len; i++) {
                entry[i] = this.data[this.keys[i]]
            }
            return entry;
        };

        this.isEmpty = function() {
            return this.keys.length == 0;
        };

        this.size = function(){
            return this.keys.length;
        };

        this.clear = function(){
            this.keys = [];
            this.data = {};
        };

        this.toString = function(){
            var s = "{";
            for(var i=0;i<this.keys.length;i++,s+=','){
                s += this.keys[i] + "=" + this.data[this.keys[i]];
            }
            s+="}";
            return s;
        };

    }

    window.HashMap = HashMap;


    function ArrayList(){
        this.arr = [];

        this.size = function () {
            return this.arr.length;
        };

        this.add = function () {
            if (arguments.length == 1) {
                this.arr.push(arguments[0]);
            } else if (arguments.length >= 2) {
                var deleteItem = this.arr[arguments[0]];
                this.arr.splice(arguments[0], 1, arguments[1], deleteItem)
            }
            return this;
        };

        this.get = function (index) {
            return this.arr[index];
        };

        this.removeIndex = function (index) {
            var result = this.arr[index];
            this.arr.splice(index, 1);
            return result;
        };

        this.removeObj = function (obj) {
            var result = this.indexOf(obj);
            this.removeIndex(this.indexOf(obj));
            return result;
        };

        this.indexOf = function (obj) {
            for (var i = 0; i < this.arr.length; i++) {
                if (this.arr[i] === obj) {
                    return i;
                }
            }
            return -1;
        };

        this.isEmpty = function () {
            return this.arr.length == 0;
        };

        this.clear = function () {
            this.arr = [];
        };

        this.contains = function (obj) {
            return this.indexOf(obj) != -1;
        };

        this.addRange = function(items){
            if(items.constructor == Array){
                this.arr = this.arr.concat(items);
            }else if(items.constructor == ArrayList){
                this.arr = this.arr.concat(items.arr);
            }
        };

        if(arguments.length == 1){
            var list = arguments[0];
            for(var i = 0; i<list.size(); i++){
                this.add(list.get(i));
            }
        }

    }

    window.ArrayList = ArrayList;

    function Queue(){
        if(arguments.length == 1){
            if(arguments[0].constructor == ArrayList){
                this.arrList = new ArrayList(arguments[0]);
            }
        }else if(arguments.length == 0){
            this.arrList = new ArrayList();
        }

        this.clear = function () {
            this.arrList.clear();
        };

        this.contains = function (obj) {
            return this.arrList(obj);
        };

        this.dequeue = function () {
            return this.arrList.removeIndex(0);
        };

        this.enqueue = function (obj) {
            this.arrList.add(this.arrList.size(), obj);
        };

        this.peek = function () {
            return this.arrList.get(0);
        };

        this.size = function () {
            return this.arrList.size();
        };

    }

    window.Queue = Queue;

})();

