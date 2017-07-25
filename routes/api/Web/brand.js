/**
 * Created by depengli on 2017/7/9.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var Brand = require('../../model/Brand');
var Product = require('../../model/Product');
/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {

    var handResults = new Array();
    Brand.getAll(function (results) {
        async.map(results,function (result,callback) {

            Product.getDistinct(result.name,function (subtypes) {
                var tmpResult = result;
                async.map(subtypes,function (item,callback2) {
                    var objProduct = new Object();
                    Product.getProductsByBrandAndSubType(tmpResult.name,item,function (subResults) {

                        objProduct[item] = subResults;

                        callback2(null,objProduct);
                    })
                },function (err2,obj) {

                    tmpResult.products = obj;

                    callback(null,tmpResult);
                });
            });

        },function(err,handitems) {
            if (handitems.length == results.length){
                var jsonResult = {"success": true,"results":handitems};
                res.json(jsonResult);
                return;
            }
        });
    });
});

router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // icon:String,
    //     name: String,
    //     company: String,
    //     address:String,
    //     tel:String,
    //     email:String,
    //     content:String
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Brand.getBrandById(requestJson["_id"],function (result) {
            result.icon =   requestJson["icon"];
            result.name =   requestJson["name"];
            result.company =   requestJson["company"];
            result.address =   requestJson["address"];
            result.province =   requestJson["province"];

            result.char =   requestJson["char"].trim().toUpperCase();
            result.city =   requestJson["city"];
            result.district =   requestJson["district"];
            result.tel =   requestJson["tel"];
            result.url =   requestJson["url"];
            result.fax =   requestJson["fax"];
            result.email =   requestJson["email"];
            result.content =   requestJson["content"];
            result.recommend = requestJson["recommend"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
            });
        });
    }else{
        var brand = new Brand();
        brand.icon =   requestJson["icon"];
        brand.name =   requestJson["name"];
        brand.company =   requestJson["company"];
        brand.province =   requestJson["province"];
        brand.city =   requestJson["city"];
        brand.char =   requestJson["char"].trim().toUpperCase();
        brand.district =   requestJson["district"];
        brand.address =   requestJson["address"];
        brand.tel =   requestJson["tel"];
        brand.url =   requestJson["url"];
        brand.fax =   requestJson["fax"];
        brand.email =   requestJson["email"];
        brand.content =   requestJson["content"];
        brand.recommend = requestJson["recommend"];
        brand.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":brand};
            res.json(jsonResult);
        })
    }

});

router.post('/delete', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    //     icon:String,
    //     name: String,
    //     company: String,
    //     address:String,
    //     tel:String,
    //     email:String,
    //     content:String
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Brand.deleteBrandById(requestJson["_id"],function (result) {
            if(result.result.ok == 1){
                var jsonResult = {"success": true};
                res.json(jsonResult);
            }
            var jsonResult = {"success": false};
            res.json(jsonResult);
        });
    }
});

module.exports = router;
