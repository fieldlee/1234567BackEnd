var express = require('express');
var router = express.Router();
var Show = require('../../model/Show');
var User = require('../../model/User');
var config = require('../../api/config');
/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Show.getAll(function (results) {
        //保密删除 身份证信息。
        for (var i=0;i<results.length;i++){
            results[i].idcard = "";
        }
        var jsonResult = {"success":true,"results":results};
        res.json(jsonResult);
        return;
    });
});

router.get('/support/:id',function (req, res) {
    if (req.params.id){
        Show.getShowById(req.params.id,function (result) {
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

router.get('/:id', function(req, res) {
    Show.getShowById(req.params.id,function (result) {
        //保密删除 身份证信息。
        result.idcard = "";

        var jsonResult = {"success":true,"data":result};
        res.json(jsonResult);
        return;
    });
});

router.post('/join',function(req, res){
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // memberid
    if (requestJson["showid"] != null && requestJson["showid"] != "" && requestJson["showid"] != undefined){
        Show.getShowById(requestJson["showid"],function (result) {
            if(result != null){
                if (result.members.indexOf(requestJson["memberid"]) >= 0 ){

                }else{
                    result.members.push(requestJson["memberid"]);
                }
                //保密删除 身份证信息。
                result.add(function (err) {
                    result.idcard = "";
                    var jsonResult = {"success":true,"data":result};
                    res.json(jsonResult);
                    return;
                });
            }
        });
    }
});

router.post('/update',function(req, res){
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // joinid
    if (requestJson["showid"] != null && requestJson["showid"] != "" && requestJson["showid"] != undefined){
        Show.getShowById(requestJson["showid"],function (result) {
            if(result != null){
                result.mainid = requestJson["mainid"];
                result.add(function (err) {
                    result.idcard = "";
                    var jsonResult = {"success":true,"data":result};
                    res.json(jsonResult);
                    return;
                });
            }
        });
    }
});

router.post('/start',function(req, res){
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // joinid
    if (requestJson["showid"] != null && requestJson["showid"] != "" && requestJson["showid"] != undefined){
        Show.getShowById(requestJson["showid"],function (result) {
            if(result != null){
                result.mainid = requestJson["mainid"];
                result.status = config.LiveStatus.LIVE;
                result.add(function (err) {
                    result.idcard = "";
                    var jsonResult = {"success":true,"data":result};
                    res.json(jsonResult);
                    return;
                });
            }
        });
    }
});

router.post('/leave',function(req, res){
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // joinid
    if (requestJson["showid"] != null && requestJson["showid"] != "" && requestJson["showid"] != undefined){
        Show.getShowById(requestJson["showid"],function (result) {
            if(result != null){
                if (requestJson["type"] =="main"){
                    result.mainid = "";
                    result.members = [];
                    result.status =  config.LiveStatus.OVER;
                    result.add(function (err) {
                        result.idcard = "";
                        var jsonResult = {"success":true,"data":result};
                        res.json(jsonResult);
                        return;
                    });
                }else{
                    result.members = result.members.filter(function (t) {
                        return t != requestJson["memberid"];
                    });
                    result.add(function (err) {
                        result.idcard = "";
                        var jsonResult = {"success":true,"data":result};
                        res.json(jsonResult);
                        return;
                    });
                }
            }
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
        Show.getShowById(requestJson["_id"],function (result) {
            result.status = config.LiveStatus.CLOSE;
            result.add(function (err) {
                var jsonResult = {"success": true,"message":"直播已经关闭"};
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
        Show.getShowById(requestJson["_id"],function (result) {
            result.sign =   requestJson["sign"];
            result.types =  requestJson["types"];
            result.image = requestJson["image"];
            result.author = requestJson["author"];
            result.idcard = requestJson["idcard"];
            result.tel =    requestJson["tel"];
            result.status = requestJson["status"];

            User.getUserByUserName(requestJson["author"],function (item) {
                result.avatorPath = item.avatorPath;
                result.avator = item.avator;
                result.add(function (err) {
                    console.log(err);
                    var jsonResult = {"success": true,"data":result};
                    res.json(jsonResult);
                    return;
                });
            });


            // ads = result;
        });
    }else{

        var showinfo = new Show();
        showinfo.sign = requestJson["sign"];
        showinfo.types = requestJson["types"];
        showinfo.image = requestJson["image"];
        showinfo.author = requestJson["author"];
        showinfo.idcard = requestJson["idcard"];
        showinfo.tel = requestJson["tel"];
        showinfo.status = requestJson["status"];
        showinfo.issueTime = new Date();
        User.getUserByUserName(requestJson["author"],function (item) {
            showinfo.avatorPath = item.avatorPath;
            showinfo.avator = item.avator;
            showinfo.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":showinfo};
                res.json(jsonResult);
                return;
            });
        });
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
        Show.deleteById(requestJson["_id"],function (result) {
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
