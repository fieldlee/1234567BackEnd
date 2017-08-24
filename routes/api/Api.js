/**
 * Created by depengli on 16/12/20.
 */
'use strict';
var express = require('express');
var passport = require('passport');
var config = require('./config');
var schdule = require('node-schedule');
var Forum = require('../model/Forum');
var Praise = require('../model/Praise');
var ConfigPraise = require('../model/ConfigPraise');
var handle = require('./Handle/handle');
//router
var apiRouter = express.Router();
apiRouter.use(function (req,res,next) {
    console.log(req.path);
    next();
});

apiRouter.use('/auth', require('./Auth/auth'));

apiRouter.use('/basic', require('./Basic/basic'));

apiRouter.use('/mobile', require('./Mobile/mobile'));

apiRouter.use('/web', require('./Web/web'));


var rule = new schdule.RecurrenceRule();
rule.dayOfWeek = [0, new schdule.Range(1, 6)];
rule.hour = 11;
rule.minute = 35;
schdule.scheduleJob(rule, function(){
    console.log("执行任务==start");
    console.log("计算会员信息====start");
    handle.userLvl();
    console.log("计算会员信息=====end");
    console.log("计算口碑信息=====start");
    handle.praiseProduct();
    console.log("计算口碑信息=====end");

    console.log("下载拷贝过来的图片=====start");
    handle.downloadForumImages();
    console.log("下载拷贝过来的图片=====end");

    console.log("tag=====start");
    handle.tags();
    console.log("tag=====end");

    handle.updateUserAvator(); // 更新用户的头像
    handle.updateNewsUserAvator(); //更新新闻用户的头像
    handle.updateCommentUserAvator(); //更新回复用户户的头像

    console.log("执行任务===end");
});

//exports
module.exports = apiRouter;