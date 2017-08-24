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
        var tags = new Array();
        // { _id: { type: '键盘乐器', name: '钢琴' }, total: 4 } ]

        for(var i =0 ;i<results.length;i++){
            var element = results[i];
            if (element._id.type == req.params.type){
                tags.push(element._id.name);
                if (tags.length>=10){
                    break;
                }
            }
        }

        var jsonResult = {"success":true,"results":tags};
        res.json(jsonResult);
        return;
    });
});

router.get('/:type/:subType', function(req, res) {
    Tag.getTagForTypeAndSub(req.params.type,req.params.subType,function (results) {

        var tags = new Array();

        for(var i =0 ;i<results.length;i++){
            var element = results[i];
            if (element._id.type == req.params.type && element._id.subType == req.params.subType){
                tags.push(element._id.name);
                if (tags.length>=10){
                    break;
                }
            }
        }

        var jsonResult = {"success":true,"results":tags};
        res.json(jsonResult);
        return;
    });
});

module.exports = router;
