/**
 * Created by depengli on 2017/7/6.
 */
/**
 * Created by depengli on 16/12/20.
 */
'use strict';
var express = require('express');
var passport = require('passport');
var config = require('../config');
//router
var router = express.Router();
router.use(function (req,res,next) {
    console.log("web:");
    console.log(req.path);
    next();
});
router.use('/file', require('./file'));
router.use('/upload', require('./upload'));
router.use('/forum', require('./forum'));

router.use(function(req, res, next) {
    if (config.verifyToken(req)){
        next();
    }else{
        var jsonResult = {"success": false,"message":"请您登录后，再继续操作吧！"};
        res.json(jsonResult);
    }
});

router.use('/ads', require('./ads'));
router.use('/news', require('./news'));
router.use('/action', require('./action'));
router.use('/brand', require('./brand'));
router.use('/product', require('./product'));

//exports
module.exports = router;