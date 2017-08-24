'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var HandlerSchma = new mongoose.Schema({
    name:String,
    type:String,
    subType:String,
    time:{type:Date}
});

HandlerSchma.methods.add = function (callback) {
    this.save().then(callback);
};

HandlerSchma.statics.getHandleByName = function (name,callback) {
    this.findOne({"name":name}).then(callback);
};

module.exports = db.model('handler', HandlerSchma);
