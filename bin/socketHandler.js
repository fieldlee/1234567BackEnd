var Show = require('../routes/model/Show');
var Class = require('../routes/model/Class');
var User = require('../routes/model/User');
var Reward = require('../routes/model/Reward');
var config = require('../routes/api/config');
var async = require('async');

module.exports = function(io, streams) {

    function mleave(client,mainid) {

        async.series({
            one:function (callback) {
                Show.getShowByMainId(mainid,function (item) { //如果主播退出，更新状态
                    if (item != null){
                        item.status = config.LiveStatus.OVER;
                        item.mainid = "";
                        item.members = [];
                        item.add(function (err) {
                            console.log(err);
                            callback(null,null);
                            client.broadcast.emit('mainLeave',{});
                        })
                    }else{
                        callback(null,null);
                    }
                });
            },
            two:function (callback) {
                Class.getClassByMainId(mainid,function (item) {
                    if (item != null){
                        item.status = config.ClassStatus.OVER;
                        item.mainid = "";
                        item.members = [];
                        item.add(function (err) {
                            console.log(err);
                            callback(null,null);
                            client.broadcast.emit('mainLeave',{});
                        })
                    }else{
                        callback(null,null);
                    }
                });
            },
            three:function (callback) {
                Show.getShowByMember(mainid,function (items) { //观众离场
                    if(items.length>0){
                        async.mapLimit(items,1,function (item,mapcallback) {
                            item.members = item.members.filter(function (t) {
                                return t != mainid
                            });
                            item.add(function (err) {
                                if (err) console.error(err.stack);
                                mapcallback(null,null);
                            })
                        },function (err,results) {
                            callback(null,null);
                        });
                    }else{
                        callback(null,null);
                    }
                });
            },
            four:function (callback) {
                Class.getClassByMember(mainid,function (items) { //学生离场
                    if(items.length>0){
                        async.mapLimit(items,1,function (item,mapcallback) {
                            item.members = item.members.filter(function (t) {
                                return t != mainid
                            });
                            item.add(function (err) {
                                if (err) console.error(err.stack);
                                mapcallback(null,null);
                            })
                        },function (err,results) {
                            callback(null,null);
                        });
                    }
                    else{
                        callback(null,null);
                    }
                });
            }

        },function (err,results) {

        });

    }

    io.on('connection', function(client) {
        console.log('-- ' + client.id + ' joined --');
        client.emit('id', client.id);

        client.on('message', function (details) {
            var otherClient = io.sockets.connected[details.to];

            if (details.type == "message"){
                if (details.room){
                    delete details.to;
                    details.from = client.id;
                    console.log(details);
                    io.in(details.room).emit('message',details);
                    // client.broadcast.to(details.room).emit('message',details); //广播消息
                    return;
                }
            }

            if (!otherClient) {
                return;
            }
            delete details.to;
            details.from = client.id;
            console.log(details);
            otherClient.emit('message', details);
        });

        client.on('readyToStream', function(options) {
            console.log('-- ' + client.id + ' is ready to stream --');

            client.broadcast.emit('readyToStream',{}); //传播ready信息号，刷新列表

            //发送 数据参数， 可以修改数据的状态
            console.log(options);
            streams.addStream(client.id, options.name);
        });

        client.on('update', function(options) {

            streams.update(client.id, options.name);
        });
        // 加入房间
        client.on('joinRoom', function (options) {
            //{room:self.id,id:id}  isPresent
            console.log("======joinRoom options =======",options);
            if (options.room){ //根据room id 生成
                if (options.isPresent){ //如果是主播要更新数据
                    Show.getShowById(options.room,function (item) {
                        item.mainid = client.id;
                        item.status = config.LiveStatus.LIVE;
                        item.add(function (err) {
                            console.log("======room emit 1 =======",{"presentid":client.id});
                            // client.broadcast.to(client.id).emit('present',{"presentid":client.id});
                            // client.broadcast.to(options.room).emit('present',{"presentid":client.id});
                            io.to(options.room).emit('present',{"presentid":client.id});
                        });
                    })
                }else{
                    Show.getShowById(options.room,function (item) {
                        // item.mainid 主播id
                        if (item != null){
                            var members = item.members;
                            members.push(client.id);
                            item.members  = members;
                            item.add(function (err) {
                                console.log("======room emit 2 =======",{"presentid":item.mainid});
                                // client.broadcast.to(client.id).emit('present',{"presentid":item.mainid});
                                // client.broadcast.to(options.room).emit('present',{"presentid":item.mainid});
                                io.to(options.room).emit('present',{"presentid":item.mainid});
                            });
                        }

                    })
                }
                client.join(options.room); //加入room
            }
        });

        client.on('reward', function (options) {
            console.log("======reward =======",options);
            //     room:this.id,
            //     id:this.client.getId(),
            //     from:window.localStorage.getItem("username"),
            //     to:this.rewardto,
            //     rewardid:id,
            //     rewardname:name,
            //     rewardvalue:value
            var reward = new Reward();
            reward.rewardname = options.rewardname;
            reward.rewardvalue=options.rewardvalue;
            reward.rewardid =options.rewardid;
            reward.rewardfrom = options.from;
            reward.rewardto = options.to;
            reward.rewardroom = options.room;
            reward.rewardtime = new Date();
            reward.add(function (err) {
                if (err){

                }
                User.getUserByUserName(options.from,function (item) {
                    var messageDetail = {
                        "type": "message",
                        "from":client.id,
                        "room":options.room,
                        "avator": item.avator,
                        "avatorPath": item.avatorPath,
                        "message": "送出<img class='img-thumbnail' src='./public/img/food/40X40/"+options.rewardid+".png'>"
                    };
                    console.log(messageDetail);
                    client.broadcast.to(options.room).emit('message',messageDetail); //广播消息
                });

            });
        });

        function leave(options) {
            // console.log(options);
            console.log('-- ' + client.id + ' left --');
            if(options.id != undefined){
                console.log('-- ' + options.id + ' left --');
                client.leave(options.id);//离开room
            }

            mleave(client,client.id);//离场

            streams.removeStream(client.id);
        }
        client.on('disconnect', leave);
        client.on('leave', leave);
    });
};