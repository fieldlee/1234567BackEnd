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
    brand:{ type: String, default: "" },
    product:String,
    type: String,
    subType:String,
    tags:Array,
    content:String,
    author:{ type: String, default: "" },
    avator:{ type: String, default: "" },
    avatorPath:{ type: String, default: "" },
    issueTime:Date,
    fromTime:{ type: String, default: "" },
    images:Array,
    videos:Array,
    comment:{ type: Number, default: 0 },
    read:{ type: Number, default: 0 },
    support:{ type: Number, default: 0 },
    collect:{type:Number,default:0}
});

NewsSchma.methods.add = function (cb) {
    this.save().then(cb);
};

NewsSchma.statics.getNewsById = function (id,cb) {
    this.findOne({"_id":id}).then(cb);
};

NewsSchma.statics.deleteNewsById = function (id,cb) {
    this.remove({"_id":id}).then(cb);
};

NewsSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

NewsSchma.statics.getNewsByUserName = function (username,cb) {
    this.find({'author':username}).then(cb);
};

NewsSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};

module.exports = db.model('news', NewsSchma);
