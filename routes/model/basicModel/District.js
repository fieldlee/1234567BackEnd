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

var DistrictSchma = new mongoose.Schema({
    id: String,
    order:Number,
    provice:String,
    city:String,
    district: String
});

DistrictSchma.methods.add = function (callback) {
    this.save().then(callback);
};

DistrictSchma.statics.getDistrict = function (provice,city,callback) {
    this.find({"provice":provice,"city":city}).then(callback);
};

DistrictSchma.statics.deleteDistrict = function (provice,city,callback) {
    this.remove({"provice":provice,"city":city}).then(callback);
};

DistrictSchma.statics.getItemsByConditions = function (condition,callback) {
    this.find(condition).then(callback);
};


module.exports = db.model('district', DistrictSchma);
