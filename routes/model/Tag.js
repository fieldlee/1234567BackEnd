'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var TagSchma = new mongoose.Schema({
    type:String,
    subType:String,
    name:String,
    number:{type:Number,default:0}
});

TagSchma.methods.add = function (callback) {
    this.save().then(callback);
};

TagSchma.statics.getAll = function (callback) {
    this.find({}).sort({"number":-1}).then(callback);
};

TagSchma.statics.getTagForType = function (type,callback) {
    this.find({"type":type}).sort({"number":-1}).then(callback);
};

TagSchma.statics.getTagForTypeAndSub = function (type,subtype,callback) {
    this.find({"type":type,"subType":subtype}).sort({"number":-1}).then(callback);
};

TagSchma.statics.getTagForNameTypeAndSub = function (name,type,subtype,callback) {
    this.findOne({"name":name,"type":type,"subType":subtype}).then(callback);
};

module.exports = db.model('tag', TagSchma);
