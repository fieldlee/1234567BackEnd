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

var ScoreCommentSchma = new mongoose.Schema({
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

ScoreCommentSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ScoreCommentSchma.statics.getCommentsById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

ScoreCommentSchma.statics.getCommentsByPId = function (id,callback) {
    this.find({"parentId":id}).sort({"issueTime":-1}).then(callback);
};

ScoreCommentSchma.statics.deleteCommentById = function (id,callback) {
    this.remove({"_id":id}).then(callback);
};

ScoreCommentSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

ScoreCommentSchma.statics.getCommentsByUsername = function (username,callback) {
    this.find({'author':username}).then(callback);
};

ScoreCommentSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('scorecomment', ScoreCommentSchma);
