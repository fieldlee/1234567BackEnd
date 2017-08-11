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

router.get('/:id', function(req, res) {
    Class.getClassByID(req.params.id,function (result) {
        var jsonResult = {"success":true,"data":result};
        res.json(jsonResult);
    });

});

router.post('/join',function(req, res){
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Class.getClassByID(requestJson["_id"],function (result) {

        });
    }
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
            result.record =   requestJson["record"];
            result.author =   requestJson["author"];
            result.end =   requestJson["end"];
            result.telphone =   requestJson["telphone"];
            result.lecture =   requestJson["lecture"];//lecturename
            result.lecturename =   requestJson["lecturename"];
            result.status =   requestJson["status"];
            result.images =   requestJson["images"];
            result.content =   requestJson["content"];
            result.schedules =   requestJson["schedules"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
                return;
            });
            // ads = result;
        });
    }else{

        var classinfo = new Class();
        classinfo.title =   requestJson["title"];
        classinfo.subtitle =   requestJson["subtitle"];
        classinfo.price =   requestJson["price"];
        classinfo.start =   requestJson["start"];
        classinfo.end =   requestJson["end"];
        classinfo.record =   requestJson["record"];
        classinfo.telphone =   requestJson["telphone"];
        classinfo.lecture =   requestJson["lecture"];
        classinfo.lecturename =   requestJson["lecturename"];
        classinfo.status =   requestJson["status"];
        classinfo.author =   requestJson["author"];
        classinfo.content =   requestJson["content"];
        classinfo.images =   requestJson["images"];
        classinfo.schedules =   requestJson["schedules"];
        classinfo.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":classinfo};
            res.json(jsonResult);
            return;
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
