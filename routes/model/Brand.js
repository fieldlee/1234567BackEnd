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
var Image = require('./Image');
mongoose.Promise = Promise;

var db = mongoose.createConnection(config.getDatabase());

var BrandSchma = new mongoose.Schema({
    icon:String,
    name: String,
    company: String,
    char:String,
    province:String,
    city:String,
    district:String,
    address:String,
    tel:String,
    email:String,
    url:String,
    fax:String,
    content:String,
    recommend:String,
    products:Object
});

BrandSchma.methods.add = function (callback) {
    this.save().then(callback);
};

BrandSchma.statics.getBrandById = function (id,callback) {
    this.findOne({"_id":id}).then(callback);
};

BrandSchma.statics.deleteBrandById = function (id,callback) {
    this.remove({"_id":id}).then(callback);
};

BrandSchma.statics.getRecommentBrand = function (callback) {
    this.find({"recommend":"1"}).then(callback);
};


BrandSchma.statics.getBrandByName = function (name,callback) {
    this.findOne({"name":name}).then(callback);
};

BrandSchma.statics.getBrandByCompany = function (company,callback) {
    this.findOne({"company":company}).then(callback);
};

BrandSchma.statics.getAll = function (callback) {
    this.find({}).then(callback);
};

BrandSchma.statics.getItemsByConditions = function (conditions,callback) {
    this.find(conditions).then(callback);
};


module.exports = db.model('brand', BrandSchma);
