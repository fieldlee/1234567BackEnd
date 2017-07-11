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

var ForumAcitonSchma = new mongoose.Schema({
    id: String,
    title: String,
    type: String,
    value:String,
    path:String,
    startTime:Date,
    endTime:Date
});

ForumAcitonSchma.methods.add = function (cb) {
    this.save().then(cb);
};


ForumAcitonSchma.statics.getValid =  function (cb) {
    this.find({"startTime":{"$lte":new Date()},"endTime":{"$gte":new Date()}}).then(cb);
};

ForumAcitonSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

ForumAcitonSchma.statics.getActionById = function (id,cb) {
    this.findOne({"_id":id}).then(cb);
};

ForumAcitonSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};


module.exports = db.model('forumAction', ForumAcitonSchma);
