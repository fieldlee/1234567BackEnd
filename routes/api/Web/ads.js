/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();

var AdsSchema = require('../../model/Ads');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    AdsSchema.getAll(function (results) {
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
    console.log(requestJson);
    // title: String,
    //     type: String,
    //     value:String,
    //     path:String,
    //     startTime:Date,
    //     endTime:Date
    console.log(requestJson["_id"]);

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        AdsSchema.getAdsById(requestJson["_id"],function (result) {
            result.title =   requestJson["title"];
            result.value =   requestJson["value"];
            result.type =   requestJson["type"];
            result.path =   requestJson["path"];
            result.startTime =   requestJson["startTime"];
            result.endTime =   requestJson["endTime"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
            });
            // ads = result;
        });
    }else{
        console.log(requestJson["startTime"]);
        var ads = new AdsSchema();
        ads.title =   requestJson["title"];
        ads.value =   requestJson["value"];
        ads.type =   requestJson["type"];
        ads.path =   requestJson["path"];
        ads.startTime =   requestJson["startTime"];
        ads.endTime =   requestJson["endTime"];
        ads.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":ads};
            res.json(jsonResult);
        })
    }

});



module.exports = router;
