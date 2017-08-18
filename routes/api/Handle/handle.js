/**
 * Created by depengli on 2017/8/3.
 */
var config = require('../config');
var Forum = require('../../model/Forum');
var News = require('../../model/News');
var User = require('../../model/User');
var Product = require('../../model/Product');
var ConfigPraise = require('../../model/ConfigPraise');
var Praise = require('../../model/Praise');
var Comment = require('../../model/Comment');
var async = require('async');
var uuid = require('node-uuid');
var http = require('http'),
    Stream = require('stream').Transform,
    fs = require('fs');
var promise = require('bluebird');
var url = require('url');
var assert = require('assert');


module.exports = {
    userLvl:function () {
        User.getAll(function (users) {
            async.map(users, function(user, next) {
                Forum.getByUsername(user.username,function (results) {
                    user.issueCount = results.length;
                    if (user.issueCount>=50){
                        user.lvl = "白银会员";
                    }else if(user.issueCount>=100){
                        user.lvl = "黄金会员";
                    }else if(user.issueCount>=200){
                        user.lvl = "钻石会员";
                    }
                    user.add(function (err) {
                        next(null,null);
                    })
                });
            },function (err,rest) {

            });
        });
    },
    praiseProduct:function () {
        Product.getAll(function (results) {
            async.map(results,function (product,next) {
                ConfigPraise.getConfigByType(product.type,function (config) {
                    if(config != null){
                        product.praisetitles = config.tags;
                        product.add(function (err) {
                            var praiseValue=new Array(product.praisetitles.length).fill(0);
                            Praise.getPraiseByProductId(product._id,function (praiseResults) {
                                for(var i=0;i<praiseResults.length;i++){ // 口碑查询结果
                                    for(var j=0;j<praiseValue.length;j++){
                                        if(praiseResults[i].praisestars[j]){
                                            if (praiseValue[j]){
                                                if (praiseResults[i].praisestars[j]&&praiseResults[i].praisestars[j]!=""){
                                                    praiseValue[j] = parseInt(praiseValue[j])+ parseInt(praiseResults[i].praisestars[j])
                                                }else{
                                                    praiseValue[j] = parseInt(praiseValue[j]);
                                                }
                                            }else{
                                                praiseValue[j] = parseInt(praiseResults[i].praisestars[j]);
                                            }
                                        }
                                    }
                                }
                                for(var j=0;j<praiseValue.length;j++){
                                    praiseValue[j] = parseFloat(praiseValue[j]/praiseResults.length).toFixed(2) ;
                                }
                                product.praisestars = praiseValue;
                                product.add(function (err) {
                                    next(null,null);
                                });
                            });
                        });
                    }
                });

            },function (err,rest) {

            })
        });
    },

    downloadForumImages:function () {

        Forum.getNeedDownload(function (results) {
            async.mapLimit(results, 1 ,function(item, forumCallback) {
                var imageurls = config.getImageUrls(item.content);
                async.mapSeries(imageurls, function(imageUrl, cb) {
                    if (imageUrl.toLowerCase().indexOf("?")>=0){
                        imageUrl = imageUrl.substring(0,imageUrl.toLowerCase().indexOf("?"));
                    }
                    http.request(imageUrl, function(response) {
                        // response.headers.location != undefined &&
                        if (response.headers["content-type"] != undefined &&
                            response.headers["content-type"].indexOf("image/")>=0){
                            // var downloadUrl = response.headers.location;
                            var downloadUrl = imageUrl;
                            // console.log(downloadUrl);
                            var extensionName = ".png";
                            if (downloadUrl.toLowerCase().indexOf(".jpeg")){
                                extensionName = ".jpeg";
                            }else if(downloadUrl.toLowerCase().indexOf(".png")){
                                extensionName = ".png";
                            }else if(downloadUrl.toLowerCase().indexOf(".jpg")){
                                extensionName = ".jpg";
                            }else if(downloadUrl.toLowerCase().indexOf(".bmp")){
                                extensionName = ".bmp";
                            }else{
                                extensionName = ".png";
                            }
                            var data = new Stream();
                            response.on('data', function(chunk) {
                                data.push(chunk);
                            });
                            response.on('end', function() {
                                var imageName = uuid.v4()+extensionName;
                                var imageFullPath = config.getImagePath()+"/"+imageName;
                                // console.log(imageFullPath);
                                fs.writeFileSync(imageFullPath, data.read());
                                cb(null,config.getUrlPath(imageFullPath));
                            });
                        }else{
                            cb(null,null);
                        }
                    }).end();
                }, function(err, result) {
                    item.images = result.filter(function (itemUrl) {
                        return itemUrl != null;
                    });
                    item.add();//保存论坛数据
                    // console.log(result);
                    forumCallback(null,result);
                })
            }, function(err,limitResult) {
                console.info('error==>' + err);
                console.info('limitResult==>' + limitResult);
            });
        });
    },

    updateUserAvator:function () {
        User.getUpdateUsers(function (items) {
            async.mapLimit(items,1,function(item,callback){
                Forum.getByUsername(item.username,function (forums) {
                    async.mapLimit(forums,1,function (forum,cb) {
                        forum.avator = item.avator;
                        forum.avatorPath = item.avatorPath;
                        forum.add(function (err) {
                            cb(null,forum);
                        });
                    },function (err,forumResults) {
                        callback(null,forumResults);
                    });
                })
            },function(err,results){
                console.log("==========update User Avator end =======");
            });
        });
    },
    updateCommentUserAvator:function () {
        User.getUpdateUsers(function (items) {
            async.mapLimit(items,1,function(item,callback){
                Comment.getCommentsByUsername(item.username,function (comments) {
                    async.mapLimit(comments,1,function (comment,cb) {
                        comment.avator = item.avator;
                        comment.avatorPath = item.avatorPath;
                        comment.add(function (err) {
                            cb(null,comment);
                        });
                    },function (err,commentResults) {
                        callback(null,commentResults);
                    });
                })
            },function(err,results){
                console.log("==========update Comment User Avator end =======");
            });
        });
    },
    updateNewsUserAvator:function () {
        User.getUpdateUsers(function (items) {
            async.mapLimit(items,1,function(item,callback){
                News.getNewsByUserName(item.username,function (newses) {
                    async.mapLimit(newses,1,function (news,cb) {
                        news.avator = item.avator;
                        news.avatorPath = item.avatorPath;
                        news.add(function (err) {
                            cb(null,news);
                        });
                    },function (err,newsResults) {
                        callback(null,newsResults);
                    });
                })
            },function(err,results){
                console.log("==========update News User Avator end =======");
            });
        });
    }
};