'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var ClassSchma = new mongoose.Schema({
    title: String,
    subtitle: String,
    price:String,
    start:Date,
    end:Date,
    telphone:String,
    lecture:String,
    status:String,
    images:{type:Array,default:[]},
    schedules:{type:Array,default:[]}
});

ClassSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ClassSchma.statics.getClassByStatus = function (callback) {
    this.find({"status":"1"}).then(callback);
};

ClassSchma.statics.getClassByID = function (ID,callback) {
    this.findOne({"_id":ID}).then(callback);
};

ClassSchma.statics.deleteById = function (ID,callback) {
    this.remove({"_id":ID}).then(callback);
};

ClassSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

ClassSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('class', ClassSchma);
