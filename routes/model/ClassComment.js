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

var ClassCommentSchma = new mongoose.Schema({
    parentId:String,
    content:String,
    author:String,
    issueTime:Date,
    fromTime:String,
    avator:String,
    avatorPath:String,
    support:Number,
    subComments:Array
});

ClassCommentSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ClassCommentSchma.statics.getCommentsById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

ClassCommentSchma.statics.getCommentsByPId = function (id,callback) {
    this.find({"parentId":id}).sort({"issueTime":-1}).then(callback);
};

ClassCommentSchma.statics.deleteCommentById = function (id,callback) {
    this.remove({"_id":id}).then(callback);
};

ClassCommentSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

ClassCommentSchma.statics.getCommentsByUsername = function (username,callback) {
    this.find({'author':username}).then(callback);
};

ClassCommentSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('classcomment', ClassCommentSchma);
