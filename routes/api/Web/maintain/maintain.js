var express = require('express');
var router = express.Router();
var https = require('https');
var async = require('async');
var config = require('../../config');
var User = require('../../../model/User');
var Forum = require('../../../model/Forum');
var TmpScore = require('../../../model/TmpScore');
var Score = require('../../../model/Score');
var md5 = require('md5');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var uuid = require('node-uuid');

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}


router.post('/generateNotes',function (req,res) {

    TmpScore.getAll(function (items) {
        async.mapLimit(items,1,function (item,cb) {
            const socre = new Score();
            socre.title = item.title;
            socre.type = item.type;
            socre.region = item.region;
            socre.difficult = item.difficult;
            socre.bpt = item.bpt;
            socre.style = item.style;
            socre.issueTime = new Date();
            console.log("https://www.8notes.com"+item.mp3[0]);

            var tofile = config.getScorePath()+"/"+item.mp3[0].split("/")[item.mp3[0].split("/").length-1];
            socre.mp3 = {"path":tofile.replace("./public/","/")};

            var pngfiles = new Array();
            for (var i= 0 ; i<item.files.length ; i++){
                console.log("https://www.8notes.com"+item.files[i]);
                var tmpfile = config.getScorePath()+"/"+item.files[i].split("/")[item.files[i].split("/").length-1];
                var tmpjson = {"path":tmpfile.replace("./public/","/")};
                pngfiles.push(tmpjson);
            }
            socre.files = pngfiles;
                User.getAdmins(function (admins) {
                    var num = GetRandomNum(1,admins.length);
                    var user = admins[num-1];
                    socre.author = user.username;
                    socre.avator = user.avator;
                    socre.avatorPath = user.avatorPath;
                    socre.add(function (err) {
                        cb(null,null);
                    })

                });
        },function (err,results) {
            
        })
    });

});

router.post('/notes', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    var lvl = requestJson["lvl"];
    var region = requestJson["region"];
    var type = requestJson["type"];
    var style = requestJson["style"];
    // "lvl":this.lvl,"region":this.region,"type":this.type,"style":this.style
    var noteurllist = requestJson["noteurl"];

    noteurllist = noteurllist.split(";");
    console.log(noteurllist);
    async.mapLimit(noteurllist,1,function (item,callback) {
        https.get(item,function (response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                // console.log(body);
                //<audio id="demo0" src="/school/mp32/guitar/water_music.mp3"></audio>

                var m,urls=[], rex =/<audio[^>]+src="([^">]+)"/g;
                while ( m = rex.exec( body ) ) {
                    urls.push( m[1] );
                }
                console.log(urls);
                // var pt.*?;
                //^A.*B$
                var rexbpt1 = /var pt.*;/g;
                var rexbpt2 = /var bt.*;/g;
                var rexbpt3 = /var bp.*;/g;

                var pt = rexbpt1.exec( body )[0];
                var bt = rexbpt2.exec( body )[0];
                var bp = rexbpt3.exec( body )[0];
                // console.log(rexbpt1.exec( body )[0]);
                // console.log(rexbpt2.exec( body )[0]);
                // console.log(rexbpt3.exec( body )[0]);

                var bpt = pt + bt + bp;

                var rexpng =/<div.*id=score[^>]+style="([^">]+)"/g;
                var pngfile = rexpng.exec( body )[1];
                if(pngfile.indexOf("url(")>=0){
                    pngfile = pngfile.substring(pngfile.indexOf("url(")+4,pngfile.indexOf(")"))
                }

                var pngfiles = new Array();
                pngfiles.push(pngfile);
                if(pt.indexOf("pt[2]")>=0){
                    pngfiles.push(pngfile.replace("001","002"));
                }
                if(pt.indexOf("pt[3]")>=0){
                    pngfiles.push(pngfile.replace("001","003"));
                }
                if(pt.indexOf("pt[4]")>=0){
                    pngfiles.push(pngfile.replace("001","004"));
                }
                if(pt.indexOf("pt[5]")>=0){
                    pngfiles.push(pngfile.replace("001","005"));
                }
                if(pt.indexOf("pt[6]")>=0){
                    pngfiles.push(pngfile.replace("001","006"));
                }
                if(pt.indexOf("pt[7]")>=0){
                    pngfiles.push(pngfile.replace("001","007"));
                }
                if(pt.indexOf("pt[8]")>=0){
                    pngfiles.push(pngfile.replace("001","008"));
                }
                if(pt.indexOf("pt[9]")>=0){
                    pngfiles.push(pngfile.replace("001","009"));
                }
                if(pt.indexOf("pt[10]")>=0){
                    pngfiles.push(pngfile.replace("001","010"));
                }
                console.log(pngfile);

            // <div id=tagtextn  >Mertz - Etude in A minor  sheet music </div>
                var rextitle =/<div.*id=tagtextn[^>](.*?)<\/div>/g;

                var titlename = rextitle.exec( body )[1];
                console.log(titlename);
                //生成score
                var score = new TmpScore();
                score.title = titlename.replace(">","");
                score.type = type;
                score.region = region;
                score.mp3 = urls;
                score.files = pngfiles;
                score.difficult = lvl;
                score.bpt = bpt;
                score.style = style;
                User.getAdmins(function (admins) {
                    var num = GetRandomNum(1,admins.length);
                    var user = admins[num-1];
                    score.author = user.username;
                    score.avatorPath = user.avatorPath;
                    score.add(function (err) {
                        callback(null,null);
                    });
                });
            });
        });
    },function (err,result) {

    });


});

router.post('/usernames',function (req,res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }

    var usernames = requestJson["usernames"].split(";");
    var avators = requestJson["avators"].split(";");
    async.mapLimit(usernames,1,function (item,callback) {
        var num = GetRandomNum(1,30);
        var user = new User();
        user.username = item;
        user.password = md5('12345qwert');
        user.email = item;
        user.avatorPath = "./public/img/avator/avator"+num+".jpg";
        user.avator = avators[usernames.indexOf(item)];
        user.registerTime = new Date();
        user.admin = "1";
        user.add(function (err) {
           callback(null,null)
        })
    },function (err,resulsts) {

    })
});

router.post('/format',function (req,res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    var videoPath = requestJson["videoPath"];
    console.log(videoPath);
    fs.readdir(videoPath,function(err,files){
        // console.log(err);
        if(err){
            return false;
        }
        // console.log(files);
        async.mapLimit(files,1,function(item,cb){
            // console.log(item);
            if (item.indexOf(".mp4")>=0){

            }else{

                var filename = item;
                if(filename==".DS_Store"){

                }else{
                    var absfilename = filename.split(".")[0];

                    console.log(videoPath+"/"+filename);
                    console.log(videoPath+"/"+absfilename+'.mp4');
                    // ffmpeg('/path/to/file.avi').format('flv');
                    ffmpeg(videoPath+"/"+filename).toFormat('mp4').saveToFile(videoPath+"/"+absfilename+'.mp4');
                }

            }
            cb(null,null);
        },function (err,results) {

        });
    });
});

router.post('/videos',function (req,res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    var videoPath = requestJson["videoPath"];
    var type = requestJson["type"];
    var subtype = requestJson["subtype"];

    console.log(type);
    console.log(subtype);
    fs.readdir(videoPath,function(err,files){
        if(err){
            return false;
        }
        async.mapLimit(files,1,function(item,cb){
            var filepath = videoPath+"/"+item;
            console.log(filepath);
            fs.stat(filepath, function(err, stat) {
                if (stat && stat.isDirectory()) {
                   cb(null,null);
                } else {
                    // 移动文件
                    console.log(item);
                    if (item.indexOf(".mp4")<=0){
                        cb(null,null);
                        return;
                    }
                    var videoName = uuid.v4()+".mp4";
                    var sourceFile = filepath;
                    var toPath = "./public/uploads/videos/"+config.getYmPath()+"/"+videoName;

                    fs.rename(sourceFile, toPath, function (err) {
                        if (err) throw err;
                        fs.stat(toPath, function (err, stats) {
                            if (err) throw err;
                            console.log('stats: ' + JSON.stringify(stats));

                        });
                    });
                    // 创建文件
                    var forum = new Forum();
                    forum.title = item.replace(".mp4","");
                    var content = '<p><span class="fr-video fr-dvb fr-draggable" contenteditable="false" draggable="true"><video "="" class="fr-draggable" controls="" src="'+toPath.replace("./public/","/")+'" style="width: 600px;">Your browser does not support HTML5 video.</video></span></p>';
                    forum.content = content;
                    forum.type = type;
                    forum.subType = subtype;

                    forum.issueTime = new Date();
                    forum.tags = "";
                    forum.videos = [toPath.replace("./public/","/")];

                    forum.comment = 0;
                    forum.read = 0;
                    forum.support = 0;
                    if (forum.videos.length > 0) {
                        var filename = uuid.v4() + ".png";
                        var fullfilename = config.thumbnailFullPath() + "/" + filename;
                        var images = new Array();
                        images.push(fullfilename);
                        forum.images = images;
                        // 读取视频的图片

                        ffmpeg(config.getPath(forum.videos[0])).screenshots({
                            timestamps: ['50%'],
                            filename: filename,
                            folder: config.thumbnailPath(),
                            size: '200x150'
                        });
                        // 读取视频的总时长
                        ffmpeg.ffprobe(config.getPath(forum.videos[0]), function (err, meta) {
                            if (meta.format.duration != undefined) {
                                var intduration = parseInt(meta.format.duration);
                                // console.log(intduration);
                                var hours = parseInt(intduration / 60 / 60);
                                // console.log(hours);
                                var mins = parseInt((intduration - hours * 60 * 60 ) / 60);
                                // console.log(mins);
                                var seconds = intduration - (hours * 60 * 60 + mins * 60);
                                // console.log(seconds);
                                if (hours > 0) {
                                    if (mins < 10) {
                                        mins = "0" + mins;
                                    }
                                    if (seconds < 10) {
                                        seconds = "0" + seconds;
                                    }
                                    forum.duration = hours + ":" + mins + ":" + seconds;
                                } else {
                                    if (seconds < 10) {
                                        seconds = "0" + seconds;
                                    }
                                    forum.duration = mins + ":" + seconds;
                                }
                                User.getAdmins(function (admins) {
                                    var num = GetRandomNum(1,admins.length);
                                    var user = admins[num-1];
                                    forum.author = user.username;
                                    forum.avator = user.avator;
                                    forum.avatorPath = user.avatorPath;
                                    forum.add(function (err) {
                                        cb(null,null);
                                    });
                                });
                            }
                        });
                    }
                }
            });
        },function(err,results){

        });
    })

});

module.exports = router;