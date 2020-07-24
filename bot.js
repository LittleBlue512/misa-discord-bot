var Discord = require('discord.js');
var dotenv = require('dotenv');
var client = new Discord.Client();
var messageHandler = require('./modules/messageHandler');
var helpers = require('./modules/helpers');

dotenv.config();

client.on('ready', () => {
    console.log(`Getting staffs...`);
    helpers.getStaffs();
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    messageHandler(message);
});

client.login(process.env.BOT_TOKEN);