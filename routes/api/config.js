/**
 * Created by depengli on 2017/7/5.
 */
'use strict';
var jwt    = require('jsonwebtoken');

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};

var date = new Date();
date.yyyymmdd();
module.exports = {
    getDatabase: function () {
        return 'mongodb://localhost:27017/instrument?socketTimeoutMS=200000';
    },
    tokenSecret: 'wsxzaqujmtgbedcrfvqwertyuiopasdfghjklzxcvbnm',
    successJson: {"success": true},
    failJson: {"success": false},
    getToken: function (username) {
        var token = jwt.sign({"username":username}, this.tokenSecret, { expiresIn: '365 days'});
        return token;
    },
    verifyToken: function (req) {
        var token = req.headers['x-access-token'];
        // decode token
        if (token) {
            try {
                console.log("verifyToken:");
                console.log(jwt.verify(token, this.tokenSecret));
                return jwt.verify(token, this.tokenSecret);
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    },
    getUsername: function (req) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            try {
                var userJson = jwt.decode(token, this.tokenSecret);//{username: username}
                console.log(userJson);
                return userJson["username"];
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    },
    isMail:function(str) {
        var reg = /^([a-za-z0-9]+[_|-|.]?)*[a-za-z0-9]+@([a-za-z0-9]+[_|-|.]?)*[a-za-z0-9]+.[a-za-z]{2,3}$/;
        return reg.test(str);
    },
    isPhone:function (str) {

        var reg = /^1(3|4|5|7|8)\d{9}$/;
        return reg.test(str);
    },
    preTime:function (date) {

        var oldDate = new Date(date);

        var now = new Date();
        //var d2 = new Date(stamp);
        //计算当前时间距结束时间多少秒
        var seconds = parseInt(now - oldDate)/1000;

        //计算相差多少天
        var day = parseInt(seconds/86400);//获得天数
        var hour = parseInt(seconds/3600-day*24);//获得小时数
        var minute = parseInt(seconds/60-(hour*60+day*1440));//获得分钟数
        if(day>30){
            return date.yyyymmdd();
        }else if(day>1 && day<=30){
            return day + "天前";
        }else if(hour>1 && hour<=24){
            return hour + "小时前";
        }else{
            return minute + "分钟前";
        }
        // if(minute<=60)
        //     return minute + "分钟前";
        // else if(hour<=24)
        //     return hour + "小时前";
        // else if (day<=30)
        //     return day + "天前";
        // else
        //     return date.yyyymmdd();
    },
    getRootPath:function () {
      return "http://localhost:3000";
    },
    getPath:function (path) {
        var replacePath = path.replace(this.getRootPath(),"./public");
        return replacePath;
    },
    getUrlPath :function (path) {
        var replacePath = path.replace("./public",this.getRootPath());
        return replacePath;
    },
    getYmPath:function () {
        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth()+1;
        var ymPath = "";
        if (curMonth>=10){
            ymPath = curYear+""+curMonth;
        }else{
            ymPath = curYear+"0"+curMonth;
        }
        return ymPath;
    },
    thumbnailFullPath:function () {
        return this.getRootPath()+"/uploads/files/"+this.getYmPath();
    },
    thumbnailPath:function () {
        return "./public/uploads/files/"+this.getYmPath();
    },
    getImagePath:function () {
        return "./public/uploads/images/"+this.getYmPath();
    },
    getImageUrls:function(content){
        var m,urls = [],rex =/<img[^>]+src="(http:\/\/[^">]+)"/g;
        while ( m = rex.exec( content ) ) {
            urls.push( m[1] );
        }
        return urls;
    }
};
