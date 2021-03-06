
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
    duration:String,
    images:Array,
    videos:Array,
    topup:{type:Boolean,default:false},
    comment:Number,
    read:Number,
    support:Number,
    collect:{type:Number,default:0}
});

ForumSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ForumSchma.statics.getTop = function (type,callback) {
    this.find({"type":type,"topup":true}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getTypes = function (type,callback) {
    this.find({"type":type,"topup":{"$ne":true}}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getRecentForums = function (callback) {
    this.find({}).sort({"issueTime":-1}).limit(15).then(callback);
};

ForumSchma.statics.getForumsByTime = function (time,subtype,callback) {
    this.find({"issueTime":{$gt:time},"subType":subtype}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getHotForums = function (callback) {
    this.find({}).sort({"read":-1}).limit(15).then(callback);
};

ForumSchma.statics.getTopSubType = function (type,subtype,callback) {
    if(subtype=="其他"){
        switch (type){
            case "键盘乐器":
                this.find({"type":type,"subType":{$nin:["钢琴"]},"topup":true}).sort({"issueTime":-1}).then(callback);
                break;
            case "管式乐器":
                this.find({"type":type,"subType":{$nin:["萨克斯"]},"topup":true}).sort({"issueTime":-1}).then(callback);
                break;
            case "拉弦乐器":
                this.find({"type":type,"subType":{$nin:["小提琴","吉他"]},"topup":true}).sort({"issueTime":-1}).then(callback);
                break;
            case "弹拨乐器":
                this.find({"type":type,"subType":{$nin:["琵琶"]},"topup":true}).sort({"issueTime":-1}).then(callback);
                break;
            default:
                this.find({"type":type,"subType":subtype,"topup":true}).sort({"issueTime":-1}).then(callback);
        }
    }else{
        this.find({"type":type,"subType":subtype,"topup":true}).sort({"issueTime":-1}).then(callback);
    }

};

ForumSchma.statics.getTypeAndSubType = function (type,subtype,callback) {
    if(subtype=="其他"){
        switch (type){
            case "键盘乐器":
                this.find({"type":type,"subType":{$nin:["钢琴"]},"topup":{"$ne":true}}).sort({"issueTime":-1}).then(callback);
                break;
            case "管式乐器":
                this.find({"type":type,"subType":{$nin:["萨克斯"]},"topup":{"$ne":true}}).sort({"issueTime":-1}).then(callback);
                break;
            case "拉弦乐器":
                this.find({"type":type,"subType":{$nin:["小提琴","吉他"]},"topup":{"$ne":true}}).sort({"issueTime":-1}).then(callback);
                break;
            case "弹拨乐器":
                this.find({"type":type,"subType":{$nin:["琵琶"]},"topup":{"$ne":true}}).sort({"issueTime":-1}).then(callback);
                break;
                //管式乐器  //萨克斯
                //拉弦乐器  小提琴","吉他
                //弹拨乐器  琵琶
                //
            default:
                this.find({"type":type,"subType":subtype,"topup":{"$ne":true}}).sort({"issueTime":-1}).then(callback);
        }
    }else{
        this.find({"type":type,"subType":subtype,"topup":{"$ne":true}}).sort({"issueTime":-1}).then(callback);
    }

};

ForumSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

ForumSchma.statics.getAllByType = function (subtype,callback) {
    this.find({"subType":subtype}).then(callback);
};

ForumSchma.statics.getForumsByIssue = function (issueTime,subtype,callback) {
    this.find({"issueTime":{$gte:issueTime},"subType":subtype}).then(callback);
};

ForumSchma.statics.getByUsername = function (username,callback) {
    this.find({"author":username}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getByProduct = function (id,callback) {
    this.find({"product":id}).sort({"issueTime":-1}).then(callback);
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


ForumSchma.statics.getTopSearchType = function (type,key,callback) {
    this.find({"type":type,"topup":true,$or: [ {"title":{'$regex': key}}, {"content":{'$regex': key}} ]}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getTopSearchTypeAndSubType = function (type,subtype,key,callback) {
    var subCondition = subtype;
    if(subtype=="其他") {
        switch (type) {
            case "键盘乐器":
                subCondition = {$nin: ["钢琴"]};

                break;
            case "管式乐器":
                subCondition = {$nin: ["萨克斯"]};

                break;
            case "拉弦乐器":
                subCondition = {$nin: ["小提琴", "吉他"]};

                break;
            case "弹拨乐器":
                subCondition = {$nin: ["琵琶"]};
                break;
            default:
                subCondition = subtype;

        }
    }

    this.find({"type":type,"subType":subCondition,"topup":true,$or: [ {"title":{'$regex': key}}, {"content":{'$regex': key}} ]}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.searchForumsByType = function (type,key,callback) {
    this.find({"type":type, "topup":{"$ne":true}, $or: [ {"title":{'$regex': key}}, {"content":{'$regex': key}} ]}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.searchForumsByTypeAndSubType = function (type,subtype,key,callback) {
    var subCondition = subtype;
    if(subtype=="其他") {
        switch (type) {
            case "键盘乐器":
                subCondition = {$nin: ["钢琴"]};

                break;
            case "管式乐器":
                subCondition = {$nin: ["萨克斯"]};

                break;
            case "拉弦乐器":
                subCondition = {$nin: ["小提琴", "吉他"]};

                break;
            case "弹拨乐器":
                subCondition = {$nin: ["琵琶"]};
                break;
            default:
                subCondition = subtype;

        }
    }
    this.find({"type":type,"subType":subCondition, "topup":{"$ne":true}, $or: [ {"title":{'$regex': key}}, {"content":{'$regex': key}} ]}).sort({"issueTime":-1}).then(callback);
};

ForumSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};


// For handle image url

ForumSchma.statics.getNeedDownload = function (callback) {
    this.find({ images : { $size : 0 },content:{'$regex': "<img"}}).then(callback);
};


module.exports = db.model('forum', ForumSchma);
