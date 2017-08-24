var express = require('express');
var router = express.Router();
var Tag = require('../../model/Tag');
/* GET users listing. */
// req.params.type
router.get('/', function(req, res) {
    Tag.getAll(function (results) {
        var jsonResult = {"success":true,"results":results};
        res.json(jsonResult);
        return;
    })
});

router.get('/:type', function(req, res) {
    Tag.getTagForType(req.params.type,function (results) {
        var jsonResult = {"success":true,"results":results};
        res.json(jsonResult);
        return;
    });
});

router.get('/:type/:subType', function(req, res) {
    Tag.getTagForTypeAndSub(req.params.type,req.params.subType,function (results) {
        var jsonResult = {"success":true,"results":results};
        res.json(jsonResult);
        return;
    });
});

module.exports = router;
