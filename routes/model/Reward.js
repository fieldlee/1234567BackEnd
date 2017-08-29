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

var RewardSchma = new mongoose.Schema({
    rewardname:String,
    rewardvalue:String,
    rewardid:String,
    rewardfrom:String,
    rewardto:String,
    rewardroom:String,
    rewardtime:{type:Date,default:new Date()}
});

RewardSchma.methods.add = function (cb) {
    this.save().then(cb);
};

RewardSchma.statics.getRewardByFrom = function (id,cb) {
    this.find({"rewardfrom":id}).then(cb);
};

RewardSchma.statics.getRewardByTo = function (id,cb) {
    this.find({"rewardto":id}).then(cb);
};

RewardSchma.statics.getRewardByRoom = function (id,cb) {
    this.find({"rewardroom":id}).then(cb);
};

module.exports = db.model('reward', RewardSchma);
