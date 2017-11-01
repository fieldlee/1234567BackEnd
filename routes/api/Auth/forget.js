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


router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }

    if (config.isPhone(requestJson["username"])){
        requestJson["type"]="phone"
    }
    else{
        var jsonResult = {"success": false,"message":"请输入正确的邮箱或手机号码"};
        res.json(jsonResult);
        return;
    }

    // if(config.isMail(requestJson["username"])){
    //     requestJson["type"]="email"
    // }else{
    //
    // }
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


