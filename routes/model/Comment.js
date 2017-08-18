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

var CommentSchma = new mongoose.Schema({
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

CommentSchma.methods.add = function (callback) {
    this.save().then(callback);
};

CommentSchma.statics.getCommentsById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

CommentSchma.statics.getCommentsByPId = function (id,callback) {
    this.find({"parentId":id}).sort({"issueTime":-1}).then(callback);
};

CommentSchma.statics.deleteCommentById = function (id,callback) {
    this.remove({"_id":id}).then(callback);
};

CommentSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

CommentSchma.statics.getCommentsByUsername = function (username,callback) {
    this.find({'author':username}).then(callback);
};

CommentSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('comment', CommentSchma);
