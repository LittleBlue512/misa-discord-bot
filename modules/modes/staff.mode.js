var Misa = require('../../configs/misa');
var connection = require('../../configs/database');
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
            Kanji
                .find()
                .then(kanjis => {
                    var characters = kanjis.map(item => item.character);
                    var targetIndex = characters.indexOf(kanji);
                    if (targetIndex == -1) {
                        new Kanji({ character: kanji })
                            .save()
                            .then(() => send(`Done!`))
                            .catch(err => {
                                console.log(err);
                                send(`Look like something went wrong, please try again later or contact my master(${Misa.master})!`);
                            });
                    } else {
                        send(`${kanji} is already added!`);
                    }
                })
                .catch(err => {
                    console.log(err);
                    send('Look like something went wrong, please try again later!');
                });

        } else {
            // Invalid inputs
            send(`Invalid input!`);
        }
    }

    else if (content.startsWith('misa staff kanji remove')) {
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
                    send(`Look like something went wrong, please try again later or contact my master(${Misa.master})!`);
                });
        } else {
            // Invalid inputs
            send(`Invalid input!`);
        }
    }
}