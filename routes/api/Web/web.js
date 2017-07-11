/**
 * Created by depengli on 2017/7/6.
 */
/**
 * Created by depengli on 16/12/20.
 */
'use strict';
var express = require('express');
var passport = require('passport');

//router
var router = express.Router();
router.use(function (req,res,next) {
    console.log("web:");
    console.log(req.path);
    next();
});

router.use('/ads', require('./ads'));
router.use('/file', require('./file'));
router.use('/upload', require('./upload'));
router.use('/news', require('./news'));
router.use('/action', require('./action'));
router.use('/forum', require('./forum'));
router.use('/brand', require('./brand'));
router.use('/product', require('./product'));

//exports
module.exports = router;