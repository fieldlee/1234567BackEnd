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

var LanchAdsSchma = new mongoose.Schema({
    id: String,
    title: String,
    type: String,
    value:String,
    path:String,
    startTime:Date,
    endTime:Date
});

LanchAdsSchma.methods.add = function (cb) {
    this.save().then(cb);
};


LanchAdsSchma.statics.getValidOne =  function (cb) {
    this.findOne({"startTime":{"$lte":new Date()},"endTime":{"$gte":new Date()}}).then(cb);
};

LanchAdsSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

LanchAdsSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};

module.exports = db.model('lanuchads', LanchAdsSchma);
