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

router.get('/mobile/:time',function (req,res) {
    const time = req.params.time;

    if (Number(time)==0){
        News.getAll(function (results) {
            var jsonResult = {"success":true,"results":results};
            res.json(jsonResult);
            return;
        });
    }else{
        const date = new Date(Number(time));
        News.getNewsByTime(date,function (results) {
            var jsonResult = {"success":true,"results":results};
            res.json(jsonResult);
            return;
        });
    }
});

/* GET users listing. */
// req.params.type
router.get('/number',function (req,res) {
    console.log("=====");
    News.getAll(function (results) {
       // if (results.length>0){
           var jsonResult = {"success":true,"count":results.length.toString()};
           // console.log(jsonResult);
           res.json(jsonResult);
           return;
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
        result.fromTime = config.preTime(result.issueTime);
        var jsonResult = {success:true,data:result};
        res.json(jsonResult);
        return;
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
            results[i].fromTime = config.preTime(results[i].issueTime);
            handleResults.push(results[i]);
        }
        var sortedResults = handleResults.sort(function (o, t) {
            var oT = new Date(o.issueTime);
            var tT = new Date(t.issueTime);
            if (oT > tT) {
                return -1;
            } else {
                return 1;
            }
        });
        var jsonResult = {success: true, page:page, results: sortedResults, count: results.length};
        res.json(jsonResult);
        return;
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

        var news = new News();
        news.title =   requestJson["title"];
        news.content =   requestJson["content"];
        news.type =   requestJson["type"];
        news.author =   requestJson["author"];
        news.issueTime =   requestJson["issueTime"];
        news.avator =   requestJson["avator"];
        news.images =   requestJson["images"];


        if(requestJson["author"] != null && requestJson["author"] != ""){
            User.getUserByUserName(requestJson["author"],function (user) {
                news.avator = user.avator;
                news.avatorPath = user.avatorPath;
                news.add(function (err) {
                    var jsonResult = {"success":true,"data":news};
                    res.json(jsonResult);
                    return;
                });
            });
        }
        else{
            news.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":news};
                res.json(jsonResult);
            })
        }

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
