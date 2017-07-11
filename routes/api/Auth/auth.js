/**
 * Created by depengli on 2017/7/11.
 */
'use strict';
var express = require('express');
var passport = require('passport');

//router
var router = express.Router();

router.use('/register', require('./register'));

//exports
module.exports = router;