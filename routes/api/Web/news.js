/**
 * Created by depengli on 2017/7/6.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var User = require('../../model/User');
var News = require('../../model/News');

/* GET users listing. */
// req.params.type
router.get('/number',function (req,res) {
    News.getAll(function (results) {
        console.log(results);
       if (results.length>0){
           var jsonResult = {success:true,"count":results.length};
           console.log(jsonResult);
           res.json(jsonResult);
           return;
       }
    });
});
router.get('/byid/:id',function (req,res) {
    var id = req.params.id;
    News.getNewsById(id,function (result) {
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

            var jsonResult = {success:true,data:obj};
            res.json(jsonResult);
            return;
        });
    });
});

router.get('/:page', function(req, res) {
    // var page = req.params["page"];
    var page = new Number(req.params.page);
    var pageSize = 20;

    News.getAll(function (results) {
        var handleResults = new Array();

        var len = 0 ;
        if (results.length >= page*pageSize){
            len = page*pageSize;
        }else{
            len = results.length;
        }
        if((page-1)*pageSize >= results.length){
            var jsonResult = {success:true,page:page,results:[],count:results.length};
            res.json(jsonResult);
            return;
        }

        for (var i = (page-1)*pageSize; i < len; i++) {
            User.getUserByObj(results[i],function (userResult,obj) {

                if(userResult != null){
                    if(userResult.avator != null){
                        obj.avator = userResult.avator;
                    }
                    if (userResult.avatorPath != null){
                        obj.avatorPath = userResult.avatorPath;
                    }
                }

                obj.fromTime = config.preTime(obj.issueTime);
                handleResults.push(obj);
                if((len - (page-1)*pageSize) == handleResults.length) {
                    var sortedResults = handleResults.sort(function (o, t) {
                        var oT = new Date(o.issueTime);
                        var tT = new Date(t.issueTime);
                        if (oT > tT) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });
                    var jsonResult = {success: true, page:page, results: sortedResults, count: sortedResults.length};

                    res.json(jsonResult);

                    return;
                }
            })
        }
    });
});

router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        News.getNewsById(requestJson["_id"],function (result) {
            result.title =   requestJson["title"];
            result.content =   requestJson["content"];
            result.type =   requestJson["type"];
            result.author =   requestJson["author"];
            result.issueTime =   requestJson["issueTime"];
            result.avator =   requestJson["avator"];
            result.images =   requestJson["images"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
            });
        });
    }else{

        var news = new News();
        news.title =   requestJson["title"];
        news.content =   requestJson["content"];
        news.type =   requestJson["type"];
        news.author =   requestJson["author"];
        news.issueTime =   requestJson["issueTime"];
        news.avator =   requestJson["avator"];
        news.images =   requestJson["images"];
        news.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":news};
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
        News.deleteNewsById(requestJson["_id"],function (result) {
            if (result.result.ok == 1){
                var jsonResult = {"success": true};
                res.json(jsonResult);
            }
            var jsonResult = {"success": false};
            res.json(jsonResult);
        });
    }
});

router.post('/support', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["id"] != null && requestJson["id"] != "" && requestJson["id"] != undefined){
        News.getNewsById(requestJson["id"],function (result) {
            if(result.support){
                result.support = result.support+1;
            }else{
                result.support = 1;
            }

            result.add(function (err) {
                var jsonResult = {"success":true,"message":"成功收到您的点赞"};
                res.json(jsonResult);
                return;
            });
        });
    }
});

module.exports = router;
