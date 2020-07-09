const Discord = require('discord.js');
const cron = require('cron');
const ListParticipants = require('./listParticipants.js');
//const ListTrials = require('./listTrials.js');
const client = new Discord.Client();
const adminID = ['308653237211234317','124949555337887744'];
var prefix = '!';
var guildID;
var channelID;
var participants = [];
var participantsCount = 0;
//var participants;
//var trials = new ListTrials();
var isActive = [];
const maxSize = 12;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("stabbing pizza", {
    type: "STREAMING",
    url: "https://www.twitch.tv/deividgp"
  });
});

client.on('message', msg => {
  
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'justice'){

    const sadge = msg.guild.emojis.cache.find(emoji => emoji.name === 'sadge');
    msg.channel.send(`${sadge} without justice there is no prevail ${sadge} and without prevail there is no life ${sadge} but afterall life is suffering and pain ${sadge} so why even have justice afterall? ${sadge}`);
  }
  else if (command === 'cheese') {
    
    const kekw = msg.guild.emojis.cache.find(emoji => emoji.name === 'kekw');
    msg.channel.send(`${kekw}`);

  }else if (command === 'quint' || command === 'mike') {

    const ahegao = msg.guild.emojis.cache.find(emojis => emojis.name === 'ahegao');
    msg.channel.send(`${ahegao}`);

  }else if (command === 'nex') {

    const disgust = new Discord.MessageAttachment('https://cdn.discordapp.com/emojis/684133015043178526.png');
    msg.channel.send(disgust);

  }else if (command === 'wink') {

    msg.channel.send(`:wink:`);

  }else if (command === 'brb') {

    msg.channel.send(`gtg eat`);

  }else if (command === 'winkall') {

    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '308653237211234317')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '655358675170361344')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '166585626425163776')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '303950858490740746')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '312629007864823808')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '397899899255128064')}`);

  }else if (command === 'getAll') {

    /*msg.channel.send(msg.guild.members.fetch().filter(member => !member.user.bot).size);
    .then(console.log)
    .catch(console.error);*/
    const members = msg.guild.members.cache.filter(member => !member.user.bot).array();
    msg.channel.send(members.length);
    for (let index = 0; index < members.length; index++) {
      console.log(members[index]['user']['id']);
    }

  }

  /*Admin only commands*/
  if(adminID.includes(msg.author.id)){

    if(command == 'changepre'){

      prefix = args[0];

    }else if(command == 'trials'){
      
      guildID = msg.guild.id;
      channelID = msg.channel.id;

    }else if (command === 'start0') {
      var num = 0;

      isActive[num] = true;
      msg.delete();

      participants[num] = new ListParticipants(args[0], parseInt(args[1]), `${args[2]} ${args[3]}`);
      let pollEmbed = new Discord.MessageEmbed()
        .setTitle(participants[num].name)
        .addField('Day and time (CEST)', `${participants[num].daytime}`, false)
        .addFields(
          { name: 'Tanks', value: `${participants[num].tMax}`, inline: true },
          { name: 'Healers', value: '2', inline: true },
          { name: 'Damage Dealers', value: `${participants[num].ddMax}`, inline: true },
        )

      msg.channel.send(pollEmbed).then(async function (messageReaction) {
        
        await messageReaction.react('🛡️');
        await messageReaction.react('🚑');
        await messageReaction.react('⚔️');
        await messageReaction.react('🏹');
        
        const filter = (reaction, user) => {
          if(messageReaction.author.id != user.id){
            
            var verify = participants[num].emojisCounter(user.id, reaction.emoji.name);
            
            if(verify == true){
              return true;
            }else if(verify == false && participants[num].findParticipant(user.id, reaction.emoji.name) == undefined){
              reaction.users.remove(user.id);
            }

            if(verify == false){
              participants[num].revert(reaction.emoji.name);
            }
          }

          if(participants[num].findParticipant(user.id, '') != undefined){
            var name = reaction.emoji.name;
            const userReactions = messageReaction.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
  
            try {
              for (const reaction of userReactions.values()) {
                if(reaction.emoji.name === name && participants[num].findParticipant(user.id, reaction.emoji.name) == undefined){
                  reaction.users.remove(user.id);
                }
              }
            } catch (error) {
              console.error('Failed to remove reactions.');
            }
          }
          return false;
        };
        
        const collector = messageReaction.createReactionCollector(filter, { });
        
        collector.on('collect', (reaction, user) => {
          participants[num].addParticipant(user.id, reaction.emoji.name);
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
          messageReaction.channel.send(`${messageReaction.guild.members.cache.find(users => users.id == user.id)} signed up for **${participants[num].name}** as ${reaction.emoji.name}`);
  
          if(participants[num].counter === maxSize){
            participants[num].listParticipants(messageReaction);
          }
  
        });
  
      });

    }else if (command === 'start1') {
      var num = 1;

      isActive[1] = true;
      msg.delete();
      participants[num] = new ListParticipants(args[0], parseInt(args[1]), `${args[2]} ${args[3]}`);
      let pollEmbed = new Discord.MessageEmbed()
        .setTitle(participants[num].name)
        .addField('Day and time (CEST)', `${participants[num].daytime}`, false)
        .addFields(
          { name: 'Tanks', value: `${participants[num].tMax}`, inline: true },
          { name: 'Healers', value: '2', inline: true },
          { name: 'Damage Dealers', value: `${participants[num].ddMax}`, inline: true },
        )
      
      msg.channel.send(pollEmbed).then(async function (messageReaction) {
        
        await messageReaction.react('🛡️');
        await messageReaction.react('🚑');
        await messageReaction.react('⚔️');
        await messageReaction.react('🏹');
        
        const filter = (reaction, user) => {
          if(messageReaction.author.id != user.id){
            
            var verify = participants[num].emojisCounter(user.id, reaction.emoji.name);
            
            if(verify == true){
              return true;
            }else if(verify == false && participants[num].findParticipant(user.id, reaction.emoji.name) == undefined){
              reaction.users.remove(user.id);
            }

            if(verify == false){
              participants[num].revert(reaction.emoji.name);
            }
          }

          if(participants[num].findParticipant(user.id, '') != undefined){
            var name = reaction.emoji.name;
            const userReactions = messageReaction.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
  
            try {
              for (const reaction of userReactions.values()) {
                if(reaction.emoji.name === name && participants[num].findParticipant(user.id, reaction.emoji.name) == undefined){
                  reaction.users.remove(user.id);
                }
              }
            } catch (error) {
              console.error('Failed to remove reactions.');
            }
          }
          return false;
        };
        
        const collector = messageReaction.createReactionCollector(filter, { });
        
        collector.on('collect', (reaction, user) => {
          participants[num].addParticipant(user.id, reaction.emoji.name);
          console.log(`${messageReaction.guild.members.cache.find(users => users.id == user.id)} signed up for ${participants[num].name} as ${reaction.emoji.name}`);
          messageReaction.channel.send(`${messageReaction.guild.members.cache.find(users => users.id == user.id)} signed up for **${participants[num].name}** as ${reaction.emoji.name}`);
  
          if(participants[num].counter === maxSize){
            participants[num].listParticipants(messageReaction);
          }
  
        });
  
      });
    }

    if(isActive[0] || isActive[1]){
      if (command === 'end') {

        participants[parseInt(args[0])] = undefined;
        isActive[parseInt(args[0])] = false;
        //participants = new ListParticipants();
        //isActive = false;
        //hCounter = 0;
        //tCounter = 0;
        //ddCounter = 0;
        //ddmCounter = 0;
        //ddrCounter = 0;
      
      //Lists all participants (!list trial(0 or 1))
      }else if (command === 'list') {

        participants[parseInt(args[0])].listParticipants(msg);
      
      //Adds a participant (!add userid role trial(0 or 1))
      }else if (command === 'add') {
  
        if (args[0] == undefined || args[1] == undefined) {
  
          msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);
  
        }
        else if (args[0] === client.user.id){
  
          msg.channel.send(`You can't provide bot's id, ${msg.author}!`);
  
        }else{
          
          let verify = participants[parseInt(args[2])].emojisCounter(args[0], args[1]);

          if(verify){
            participants[parseInt(args[2])].addParticipant(args[0], args[1]);
          }else{
            participants[parseInt(args[2])].revert(args[1]);
            msg.channel.send(`Can't add participant, ${msg.author}!`);
          }
        }

      //Delete a participant (!delete userid trial(0 or 1))
      }else if (command === 'delete') {

        if (args[0] == undefined) {
  
          msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);
  
        }else if (args[0] === client.user.id){
  
          msg.channel.send(`You can't provide bot's id, ${msg.author}!`);
  
        }else{

          let index = participants[parseInt(args[1])].findParticipant(args[0], '');
          participants[parseInt(args[1])].deleteParticipant(index, msg);

        }
      }
    }
  }

});

/*let edgyTurn = new cron.CronJob('00 00 00 * * *', () => {
  if(guildID != undefined){
    let guild = client.guilds.cache.get(guildID);
    let channel = guild.channels.cache.get(channelID);
    let randomID = selectRandomMember();
    
    channel.send(`Today is ${guild.members.cache.find(users => users.id == randomID)} 's turn`);
  }
});

edgyTurn.start();*/

/*let trials = new cron.CronJob('00 28 17 * * 04', async function (){
  
  if(guildID != undefined){
    let guild = client.guilds.cache.get(guildID);
    let channel = guild.channels.cache.get(channelID);
    let message = undefined;
    let fields;
    let num = 0;
    for (let num = 0; num <= 1; num++) {
      await channel.send(`Trial number ${num}: type name and number of tanks`);
      
      /*while(message === undefined){
        client.on('message', msg => {
          if(adminID.includes(msg.author.id)){
            message = msg.content.toString();
            console.log(message);
          }
        });
      }*/
      /*client.on('message', msg => {
        msg.channel.awaitMessages(m => adminID.includes(m.author.id),{max: 1, time: 5000}).then(collected => {
                  
          message = m.content.toString();
          }).catch(() => {
                  message.reply('No answer after 30 seconds, operation canceled.');
          });
        
      });
      client.on('message', msg => {
      channel.send(`Trial number ${num}: type name and number of tanks`).then(() => {
        channel.awaitMessages(msg => adminID.includes(msg.author.id), { max: 1, time: 5000})
          .then(collected => {
            message = msg.content.toString();
          })
          .catch(collected => {
            channel.send('Looks like nobody got the answer this time.');
          });
      });
    });
      setTimeout(function () {
        fields = message.split(" ");
        isActive[num] = true;

      let pollEmbed = new Discord.MessageEmbed()
        .setTitle(fields[0])

      participants[num] = new ListParticipants(fields[0], parseInt(fields[1]));
      channel.send(pollEmbed).then(async function (messageReaction) {
        
      await messageReaction.react('🛡️');
      await messageReaction.react('🚑');
      await messageReaction.react('⚔️');
      await messageReaction.react('🏹');
      
      const filter = (reaction, user) => {
          if(messageReaction.author.id != user.id){
            
            var verify = participants[num].emojisCounter(user.id, reaction.emoji.name, messageReaction);
            
            if(verify == true){
              return true;
            }else if(verify == false && participants[num].findParticipant(user.id, reaction.emoji.name) == undefined){
              reaction.users.remove(user.id);
            }

          }

          if(participants[num].findParticipant(user.id, '') != undefined){
            var name = reaction.emoji.name;
            const userReactions = messageReaction.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

            try {
              for (const reaction of userReactions.values()) {
                if(reaction.emoji.name === name && participants[num].findParticipant(user.id, reaction.emoji.name) == undefined){
                  reaction.users.remove(user.id);
                }
              }
            } catch (error) {
              console.error('Failed to remove reactions.');
            }
          }
          return false;
        };
        
        const collector = messageReaction.createReactionCollector(filter, { });
        
        collector.on('collect', (reaction, user) => {
          participants[num].addParticipant(user.id, reaction.emoji.name);
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
          messageReaction.channel.send(`${messageReaction.guild.members.cache.find(users => users.id == user.id)} signed up for ${participants[num].name} as ${reaction.emoji.name}`);

          if(participants[num].counter === maxSize){
            participants[num].listParticipants(messageReaction);
          }

        });

      })
      .catch();
      }, 5000);
      
      

    }
    

  }
});

trials.start();*/

function selectRandomMember(){
  const members = (client.guilds.cache.get(guildID)).members.cache.filter(member => !member.user.bot).array();
  return (members[Math.floor(Math.random() * members.length)]['user']['id']);
}

client.login('NTExMTc3MzA2NDc2MzgwMTg5.Xuo6FA.kuvT0a7ama0eO8aGalioQFCAyK0');