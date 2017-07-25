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
        console.log(username);
        var myFollows = new Array();
        var followmines = new Array();
        Follow.getMyfollows(username,function (results) {

            if(results && results.length>0){
                for(var o in results){
                    if (results[o].followusername){
                        User.getUserByUserName(results[o].followusername,function (userResult) {
                            myFollows.push(userResult);
                            if(results.length == myFollows.length){
                                Follow.getFollowForMy(username,function (results2) {
                                    console.log(results2);
                                    if(results2 && results2.length>0){
                                        for(var o in results2){
                                            if (results2[o].username){
                                                User.getUserByUserName(results2[o].username,function (userResult2) {
                                                    followmines.push(userResult2);
                                                    if(results2.length == followmines.length){
                                                        var respJson = {"success":true,"myfollows":myFollows,"followmys":followmines};
                                                        console.log(respJson);
                                                        res.json(respJson);
                                                        return;
                                                    }
                                                })
                                            }
                                        }
                                    }
                                    else{
                                        var respJson = {"success":true,"myfollows":myFollows,"followmys":followmines};
                                        console.log(respJson);
                                        res.json(respJson);
                                        return;
                                    }
                                });
                            }
                        })
                    }
                }
            }else{
                Follow.getFollowForMy(username,function (results2) {
                    for(var o in results2){
                        if (results2[o].username){
                            User.getUserByUserName(results2[o].username,function (userResult2) {
                                followmines.push(userResult2);
                                if(results2.length == followmines.length){
                                    var respJson = {"success":true,"myfollows":myFollows,"followmys":followmines};
                                    console.log(respJson);
                                    res.json(respJson);
                                    return;
                                }
                            })
                        }
                    }
                });
            }
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
                var follow = new Follow();
                follow.username = requestJson["username"];
                follow.followusername = requestJson["followusername"];
                follow.add(function (err) {
                    var respJson = {"success":true,"message":"成功的关注了"};
                    res.json(respJson);
                });
            }
        });
    }
    else{
        var respJson = {"success":false,"message":"请重试"};
        res.json(respJson);
    }

});

module.exports = router;
