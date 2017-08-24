/**
 * Created by depengli on 2017/7/17.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var ScoreComment = require('../../model/ScoreComment');
var User = require('../../model/User');
var Score = require('../../model/Score');

var async = require('async');

router.get('/:pid',function (req,res) {
    if (req.params.pid) {
        ScoreComment.getCommentsByPId(req.params.pid,function (results) {
            async.mapLimit(results,1,function (item,callback) {
                ScoreComment.getCommentsByPId(item._id,function (commentResults) {
                    for (var j = 0; j < commentResults.length; j++) {
                        commentResults[j].fromTime = config.preTime(commentResults[j].issueTime);
                    }
                    item.subComments = commentuserResults;
                    callback(null,item);
                });
            },function (err,items) {
                var sortedResults = items.sort(function (o,t) {
                    var oT = new Date(o.issueTime);
                    var tT = new Date(t.issueTime);
                    if (oT > tT){
                        return -1;
                    }else{
                        return 1;
                    }
                });
                for (var i = 0; i < sortedResults.length; i++) {
                    sortedResults[i].fromTime = config.preTime(sortedResults[i].issueTime);
                }
                var jsonResult = {success:true,results:sortedResults,count:sortedResults.length};
                res.json(jsonResult);
                return;
            });

        });
    }
});

router.get('/:pid/:page',function (req,res) {
    var pagesize = 10;
    var pagenumber = 1;
    if (req.params.page){
        pagenumber = parseInt(req.params.page);
    }

    if (req.params.pid) {
        ScoreComment.getCommentsByPId(req.params.pid,function (results) {
            var handleResults = new Array();
            var endLen = 0;
            var startLen = (pagenumber-1)*pagesize;
            if (results.length <= pagesize*pagenumber){
                endLen =  results.length;
            }else{
                endLen = pagesize*pagenumber;
            }

            for (var i = startLen; i < endLen; i++) {
                handleResults.push(results[i]);
            }
            async.mapLimit(handleResults,1,function (item,callback) {
                item.fromTime = config.preTime(item.issueTime)
                ScoreComment.getCommentsByPId(item._id,function (commentResults) {
                    for(var j=0;j<commentResults.length;j++){
                        commentResults[j].fromTime = config.preTime(commentResults[j].issueTime);
                    }
                    item.subComments = commentResults;
                    callback(null,item);
                });
            },function (err,items) {
                var sortedResults = items.sort(function (o,t) {
                    var oT = new Date(o.issueTime);
                    var tT = new Date(t.issueTime);
                    if (oT > tT){
                        return -1;
                    }else{
                        return 1;
                    }
                });

                for(var k=0;k<sortedResults.length;k++){
                    sortedResults[k].fromTime = config.preTime(sortedResults[k].issueTime);
                }

                var jsonResult = {success:true,results:sortedResults,count:sortedResults.length};
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

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        ScoreComment.getCommentsById(requestJson["_id"],function (result) {
            result.parentId =   requestJson["parentId"];
            result.content =   requestJson["content"];
            result.author =   requestJson["author"];
            result.issueTime =   requestJson["issueTime"];

            Score.getScoreById(requestJson["parentId"],function (t) {
                if (t != null){
                    if(t.comment){
                        t.comment =  t.comment+1;
                    }else{
                        t.comment =  1;
                    }
                    t.add(function (err) {
                        console.log(err);
                    });
                }

            });

            if(requestJson["author"] != null && requestJson["author"] != ""){
                User.getUserByUserName(requestJson["author"],function (user) {
                    result.avator = user.avator;
                    result.avatorPath = user.avatorPath;
                    result.add(function (err) {
                        var jsonResult = {"success":true,"data":result};
                        res.json(jsonResult);
                        return;
                    });
                });
            }
            else{
                result.add(function (err) {
                    var jsonResult = {"success":true,"data":result};
                    res.json(jsonResult);
                    return;
                })
            }
        });
    }else{

        var comment = new ScoreComment();
        comment.parentId =   requestJson["parentId"];
        comment.content =   requestJson["content"];
        comment.author =   requestJson["author"];
        comment.issueTime =   requestJson["issueTime"];

        Score.getScoreById(requestJson["parentId"],function (t) {
            if (t != null){
                if(t.comment){
                    t.comment =  t.comment+1;
                }else{
                    t.comment =  1;
                }
                t.add(function (err) {
                    console.log(err);
                });
            }

        });
        if(requestJson["author"] != null && requestJson["author"] != ""){
            User.getUserByUserName(requestJson["author"],function (user) {
                comment.avator = user.avator;
                comment.avatorPath = user.avatorPath;
                comment.add(function (err) {
                    var jsonResult = {"success":true,"data":comment};
                    res.json(jsonResult);
                    return;
                });
            });
        }
        else{
            comment.add(function (err) {
                var jsonResult = {"success":true,"data":comment};
                res.json(jsonResult);
                return;
            })
        }
    }

});

router.post('/support',function (req,res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }

    if (requestJson["id"] != null && requestJson["id"] != "" && requestJson["id"] != undefined){
        ScoreComment.getCommentsById(requestJson["id"],function (result) {
            if (result.support){
                result.support = result.support+1;

            }else{
                result.support = 1;
            }
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success":true,"message":"成功收到您的赞"};
                res.json(jsonResult);
                return;
            });
        });
    }
});

module.exports = router;