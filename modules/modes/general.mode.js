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
    if (message.author.bot) return;                             // Ignore bots
    if (!content.startsWith(Misa.prefixs.general)) return;      // Prefix required

    // Handy function ~
    send = (string) => message.channel.send(string);
    yaml = (string) => '```yaml\n' + string + '\n```';

    if (content == 'misa') {
        send('Yes?');
    }

    else if (content == 'misa help') {
        var output = '';
        Misa.help_list.forEach(command => {
            output += `- ${command}\n`;
        });
        send(`How can I help you, ${username}?\n${output}`);
    }

    else if (content == 'misa cat') {
        send(`I'm finding a cat picture...`);
        Axios.get(Misa.apis.CATPICS_API)
            .then(res => {
                message.channel.send('I love cats!', { files: [res.data[0].url] });
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, I am going to have my master look into it!');
            });
    }

    else if (content == 'misa cat fact') {
        send(`I'm finding a cat fact...`);
        Axios.get(Misa.apis.CATFACTS_API)
            .then(res => {
                send(res.data.text);
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, I am going to have my master look into it!');
            });
    }

    else if (content == 'misa shiba') {
        send(`I'm finding a shiba picture...`);
        Axios.get(Misa.apis.SHIBAS_API)
            .then(res => {
                message.channel.send('I love shibas!', { files: [res.data[0]] });
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, I am going to have my master look into it!');
            });
    }

    else if (content == 'misa joke') {
        send(`I'm finding a joke...`);
        Axios.get(Misa.apis.JOKES_API)
            .then(res => {
                var data = res.data;
                if (data.type == 'single') {
                    send(`${data.joke}`);
                } else if (data.type == 'twopart') {
                    send(`${data.setup}`);
                    send(`${data.delivery}`);
                }
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, I am going to have my master look into it!');
            });
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
                send('Look like something went wrong, I am going to have my master look into it!');
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
                send('Look like something went wrong, I am going to have my master look into it!');
            });
    }

    else if (content.startsWith('misa photo')) {
        var startIndex1 = content.indexOf('[');
        var endIndex1 = content.indexOf(']');
        var startIndex2 = content.indexOf('[', startIndex1 + 1);
        var endIndex2 = content.indexOf(']', endIndex1 + 1);
        var width = content.substring(startIndex1 + 1, endIndex1);
        var height = content.substring(startIndex2 + 1, endIndex2);
        if (startIndex1 == -1 || endIndex1 == -1 || startIndex2 == -1 || endIndex2 == -1 || endIndex1 - startIndex1 == 1 || endIndex2 - startIndex2 == 1) {
            send(`Sorry, I don't understand your command.`)
        } else {
            send(`I'm finding a photo...`)
            Axios.get(Misa.apis.PHOTO_API + `/${width}/${height}`)
                .then(res => {
                    message.channel.send({ files: [res.request.res.responseUrl] });
                })
                .catch(err => {
                    console.log(err);
                    send('Look like something went wrong, I am going to have my master look into it!');
                })
        }
    }

    else if (content.startsWith('misa binance')) {
        var startIndex = content.indexOf('[');
        var endIndex = content.indexOf(']');
        if (startIndex != -1 && endIndex != -1 && endIndex - startIndex != 1) {
            var symbol = content.substring(startIndex + 1, endIndex).toUpperCase();
            send(`I'm finding the data...`);
            Axios.get(Misa.apis.BINANCE_PRICE_API + symbol)
                .then(res => {
                    send(`Here's the price from Binance.com:\n${symbol}: ${res.data.price}`);
                })
                .catch(err => {
                    if (err.response.status == 400) {
                        send('Invalid symbol!');
                    } else {
                        send('Look like something went wrong, I am going to have my master look into it!');
                    }
                });
        } else {
            send(`Sorry, I don't understand your command.`);
        }
    }

    else if (content == 'misa quote') {
        send(`I'm finding a quote...`);
        Axios.get(Misa.apis.QUOTE_API)
            .then(res => {
                send(res.data.quote.quoteText)
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, I am going to have my master look into it!');
            });
    }

    else if (content == 'misa prog quote') {
        send(`I'm finding a programming quote...`);
        Axios.get(Misa.apis.PROGRAMMING_QUOTE_API)
            .then(res => {
                send(res.data.en)
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, I am going to have my master look into it!');
            });
    }

    else if (content == 'misa code') {
        send(`Misa's source code: https://github.com/LittleBlue512/misa-discord-bot`);
    }

    else if (content == 'misa kanji rand') {
        Kanji
            .find()
            .then(kanjis => {
                var randIndex = Math.round(Math.random() * kanjis.length);
                send(yaml(kanjis[randIndex].character));
            })
            .catch(err => {
                console.log(err);
                send('Look like something went wrong, I am going to have my master look into it!');
            });
    }

    else if (content.startsWith('misa kanji list')) {
        var words = content.split(' ');
        if (words.length == 3) {
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
            if (words.length != 5) {
                send(`Invalid input!`);
            } else {
                var fromIndex = words[3];
                var toIndex = words[4];
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

    else if (content.startsWith('misa kanji count')) {
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
                        send('Look like something went wrong. I will have my master look into it!');
                    });
            } else {
                // Invalid inputs
                send(`Invalid input!`);
            }
        } else {
            // Invalid too many arguments!
            send(`Invalid command!`);
        }
    }
};