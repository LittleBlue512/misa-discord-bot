var Axios = require('axios');
var dotenv = require('dotenv');
var Misa = require('../../configs/misa');
var Discord = require('discord.js');

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

    else if (content.startsWith('misa avatar')) {
        var startIndex = content.indexOf('[');
        var endIndex = content.indexOf(']');
        var indentifier = content.substring(startIndex1 + 1, endIndex);
        if (startIndex == -1 || endIndex == -1 || endIndex - startIndex == 1) {
            send(`Sorry, I don't understand your command.`)
        } else {
            send(`I'm finding a avatar...`);
            message.channel.send({ files: [Misa.apis.AVATAR_API + `/${indentifier}.png`] });
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

    else if (content.startsWith('misa anime')) {
        var startIndex = content.indexOf('[');
        var endIndex = content.indexOf(']');
        if (startIndex != -1 && endIndex != -1 && endIndex - startIndex != 1) {
            var category = content.substring(startIndex + 1, endIndex).toLowerCase();
            send(`I'm finding the data...`);
            var randomOffset = Math.floor(Math.random() * 10);
            Axios.get(Misa.apis.ANIME_API + `?filter[categories]=${category}&page[offset]=${randomOffset}`)
                .then(res => {
                    var maxLength = res.data.data.length;
                    if (maxLength == 0) {
                        send(`Sorry, I did't get any ${category} animes from the Kitsu API.`);
                    } else {
                        var randomIndex = Math.floor(Math.random() * maxLength);
                        var title = res.data.data[randomIndex].attributes.titles.en_jp;
                        send(`Here's a random ${category} anime from the Kitsu API:\n${title}`);
                    }
                })
                .catch(err => {
                    console.log(err);
                    send('Look like something went wrong, I am going to have my master look into it!');
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
};