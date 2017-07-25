/**
 * Created by depengli on 2017/7/22.
 */
/**
 * Created by depengli on 2017/7/7.
 */
/**
 * Created by depengli on 2017/7/6.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var config = require('../../config');
var Forum = require('../../../model/Forum');
var User = require('../../../model/User');
var Comment = require('../../../model/Comment');
/* GET users listing. */
// req.params.type

router.get('/recent',function (req,res) {
    Forum.getRecentForums(function (results) {
        var handleResults = new Array();
        for(var i=0;i<results.length;i++){
            User.getUserByObj(results[i],function (userResult,obj) {
                obj.avator = userResult.avator;
                obj.avatorPath = userResult.avatorPath;
                obj.fromTime = config.preTime(obj.issueTime);
                handleResults.push(obj);
                if(results.length == handleResults.length){
                    var sortedResults = handleResults.sort(function (o,t) {
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
                }
            })
        }
    });
});

router.get('/support/:id',function (req, res) {
    if (req.params.id){
        Forum.getForumById(req.params.id,function (result) {
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

router.get('/byid/:id',function (req, res) {
    if (req.params.id){
        Forum.getForumById(req.params.id,function (result) {

            if(result.read){
                result.read = result.read + 1;
            }
            else{
                result.read =  1;
            }
            result.add(function (err) {  // 记录查看次数加1

            });
            User.getUserByObj(result,function (userResult,obj) {
                obj.avator = userResult.avator;
                obj.avatorPath = userResult.avatorPath;
                obj.fromTime = config.preTime(obj.issueTime);
                var jsonResult = {"success":true,"data":obj};
                res.json(jsonResult)
            })
        });
    }
});



router.get('/byusername/:username', function(req, res) {
    var username = req.params.username;
    if(username){
        Forum.getByUsername(username,function (results) {
            var handleResults = new Array();
            for (var i = 0; i < results.length; i++) {
                User.getUserByObj(results[i],function (userResult,obj) {
                    obj.avator = userResult.avator;
                    obj.avatorPath = userResult.avatorPath;
                    obj.fromTime = config.preTime(obj.issueTime);
                    handleResults.push(obj);
                    if(results.length == handleResults.length) {
                        var sortedResults = handleResults.sort(function (o, t) {
                            var oT = new Date(o.issueTime);
                            var tT = new Date(t.issueTime);
                            if (oT > tT) {
                                return -1;
                            } else {
                                return 1;
                            }
                        });
                        var jsonResult = {"success":true,"results":sortedResults};
                        res.json(jsonResult);
                        return;
                    }
                })
            }
        });
    }else{
        var jsonResult = {"success":false};
        res.json(jsonResult);
        return;
    }
});

module.exports = router;
