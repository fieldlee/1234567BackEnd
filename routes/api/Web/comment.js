/**
 * Created by depengli on 2017/7/17.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var Comment = require('../../model/Comment');
var User = require('../../model/User');
var Forum = require('../../model/Forum');
var News = require('../../model/News');

router.get('/:pid',function (req,res) {
   if (req.params.pid) {
       Comment.getCommentsByPId(req.params.pid,function (results) {
           var handleResults = new Array();
           for (var i = 0, len = results.length; i < len; i++) {
               User.getUserByObj(results[i],function (userResult,obj) {
                   if(userResult==null){
                       obj.avator = "匿名用户";
                       obj.avatorPath = "";
                       obj.fromTime = config.preTime(obj.issueTime);
                   }else{
                       obj.avator = userResult.avator;
                       obj.avatorPath = userResult.avatorPath;
                       obj.fromTime = config.preTime(obj.issueTime);
                   }
                   Comment.getCommentsByPId(obj._id,function (commentResults) {
                       console.log(commentResults);
                       if(commentResults.length>0){
                           var commentuserResults = new Array();
                           for (var j = 0, jlen = commentResults.length; j < jlen; j++) {
                               User.getUserByObj(commentResults[j],function (userResult2,commentObj) {
                                   if(userResult2==null){
                                       commentObj.avator = "匿名用户";
                                       commentObj.avatorPath = "";
                                       commentObj.fromTime = config.preTime(commentObj.issueTime);
                                   }else{
                                       commentObj.avator = userResult2.avator;
                                       commentObj.avatorPath = userResult2.avatorPath;
                                       commentObj.fromTime = config.preTime(commentObj.issueTime);
                                   }

                                   commentuserResults.push(commentObj);
                                   if (commentResults.length == commentuserResults.length){
                                       obj.subComments = commentuserResults;

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

                                           var jsonResult = {success:true,results:sortedResults,count:sortedResults.length};
                                           res.json(jsonResult)
                                       }
                                   }
                               });

                           }
                       }else{ ////
                           obj.subComments = [];

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

                               var jsonResult = {success:true,results:sortedResults,count:sortedResults.length};
                               res.json(jsonResult)
                           }
                       }

                   });
               });
           }

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
        Comment.getCommentsById(requestJson["_id"],function (result) {
            result.parentId =   requestJson["parentId"];
            result.content =   requestJson["content"];
            result.author =   requestJson["author"];
            result.issueTime =   requestJson["issueTime"];
            Forum.getForumById(requestJson["parentId"],function (t) {
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
            News.getNewsById(requestJson["parentId"],function (t) {
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
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success":true,"data":result};
                res.json(jsonResult);
            });

        });
    }else{

        var comment = new Comment();
        comment.parentId =   requestJson["parentId"];
        comment.content =   requestJson["content"];
        comment.author =   requestJson["author"];
        comment.issueTime =   requestJson["issueTime"];
        Forum.getForumById(requestJson["parentId"],function (t) {
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
        News.getNewsById(requestJson["parentId"],function (t) {
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
        comment.add(function (err) {
            console.log(err);
            var jsonResult = {"success":true,"data":comment};
            res.json(jsonResult);
        })
    }

});

router.post('/support',function (req,res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    console.log(requestJson);
    if (requestJson["id"] != null && requestJson["id"] != "" && requestJson["id"] != undefined){
        Comment.getCommentsById(requestJson["id"],function (result) {
            if (result.support){
                result.support = result.support+1;

            }else{
                result.support = 1;
            }
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success":true,"message":"成功收到您的赞"};
                res.json(jsonResult);
            });
        });
    }
});

module.exports = router;