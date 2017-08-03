/**
 * Created by depengli on 16/12/20.
 */
'use strict';
var express = require('express');
var passport = require('passport');
var config = require('./config');
var async = require('async');
var schdule = require('node-schedule');
var Forum = require('../model/Forum');
var User = require('../model/User');
var Product = require('../model/Product');
var Praise = require('../model/Praise');
var ConfigPraise = require('../model/ConfigPraise');
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
rule.hour = 12;
rule.minute = 57;
schdule.scheduleJob(rule, function(){
    console.log("执行任务==start");
    console.log("计算会员信息");
    User.getAll(function (users) {
        async.map(users, function(user, next) {
            Forum.getByUsername(user.username,function (results) {
                user.issueCount = results.length;
                if (user.issueCount>=50){
                    user.lvl = "银会员";
                }else if(user.issueCount>=100){
                    user.lvl = "金会员";
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
    // console.log("计算口碑信息");
    Product.getAll(function (results) {
        async.map(results,function (product,next) {
            ConfigPraise.getConfigByType(product.type,function (config) {
                product.praisetitles = config.tags;
                product.add(function (err) {
                    var praiseValue=new Array(product.praisetitles.length);
                    Praise.getPraiseByProductId(product._id,function (praiseResults) {
                        for(var i=0;i<praiseResults.length;i++){
                            for(var j=0;j<praiseValue.length;j++){
                                if(praiseResults.praisestars[j]){
                                    if (praiseValue[j]){
                                        if (raiseValue[j]&&raiseValue[j]!=""){
                                            praiseValue[j] = parseInt(praiseValue[j])+ parseInt(raiseValue[j])
                                        }

                                    }else{
                                        praiseValue[j] = parseInt(raiseValue[j]);
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
            });

        },function (err,rest) {
            
        })
    });
    console.log("执行任务===end");
});

//exports
module.exports = apiRouter;