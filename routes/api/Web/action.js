/**
 * Created by depengli on 2017/7/7.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();

var Action = require('../../model/ForumAction');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Action.getAll(function (results) {
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
        Action.getActionById(requestJson["_id"],function (result) {
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
            // action = result;
        });
    }else{
        console.log(requestJson["startTime"]);
        var action = new Action();
        action.title =   requestJson["title"];
        action.value =   requestJson["value"];
        action.type =   requestJson["type"];
        action.path =   requestJson["path"];
        action.startTime =   requestJson["startTime"];
        action.endTime =   requestJson["endTime"];
        action.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":action};
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
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Action.deleteActionById(requestJson["_id"],function (result) {
            if (result.result.ok == 1){
                var jsonResult = {"success": true};
                res.json(jsonResult);
            }
            var jsonResult = {"success": false};
            res.json(jsonResult);
        });
    }
});

module.exports = router;
