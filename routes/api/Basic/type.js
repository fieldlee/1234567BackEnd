/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uuid = require('node-uuid');

var InstrumentTypeSchma = require('../../model/basicModel/InstrumentType');
var InstrumentSubTypeSchma = require('../../model/basicModel/InstrumentSubType');

var db = mongoose.createConnection("mongodb://localhost:27017/instrument", {
    connectTimeout: 200000,
    poolSize: 40,
    ssl: true
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("DB connected");
    // yay!
});



/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    InstrumentTypeSchma.getAll(function (results) {
        var jsonResult = {success: true, results: results};
        res.json(jsonResult);
    });
});

router.get('/allsubtype', function(req, res) {
    InstrumentSubTypeSchma.getAllSubType(function (results) {
        var jsonResult = {success: true, results: results};
        res.json(jsonResult);
    });
});

router.get('/:type', function(req, res) {
    var type = req.params.type;
    InstrumentSubTypeSchma.getAllByType(type,function (results) {
        var jsonResult = {success: true, results: results};
        res.json(jsonResult);
    });
});


router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["types"] instanceof Array) {
        var types = requestJson["types"];
        InstrumentTypeSchma.deleteAll(function (result) {
            console.log(result.result)
        });
        for(t in types){
            if(types[t] != null && types[t] != ""){
                var typeObj = new InstrumentTypeSchma();
                typeObj.id = uuid.v4();
                typeObj.type = types[t] ;
                typeObj.add(function (err) {
                    console.log(err)
                });
            }
        }
    }
    var jsonResult = {success: true};
    res.json(jsonResult);
});
router.post('/:type', function(req, res) {
    var type = req.params.type;
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }

    if (requestJson["subtypes"] instanceof Array) {
        var subtypes =  requestJson["subtypes"];

        InstrumentSubTypeSchma.deleteByType(type,function (result) {
            console.log(result.result);
        });

        for(s in subtypes) {
            if(subtypes[s] != null && subtypes[s] != ""){
                var subObj = new InstrumentSubTypeSchma();
                subObj.id = uuid.v4();
                subObj.type = type ;
                subObj.subType =  subtypes[s];
                subObj.add(function (err) {
                    console.log(err);
                });
            }
        }
    }
    var jsonResult = {success: true};
    res.json(jsonResult);
});

router.post('/:type/:subtype', function(req, res) {
    var type = req.params.type;
    var subtype = req.params.subtype;
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    console.log("------=======--------");
    console.log(requestJson);
    if (requestJson["configs"] instanceof Array) {
        var configs =  requestJson["configs"];
        InstrumentSubTypeSchma.getAllByTypeAndSubType(type,subtype,function (result) {
            console.log(result);
            result.configs = configs;
            result.add(function (err) {
                console.log(err);
            });
        });
    }
    var jsonResult = {success: true};
    res.json(jsonResult);
});
module.exports = router;
