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

var ProviceSchma = new mongoose.Schema({
    id: String,
    order:Number,
    name: String
});

ProviceSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ProviceSchma.methods.update = function (callback) {
    this.save().then(callback);
};


ProviceSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};
ProviceSchma.statics.deleteAll = function (callback) {

    this.remove({}).then(callback);
};

ProviceSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};


module.exports = db.model('province', ProviceSchma);;
