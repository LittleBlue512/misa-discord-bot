var Misa = require('./../configs/misa');
var connection = require('./../configs/database');
var Staff = connection.models.Staff;
var CleanChatPrefix = connection.models.CleanChatPrefix;

var helpers = {};

// Get staff usernames from the database and put it into Misa.js
helpers.getStaffs = () => {
    Staff
        .find()
        .then(staffs => {
            Misa.staffs = staffs.map(item => item.username);
        })
        .catch(err => {
            console.log('Could not get staff usernames from the database.');
            console.log(err);
        });
};

// Get prefixs for clean chat from the database and put it into Misa.js
helpers.getCleanChatPrefixes = () => {
    CleanChatPrefix
        .find()
        .then(prefixes => {
            Misa.cleanChatPrefixes = prefixes.map(item => item.prefix);
        })
        .catch(err => {
            console.log('Could not get prefixs for clean chat from the database.');
            console.log(err);
        });
};

module.exports = helpers;