
var express = require('express');
var router = express.Router();
var User = require('../../model/User');
var MusicSorce = require('../../model/MusicSorce');
var async = require('async');
/* GET users listing. */
// req.params.type
router.get('/:type', function(req, res) {
    MusicSorce.getSorcesByType(function (results) {
        async.mapLimit(results,1,function (item,callback) {
            User.getUserByObj(item,function (userResult,obj) {
                if (userResult == null) {
                    obj.avator = "匿名用户";
                    obj.avatorPath = "";
                    obj.fromTime = config.preTime(obj.issueTime);
                } else {
                    obj.avator = userResult.avator;
                    obj.avatorPath = userResult.avatorPath;
                    obj.fromTime = config.preTime(obj.issueTime);
                }
                callback(null,obj);
            });

        }, function(err,limitResult) {
            console.info('error==>' + err);
            var jsonResult = {"success":true,"results":limitResult};
            res.json(jsonResult);
            return;
        });

    });
});

router.get('/:id', function(req, res) {
    MusicSorce.getSorceById(req.params.id,function (result) {
        User.getUserByObj(result,function (userResult,obj) {
            if (userResult == null) {
                obj.avator = "匿名用户";
                obj.avatorPath = "";
                obj.fromTime = config.preTime(obj.issueTime);
            } else {
                obj.avator = userResult.avator;
                obj.avatorPath = userResult.avatorPath;
                obj.fromTime = config.preTime(obj.issueTime);
            }
            var jsonResult = {"success":true,"data":obj};
            res.json(jsonResult);
            return;
        });
    })
});

router.post('/', function(req, res) {

    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // type: String,
    //     mp3:{type:Array,default:[]},
    // files:{type:Array,default:[]},
    // content:String,
    //     national:String,
    //     author:String,
    //     tags:{type:Array,default:[]},
    //
    //     issueTime:Date,

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        MusicSorce.getSorceById(requestJson["_id"],function (result) {
            result.type = requestJson["type"];
            result.mp3 = requestJson["mp3"];
            result.files = requestJson["files"];
            result.content = requestJson["content"];
            result.national = requestJson["national"];
            result.tags = requestJson["tags"];

            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
            });
        });
    }else{
        var sorce = new MusicSorce();
        sorce.type = requestJson["type"];
        sorce.mp3 = requestJson["mp3"];
        sorce.files = requestJson["files"];
        sorce.content = requestJson["content"];
        sorce.national = requestJson["national"];
        sorce.tags = requestJson["tags"];
        sorce.issueTime = new Date();
        sorce.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":sorce};
            res.json(jsonResult);
        });
    }

});



module.exports = router;
