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

    else if (content.startsWith('misa staff kanji count')) {
        Kanji
            .find()
            .then(kanji => {
                send(`There are ${kanji.length} kanji in the list!`);
            })
            .catch(err => {
                console.log(err);
                send('Master! I encountered an error while trying to find the kanji in the database!');
            });
    }
}