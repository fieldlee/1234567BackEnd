/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var uuid = require('node-uuid');

var ProviceSchma = require('../../model/basicModel/Provice');
var CitySchma = require('../../model/basicModel/City');
var DistrictSchma = require('../../model/basicModel/District');

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

router.use(function (req,res,next) {
    console.log("city:");
    console.log(req.path);
    next();
});


/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    ProviceSchma.getAll(function (results) {
        var jsonResult = {success: true, results: results};
        res.json(jsonResult);
    });

});


router.get('/:province', function(req, res) {
    var province = req.params.province;
    CitySchma.getCity(province,function (results) {
        console.log(results);
        var jsonResult = {success: true, results: results};
        res.json(jsonResult);
    });
});

router.get('/:province/:city', function(req, res) {
    var province = req.params.province;
    var city = req.params.city;

    DistrictSchma.getDistrict(province,city,function (results) {
        console.log(results);
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

    if (requestJson["provinces"] instanceof Array) {
        var provinces = requestJson["provinces"];
        ProviceSchma.deleteAll(function (result) {
           console.log(result.result);
        });
        for (p in provinces){
            var ProObj = new ProviceSchma();
            ProObj.id = uuid.v4();
            ProObj.order = Number(p) + 1 ;
            ProObj.name =  provinces[p];
            ProObj.add(function (err) {
                console.log(err);
            });
        }

    }
    var jsonResult = {success: true};
    res.json(jsonResult);
});
router.post('/:province', function(req, res) {
    var province = req.params.province;
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if (requestJson["citys"] instanceof Array) {
        var citys = requestJson["citys"];
        CitySchma.deleteCity(province,function (result) {
            console.log(result.result);
        });
        for (p in citys){
            if (citys[p] != null && citys[p] != "") {
                var CityObj = new CitySchma();
                CityObj.id = uuid.v4();
                CityObj.order = Number(p) + 1 ;
                CityObj.provice =  province;
                CityObj.city =  citys[p];
                CityObj.add(function (err) {
                    console.log(err);
                })
            }
        }
    }
    var jsonResult = {success: true};
    res.json(jsonResult);
});

router.post('/:province/:city', function(req, res) {
    var province = req.params.province;
    var city = req.params.city;

    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    console.log(requestJson);
    if (requestJson["districts"] instanceof Array) {
        var districts = requestJson["districts"];
        DistrictSchma.deleteDistrict(province,city,function (result) {
            console.log(result.result);
        });
        console.log(districts.length);
        for (d in districts){
            console.log(districts[d]);
            if (districts[d] != null && districts[d] != "") {
                var DistrictObj = new DistrictSchma();
                DistrictObj.id = uuid.v4();
                DistrictObj.order = Number(d) + 1 ;
                DistrictObj.provice =  province;
                DistrictObj.city =  city;
                DistrictObj.district =  districts[d];
                DistrictObj.add(function (err) {
                    console.log(err);
                });
            }

        }
    }
    var jsonResult = {success: true};
    res.json(jsonResult);
});

module.exports = router;
