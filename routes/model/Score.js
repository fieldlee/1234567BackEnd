/**
 * Created by depengli on 2017/7/5.
 */
/**
 * Created by depengli on 2017/7/5.
 */
'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var ScoreSchma = new mongoose.Schema({
    title: String,
    type: String,
    region:String,
    mp3:Object,
    files:{type:Array,default:[]},
    difficult:String,
    bpt:String,
    author:String,
    avator:String,
    avatorPath:String,
    style:String,
    issueTime:Date,
    fromTime:String,
    comment:{type:Number,default:0},
    read:{type:Number,default:0},
    support:{type:Number,default:0}
});

ScoreSchma.methods.add = function (cb) {
    this.save().then(cb);
};

ScoreSchma.statics.getScoreById = function (id,cb) {
    this.findOne({"_id":id}).then(cb);
};

ScoreSchma.statics.deleteScoreById = function (id,cb) {
    this.remove({"_id":id}).then(cb);
};

ScoreSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

ScoreSchma.statics.getScoresByType = function (type,cb) {
    this.find({'type':type}).sort({"issueTime":-1}).then(cb);
};

ScoreSchma.statics.getScoresByTime = function (type,time,cb) {
    this.find({'type':type,"issueTime":{$gt:time}}).sort({"issueTime":-1}).then(cb);
};

ScoreSchma.statics.getHotScoresByType = function (type,cb) {
    this.find({'type':type}).sort({"read":1}).then(cb);
};

ScoreSchma.statics.getScoresByTypeAndKey = function (type,key,cb) {
    this.find({'type':type,"title":{'$regex': key}}).sort({"issueTime":-1}).then(cb);
};

ScoreSchma.statics.getScoresByTypeAndSelect = function (type,lvl,region,style,cb) {
    var obj = {'type':type};
    if (lvl){
        obj.difficult = lvl;
    }
    if(region){
        obj.region = region;
    }
    if(style){
        obj.style = style;
    }
    console.log(obj);
    this.find(obj).sort({"issueTime":-1}).then(cb);
};

ScoreSchma.statics.getScoresByUserName = function (username,cb) {
    this.find({'author':username}).then(cb);
};

ScoreSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};

module.exports = db.model('score', ScoreSchma);
