var Show = require('../routes/model/Show');
var User = require('../routes/model/User');

module.exports = function(io, streams) {
    function openShow(mainid,clientid){
        Show.getShowById(mainid,function (item) {
            item.status = "直播中";
            item.mainid = clientid;
            item.add();
        });
    }

    function audienceJoin(mainid,clientid){
        Show.getShowByMainId(mainid,function (item) {
            if(item != null){
                var members = item.members;
                members.push(clientid);
                item.members  = members;
                item.add();
            }
        });
    }
    
    function mainLeave(mainid) {
        Show.getShowByMainId(mainid,function (item) { //如果主播退出，更新状态
            if (item != null){
                item.status = "直播结束";
                item.mainid = "";
                item.members = [];
                item.add();
            }
        });
    }
    function audienceLeave(audieId) {
        Show.getShowByMember(audieId,function (items) { //观众离场
            for (var i =0;i<items.length;i++){
                items[i].members = items[i].members.filter(function (t) {
                    return t != audieId
                });
                items[i].add();
            }
        });
    }


    io.on('connection', function(client) {
        // console.log(client);
        console.log('-- ' + client.id + ' joined --');
        client.emit('id', client.id);

        client.on('message', function (details) {
            console.log(details);
            var otherClient = io.sockets.connected[details.to];

            // if(details.type == "init"){ //如果是直播表扬 初始化
            //     audienceJoin(details.to,client.id);//观众 加入
            // }

            if (!otherClient) {
                return;
            }
            delete details.to;
            details.from = client.id;
            otherClient.emit('message', details);
        });

        client.on('readyToStream', function(options) {
            console.log('-- ' + client.id + ' is ready to stream --');
            // if(options.type == "show"){ //如果是直播表扬
            //     openShow(options.id,client.id);//开播
            // }
            //发送 数据参数， 可以修改数据的状态
            streams.addStream(client.id, options.name);
        });

        client.on('update', function(options) {
            console.log("=------update-----");
            // if(options.type == "show"){ //如果是直播表扬
            //     Show.getShowById(options.id,function (item) {
            //         var members = item.members;
            //         members.push(client.id);
            //         item.members  = members;
            //         item.add();
            //     });
            // }
            streams.update(client.id, options.name);
        });

        function leave(options) {
            // console.log(options);
            console.log('-- ' + client.id + ' left --');

            mainLeave(client.id);//主播离场

            audienceLeave(client.id);//观众离场

            streams.removeStream(client.id);
        }

        client.on('disconnect', leave);
        client.on('leave', leave);

    });
};