/**
 * Created by depengli on 16/12/20.
 */
'use strict';
var express = require('express');
var passport = require('passport');


//router
var apiRouter = express.Router();


apiRouter.use(function (req,res,next) {
    console.log("basic:");
    console.log(req.path);
    next();
});

apiRouter.use('/city', require('./city'));
apiRouter.use('/type', require('./type'));
apiRouter.use('/configpraise', require('./configpraise'));
//exports
module.exports = apiRouter;