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

var CitySchma = new mongoose.Schema({
    id: String,
    order:Number,
    provice:String,
    city: String
});

CitySchma.methods.add = function (callback) {
    this.save().then(callback);
};

CitySchma.methods.update = function (callback) {
    this.save().then(callback);
};

CitySchma.statics.getCity = function (province,callback) {
    this.find({"provice":province}).then(callback);
};

CitySchma.statics.deleteCity = function (province,callback) {
    this.remove({"provice":province}).then(callback);
};

CitySchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('city', CitySchma);
