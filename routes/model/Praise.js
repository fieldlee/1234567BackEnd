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

var PraiseSchma = new mongoose.Schema({
    id: String,
    product: String,
    author: String,
    telephone: String,
    delegate:String,
    provice:String,
    city:String,
    content:String,
    selectdPraise:Array,
    issueTime:Date
});

PraiseSchma.methods.add = function (cb) {
    this.save().then(cb);
};

PraiseSchma.statics.getPraiseByProductId = function (id,cb) {
    this.find({"product":id}).then(cb);
};

PraiseSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

PraiseSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};

module.exports = db.model('praise', PraiseSchma);
