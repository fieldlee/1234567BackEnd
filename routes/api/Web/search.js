
var express = require('express');
var router = express.Router();
var async = require('async');
var config = require('../config');
var Forum = require('../../model/Forum');
var Product = require('../../model/Product');
var User = require('../../model/User');
/* GET users listing. */
// req.params.type

router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    console.log(requestJson);
    if (requestJson["key"] != null && requestJson["key"] != "" && requestJson["key"] != undefined){
        async.series({
                one: function(callback){
                    Product.searchProducts(requestJson["key"],function (results) {
                        callback(null,results);
                    });
                },
                two: function(callback){
                    Forum.searchForums(requestJson["key"],function (results) {
                        var handleResults = new Array();
                        if (results.length>0){
                            for (var i = 0, len = results.length; i < len; i++) {
                                results[i].fromTime = config.preTime(results[i].issueTime);
                                handleResults.push(results[i]);
                            }
                            callback(null,handleResults);
                        }else{
                            callback(null,handleResults);
                        }

                    })
                }
            },
            function(err, results) {
                if (err==null){
                    var resultJson = {};
                    resultJson["forums"] = results.two;
                    resultJson["forumCount"] = results.two.length;
                    resultJson["products"] = results.one;
                    resultJson["productCount"] = results.one.length;
                    resultJson["success"] = true;
                    res.json(resultJson);
                    return;
                }
            });
    }

});

module.exports = router;
