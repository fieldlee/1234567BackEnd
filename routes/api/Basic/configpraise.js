/**
 * Created by depengli on 2017/7/10.
 */
/**
 * Created by depengli on 2017/7/6.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();

var ConfigPraise = require('../../model/ConfigPraise');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    ConfigPraise.getAll(function (results) {
        // console.log(results);
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
    // configItems: String,
    // type: String,

    console.log(requestJson["_id"]);

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        ConfigPraise.getConfigInfoById(requestJson["_id"],function (result) {
            result.type =   requestJson["type"];
            result.tags =   requestJson["tags"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
            });
        });
    }else{

        var praise = new ConfigPraise();
        praise.type =   requestJson["type"];
        praise.tags =   requestJson["tags"];
        praise.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":praise};
            res.json(jsonResult);
        })
    }

});



module.exports = router;
