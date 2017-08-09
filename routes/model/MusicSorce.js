
'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');

mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var MusicSorceSchema = new mongoose.Schema({
    type: String,
    mp3:{type:Array,default:[]},
    files:{type:Array,default:[]},
    content:String,
    national:String,
    author:String,
    tags:{type:Array,default:[]},
    avator:String,
    avatorPath:String,
    issueTime:Date,
    fromTime:String,
    comment:Number,
    read:Number,
    support:Number,
    collect:{type:Number,default:0}
});

MusicSorceSchema.methods.add = function (cb) {
    this.save().then(cb);
};

MusicSorceSchema.statics.getSorceById = function (id,cb) {
    this.find({"_id":id}).then(cb);
};

MusicSorceSchema.statics.getSorcesByUser = function (id,cb) {
    this.find({"author":id}).then(cb);
};

MusicSorceSchema.statics.getSorcesByType = function (type,cb) {
    this.find({"type":type}).then(cb);
};

MusicSorceSchema.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

MusicSorceSchema.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};

module.exports = db.model('musicsorce', MusicSorceSchema);

