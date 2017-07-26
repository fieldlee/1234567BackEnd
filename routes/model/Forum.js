
'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var ForumSchma = new mongoose.Schema({
    title: String,
    brand:String,
    product:String,
    type: String,
    subType:String,
    tags:Array,
    content:String,
    author:String,
    avator:String,
    avatorPath:String,
    issueTime:Date,
    fromTime:String,
    images:Array,
    videos:Array,
    comment:Number,
    read:Number,
    support:Number
});

ForumSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ForumSchma.statics.getTypes = function (type,callback) {
    this.find({"type":type}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getRecentForums = function (callback) {
    this.find({}).sort({"issueTime":-1}).limit(15).then(callback);
};

ForumSchma.statics.getTypeAndSubType = function (type,subtype,callback) {
    if(subtype=="其他"){
        switch (type){
            case "键盘乐器":
                this.find({"type":type,"subType":{$nin:["钢琴"]}}).sort({"issueTime":-1}).then(callback);
                break;
            case "管式乐器":
                this.find({"type":type,"subType":{$nin:["萨克斯"]}}).sort({"issueTime":-1}).then(callback);
                break;
            case "拉弦乐器":
                this.find({"type":type,"subType":{$nin:["小提琴","吉他"]}}).sort({"issueTime":-1}).then(callback);
                break;
            case "弹拨乐器":
                this.find({"type":type,"subType":{$nin:["琵琶"]}}).sort({"issueTime":-1}).then(callback);
                break;
                //管式乐器  //萨克斯
                //拉弦乐器  小提琴","吉他
                //弹拨乐器  琵琶
                //
            default:
                this.find({"type":type,"subType":subtype}).sort({"issueTime":-1}).then(callback);
        }
    }else{
        this.find({"type":type,"subType":subtype}).sort({"issueTime":-1}).then(callback);
    }

};

ForumSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

ForumSchma.statics.getByUsername = function (username,callback) {
    this.find({"author":username}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getForumById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

ForumSchma.statics.deleteForumById = function (id,callback) {
    this.remove({"_id":id}).then(callback);
};


ForumSchma.statics.searchForums = function (key,callback) {
    this.find({ $or: [ {"title":{'$regex': key}}, {"content":{'$regex': key}} ]}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('forum', ForumSchma);
