/**
 * Created by depengli on 16/12/20.
 */
'use strict';
var express = require('express');
var passport = require('passport');
var config = require('./config');
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
//exports
module.exports = apiRouter;