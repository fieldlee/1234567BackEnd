/**
 * Created by depengli on 2017/7/25.
 */
/**
 * Created by depengli on 2017/7/13.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var Praise = require('../../model/Praise');
var User = require('../../model/User');
var ConfigPraise = require('../../model/ConfigPraise');
/* GET users listing. */
// req.params.type
router.get('/byproduct/:productid', function(req, res) {

    if (req.params.productid){
        Praise.getPraiseByProductId(req.params.productid,function (results) {
            for(var i =0 ; i<results.length;i++){
                results[i].fromTime = config.preTime(results[i].issueTime);
            }
            var sortedResults = results.sort(function (o,t) {
                var oT = new Date(o.issueTime);
                var tT = new Date(t.issueTime);
                if (oT > tT){
                    return -1;
                }else{
                    return 1;
                }
            });
            var jsonResult = {"success":true,"results":sortedResults};
            res.json(jsonResult);
            return;
        });
    }
});

router.get('/:id', function(req, res) {

    if (req.params.id){
        Praise.getPraiseById(req.params.id,function (result) {
            var jsonResult = {"success":true,"data":result};
            res.json(jsonResult);
            return;
        });
    }

});


router.get('/config/:type', function(req, res) {
    console.log(req.params.type);
    if(req.params.type){
        ConfigPraise.getConfigByType(req.params.type,function (result) {
            console.log(result);
            var jsonResult = {"success":true,"data":result};
            res.json(jsonResult);
            return;
        });
    }
    else{
        var jsonResult = {"success":false};
        res.json(jsonResult);
        return;
    }

});

router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    //     chenghu:String,
    //     product: String,
    //     author: String,
    //     telephone: String,
    //     delegate:String,
    //     province:String,
    //     city:String,
    //     district:String,
    //     content:String,
    //     best:String,
    //     bad:String,
    //     praisetitles:Array,
    //     praisevalues:Array,
    //     praisestars:Array,
    //     fromTime:String,
    //     issueTime:Date
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Praise.getPraiseById(requestJson["_id"],function (result) {
            result.chenghu = requestJson["chenghu"];
            result.product = requestJson["product"];
            result.author = requestJson["author"];
            result.telephone = requestJson["telephone"];
            result.delegate = requestJson["delegate"];
            result.province = requestJson["province"];
            result.city = requestJson["city"];
            result.district = requestJson["district"];
            result.best = requestJson["best"];
            result.bad = requestJson["bad"];
            result.praisetitles = requestJson["praisetitles"];
            result.praisevalues = requestJson["praisevalues"];
            result.praisestars = requestJson["praisestars"];
            result.add(function (err) {
                var jsonResult = {"success":true,"data":result};
                res.json(jsonResult);
                return;
            });

        });
    }
    else{
        var result = new Praise();
        result.chenghu = requestJson["chenghu"];
        result.product = requestJson["product"];
        result.author = requestJson["author"];
        result.telephone = requestJson["telephone"];
        result.delegate = requestJson["delegate"];
        result.province = requestJson["province"];
        result.city = requestJson["city"];
        result.district = requestJson["district"];
        result.best = requestJson["best"];
        result.bad = requestJson["bad"];
        result.praisetitles = requestJson["praisetitles"];
        result.praisevalues = requestJson["praisevalues"];
        result.praisestars = requestJson["praisestars"];
        result.issueTime = new Date();
        result.add(function (err) {
            var jsonResult = {"success":true,"data":result};
            console.log(jsonResult);
            res.json(jsonResult);
            return;
        });
    }
});

module.exports = router;
