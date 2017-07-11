/**
 * Created by depengli on 2017/7/7.
 */
/**
 * Created by depengli on 2017/7/6.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();

var Forum = require('../../model/Forum');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Forum.getAll(function (results) {
        console.log(results);
        var jsonResult = {success:true,results:results};
        res.json(jsonResult);
    });
});

router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    console.log(requestJson);
    // title: String,
    //     type: String,
    //     content:String,
    //     author:String,
    //     avator:String,
    //     issueTime:Date,
    //     images:Array
    console.log(requestJson["_id"]);

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Forum.getForumById(requestJson["_id"],function (result) {
            result.title =   requestJson["title"];
            result.content =   requestJson["content"];
            result.type =   requestJson["type"];
            result.author =   requestJson["author"];
            result.issueTime =   requestJson["issueTime"];
            result.avator =   requestJson["avator"];
            result.images =   requestJson["images"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success":true,"data":result};
                res.json(jsonResult);
            });

        });
    }else{
        console.log(requestJson["startTime"]);
        var forum = new Forum();
        forum.title =   requestJson["title"];
        forum.content =   requestJson["content"];
        forum.type =   requestJson["type"];
        forum.author =   requestJson["author"];
        forum.issueTime =   requestJson["issueTime"];
        forum.avator =   requestJson["avator"];
        forum.images =   requestJson["images"];
        forum.add(function (err) {
            console.log(err);
            var jsonResult = {"success":true,"data":forum};
            res.json(jsonResult);
        })
    }

});


router.post('/delete', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Forum.deleteForumById(requestJson["_id"],function (result) {
            if(result.result.ok == 1){
                var jsonResult = {"success":true};
                res.json(jsonResult);
            }
            var jsonResult = {"success":false};
            res.json(jsonResult);
        })
    }
});

module.exports = router;
