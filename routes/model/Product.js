
/**
 * Created by depengli on 2017/7/5.
 */
'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../api/config');
var productConfig = require('./class/ProductConfig');
mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());
// name: String;
// brand:String;
// type: String;
// subType: String;
// recomment:String;
// recommentPrice:String;
// content:String;
// images:String[];
var ProductSchma = new mongoose.Schema({
    name: String,
    type: String,  // piano
    subType:String,
    brand:String,
    status:String,
    recomment:String,
    content:String, // 产品介绍
    images:Array,   // 产品的图片
    delegates:Array, // 代理的琴行
    config: {}, // 产品的config 比较
    praise:Array, // 计算出来的口碑数组，每个口碑的数量
    recommentPrice:String
});

ProductSchma.methods.add = function (cb) {
    this.save().then(cb);
};

ProductSchma.statics.getValid = function (cb) {
    this.find({"status":"insale"})
        .then(cb);
};

ProductSchma.statics.getProductById = function (id,cb) {
    this.findOne({"_id":id}).then(cb);
};

ProductSchma.statics.getAll = function (cb) {
    this.find({}).then(cb);
};

ProductSchma.statics.getItemsByConditions = function (conditions,cb) {
    this.find(conditions).then(cb);
};
module.exports = db.model('product', ProductSchma);
