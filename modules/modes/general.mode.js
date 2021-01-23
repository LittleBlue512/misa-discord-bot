var Axios = require('axios');
var dotenv = require('dotenv');
var Misa = require('../../configs/misa');
var connection = require('../../configs/database');
var Kanji = connection.models.Kanji;

dotenv.config();

module.exports = (message) => {
    var content = message.content;
    var username = message.author.username;

    // Convert input string to lowercase
    content = content.toLowerCase();

    // Validations
    if (!content.startsWith(Misa.prefixes.general)) return;      // Prefix required

    // Handy function ~
    send = (string) => message.channel.send(string);
    yaml = (string) => '```yaml\n' + string + '\n```';

    if (content == 'misa') {
        send(`I'm here, use "misa help" for more commands!`);
    }

    else if (content == 'misa help') {
        var output = '';
        Misa.help_list.forEach(command => {
            output += `- ${command}\n`;
        });
        send(`How can I help you, ${username}?\n${output}`);
    }

    else if (content == 'misa covid19 thai') {
        send(`I'm finding the data...`);
        Axios.get(Misa.apis.COVID19_THAI_API)
            .then(res => {
                var confirmed = res.data.Confirmed;
                var recovered = res.data.Recovered;
                var hospitalized = res.data.Hospitalized;
                var death = res.data.Deaths;
                send(`Today's report from the Department of Disease Control of Thailand:\nConfirmed: ${confirmed}\nRecovered: ${recovered}\nHospitalized: ${hospitalized}\nDeaths: ${death}`);
                send('Stay safe!');
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, please try again later!');
            });
    }

    else if (content == 'misa covid19 global') {
        send(`I'm finding the data...`);
        Axios.get(Misa.apis.COVID19_GLOBAL_API)
            .then(res => {
                var global = res.data.Global;
                var totalConfirmed = global.TotalConfirmed;
                var totalDeaths = global.TotalDeaths;
                var totalRecovered = global.TotalRecovered;
                send(`Today's report from api.covid19api.com:\nConfirmed: ${totalConfirmed}\nRecovered: ${totalRecovered}\nDeaths: ${totalDeaths}`);
                send('Stay safe!');
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong. Please try again later!');
            });
    }

    else if (content == 'misa code') {
        send(`Misa's source code: https://github.com/LittleBlue512/misa-discord-bot`);
    }

    else if (content.startsWith('misa kanji rand')) {
        var words = content.split(' ');
        if (words.length == 4) {
            var number = words[3];
            Kanji
                .find()
                .then(kanjis => {
                    if (number < 0 || number > kanjis.length) {
                        send('Invalid input!');
                    } else {
                        var output = '';
                        var randIndices = new Set();
                        while (randIndices.size < number)   // Get random indices
                            randIndices.add(Math.round(Math.random() * kanjis.length));
                        for (var index of randIndices)      // Get kanjis
                            output += kanjis[index].character + '\n';
                        send(output);
                    }
                })
                .catch(err => {
                    console.log(err);
                    send('Look like something went wrong. Please try again later!');
                });
        } else {
            send('Invalid input!');
        }
    }

    else if (content.startsWith('misa kanji list')) {
        var words = content.split(' ');
        if (words.length == 3) {
            Kanji
                .find()
                .then(kanjis => {
                    var output = '';
                    var characters = [];
                    var charactersPerLine = 10;
                    kanjis.forEach(kanji => characters.push(kanji.character))
                    for (var i = 0; i < characters.length; i++) {
                        if (i % charactersPerLine == 0) output += `\n${i}:   `;
                        output += characters[i] + '   ';
                    }
                    send(output);
                })
                .catch(err => {
                    console.log(err);
                    send('Look like something went wrong, please try again later!');
                })
        } else {
            if (words.length != 5) {
                send('Invalid input!');
            } else {
                var fromIndex = words[3];
                var toIndex = words[4];
                Kanji
                    .find()
                    .then(kanjis => {
                        if (fromIndex < 1 || fromIndex > kanjis.length || toIndex < 1 || toIndex <= fromIndex || toIndex > kanjis.length) {
                            send('Invalid input!');
                        } else {
                            var characters = [];
                            var subArray = kanjis.slice(fromIndex - 1, toIndex);
                            subArray.forEach(kanji => characters.push(kanji.character));
                            send(characters.join('   '));
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        send('Look like something went wrong. Please try again later!');
                    })
            }
        }

    }

    else if (content.startsWith('misa kanji count')) {
        Kanji
            .find()
            .then(kanji => {
                send(`There are ${kanji.length} kanji in the list!`);
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, please try again later!');
            });
    }

    else if (content.startsWith('misa kanji find')) {
        var words = content.split(' ');
        if (words.length == 4) {
            var kanji = words[3];
            if (kanji) {
                Kanji
                    .find()
                    .then(kanjis => {
                        var characters = kanjis.map(item => item.character);
                        var targetIndex = characters.indexOf(kanji);
                        if (targetIndex == -1) {
                            send('Kanji not found!');
                        } else {
                            send(`Kanji found at the index of ${targetIndex + 1}`);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        send('Look like something went wrong. Please try again later!');
                    });
            } else {
                // Invalid inputs
                send('Invalid input!');
            }
        } else {
            // Invalid too many arguments!
            send('Invalid command!');
        }
    }

    // ...
    else if (content == 'misa, i love you!' || content == 'misa, i love you' || content == 'misa i love you!' || content == 'misa i love you' || content == 'i love misa') {
        if (username == Misa.master) {
            send('I love you too, master!');
        } else {
            send('(🌸≧‿≦)');
        }
    }
};