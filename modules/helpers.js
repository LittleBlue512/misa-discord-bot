var Misa = require('./../configs/misa');
var connection = require('./../configs/database');
var Staff = connection.models.Staff;

var helpers = {};

// Get staff usernames from the database and put it into Misa.js
helpers.getStaffs = () => {
    Staff
        .find()
        .then(staffs => {
            Misa.staffs = staffs.map(staff => staff.username);
        })
        .catch(err => {
            console.log(`Could not get staff usernames from the database.`);
            console.log(err);
        });
};

module.exports = helpers;