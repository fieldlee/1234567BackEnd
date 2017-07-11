/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var multer = require('multer');
var uuid = require('node-uuid');
var router = express.Router();
var app = express();
var fs = require('fs');
var path = require('path');
var Image = require('../../model/Image');


var rootPath = "/uploads/formupload/";
/* GET users listing. */
// req.params.type
router.delete('/:imagepath',function (req,res) {
    var imagepath = req.params.imagepath;
    console.log(imagepath);
    imagepath = rootPath + imagepath;
    var filepath = path.join(path.join(path.dirname(path.dirname(require.main.filename)),"public"), imagepath);
    console.log(filepath);
    fs.unlink(filepath, function (err) {
        if (err) {
            res.json({"success":false});
        }
        res.json({"success":true});
    });
});


router.post('/delete',function (req,res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    console.log(requestJson);

    if (requestJson["imagepath"] != null && requestJson["imagepath"] != "" && requestJson["imagepath"] != undefined ){
        Image.removeImageByPath(requestJson["imagepath"],function (result) {
            console.log(result.result.ok);

            if (result.result.ok !== 1){
                res.json({success:false})
            }

            var filepath = path.join(path.join(path.dirname(path.dirname(require.main.filename)),"public"), requestJson["imagepath"]);
            console.log(filepath);
            fs.stat(filepath, function(err, stat) {
                if(err == null) {
                    if(stat.isFile()) {
                        fs.unlink(filepath, function (err) {
                            console.log(err);
                            if (err) {
                                res.json({"success":false,"message":"删除失败"});
                            }
                            res.json({"success":true});
                        });
                    } else {
                        res.json({"success":false,"message":"文件路径不对"});
                    }
                } else if(err.code == 'ENOENT') {
                    res.json({"success":false,"message":"文件不存在"});
                } else {
                    res.json({"success":false,"message":"文件无法删除"});
                }
            });

        });

    }
});

router.post('/',function(req,res){
    console.log("app web file upload");
    var fileName = "";
    var originName = "";
    var storage =   multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public'+rootPath);
        },
        filename: function (req, file, callback) {

            originName = file.originalname;

            var fileExtension = "";
            if (file.mimetype) {
                if (file.mimetype == 'image/jpeg' ){
                    fileExtension = ".jpg"
                }
                if (file.mimetype == 'image/png' ){
                    fileExtension = ".png"
                }
                if (file.mimetype == 'image/gif' ){
                    fileExtension = ".gif"
                }
                if (file.mimetype == 'image/gif' ){
                    fileExtension = ".gif"
                }
                if (file.mimetype == 'image/pjpeg' ){
                    fileExtension = ".jpeg"
                }
                if (file.mimetype == 'image/x-png' ){
                    fileExtension = ".png"
                }
                if (file.mimetype == 'image/svg+xml' ){
                    fileExtension = ".svg"
                }

            }
            fileName = uuid.v4()+fileExtension;
            callback(null, fileName);
        }
    });
    multer({ storage : storage}).single('userPhoto')(req,res,function (err) {

        if(err) {
            console.log(err);
            res.json({success:false})
        }
        var uploadImage = new Image();
        uploadImage.originName = originName;
        uploadImage.path =  rootPath+fileName;
        var filepath = path.join(path.join(path.dirname(path.dirname(require.main.filename)),"public"), uploadImage.path);
        fs.stat(filepath, function (err, stats) {
            console.log(stats.size/1024);
            var stringSize = "0KB";
            if (err) {
                uploadImage.size = stringSize;
            }else{
                if ((stats.size/1024) > 1024) {
                    stringSize = (stats.size/1024/1024).toFixed(2) + "MB";
                }else{
                    stringSize = (stats.size/1024).toFixed(2) + "KB";
                }
                uploadImage.size = stringSize;
            }
            uploadImage.add(function () {
                console.log(uploadImage);
                res.json({"success":true,"path":uploadImage.path,"originName":uploadImage.originName});
            });
        });
    });
});
module.exports = router;
