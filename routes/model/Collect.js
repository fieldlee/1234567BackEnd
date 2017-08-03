/**
 * Created by depengli on 2017/7/17.
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

var CollectSchma = new mongoose.Schema({
    username:String,
    avator:String,
    avatorPath:String,
    author:String,
    title:String,
    fromTime:String,
    collectTime:{type:Date,default:new Date()},
    forumId:String
});

CollectSchma.methods.add = function (callback) {
    this.save().then(callback);
};

CollectSchma.statics.getCollectById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

CollectSchma.statics.getCollectByIdUsername = function (id,username,callback) {
    this.findOne({"forumId":id,"username":username}).then(callback);
};

CollectSchma.statics.getCollectsByUsername = function (username,callback) {
    this.find({"username":username}).sort({"collectTime":-1}).then(callback);
};

module.exports = db.model('collect', CollectSchma);
