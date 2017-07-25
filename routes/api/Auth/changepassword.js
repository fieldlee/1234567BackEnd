/**
 * Created by depengli on 2017/7/19.
 */
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

    User.getUserByUserName(requestJson["username"],function (result) {
        if(result){
            if(requestJson["oldpassword"]==result.password){
                result.password = requestJson["newpassword"];
                result.add(function (err) {
                    var jsonResult = {"success": true,"message":"密码已经修改完成！"};
                    res.json(jsonResult);
                    return;
                });
            }else{
                var jsonResult = {"success": false,"message":"老密码不对，请重新输入！"};
                res.json(jsonResult);
                return;
            }
        }else{
            var jsonResult = {"success": false,"message":"用户名不存在，请重新输入！"};
            res.json(jsonResult);
            return;
        }
    })

});

module.exports = router;


