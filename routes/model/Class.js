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
    content:String,
    record:Boolean,
    start:Date,
    end:Date,
    author:String,
    telphone:String,
    lecture:String,
    lecturename:String,
    certifyfile:String,
    certifyfilename:String,
    idcard:String,
    idno:String,
    status:String,
    mainid:String,
    members:{type:Array,default:[]},
    materials:{type:Array,default:[]},
    images:{type:Array,default:[]},
    schedules:{type:Array,default:[]},
    joins:{type:Array,default:[]},
    issueTime:Date,
    comment:{type:Number,default:0},
    read:{type:Number,default:0},
    support:{type:Number,default:0}
});

ClassSchma.methods.add = function (callback) {
    this.save().then(callback);
};

ClassSchma.statics.getClassByStatus = function (callback) {
    this.find({"status":"1"}).then(callback);
};

ClassSchma.statics.getClassByMainId = function (mainid,callback) {
    this.findOne({"mainid":mainid}).then(callback);
};

ClassSchma.statics.getClassByMember = function (id,callback) {
    this.find({ "members":{ $in:[id]}}).then(callback);
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
