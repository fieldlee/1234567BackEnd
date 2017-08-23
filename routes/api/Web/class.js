var express = require('express');
var router = express.Router();
var Class = require('../../model/Class');
var User = require('../../model/User');
/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Class.getAll(function (results) {
        console.log(results);
        var jsonResult = {"success":true,"results":results};
        res.json(jsonResult);
    });
});

router.get('/support/:id',function (req, res) {
    if (req.params.id){
        Class.getClassByID(req.params.id,function (result) {
            if(result.support){
                result.support = result.support+1;
            }else{
                result.support = 1;
            }
            result.add(function (err) {
                var jsonResult = {"success":true,"message":"成功收到您的点赞"};
                res.json(jsonResult)
            });
        });
    }
});

router.get('/:id', function(req, res) {
    Class.getClassByID(req.params.id,function (result) {
        if(result.read){
            result.read = result.read+1;
        }else{
            result.read = 1;
        }
        result.add();

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
    console.log(body);
    // { "classid":this.class._id,"joinTel":this.joinTel,"joinUsername":window.localStorage.getItem("username"),"joinPayStatus":this.joinPayStatus}
    if (requestJson["classid"] != null && requestJson["classid"] != "" && requestJson["classid"] != undefined){
        Class.getClassByID(requestJson["classid"],function (result) {
            User.getUserByUserName(requestJson["joinUsername"],function (item) {
                var joinBody = {
                    "joinTel":requestJson["joinTel"],
                    "joinUsername":requestJson["joinUsername"],
                    "joinPayStatus":requestJson["joinPayStatus"],
                    "joinAvator":item.avator,
                    "joinAvatorPath":item.avatorPath
                };
                if(result.joins){
                    result.joins = [];

                    result.joins.push(joinBody);
                }else{
                    result.joins.push(joinBody);
                }
                result.add(function (err) {
                    var jsonResult = {"success": true,"message":"课程已经关闭"};
                    res.json(jsonResult);
                    return;
                })
            });

        });
    }
});

router.post('/close',function(req, res){
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Class.getClassByID(requestJson["_id"],function (result) {
            result.status = "close";
            result.add(function (err) {
                var jsonResult = {"success": true,"message":"课程已经关闭"};
                res.json(jsonResult);
                return;
            });
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
            result.certifyfile =   requestJson["certifyfile"];
            result.certifyfilename =   requestJson["certifyfilename"];
            result.status =   requestJson["status"];
            result.materials =   requestJson["materials"];
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
        classinfo.certifyfile =   requestJson["certifyfile"];
        classinfo.certifyfilename =   requestJson["certifyfilename"];
        classinfo.status =   requestJson["status"];
        classinfo.author =   requestJson["author"];
        classinfo.content =   requestJson["content"];
        classinfo.images =   requestJson["images"];
        classinfo.materials =   requestJson["materials"];
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
