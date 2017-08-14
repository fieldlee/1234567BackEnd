/**
 * Created by depengli on 2017/7/11.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var User = require('../../model/User');

/* GET users listing. */



// req.params.type
router.get('/:key', function(req, res) {
    var key = req.params.key;
    key = key.trim();
    if (config.isMail(key)){
        User.getNewsByMail(key,function (result) {
            var jsonResult = {"success": true,"data":result};
            res.json(jsonResult);
        });
    }else{
        User.getNewsByPhone(key,function (result) {
            var jsonResult = {"success": true,"data":result};
            res.json(jsonResult);
        });
    }
});

router.post('/', function(req, res) {
    var body = req.body;

    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // console.log(requestJson);
    if (config.isMail(requestJson["username"])){
        requestJson["email"] = requestJson["username"];
    }else{
        if (config.isPhone(requestJson["username"])){
            requestJson["phone"] = requestJson["username"];
        }else{
            var jsonResult = {"success": false,"message":"请输入正确的邮箱或手机号码"};
            res.json(jsonResult);
            return
        }
    }

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        User.getUserById(requestJson["_id"],function (result) {
            result.username = requestJson["username"];
            result.password = requestJson["password"];
            result.phone = requestJson["phone"];
            result.email = requestJson["email"];
            result.avator = requestJson["avator"];
            result.add(function (err) {
                console.log(err);
                var token = config.getToken(requestJson["username"]);

                var jsonResult = {"success": true,"data":result,"token":token};

                res.json(jsonResult);
            });
            // ads = result;
        });
    }else{
        var user = new User();
        user.username = requestJson["username"];
        user.password = requestJson["password"];
        user.phone = requestJson["phone"];
        user.email = requestJson["email"];
        user.avator = requestJson["avator"];
        user.registerTime = new Date();
        user.add(function (err) {
            console.log(err);
            var token= config.getToken(requestJson["username"]);
            var jsonResult = {"success": true,"data":user,"token":token};
            res.json(jsonResult);
        })
    }
});

module.exports = router;
