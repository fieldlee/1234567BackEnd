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
var config = require('../config');
var Forum = require('../../model/Forum');
var User = require('../../model/User');
var Comment = require('../../model/Comment');
var ffmpeg = require('fluent-ffmpeg');
var uuid = require('node-uuid');
/* GET users listing. */
// req.params.type



// /usr/local/Cellar/ffmpeg
// ffmpeg.setFfmpegPath("/usr/local/Cellar/ffmpeg");
// /Users/depengli/1234567backend/instrumentBackend/routes/api/Web/676a711ad00f90d74a3c169f08b9034e0e22a27c.mp4



router.use('/sub', require('./subForum/subForum'));

router.get('/', function(req, res) {
    Forum.getAll(function (results) {

        var handleResults = new Array();
        for (var i = 0, len = results.length; i < len; i++) {
            User.getUserByObj(results[i],function (userResult,obj) {
                obj.avator = userResult.avator;
                obj.avatorPath = userResult.avatorPath;
                obj.fromTime = config.preTime(obj.issueTime);

                handleResults.push(obj);
                if(results.length == handleResults.length){
                    var sortedResults = handleResults.sort(function (o,t) {
                        var oT = new Date(o.issueTime);
                        var tT = new Date(t.issueTime);
                        if (oT > tT){
                            return -1;
                        }else{
                            return 1;
                        }
                    });
                    var jsonResult = {success:true,results:sortedResults};
                    res.json(jsonResult);
                }
            })
        }

    });
});


router.get('/:type/:page', function(req, res) {
    var pageSize = 10;
    var page = new Number(req.params.page);
    if (req.params.type){
        Forum.getTypes(req.params.type,function (results) {
            var handleResults = new Array();
            var len = 0;
            if (results.length>=page*pageSize){
                len = page*pageSize;
            }else{
                len = results.length;
            }
            if((page-1)*pageSize >= results.length){
                var jsonResult = {success:true,page:page,results:[],count:results.length};
                res.json(jsonResult);
                return;
            }
            for (var i = (page-1)*pageSize; i < len; i++) {
                User.getUserByObj(results[i],function (userResult,obj) {
                    if (userResult == null){
                        obj.avator = "匿名用户";
                        obj.avatorPath = "";
                        obj.fromTime = config.preTime(obj.issueTime);
                    }else{
                        obj.avator = userResult.avator;
                        obj.avatorPath = userResult.avatorPath;
                        obj.fromTime = config.preTime(obj.issueTime);
                    }
                    config.getImageUrls(obj.content);
                        handleResults.push(obj);
                        if((len - (page-1)*pageSize) == handleResults.length){
                            var sortedResults = handleResults.sort(function (o,t) {
                                var oT = new Date(o.issueTime);
                                var tT = new Date(t.issueTime);
                                if (oT > tT){
                                    return -1;
                                }else{
                                    return 1;
                                }
                            });
                            var jsonResult = {success:true,page:page,results:sortedResults,count:sortedResults.length};
                            res.json(jsonResult)
                        }
                })
            }
        });
    }

});

router.get('/:type/:subtype/:page', function(req, res) {
    // console.log(req.params.page);
    var pageSize = 10;
    var page = new Number(req.params.page);
    if (req.params.type && req.params.subtype) {

        Forum.getTypeAndSubType(req.params.type,req.params.subtype,function (results) {
            var handleResults = new Array();

            var len = 0 ;
            if (results.length>=page*pageSize){
                len = page*pageSize;
            }else{
                len = results.length;
            }
            // 没有数据
            if((page-1)*pageSize >= results.length){
                var jsonResult = {success:true,page:page,results:[],count:results.length};
                res.json(jsonResult);
                return;
            }
            for (var i = (page-1)*pageSize; i < len; i++) {
                User.getUserByObj(results[i],function (userResult,obj) {
                    if (userResult==null){
                        obj.avator = "匿名用户";
                        obj.avatorPath = "";
                        obj.fromTime = config.preTime(obj.issueTime);
                    }else{
                        obj.avator = userResult.avator;
                        obj.avatorPath = userResult.avatorPath;
                        obj.fromTime = config.preTime(obj.issueTime);
                    }

                        handleResults.push(obj);
                        if((len - (page-1)*pageSize) == handleResults.length) {
                            var sortedResults = handleResults.sort(function (o, t) {
                                var oT = new Date(o.issueTime);
                                var tT = new Date(t.issueTime);
                                if (oT > tT) {
                                    return -1;
                                } else {
                                    return 1;
                                }
                            });
                            var jsonResult = {success: true, page:page, results: sortedResults, count: sortedResults.length};
                            res.json(jsonResult)
                        }
                })
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
    // console.log(requestJson);
    // title: String,
    //     type: String,
    //     content:String,
    //     author:String,
    //     avator:String,
    //     issueTime:Date,
    //     images:Array
    // console.log(requestJson["_id"]);

    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined){
        Forum.getForumById(requestJson["_id"],function (result) {
            result.title =   requestJson["title"];
            result.brand =   requestJson["brand"];
            result.product =   requestJson["product"];
            result.content =   requestJson["content"];
            result.type =   requestJson["type"];
            result.subType =   requestJson["subType"];
            result.author =  requestJson["author"];
            result.issueTime =   requestJson["issueTime"];
            result.tags =   requestJson["tags"];
            result.videos =   requestJson["videos"];
            result.images =   requestJson["images"];
            if (result.videos.length>0){
                //Save thumbnail image
                var filename = uuid.v4()+".png";
                var fullfilename = config.thumbnailFullPath()+"/"+filename;
                var images = new Array();
                images.push(fullfilename);
                result.images = images;
                //get thumbnail image
                ffmpeg(config.getPath(result.videos[0]))
                    .on('filenames', function(filenames) {
                        console.log('Will generate ' + filenames.join(', '))
                    })
                    .on('end', function() {
                        console.log('Screenshots taken');
                    })
                    .screenshots({
                        count: 1,
                        timestamps: ['00:02.123'],
                        filename: filename,
                        folder: config.thumbnailPath(),
                        size: '200x150'
                    });
            }
            result.add(function (err) {
                var jsonResult = {"success":true,"data":result};
                res.json(jsonResult);
            });

        });
    }else{
        var forum = new Forum();
        forum.title =   requestJson["title"];
        forum.brand =   requestJson["brand"];
        forum.product =   requestJson["product"];
        forum.content =   requestJson["content"];
        forum.type =   requestJson["type"];
        forum.subType =   requestJson["subType"];
        forum.author =  requestJson["author"];
        forum.issueTime =   requestJson["issueTime"];
        forum.tags =   requestJson["tags"];
        forum.videos =   requestJson["videos"];
        forum.images =   requestJson["images"];
        forum.comment = 0;
        forum.read = 0;
        forum.support = 0;
        if (forum.videos.length>0){
            var filename = uuid.v4()+".png";
            var fullfilename = config.thumbnailFullPath()+"/"+filename;
            var images = new Array();
            images.push(fullfilename);
            forum.images = images;

            ffmpeg(config.getPath(forum.videos[0]))
                .on('filenames', function(filenames) {
                console.log('Will generate ' + filenames.join(', '))
                })
                .on('end', function() {
                    console.log('Screenshots taken');
                })
                .screenshots({
                    count: 1,
                    timestamps: ['00:02.123'],
                    filename: filename,
                    folder: config.thumbnailPath(),
                    size: '200x150'
                });
        }
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
