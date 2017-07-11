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

var ImageSchma = new mongoose.Schema({
    originName:String,
    path:String,
    size:String
});

ImageSchma.methods.add = function (callback) {
    this.save().then(callback);
};


ImageSchma.statics.getImageById = function (id,callback) {
    this.find({"_id":id}).then(callback);
};

ImageSchma.statics.getImageByPath = function (path,callback) {
    this.find({"path":path}).then(callback);
};

ImageSchma.statics.removeImageByPath = function (path,callback) {
    this.remove({"path":path}).then(callback);
};

ImageSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

ImageSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};


module.exports = db.model('image', ImageSchma);
