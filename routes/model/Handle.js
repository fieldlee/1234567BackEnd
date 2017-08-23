'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var HandleSchma = new mongoose.Schema({
    name:String,
    time:{type:Date}
});

HandleSchma.methods.add = function (callback) {
    this.save().then(callback);
};

HandleSchma.methods.getHandleByName = function (name,callback) {
    this.findOne({"name":name}).then(callback);
};

module.exports = db.model('handle', HandleSchma);
