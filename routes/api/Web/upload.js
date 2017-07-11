/**
 * Created by depengli on 2017/7/6.
 */
var express = require('express');
var multer = require('multer');
var uuid = require('node-uuid');
var router = express.Router();
var app = express();
var path = require('path');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});

var FroalaEditor = require('./lib/froalaEditor.js');



router.post('/upload_image', function (req, res) {
    console.log("upload_image");
    FroalaEditor.Image.upload(req, '/uploads/images/', function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/upload_image_resize', function (req, res) {
    console.log("upload_image_resize");
    var options = {
        resize: [300, 300]
    };
    FroalaEditor.Image.upload(req, '/uploads/images/', options, function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/upload_image_validation', function (req, res) {
    console.log("upload_image_validation");
    var options = {
        fieldname: 'myImage',
        validation: function(filePath, mimetype, callback) {

            gm(filePath).size(function(err, value){

                if (err) {
                    return callback(err);
                }

                if (!value) {
                    return callback('Error occurred.');
                }

                if (value.width != value.height) {
                    return callback(null, false);
                }
                return callback(null, true);
            });
        }
    };

    FroalaEditor.Image.upload(req, '/uploads/images/', options, function(err, data) {

        if (err) {
            return res.send(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/upload_file', function (req, res) {
    console.log("upload_file");
    var options = {
        validation: null
    };

    FroalaEditor.File.upload(req, '/uploads/files/', options, function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/upload_file_validation', function (req, res) {
    console.log("upload_file_validation");
    var options = {
        fieldname: 'myFile',
        validation: function(filePath, mimetype, callback) {

            fs.stat(filePath, function(err, stat) {

                if(err) {
                    return callback(err);
                }

                if (stat.size > 10 * 1024 * 1024) { // > 10M
                    return callback(null, false);
                }

                return callback(null, true);

            });
        }
    };

    FroalaEditor.File.upload(req, '/uploads/files/', options, function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        res.send(data);
    });
});

router.post('/delete_image', function (req, res) {
    console.log("delete_image");
    FroalaEditor.Image.delete(req.body.src, function(err) {
        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

router.post('/delete_file', function (req, res) {
    console.log("delete_file");
    FroalaEditor.File.delete(req.body.src, function(err) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.end();
    });
});

router.get('/load_images', function (req, res) {
    console.log("load_images");
    FroalaEditor.Image.list('/uploads/images/', function(err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }
        return res.send(data);
    });
});

router.get('/get_amazon', function (req, res) {
    console.log("get_amazon");
    var configs = {
        bucket: process.env.AWS_BUCKET,
        region: process.env.AWS_REGION,
        keyStart: process.env.AWS_KEY_START,
        acl: process.env.AWS_ACL,
        accessKey: process.env.AWS_ACCESS_KEY,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY
    };

    var configsObj = FroalaEditor.S3.getHash(configs);
    res.send(configsObj);
});

// Create folder for uploading files.
var imagesDir = path.join(path.dirname(path.dirname(require.main.filename)), 'public/uploads/images');
var filesDir = path.join(path.dirname(path.dirname(require.main.filename)), 'public/uploads/files');
var videosDir = path.join(path.dirname(path.dirname(require.main.filename)), 'public/uploads/videos');
if (!fs.existsSync(filesDir)){
    fs.mkdirSync(filesDir);
}
if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir);
}
if (!fs.existsSync(videosDir)){
    fs.mkdirSync(videosDir);
}


module.exports = router;