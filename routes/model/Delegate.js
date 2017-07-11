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

var DelegateSchma = new mongoose.Schema({
    name:String,
    address:String,
    email:String,
    provice:String,
    city:String,
    id:String
});

DelegateSchma.methods.add = function (callback) {
    this.save().then(callback);
};

DelegateSchma.statics.getDelegateById = function (id,callback) {
    this.findOne({"id":id}).then(callback);
};

DelegateSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

DelegateSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};


module.exports = db.model('delegate', DelegateSchma);
