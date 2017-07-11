
'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var ForumSchma = new mongoose.Schema({
    title: String,
    type: String,
    content:String,
    author:String,
    avator:String,
    issueTime:Date,
    images:Array
});

ForumSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ForumSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

ForumSchma.statics.getForumById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

ForumSchma.statics.deleteForumById = function (id,callback) {
    this.remove({"_id":id}).then(callback);
};

ForumSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('forum', ForumSchma);
