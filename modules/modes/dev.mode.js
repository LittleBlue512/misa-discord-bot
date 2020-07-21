var Misa = require('../../configs/misa');
var connection = require('../../configs/database');
var Command = connection.models.Command;

module.exports = (message) => {
    var content = message.content;
    var username = message.author.username;

    // Convert input string to lowercase
    content = content.toLowerCase();

    // Validations
    if (message.author.bot) return;                         // Ignore bots
    if (username != Misa.master) return;                    // Only master
    if (!content.startsWith(Misa.prefixs.dev)) return;      // Prefix required

    // Handy function ~
    send = (string) => message.channel.send(string);
    yaml = (string) => '```yaml\n' + string + '\n```';
    mono = (string) => '```\n' + string + '\n```';

    if (content == 'misa dev') {
        send('Happy hacking!');
    }

    else if (content == 'misa dev help') {
        var output = 'How can I help you, master?';
        Misa.dev_list.forEach(command => {
            output += `\n- ${command}`;
        });
        send(output);
    }
}