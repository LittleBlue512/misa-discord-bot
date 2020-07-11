var GeneralMode = require('./modes/general.mode');
var DevMode = require('./modes/dev.mode');
var TalkMode = require('./modes/talk.mode');
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

    // Talk channel
    else if (message.channel.name == Misa.channels.talk) {
        TalkMode(message);
    }

    // DM channel
    else if (message.channel.type == 'dm') {
        message.channel.send('Misa is not allowed to talk to a stranger.\nIf you want to talk to Misa, please visit #misa-bot-dev text channel!');
    }

    // Other Channel
    else {
        GeneralMode(message);
    }
};