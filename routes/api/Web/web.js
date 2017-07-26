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
router.use('/brand', require('./brand'));
router.use('/comment', require('./comment'));
// router.use(function(req, res, next) {
//     console.log(config.verifyToken(req));
//     if (config.verifyToken(req)){
//         console.log("head token had got");
//         next();
//     }else{
//         var jsonResult = {"success": false,"message":"请您登录后，再继续操作吧！"};
//         res.json(jsonResult);
//     }
// });

router.use('/ads', require('./ads'));
router.use('/news', require('./news'));
router.use('/action', require('./action'));
router.use('/product', require('./product'));
router.use('/follow', require('./follow'));
router.use('/praise', require('./praise'));
router.use('/search', require('./search'));
//exports
module.exports = router;