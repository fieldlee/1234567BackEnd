/**
 * Created by depengli on 2017/7/9.
 */
var express = require('express');
var router = express.Router();

var Brand = require('../../model/Brand');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Brand.getAll(function (results) {
        console.log(results);
        var jsonResult = {"success":true,"results":results};
        res.json(jsonResult);
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
            result.tel =   requestJson["tel"];
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
        brand.address =   requestJson["address"];
        brand.tel =   requestJson["tel"];
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



module.exports = router;
