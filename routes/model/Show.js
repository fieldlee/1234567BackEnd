'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var ShowSchma = new mongoose.Schema({
    sign: String,
    types:{type:Array,default:[]},
    image:String,
    author:String,
    avator:String,
    avatorPath:String,
    idcard:String,
    idno:String,
    tel:String,
    status:String,
    issueTime:Date,
    mainid:String,
    members:{type:Array,default:[]},
    support:{type:Number,default:0},
    attend:{type:Number,default:0}
});

ShowSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ShowSchma.statics.getShowByStatus = function (status,callback) {
    this.find({"status":status}).then(callback);
};

ShowSchma.statics.getShowById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

ShowSchma.statics.getShowByMainId = function (id,callback) {
    this.findOne({"mainid":id}).then(callback);
};

ShowSchma.statics.getShowByMember = function (id,callback) {
    this.find({ "members":{ $in:[id]}}).then(callback);
};

ShowSchma.statics.deleteById = function (id,callback) {
    this.remove({"_id":id}).then(callback);
};

ShowSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

ShowSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};

module.exports = db.model('show', ShowSchma);
