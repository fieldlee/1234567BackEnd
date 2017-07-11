/**
 * Created by depengli on 16/12/20.
 */
'use strict';
var express = require('express');
var passport = require('passport');

//router
var apiRouter = express.Router();
apiRouter.use(function (req,res,next) {
    console.log(req.path);
    next();
});

apiRouter.use('/basic', require('./Basic/basic'));
apiRouter.use('/web', require('./Web/web'));
apiRouter.use('/mobile', require('./Mobile/mobile'));
//exports
module.exports = apiRouter;