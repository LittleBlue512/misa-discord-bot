var Misa = require('../../configs/misa');
var connection = require('../../configs/database');
var Command = connection.models.Command;
var Kanji = connection.models.Kanji;

module.exports = (message) => {
    var content = message.content;
    var username = message.author.username;

    // Convert input string to lowercase
    content = content.toLowerCase();

    // Validations
    if (message.author.bot) return;                             // Ignore bots
    if (Misa.staffs.indexOf(username) == -1) return;            // Only staff
    if (!content.startsWith(Misa.prefixs.staff)) return;        // Prefix required

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

    else if (content == 'misa staff command list') {
        Command
            .find()
            .then(commands => {
                if (commands.length == 0) {
                    send('The list of commands is empty!');
                } else {
                    var output = '';
                    commands.forEach(command => output += `${command.key}: ${command.response}\n`)
                    send(mono(output));
                }
            })
            .catch(err => {
                console.log(err);
                send('Master! I encountered an error while trying to find the commands in the database!');
            })
    }

    else if (content.startsWith('misa staff command add')) {
        var startIndex1 = content.indexOf('[');
        var endIndex1 = content.indexOf(']');
        var startIndex2 = content.indexOf('[', startIndex1 + 1);
        var endIndex2 = content.indexOf(']', endIndex1 + 1);
        var key = content.substring(startIndex1 + 1, endIndex1);
        var response = content.substring(startIndex2 + 1, endIndex2);
        if (startIndex1 == -1 || endIndex1 == -1 || startIndex2 == -1 || endIndex2 == -1 || endIndex1 - startIndex1 == 1 || endIndex2 - startIndex2 == 1) {
            send(`Invalid command!`)
        } else {
            var newCommand = new Command({ key, response });
            newCommand.save();
            send(`I'm adding [${key}: ${response}] to the list of commands!`);
        }
    }

    else if (content.startsWith('misa staff kanji add')) {
        var words = content.split(' ');
        var kanji = words[4];
        if (kanji) {
            new Kanji({ character: kanji })
                .save()
                .then(() => send(`Done!`))
                .catch(err => {
                    console.log(err);
                    send('Master! I encountered an error while trying to find the commands in the database!');
                });
        } else {
            // Invalid inputs
            send(`Invalid input!`);
        }
    }

    else if (content.startsWith('misa staff kanji list')) {
        var words = content.split(' ');
        if (words.length == 4) {
            Kanji
                .find()
                .then(kanjis => {
                    var cnt = 1;
                    var output = '';
                    kanjis.forEach(kanji => output += `${cnt++}: ${kanji.character}\n`)
                    send(yaml(output));
                })
                .catch(err => {
                    console.log(err);
                    send('Master! I encountered an error while trying to find the kanji in the database!');
                })
        } else {
            if (words.length != 6) {
                send(`Invalid input!`);
            } else {
                var fromIndex = words[4];
                var toIndex = words[5];
                Kanji
                    .find()
                    .then(kanjis => {
                        if (fromIndex < 1 || fromIndex > kanjis.length || toIndex < 1 || toIndex <= fromIndex || toIndex > kanjis.length) {
                            send(`Invalid input!`);
                        } else {
                            var cnt = fromIndex;
                            var output = '';
                            var subArray = kanjis.slice(fromIndex - 1, toIndex);
                            subArray.forEach(kanji => output += `${cnt++}: ${kanji.character}\n`)
                            send(yaml(output));
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        send('Master! I encountered an error while trying to find the kanji in the database!');
                    })
            }
        }

    }

    else if (content.startsWith('misa staff kanji delete')) {
        var words = content.split(' ');
        var kanji = words[4];
        if (kanji) {
            Kanji
                .findOneAndDelete({ character: kanji })
                .then(() => {
                    send(`Done!`);
                })
                .catch(err => {
                    console.log(err);
                    send('Master! I encountered an error while trying to find the kanji in the database!');
                });
        } else {
            // Invalid inputs
            send(`Invalid input!`);
        }
    }
}