/**
 * Created by depengli on 2017/7/13.
 */
/**
 * Created by depengli on 2017/7/11.
 */
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

var FollowSchma = new mongoose.Schema({
    username: String,
    followusername:String
});

FollowSchma.methods.add = function (cb) {
    this.save().then(cb);
};

FollowSchma.statics.getMyfollows = function (id,cb) {
    this.find({"username":id}).then(cb);
};

FollowSchma.statics.getFollowForMy = function (id,cb) {
    this.find({"followusername":id}).then(cb);
};

FollowSchma.statics.getFollow = function (username,followusername,cb) {
    this.find({"username":username,"followusername":followusername}).then(cb);
};

FollowSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

FollowSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};

module.exports = db.model('follow', FollowSchma);
