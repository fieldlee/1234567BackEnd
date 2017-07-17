/**
 * Created by depengli on 2017/7/13.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var Follow = require('../../model/Follow');
var User = require('../../model/User');
/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    if (config.getUsername(req)==false){
        var respJson = {"success":false};
        res.json(respJson);
    }else{
        var username = config.getUsername(req);
        var myFollows = new Array();
        var followmines = new Array();
        Follow.getMyfollows(username,function (results) {
            for(var o in results){
                if (results[o].followusername){
                    User.getUserByUserName(results[o].followusername,function (userResult) {
                        myFollows.push(userResult);
                    })
                }
            }
            Follow.getFollowForMy(username,function (results2) {
                for(var o in results2){
                    if (results2[o].username){
                        User.getUserByUserName(results2[o].username,function (userResult) {
                            followmines.push(userResult);
                        })
                    }
                }

                var respJson = {"success":true,"myfollows":myFollows,"followmys":followmines};
                res.json(respJson);
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
    if(requestJson["username"] && requestJson["followusername"]){
        Follow.getFollow(requestJson["username"],requestJson["followusername"],function (results) {
            if(results.length > 0 ){
                var respJson = {"success":false,"message":"已经关注过了"};
                res.json(respJson);
            }else{
                var respJson = {"success":true,"message":"成功的关注了"};
                res.json(respJson);
            }
        });
    }
    else{
        var respJson = {"success":false,"message":"请重试"};
        res.json(respJson);
    }

});


module.exports = router;
