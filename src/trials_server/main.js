//Logs class for the new trials server
const Discord = require('discord.js');
const client = new Discord.Client();
const transmitterServerId = "824242841705250837";
const receiverServerId = "824272782333706282";

class Main {
    constructor(){
        client.on('guildMemberRemove', member => {
            
        });
          
        client.on('guildMemberAdd', member => {
            
        });

        client.on('inviteCreate', invite => {

        });
    }
}