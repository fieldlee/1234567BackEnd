/**
 * Created by depengli on 2017/7/13.
 */
/**
 * Created by depengli on 2017/7/11.
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

var SignatureSchema = new mongoose.Schema({
    username: String,
    signatureTime:Date
});

SignatureSchema.methods.add = function (cb) {
    this.save().then(cb);
};

SignatureSchema.statics.getMySigns = function (username,cb) {
    this.find({"username":username}).then(cb);
};

SignatureSchema.statics.getTodayMySign = function (username,cb) {
    this.find({"username":username,"signatureTime":new Date()}).then(cb);
};


module.exports = db.model('signature', SignatureSchema);
