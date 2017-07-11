/**
 * Created by depengli on 2017/7/6.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();

var News = require('../../model/News');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    News.getAll(function (results) {
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
    //     issueTime:Date,
    //     avator:String,
    //     images:Array
    console.log(requestJson["_id"]);

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        News.getNewsById(requestJson["_id"],function (result) {
            result.title =   requestJson["title"];
            result.content =   requestJson["content"];
            result.type =   requestJson["type"];
            result.author =   requestJson["author"];
            result.issueTime =   requestJson["issueTime"];
            result.avator =   requestJson["avator"];
            result.images =   requestJson["images"];
            result.add(function (err) {
                console.log(err);
                var jsonResult = {"success": true,"data":result};
                res.json(jsonResult);
            });
        });
    }else{
        console.log(requestJson["startTime"]);
        var news = new News();
        news.title =   requestJson["title"];
        news.content =   requestJson["content"];
        news.type =   requestJson["type"];
        news.author =   requestJson["author"];
        news.issueTime =   requestJson["issueTime"];
        news.avator =   requestJson["avator"];
        news.images =   requestJson["images"];
        news.add(function (err) {
            console.log(err);
            var jsonResult = {"success": true,"data":news};
            res.json(jsonResult);
        })
    }

});



module.exports = router;
