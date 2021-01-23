var Misa = require('../configs/misa');

// CleanChat: Delete any message containing specific prefixes.

module.exports = (message) => {
    var content = message.content;

    Misa.cleanChatPrefixes.forEach(prefix => {
        if (content.startsWith(prefix)) {
            message.delete();
        }
    });
};