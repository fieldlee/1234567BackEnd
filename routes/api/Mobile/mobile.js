/**
 * Created by depengli on 16/12/20.
 */
'use strict';
var express = require('express');
var passport = require('passport');

//router
var router = express.Router();
router.use(function (req,res,next) {
    console.log(req.path);
    next();
});


// router.use('/1.0', require('./1.0/v1.0'));

//exports
module.exports = router;