var Misa = require('../../configs/misa');
var connection = require('../../configs/database');
var Kanji = connection.models.Kanji;
var helpers = require('../helpers');
var CleanChatPrefix = connection.models.CleanChatPrefix;

module.exports = (message) => {
    var content = message.content;
    var username = message.author.username;

    // Convert input string to lowercase
    content = content.toLowerCase();

    // Validations
    if (Misa.staffs.indexOf(username) == -1) return;            // Only staff
    if (!content.startsWith(Misa.prefixes.staff)) return;        // Prefix required

    // Handy function ~
    send = (string) => message.channel.send(string);
    yaml = (string) => '```yaml\n' + string + '\n```';
    mono = (string) => '```\n' + string + '\n```';

    if (content == 'misa staff') {
        send(`I'm ready!`);
    }

    else if (content == 'misa staff help') {
        var output = `How can I help you, ${username}?`;
        Misa.staff_list.forEach(command => {
            output += `\n- ${command}`;
        });
        send(output);
    }

    else if (content.startsWith('misa staff kanji add')) {
        var words = content.split(' ');
        var kanji = words[4];
        if (kanji) {
            Kanji
                .find()
                .then(kanjis => {
                    var characters = kanjis.map(item => item.character);
                    if (characters.indexOf(kanji) == -1) {
                        new Kanji({ character: kanji })
                            .save()
                            .then(() => send('Done!'))
                            .catch(err => {
                                console.log(err);
                                send(`Look like something went wrong, please try again later! or contact my master! ${Misa.master}`);
                            });
                    } else {
                        send(`${kanji} is already added!`);
                    }
                })
                .catch(err => {
                    console.log(err);
                    send(`Look like something went wrong, please try again later! or contact my master! ${Misa.master}`);
                });

        } else {
            // Invalid inputs
            send('Invalid input!');
        }
    }

    else if (content.startsWith('misa staff kanji remove')) {
        var words = content.split(' ');
        var kanji = words[4];
        if (kanji) {
            Kanji
                .findOneAndDelete({ character: kanji })
                .then(() => {
                    send('Done!');
                })
                .catch(err => {
                    console.log(err);
                    send(`Look like something went wrong. Please try again later or contact my master! ${Misa.master}`);
                });
        } else {
            // Invalid inputs
            send('Invalid input!');
        }
    }

    else if (content.startsWith('misa staff cleanchatprefix list')) {
        if (Misa.cleanChatPrefixes.length == 0) {
            send('The list is empty!');
        } else {
            var output = '';
            Misa.cleanChatPrefixes.forEach(prefix => output += prefix + '\n');
            send(yaml(output));
        }
    }

    else if (content.startsWith('misa staff cleanchatprefix add')) {
        var words = content.split(' ');
        if (words.length != 5) {
            send('Invalid command!');
        } else {
            var prefix = words[4].toLowerCase();
            CleanChatPrefix
                .find()
                .then(data => {
                    var prefixes = data.map(item => item.prefix.toLowerCase());
                    // Check duplicates
                    if (prefixes.indexOf(prefix) == -1) {
                        // Add new prefix
                        new CleanChatPrefix({ prefix })
                            .save()
                            .then(() => {
                                send(`${prefix} saved!`);
                                // Update prefixes list
                                helpers.getCleanChatPrefixes();
                            })
                            .catch(err => {
                                send(`I encounter an error while trying to save the prefix for clean chat to the database. Please try again later or contact my master! ${Misa.master}`);
                                console.log(err);
                            })
                    } else {
                        send(`The prefix already exists!`);
                    }
                })
                .catch(err => {
                    send(`I encountered an error while trying to get the prefixes for clean chat from the database. Please try again later or contact my master! ${Misa.master}`);
                    console.log(err);
                })
        }
    }

    else if (content.startsWith('misa staff cleanchatprefix remove')) {
        var words = content.split(' ');
        if (words.length != 5) {
            send(`Invalid command!`);
        } else {
            var prefix = words[4].toLowerCase();
            CleanChatPrefix
                .findOne({ prefix })
                .then(item => {
                    if (item) {
                        item
                            .remove()
                            .then(() => {
                                send(`${prefix} removed!`);
                                // Update prefixes list
                                helpers.getCleanChatPrefixes();
                            })
                            .catch(err => {
                                send(`There's an error! Please try again later or contact my master! ${Misa.master}`);
                                console.log(err);
                            });
                    } else {
                        send(`I couldn't find the given prefix!`);
                    }
                })
                .catch(err => {
                    send(`I encountered an error while trying to get the prefixes for clean chat from the database. Please try again later or contact my master! ${Misa.master}`);
                    console.log(err);
                })
        }
    }
}