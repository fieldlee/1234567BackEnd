/**
 * Created by depengli on 2017/7/11.
 */
'use strict';
var express = require('express');
var passport = require('passport');

//router
var router = express.Router();

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/forget', require('./forget'));
router.use('/user', require('./user'));
router.use('/changepassword', require('./changepassword'));
//exports
module.exports = router;