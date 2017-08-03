
var express = require('express');
var router = express.Router();
var config = require('../config');
var Collect = require('../../model/Collect');
var Forum =   require('../../model/Forum');

router.get('/:username',function (req,res) {
    if (req.params.username) {

        Collect.getCollectsByUsername(req.params.username,function (results) {
            for(var i=0;i<results.length;i++){
                results[i].fromTime = config.preTime(results[i].collectTime);
            }
            var jsonResult = {"success":true,"results":results};
            res.json(jsonResult);
            return;
        })
    }
});


router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Collect.getCollectById(requestJson["_id"],function (result) {
            Forum.getForumById(requestJson["forumId"],function (forum) {
                if (forum.collect){
                    forum.collect = 1;
                }else {
                    forum.collect = forum.collect + 1;
                }
                forum.add();
            });
            result.avator = requestJson["avator"];
            result.avatorPath = requestJson["avatorPath"];
            result.username = requestJson["username"];
            result.forumId = requestJson["forumId"];
            result.author =  requestJson["author"];
            result.title =  requestJson["title"];
            result.add(function (err) {
                var jsonResult = {"success":true,"data":result};
                res.json(jsonResult);
                return;
            });
        });
    }
    else{

        Collect.getCollectByIdUsername(requestJson["forumId"],requestJson["username"],function (result) {
            if (result == null){
                // 增加collect number
                Forum.getForumById(requestJson["forumId"],function (result) {
                    if (result.collect){
                        result.collect = 1;
                    }else {
                        result.collect = result.collect + 1;
                    }
                    result.add();
                });

                var collect = new Collect();
                collect.avator = requestJson["avator"];
                collect.avatorPath = requestJson["avatorPath"];
                collect.username = requestJson["username"];
                collect.forumId = requestJson["forumId"];
                collect.author =  requestJson["author"];
                collect.title =  requestJson["title"];
                collect.add(function (err) {
                    var jsonResult = {"success":true,"data":collect};
                    res.json(jsonResult);
                    return;
                });
            }else{
                var jsonResult = {"success":false,"message":"您已经收藏了此帖子"};
                res.json(jsonResult);
                return;
            }

        });


    }
});

module.exports = router;
