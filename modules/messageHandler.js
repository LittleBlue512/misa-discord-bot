var GeneralMode = require('./modes/general.mode');
var DevMode = require('./modes/dev.mode');
var StaffMode = require('./modes/staff.mode');
var Misa = require('../configs/misa');


module.exports = (message) => {
    // Ignore bots
    if (message.author.bot) return;

    // Filter channels

    // Dev channel
    if (message.channel.name == Misa.channels.dev) {
        DevMode(message);
        StaffMode(message);
        GeneralMode(message);
    }

    // DM channel
    else if (message.channel.type == 'dm') {
        message.channel.send('Sorry, Misa is not allowed to talk to a stranger!');
    }

    // Other Channel
    else {
        StaffMode(message);
        GeneralMode(message);
    }
};