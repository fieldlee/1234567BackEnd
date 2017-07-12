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

var UserSchma = new mongoose.Schema({
    username: String,
    admin: String,
    password:String,
    phone:String,
    email:String,
    registerTime:Date,
    avator:String
});

UserSchma.methods.add = function (cb) {
    this.save().then(cb);
};

UserSchma.statics.getUserById = function (id,cb) {
    this.findOne({"_id":id}).then(cb);
};

UserSchma.statics.getUserByPhone = function (id,cb) {
    this.findOne({"phone":id}).then(cb);
};

UserSchma.statics.getUserByMail = function (id,cb) {
    this.findOne({"email":id}).then(cb);
};


UserSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

UserSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};

module.exports = db.model('user', UserSchma);
