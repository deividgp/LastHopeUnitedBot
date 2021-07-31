const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: '',
    execute(trials, client, msg, args) {
        let helpEmbed = new Discord.MessageEmbed()
            .setTitle("LHU BOT COMMANDS")

        let data = fs.readFileSync('./help.json');
        data = JSON.parse(data);
        for (const element of data) {
            helpEmbed.addField(element.name, element.value, false);
        }
        msg.channel.send(helpEmbed);
    }
}