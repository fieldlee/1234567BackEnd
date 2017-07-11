/**
 * Created by depengli on 2017/7/5.
 */
'use strict';
var jwt    = require('jsonwebtoken');

module.exports = {
    getDatabase: function () {
        return 'mongodb://localhost:27017/instrument?socketTimeoutMS=200000';
    },
    tokenSecret: 'wsxzaqujmtgbedcrfvqwertyuiopasdfghjklzxcvbnm',
    successJson: {"success": true},
    failJson: {"success": false},
    getToken: function (username) {
        var token = jwt.sign({username: username}, this.tokenSecret, { expiresIn: '365 days' });
        return token;
    },
    verifyToken: function (req) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            try {
                return jwt.verify(token, this.tokenSecret);
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }
};
