/**
 * Created by depengli on 2017/7/5.
 */
/**
 * Created by depengli on 2017/7/5.
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

var ConfigPraiseSchma = new mongoose.Schema({
    type:String,
    tags:Array
});

ConfigPraiseSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ConfigPraiseSchma.statics.getConfigByType = function (type,callback) {
    this.findOne({"type":type}).then(callback);
};

ConfigPraiseSchma.statics.getConfigInfoById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

ConfigPraiseSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

ConfigPraiseSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('configPraise', ConfigPraiseSchma);
