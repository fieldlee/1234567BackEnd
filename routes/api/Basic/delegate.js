/**
 * Created by depengli on 2017/8/4.
 */
var express = require('express');
var router = express.Router();
var Delegate = require('../../model/Delegate');

/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Delegate.getAll(function (results) {
        var jsonResult = {success: true, results: results};
        res.json(jsonResult);
    });
});

router.get('/delete/:id', function(req, res) {

    if(req.params.id){
        Delegate.deleteAdsById(req.params.id,function (result) {
            if (result.result.ok == 1){
                var jsonResult = {"success": true};
                res.json(jsonResult);
            }else{
                var jsonResult = {"success": false};
                res.json(jsonResult);
            }
        });
    }else{
        var jsonResult = {"success": false};
        res.json(jsonResult);
    }
});


router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    // name:String,
    //     address:String,
    //     email:String,
    //     telephone:String,
    //     province:String,
    //     city:String,
    //     district:String,
    //     images:{type:Array,default:[]}
    if (requestJson["_id"] != null && requestJson["_id"] != "" && requestJson["_id"] != undefined) {
        Delegate.getDelegateById(requestJson["_id"],function (item) {
            item.name = requestJson["name"];
            item.address = requestJson["address"];
            item.email = requestJson["email"];
            item.telephone = requestJson["telephone"];
            item.province = requestJson["province"];
            item.city = requestJson["city"];
            item.district = requestJson["district"];
            item.images = requestJson["images"];
            item.add(function (err) {
                var jsonResult = {success: true,"data":item};
                res.json(jsonResult);
                return;
            });
        });
    }else{
        var item = new Delegate();
        item.name = requestJson["name"];
        item.address = requestJson["address"];
        item.email = requestJson["email"];
        item.telephone = requestJson["telephone"];
        item.province = requestJson["province"];
        item.city = requestJson["city"];
        item.district = requestJson["district"];
        item.images = requestJson["images"];
        item.add(function (err) {
            var jsonResult = {success: true,"data":item};
            res.json(jsonResult);
            return;
        });
    }

});

module.exports = router;
