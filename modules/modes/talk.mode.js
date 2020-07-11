var Misa = require('../../configs/misa');
var connection = require('../../configs/database');
var Command = connection.models.Command;

module.exports = (message) => {
    var content = message.content;
    var username = message.author.username;

    // Convert input string to lowercase
    content = content.toLowerCase();

    // Validations
    if (message.author.bot) return;                             // Ignore bots

    // Handy function ~
    send = (string) => message.channel.send(string);

    Command.findOne({ key: content })
        .then(data => {
            if (data) {
                send(data.response);
            } else {
                send('404 Misa not found ~');
            }
        })
        .catch(err => {
            console.log(err);
            send('Look like something went wrong, I am going to have my master look into it!');
        })

}