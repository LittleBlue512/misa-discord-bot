var Discord = require('discord.js');
var dotenv = require('dotenv');
var client = new Discord.Client();
var messageHandler = require('./modules/messageHandler');

dotenv.config();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    messageHandler(message);
});

client.login(process.env.BOT_TOKEN);