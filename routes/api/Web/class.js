var express = require('express');
var router = express.Router();
var Class = require('../../model/Class');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Class.getAll(function (results) {
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
    // title: String,
    //     subtitle: String,
    //     price:String,
    //     start:Date,
    //     end:Date,
    //     telphone:String,
    //     lecture:String,
    //     status:String,
    //     images:{type:Array,default:[]},
    // schedules:{type:Array,default:[]}
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Class.getClassByID(requestJson["_id"],function (result) {
            result.title =   requestJson["title"];
            result.subtitle =   requestJson["subtitle"];
            result.price =   requestJson["price"];
            result.start =   requestJson["start"];
            result.end =   requestJson["end"];
            result.telphone =   requestJson["telphone"];
            result.lecture =   requestJson["lecture"];
            result.status =   requestJson["status"];
            result.images =   requestJson["images"];
            result.schedules =   requestJson["schedules"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
            });
            // ads = result;
        });
    }else{

        var ads = new Class();
        ads.title =   requestJson["title"];
        ads.subtitle =   requestJson["subtitle"];
        ads.price =   requestJson["price"];
        ads.start =   requestJson["start"];
        ads.end =   requestJson["end"];
        ads.telphone =   requestJson["telphone"];
        ads.lecture =   requestJson["lecture"];
        ads.status =   requestJson["status"];
        ads.images =   requestJson["images"];
        ads.schedules =   requestJson["schedules"];
        ads.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":ads};
            res.json(jsonResult);
        })
    }

});

// delete
router.post('/delete', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Class.deleteById(requestJson["_id"],function (result) {
            if (result.result.ok == 1){
                var jsonResult = {"success": true};
                res.json(jsonResult);
            }else{
                var jsonResult = {"success": false};
                res.json(jsonResult);
            }
        });
    }

});


module.exports = router;
