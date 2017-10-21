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

var TmpScoreSchma = new mongoose.Schema({
    title: String,
    type: String,
    region:String,
    mp3:{type:Array,default:[]},
    files:{type:Array,default:[]},
    difficult:String,
    bpt:String,
    author:String,
    avator:String,
    avatorPath:String,
    style:String,
    issueTime:Date,
    status:String
});

TmpScoreSchma.methods.add = function (cb) {
    this.save().then(cb);
};

TmpScoreSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

TmpScoreSchma.statics.getScoresByStatus = function (status,cb) {
    this.findOne({"status":status}).then(cb);
};

module.exports = db.model('tmpscore', TmpScoreSchma);
