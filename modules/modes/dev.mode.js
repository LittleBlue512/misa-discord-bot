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

    else if (content == 'misa dev command list') {
        Command.find()
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
                send('Master! I encountered an error while trying to find the data in the database!');
            })
    }

    else if (content == 'misa dev command clear') {
        Command.find()
            .then(commands => {
                commands.forEach(command => command.remove());
                send('OK!');
            })
            .catch(err => {
                console.log(err);
                send('Master! I encountered an error while trying to find the data in the database!');
            })
    }

    else if (content.startsWith('misa dev command add')) {
        var startIndex1 = content.indexOf('[');
        var endIndex1 = content.indexOf(']');
        var startIndex2 = content.indexOf('[', startIndex1 + 1);
        var endIndex2 = content.indexOf(']', endIndex1 + 1);
        var key = content.substring(startIndex1 + 1, endIndex1);
        var response = content.substring(startIndex2 + 1, endIndex2);
        if (startIndex1 == -1 || endIndex1 == -1 || startIndex2 == -1 || endIndex2 == -1 || endIndex1 - startIndex1 == 1 || endIndex2 - startIndex2 == 1) {
            send(`Invalid command, master!`)
        } else {
            // Save the command to the database
            var newCommand = new Command({ key, response });
            newCommand.save();
            send(`I'm adding [${key}: ${response}] to the list of commands!`);
        }
    }
}