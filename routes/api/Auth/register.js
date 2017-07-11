/**
 * Created by depengli on 2017/7/11.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();

var User = require('../../model/User');

/* GET users listing. */

function isMail(str) {
    var re = /^([a-za-z0-9]+[_|-|.]?)*[a-za-z0-9]+@([a-za-z0-9]+[_|-|.]?)*[a-za-z0-9]+.[a-za-z]{2,3}$/;
    return re.test(str);
}

// req.params.type
router.get('/:key', function(req, res) {
    var key = req.params.key;
    key = key.trim();
    if (isMail(key)){
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
    console.log(requestJson);

    console.log(requestJson["_id"]);
    // username: String,
    //     admin: String,
    //     password:String,
    //     phone:String,
    //     email:Date,
    //     registerTime:Date,
    //     avator:String
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        User.getUserById(requestJson["_id"],function (result) {
            result.username = requestJson["username"];
            result.password = requestJson["password"];
            result.phone = requestJson["phone"];
            result.email = requestJson["email"];
            result.avator = requestJson["avator"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
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
            var jsonResult = {"success": true,"data":user};
            res.json(jsonResult);
        })
    }
});

module.exports = router;
