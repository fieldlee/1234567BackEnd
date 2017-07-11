/**
 * Created by depengli on 2017/7/5.
 */
'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var AdsSchma = new mongoose.Schema({
    title: String,
    type: String,
    value:String,
    path:String,
    startTime:Date,
    endTime:Date
});

AdsSchma.methods.add = function (callback) {
    this.save().then(callback);
};

AdsSchma.statics.getValid = function (callback) {
    this.find({"startTime":{"$lte":new Date()},"endTime":{"$gte":new Date()}}).then(callback);
};

AdsSchma.statics.getAdsById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

AdsSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

AdsSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('ads', AdsSchma);
