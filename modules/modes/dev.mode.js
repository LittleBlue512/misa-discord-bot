var Misa = require('../../configs/misa');
var connection = require('../../configs/database');
var helpers = require('../helpers');
var Staff = connection.models.Staff;

module.exports = (message) => {
    var content = message.content;
    var authorUsername = message.author.username;

    // Convert input string to lowercase
    originalContent = content;
    content = content.toLowerCase();

    // Validations
    if (message.author.bot) return;                         // Ignore bots
    if (authorUsername != Misa.master) return;              // Only master
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

    else if (content == 'misa dev staff list') {
        var output = '';
        Misa.staffs.forEach(staff => output += staff + '\n');
        send(yaml(output));
    }

    else if (content.startsWith('misa dev staff add')) {
        var startIndex = content.indexOf('[');
        var endIndex = content.indexOf(']');
        if (startIndex != -1 && endIndex != -1 && endIndex - startIndex > 1) {
            var username = originalContent.substring(startIndex + 1, endIndex);
            Staff
                .find()
                .then(staffs => {
                    var usernames = staffs.map(staff => staff.username.toLowerCase());
                    if (usernames.indexOf(username.toLowerCase()) == -1) {
                        // Save the new staff
                        new Staff({ username })
                            .save()
                            .then(() => {
                                send(`${username} saved!`);
                                // Update staffs
                                helpers.getStaffs();
                            })
                            .catch(err => {
                                send(`I encounter an error while trying to save the username to the database!`);
                                console.log(err);
                            });
                    } else {
                        send(`The username already exists!`);
                    }
                })
                .catch(err => {
                    send(`I encountered an error while trying to get staffs data from the database, please check the logs master!`);
                    console.log(err);
                })
        } else {
            send(`Invalid command, master!`);
        }
    }

    else if (content.startsWith('misa dev staff remove')) {
        var startIndex = content.indexOf('[');
        var endIndex = content.indexOf(']');
        if (startIndex != -1 && endIndex != -1 && endIndex - startIndex > 1) {
            var username = originalContent.substring(startIndex + 1, endIndex);
            Staff
                .findOne({ username })
                .then(staff => {
                    if (staff) {
                        staff
                            .remove()
                            .then(staff => {
                                send(`${staff.username} removed!`);
                                // Update staffs
                                helpers.getStaffs();
                            })
                            .catch(err => {
                                send(`There's an error! Please check the logs master!`);
                                console.log(err);
                            });
                    } else {
                        send(`I couldn't find the given username!`);
                    }
                })
                .catch(err => {
                    send(`I encountered an error while trying to get staffs data from the database, please check the logs master!`);
                    console.log(err);
                })
        } else {
            send(`Invalid command, master!`);
        }
    }
}