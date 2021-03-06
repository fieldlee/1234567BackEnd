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
var Score = require('../../model/Score');

/* GET users listing. */
// req.params.type
router.get('/number',function (req,res) {
    Score.getAll(function (results) {
        if (results.length>0){
            var jsonResult = {success:true,"count":results.length};
            console.log(jsonResult);
            res.json(jsonResult);
            return;
        }
    });
});

router.get('/mobile/:type/:time',function (req,res) {
    const time = new Number(req.params.time);
    const type = req.params.type;
    if (time == 0){
        Score.getScoresByType(type,function (results) {

            console.log("type:"+type);
            console.log("results:"+results.length);
            var sortedResults = results.sort(function (o,t) {
                var oT = new Date(o.issueTime);
                var tT = new Date(t.issueTime);
                if (oT > tT){
                    return -1;
                }else{
                    return 1;
                }
            });

            const jsonResult = {"success":true,"results":sortedResults};
            res.json(jsonResult);
            return;
        });
    }else{
        const date = new Date(time);
        Score.getScoresByTime(type,date,function (results) {
            console.log("type:"+type);
            console.log("results:"+results.length);
            var sortedResults = results.sort(function (o,t) {
                var oT = new Date(o.issueTime);
                var tT = new Date(t.issueTime);
                if (oT > tT){
                    return -1;
                }else{
                    return 1;
                }
            });

            const jsonResult = {"success":true,"results":sortedResults};
            res.json(jsonResult);
            return;
        });
    }
});

router.get('/id/:id',function (req,res) {
    var id = req.params.id;
    Score.getScoreById(id,function (result) {
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

    Score.getAll(function (results) {
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

router.get('/hot/:type', function(req, res) {
    // var page = req.params["page"];
    var type = req.params.type;

    var pageSize = 20;

    Score.getHotScoresByType(type,function (results) {

        var handleResults = new Array();
        var len = 0 ;
        if (results.length >= pageSize){
            len = pageSize;
        }else{
            len = results.length;
        }

        for (var i = 0; i < len; i++) {
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
        var jsonResult = {success: true,  results: sortedResults};
        res.json(jsonResult);
        return;
    });
});

router.get('/type/:type/:page', function(req, res) {
    // var page = req.params["page"];
    var type = req.params.type;
    var page = new Number(req.params.page);
    var pageSize = 20;

    Score.getScoresByType(type,function (results) {
        // console.log(results);
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

router.get('/search/:type/:key', function(req, res) {
    // var page = req.params["page"];
    var type = req.params.type;
    var key = req.params.key;
    Score.getScoresByTypeAndKey(type,key,function (results) {
        console.log(results);
        var handleResults = new Array();
        for (var i = 0; i < results.length; i++) {
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
        var jsonResult = {success: true, results: sortedResults};
        res.json(jsonResult);
        return;
    });
});

router.post('/fitler/:type', function(req, res) {

    var type = req.params.type;
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }

    var lvl = requestJson["lvl"];
    var region = requestJson["region"];
    var style = requestJson["style"];

    Score.getScoresByTypeAndSelect(type,lvl,region,style,function (results) {

        var handleResults = new Array();
        for (var i = 0; i < results.length; i++) {
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
        var jsonResult = {success: true, results: sortedResults};
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
        Score.getScoreById(requestJson["_id"],function (result) {
            result.title = requestJson["title"];
            result.type = requestJson["type"];
            result.region = requestJson["region"];
            result.mp3 = requestJson["mp3"];
            result.files = requestJson["files"];
            result.difficult = requestJson["difficult"];
            result.bpt = requestJson["bpt"];
            result.author = requestJson["author"];
            result.style = requestJson["style"];
            result.add(function (err) {  // 记录查看次数加1
                var jsonResult = {"success":true,"data":result};
                res.json(jsonResult);
                return;
            });
        });

    }else{

        var score = new Score();
        score.title = requestJson["title"];
        score.type = requestJson["type"];
        score.region = requestJson["region"];
        score.mp3 = requestJson["mp3"];
        score.files = requestJson["files"];
        score.difficult = requestJson["difficult"];
        score.bpt = requestJson["bpt"];
        score.author = requestJson["author"];
        score.style = requestJson["style"];
        score.issueTime = new Date();
        if(requestJson["author"] != null && requestJson["author"] != ""){
            User.getUserByUserName(requestJson["author"],function (user) {
                score.avator = user.avator;
                score.avatorPath = user.avatorPath;
                score.add(function (err) {
                    var jsonResult = {"success":true,"data":score};
                    res.json(jsonResult);
                    return;
                });
            });
        }
        else{
            score.add(function (err) {
                var jsonResult = {"success": true,"data":score};
                res.json(jsonResult);
                return;
            })
        }

    }

});

router.get('/support/:id',function (req, res) {
    if (req.params.id){
        Score.getScoreById(req.params.id,function (result) {
            if(result.support){
                result.support = result.support + 1;
            }
            else{
                result.support =  1;
            }
            result.add(function (err) {  // 记录查看次数加1

            });

            var jsonResult = {"success":true,"message":"成功收到您的点赞"};
            res.json(jsonResult);
            return;
        });
    }else{
        var jsonResult = {"success":false,"message":"没有收到您的赞，请重试"};
        res.json(jsonResult);
        return;
    }
});


router.post('/support', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Score.getScoreById(requestJson["_id"],function (result) {
            if(result.support){
                result.support = result.support + 1;
            }
            else{
                result.support =  1;
            }
            result.add(function (err) {  // 记录查看次数加1

            });

            var jsonResult = {"success":true,"message":"成功收到您的点赞"};
            res.json(jsonResult);
            return;
        });
    }
});

module.exports = router;
