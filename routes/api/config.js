/**
 * Created by depengli on 2017/7/5.
 */
'use strict';

module.exports = {
    getDatabase: function () {
        return 'mongodb://localhost:27017/instrument?socketTimeoutMS=200000';
    },
    tokenSecret: '1111232111',
    successJson: {"success": true},
    failJson: {"success": false}
};
