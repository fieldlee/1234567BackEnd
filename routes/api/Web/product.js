/**
 * Created by depengli on 2017/7/10.
 */
/**
 * Created by depengli on 2017/7/9.
 */
var express = require('express');
var router = express.Router();

var Product = require('../../model/Product');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Product.getAll(function (results) {
        console.log(results);
        var jsonResult = {"success":true,"results":results};
        res.json(jsonResult);
    });
});

router.post('/', function(req, res) {
    console.log("=====product=====");
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // name: String,
    //     type: String,  // piano
    //     subType:String,
    //     brand:String,
    //     status:String,
    //     recomment:String,
    //     content:String, // 产品介绍
    //     images:Array,   // 产品的图片
    //     delegates:Array, // 代理的琴行
    //     config: Array, // 产品的config 比较
    //     praise:Array, // 计算出来的口碑数组，每个口碑的数量
    //     recommentPrice:String
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Product.getProductById(requestJson["_id"],function (result) {
            result.name =   requestJson["name"];
            result.type =   requestJson["type"];
            result.subType =   requestJson["subType"];
            result.brand =   requestJson["brand"];
            result.status =   requestJson["status"];
            result.recomment =   requestJson["recomment"];
            result.content =   requestJson["content"];
            result.images = requestJson["images"];
            result.delegates = requestJson["delegates"];
            result.config = requestJson["config"];
            result.praise = requestJson["praise"];
            result.recommentPrice = requestJson["recommentPrice"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
            });
        });
    }else{
        var result = new Product();
        result.name =   requestJson["name"];
        result.type =   requestJson["type"];
        result.subType =   requestJson["subType"];
        result.brand =   requestJson["brand"];
        result.status =   requestJson["status"];
        result.recomment =   requestJson["recomment"];
        result.content =   requestJson["content"];
        result.images = requestJson["images"];
        result.delegates = requestJson["delegates"];
        result.config = requestJson["config"];
        result.praise = requestJson["praise"];
        result.recommentPrice = requestJson["recommentPrice"];
        result.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":result};
            res.json(jsonResult);
        })
    }

});



module.exports = router;
