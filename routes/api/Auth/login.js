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
    if(config.isMail(requestJson["username"])){
        requestJson["type"]="email"
    }else{
        if(config.isPhone(requestJson["username"])){
            requestJson["type"]="phone"
        }
        else{
            var jsonResult = {"success": false,"message":"请输入正确的邮箱或手机号码！"};
            res.json(jsonResult);
            return;
        }
    }
        User.getUserByUserName(requestJson["username"],function (result) {
            if(result){
                if (result.password == requestJson["password"]){
                    var token = config.getToken(requestJson["username"]);
                    var jsonResult = {"success": true,"data":result,token:token};
                    res.json(jsonResult);
                    return;
                }else{
                    var jsonResult = {"success": false,"message":"密码不正确,请重新输入！"};
                    res.json(jsonResult);
                    return;
                }
            }else{
                var jsonResult = {"success": false,"message":"用户名不存在，请先注册！"};
                res.json(jsonResult);
                return;
            }
        });

});

module.exports = router;

