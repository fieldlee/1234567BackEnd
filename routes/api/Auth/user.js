
var express = require('express');
var router = express.Router();
var config = require('../config');
var User = require('../../model/User');

/* GET users listing. */

router.get('/:username',function (req,res) {
    var username = req.params.username;
    User.getUserByUserName(username,function (result) {
        if (result){
            var jsonResult = {"success": true,"data":result};
            res.json(jsonResult);
            return;
        }else{
            var jsonResult = {"success": false,"message":"该用户不存在"};
            res.json(jsonResult);
            return;
        }
    });
});

router.post('/update/avator/:username', function(req, res) {
    var body = req.body.data;
    // var body = req.body;
    console.log(body);
    var username = req.params.username;
    User.getUserByUserName(username,function (result) {
        result.avatorPath = body;
        result.updateTime = new Date();
        result.add(function (err) {
            var jsonResult = {"success": true,"data":result};
            res.json(jsonResult);
            return;
        });
    });
});

router.post('/update/back/:username', function(req, res) {
    var body = req.body.data;
    // var body = req.body;
    console.log(body);
    var username = req.params.username;
    User.getUserByUserName(username,function (result) {
        result.backgroundPath = body;
        result.updateTime = new Date();
        result.add(function (err) {
            var jsonResult = {"success": true,"data":result};
            res.json(jsonResult);
            return;
        });
    });
});


router.post('/update', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // phone:String,
    //     email:String,
    //     registerTime:Date,
    //     avator:String,
    //     avatorPath:String,
    //     backgroundPath:String,
    //     birthday:Date,
    //     province:String,
    //     city:String,
    //     district:String,
    //     address:String,
    //     sex:String,
    //     focus:Array,
    //     skills:Array

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined) {
        User.getUserById(requestJson["_id"],function (result) {
            result.phone = requestJson["phone"];
            result.email = requestJson["email"];
            result.avator = requestJson["avator"];
            // result.avatorPath = requestJson["avatorPath"];
            if(requestJson["birthday"] != null && requestJson["birthday"] != ""){
                result.birthday = new Date(requestJson["birthday"]) ;
            }

            result.province = requestJson["province"];
            result.city = requestJson["city"];
            result.district = requestJson["district"];
            result.address = requestJson["address"];
            result.sex = requestJson["sex"];
            result.focus = requestJson["focus"];
            result.skills = requestJson["skills"];
            result.updateTime = new Date();
            result.add(function (err) {
                var jsonResult = {"success": true,"message":"客户信息已更新","data":result};
                res.json(jsonResult);
            })
        });
    }else{
        var jsonResult = {"success": false,"message":"该用户id有误，请联系客服"};
        res.json(jsonResult);
    }


});

router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if(config.isMail(requestJson["username"])){
        requestJson["type"]="email"
    }else{
        if (config.isPhone(requestJson["username"])){
            requestJson["type"]="phone"
        }
        else{
            var jsonResult = {"success": false,"message":"请输入正确的邮箱或手机号码"};
            res.json(jsonResult);
            return;
        }
    }


    User.getUserByUserName(requestJson["username"],function (result) {
        if(result){
            if (requestJson["type"]=="phone"){
                var jsonResult = {"success": true,"message":"密码已经通过短信发送到手机，请及时查收短信信息！"};
                res.json(jsonResult);
            }
            else{
                var jsonResult = {"success": true,"message":"密码已经通过邮件发送，请及时查收您的邮箱！"};
                res.json(jsonResult);
            }
        }else{
            var jsonResult = {"success": false,"message":"用户名不存在，请先注册！"};
            res.json(jsonResult);
            return;
        }
    })

});

module.exports = router;


