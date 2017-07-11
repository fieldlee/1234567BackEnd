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

var ConfigSchma = new mongoose.Schema({
    id:String,
    name:String,
    type:String,
    subType:String,
    configItems:Array
});

ConfigSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ConfigSchma.statics.getConfigInfoById = function (id,callback) {
    this.findOne({"id":id}).then(callback);
};

ConfigSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};
ConfigSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('configinfo', ConfigSchma);
