var express = require('express');
var router = express.Router();
var streams = require('../../../bin/stream')();

router.get('/', function(req, res) {
    var streamList = streams.getStreams();
    // JSON exploit to clone streamList.public
    var data = (JSON.parse(JSON.stringify(streamList)));
    res.status(200).json(data);
});
module.exports = router;