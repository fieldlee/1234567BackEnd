/**
 * Created by depengli on 2017/7/13.
 */
/**
 * Created by depengli on 2017/7/13.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var Signature = require('../../model/Signature');
var User = require('../../model/User');
/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    if (config.getUsername(req)==false){
        var respJson = {"success":false,"message":"请先登录"};
        res.json(respJson);
    }else{
        var username = config.getUsername(req);
        Signature.getMySigns(username,function (results) {
            var respJson = {"success":true,"results":results};
            res.json(respJson);
        });
    }

});

router.post('/', function(req, res) {
    if (config.getUsername(req)==false){
        var respJson = {"success":false,"message":"请先登录"};
        res.json(respJson);
    }else{
        var username = config.getUsername(req);
        Signature.getTodayMySign(username,function (results) {
            if (results.length>0){
                var respJson = {"success":false,"message":"今日已经签到"};
                res.json(respJson);
                return
            }else{
                var tSign = new Signature();
                tSign.username = username;
                tSign.signatureTime = new Date();
                tSign.add(function (err) {
                    if (err){
                        var respJson = {"success":false,"message":"请重试签到"};
                        res.json(respJson);
                        return
                    }
                    var respJson = {"success":true,"message":"今日已签到"};
                    res.json(respJson);
                    return
                });
            }
        });
    }
});


module.exports = router;
