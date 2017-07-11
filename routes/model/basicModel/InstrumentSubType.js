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
var config = require('../../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var InstrumentSubTypeSchma = new mongoose.Schema({
    id: String,
    type: String,
    subType:String,
    configs:[]
});

InstrumentSubTypeSchma.methods.add = function (callback) {
    this.save().then(callback);
};

InstrumentSubTypeSchma.statics.deleteByType = function (type,callback) {
    this.find({"type":type}).then(callback);
};

InstrumentSubTypeSchma.statics.getAllByType = function (type,callback) {
    this.find({"type":type}).then(callback);
};

InstrumentSubTypeSchma.statics.getAllByTypeAndSubType = function (type,subtype,callback) {
    this.findOne({"type":type,"subType":subtype}).then(callback);
};

InstrumentSubTypeSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('instrumentSubType', InstrumentSubTypeSchma);
