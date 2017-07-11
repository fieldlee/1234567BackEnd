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

var NewsSchma = new mongoose.Schema({
    title: String,
    type: String,
    content:String,
    author:String,
    issueTime:Date,
    avator:String,
    images:Array
});

NewsSchma.methods.add = function (cb) {
    this.save().then(cb);
};

NewsSchma.statics.getNewsById = function (id,cb) {
    this.findOne({"_id":id}).then(cb);
};

NewsSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

NewsSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};

module.exports = db.model('news', NewsSchma);
