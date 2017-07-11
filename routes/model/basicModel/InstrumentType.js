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

var InstrumentTypeSchma = new mongoose.Schema({
    id: String,
    type: String
});

InstrumentTypeSchma.methods.add = function (callback) {
    this.save().then(callback);
};


InstrumentTypeSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

InstrumentTypeSchma.statics.deleteAll = function (callback) {
    this.remove({}).then(callback);
};

InstrumentTypeSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('instrumentType', InstrumentTypeSchma);
