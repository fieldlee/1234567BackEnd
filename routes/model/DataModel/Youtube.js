/**
 * Created by depengli on 2017/7/5.
 */
'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise;

var db = mongoose.createConnection("mongodb://localhost:27017/data?socketTimeoutMS=200000");

var YoutubeSchma = new mongoose.Schema({
    title: String,
    youtubelink: String
});

YoutubeSchma.methods.add = function (callback) {
    this.save().then(callback);
};

YoutubeSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

module.exports = db.model('youtube', YoutubeSchma);
