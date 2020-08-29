const Discord = require('discord.js');
const cron = require('cron');
const ListParticipants = require('./listParticipants.js');
const fetch = require('node-fetch');
const express = require('express');
const { Translate } = require('@google-cloud/translate').v2;
const {
  prefix,
  token,
} = require('../config.json');
const translate = new Translate();
//const ListTrials = require('./listTrials.js');
const client = new Discord.Client();
const adminID = ['308653237211234317', '124949555337887744'];
var guildID;
var channelID;
var participants = [];
var participantsCount = 0;
//var participants;
//var trials = new ListTrials();
const maxSize = 12;
const roles = ['🛡️','🚑','⚔️','🏹'];
const specificRole = "Strong mental";
var trialsCounter = 0;
var edgyActive = false;
var trialsActive = false;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("stabbing pizza", {
    type: "STREAMING",
    url: "https://www.twitch.tv/deividgp"
  });

  /*client.channels.fetch('658353140000620546')
    .then(channel => {
      channel.send(`${prefix}assignrole 744166758813794454`);
    })
    .catch(console.error);*/

  client.channels.fetch('744202016024297472')
  .then(channel => {
    assignRole(channel, "682206766456373352");
    assignRole(channel, "675006815091687425");
  })
  .catch(console.error);
});

client.on('guildMemberAdd', member => {
  if (!member.bot) {
    var role = member.guild.roles.cache.find(role => role.name === "Pleb");
    member.roles.add(role);
  }
});

client.on('message', async msg => {

  if(msg.author.bot) return;

  if (msg.content === "?XD") msg.channel.send("?XD");
  
  if (!msg.content.startsWith(prefix)) return;
  //if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'joker':
      msg.channel.send('https://tenor.com/view/you-wouldnt-get-it-joker-smoking-gif-15952801');
      break;
    case 'justice':
      const sadge = msg.guild.emojis.cache.find(emoji => emoji.name === 'sadge');
      msg.channel.send(`${sadge} without justice there is no prevail ${sadge} and without prevail there is no life ${sadge} but afterall life is suffering and pain ${sadge} so why even have justice afterall? ${sadge}`);
      break;
    case 'cheese':
      //var now = new Date();
      //const kekw = msg.guild.emojis.cache.find(emoji => emoji.name === 'kekw');
      //await msg.channel.send(`${kekw}`);
      msg.channel.send('https://cdn.discordapp.com/emojis/715902179902488597.png');
      //var later = new Date();
      //await msg.channel.send(`${(later.getTime()-now.getTime())/1000}`);
      break;
    case 'quint':
    case 'mike':
      //var now = new Date();
      //const ahegao = msg.guild.emojis.cache.find(emojis => emojis.name === 'ahegao');
      //msg.channel.send(`${ahegao}`);
      msg.channel.send('https://cdn.discordapp.com/emojis/715902487781048321.png?v=1');
      //var later = new Date();
      //await msg.channel.send(`${(later.getTime()-now.getTime())/1000}`);
      break;
    case 'nex':
      //var now = new Date();
      //const disgust = new Discord.MessageAttachment('https://cdn.discordapp.com/emojis/684133015043178526.png');
      //await msg.channel.send(disgust);
      msg.channel.send('https://cdn.discordapp.com/emojis/684133015043178526.png');
      //var later = new Date();
      //await msg.channel.send(`${(later.getTime()-now.getTime())/1000}`);
      break;
    case 'thot':
      //const thot = new Discord.MessageAttachment('https://media1.tenor.com/images/c0086dbd46e551b5aa1ea42de6960b3b/tenor.gif?itemid=10386441');
      msg.channel.send('https://media1.tenor.com/images/c0086dbd46e551b5aa1ea42de6960b3b/tenor.gif?itemid=10386441');
      break;
    case 'putin':
      //const putin = new Discord.MessageAttachment('https://media1.tenor.com/images/c59a419de2c2b94aa95215d575ea9a14/tenor.gif?itemid=17444588');
      msg.channel.send('https://media1.tenor.com/images/c59a419de2c2b94aa95215d575ea9a14/tenor.gif?itemid=17444588');
      break;
    case 'wink':
      msg.channel.send(`:wink:`);
      break;
    case 'cheesedark':
      msg.channel.send('https://cdn.discordapp.com/emojis/701053681616945183.gif');
      break;
    case 'winkall':
      msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '308653237211234317')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '655358675170361344')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '166585626425163776')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '303950858490740746')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '397899899255128064')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '312629007864823808')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '502430932255375360')}`);
      break;
    case 'getall':
      /*msg.channel.send(msg.guild.members.fetch().filter(member => !member.user.bot).size);
      .then(console.log)
      .catch(console.error);*/
      const members = msg.guild.members.cache.filter(member => !member.user.bot).array();
      msg.channel.send(members.length);
      for (let index = 0; index < members.length; index++) {
        console.log(members[index]['user']['id']);
      }
      break;
    case 'simpsonsquote':
      fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
        .then(response => response.json())
        .then(data => {
          let quoteEmbed = new Discord.MessageEmbed()
            .addFields(
              { name: 'SimpsonsQuote', value: `${data[0]['quote']}`, inline: false },
              { name: 'Character', value: `${data[0]['character']}`, inline: false },
            )
            .setImage(`${data[0]['image']}`)
          msg.channel.send(quoteEmbed);
        })
        .catch(err => {
          console.log(err);
        })
      break;
    case 'translate':
      var text = [];

      for (let index = 0; index < args.length; index++) {
        await msg.channel.messages.fetch(args[index])
          .then(message => {
            text[index] = message.content;
          })
          .catch(console.error);
      }

      let [translations] = await translate.translate(text, "en");
      translations = Array.isArray(translations) ? translations : [translations];
      translations.forEach(translation => {
        msg.channel.send(`${translation}`);
      });
      break;
    case 'currentprefix':
      msg.channel.send(`Current prefix is ${prefix}`);
      break;
    case 'help':
      let helpEmbed = new Discord.MessageEmbed()
        .setTitle("COMMANDS ARE NOT CASE SENSITIVE")
        .addFields(
          { name: `${prefix}simpsonsQuote`, value: `Returns a random Simpsons quote`, inline: false },
          { name: `${prefix}translate [messageId1] [messageId2]...`, value: `Translate a message or multiple messages`, inline: false },
          { name: `Strong mental (ESO Admin) commands`, value: `↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓`, inline: false },
          { name: `${prefix}startTrial [name] [nº of tanks] [day (MM/DD/YYYY)] [CEST time (HH:MM)]`, value: `Initialize a trial. Example: ${prefix}startTrial nHoF 2 08/20/2020 18:00`, inline: false },
          { name: `${prefix}list [trialID]`, value: `List all trial members given trial's id. Example: ${prefix}list 1`, inline: false },
          { name: `${prefix}add [trialID] [userID] [role]`, value: `Add a trial member. Example: ${prefix}add 1 308653237211234317 🛡️`, inline: false },
          { name: `${prefix}update [trialID] [userID] [newRole]`, value: `Update a member's role. Example: ${prefix}update 1 308653237211234317 🚑`, inline: false },
          { name: `${prefix}delete [trialID] [userID]`, value: `Delete a member from the specified trial. Example: ${prefix}delete 308653237211234317`, inline: false },
          { name: `Admin commands`, value: `↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓`, inline: false },
          { name: `${prefix}assignRole [roleID]`, value: `Create an autoassign embed message`, inline: false },
        )
      msg.channel.send(helpEmbed);
      break;
    case 'assignrole':
      msg.delete();
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);
      assignRole(msg.channel, args[0]);
      
      break;
    
    case 'dailyedgy':
      msg.delete();
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);
      guildID = msg.guild.id;
      channelID = msg.channel.id;
      edgyActive = true;
      break;
    case 'changepre':
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);
      prefix = args[0];
      break;
    case 'trials':
      msg.delete();
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author))
        return msg.channel.send(`Not enough permissions`);
      
      guildID = msg.guild.id;
      channelID = msg.channel.id;
      trialsActive = true;
      break;

    case 'starttrial':
      msg.delete();
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author))
        return msg.channel.send(`Not enough permissions`);

      if ((parseInt(args[1]) >= 1 && parseInt(args[1]) <= 2) && args[2].length == 10 && args[3].length == 5)
        startTrial(msg.channel, args);
      break;
    //Lists all participants (!list trialid)
    case 'list':
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || parseInt(args[0]) > trialsCounter)
        return msg.channel.send(`The first argument isn't valid`);

      participants[parseInt(args[0]) - 1].listParticipants(msg);
      break;
    //Adds a participant (!add trialid userid role)
    case 'add':

      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || parseInt(args[0]) > trialsCounter)
        return msg.channel.send(`The first argument is invalid`);
      
      if (args[1] == undefined || args[2] == undefined) {

        msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

      } else {
        let verify = participants[parseInt(args[0]) - 1].emojisCounter(args[1], args[2]);

        if (verify) {
          participants[parseInt(args[0]) - 1].addParticipant(args[1], args[2]);
          participants[parseInt(args[0]) - 1].editEmbed();
        } else {
          participants[parseInt(args[0]) - 1].revert(args[2]);
          msg.channel.send(`Can't add participant, ${msg.author}!`);
        }
      }
      
      break;
    //Update a participant (!update trialid userid newRole)
    case 'update':

      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || parseInt(args[0]) > trialsCounter)
        return msg.channel.send(`The first argument is invalid`);
      
      if (args[1] == undefined || args[2] == undefined) {

        msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

      } else {
        let index = participants[parseInt(args[0]) - 1].findParticipant(args[1], '');
        let oldRole = participants[parseInt(args[0]) - 1].participants[index].role;
        participants[parseInt(args[0]) - 1].deleteParticipant(index, msg);

        let verify = participants[parseInt(args[0]) - 1].emojisCounter(args[1], args[2]);

        if (verify) {
          participants[parseInt(args[0]) - 1].addParticipant(args[1], args[2]);
          participants[parseInt(args[0]) - 1].editEmbed();
        } else {
          participants[parseInt(args[0]) - 1].revert(args[2]);
          participants[parseInt(args[0]) - 1].addParticipant(args[1], oldRole);
          msg.channel.send(`Can't update participant, ${msg.author}!`);
        }
      }

      break;
    //Delete a participant (!delete trialid userid)
    case 'delete':

      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || parseInt(args[0]) > trialsCounter)
        return msg.channel.send(`The first argument is invalid`);

      if (args[1] == undefined) {

        msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

      } else {

        let index = participants[parseInt(args[0]) - 1].findParticipant(args[1], '');
        participants[parseInt(args[0]) - 1].deleteParticipant(index, msg);
        participants[parseInt(args[0]) - 1].editEmbed();
      }

      break;
  }

});

async function assignRole(channel, roleID) {
  var role = channel.guild.roles.cache.find(role => role.id === roleID);

  let roleEmbed = new Discord.MessageEmbed()
    .addField(`${role.name}?`, `✔️ if yes or ❌ if not. React to have access to most channels if you are new.`, false)

  channel.send(roleEmbed).then(async function (messageReaction) {

    await messageReaction.react('✔️');
    await messageReaction.react('❌');

    const filter = (reaction, user) => {

      if (messageReaction.author.id != user.id) {

        switch (reaction.emoji.name) {
          case '✔️':
            return true;
          case '❌':
            return true;
        }

        return false;
      }
    };

    const collector = messageReaction.createReactionCollector(filter, {});

    collector.on('collect', (reaction, user) => {
      var member = channel.guild.members.cache.find(users => users.id == user.id);
      var plebRole = channel.guild.roles.cache.find(role => role.name === "Pleb");
      switch (reaction.emoji.name) {
        case '✔️':
          member.roles.remove(plebRole);
          member.roles.add(role);
          break;
        case '❌':
          member.roles.remove(plebRole);
          break;
      }
    });
  });
}

async function startTrial(channel, args) {
  var num = trialsCounter;
  trialsCounter++;

  participants[num] = new ListParticipants(args[0], parseInt(args[1]), `${args[2]} ${args[3]}`, undefined, trialsCounter);
  let trialEmbed = new Discord.MessageEmbed()
    .setTitle(`Trial nº ${trialsCounter}: ${participants[num].name}`)
    .addField('Day and time (CEST)', `${participants[num].daytime}`, false)
    .addFields(
      { name: 'Tanks', value: `0/${participants[num].tMax}`, inline: true },
      { name: 'Healers', value: `0/2`, inline: true },
      { name: 'Damage Dealers', value: `0/${participants[num].ddMax}`, inline: true },
    )

  var time = Math.abs(new Date() - new Date(participants[num].daytime + ":00"));

  channel.send(trialEmbed).then(async function (messageReaction) {

    participants[num].message = messageReaction;
    for (let index = 0; index < roles.length; index++) {
      await messageReaction.react(roles[index]);
    }

    const filter = (reaction, user) => {
      if (adminID.includes(user.id) && reaction.emoji.name == '🛑') {
        return true;
      }

      if (messageReaction.author.id != user.id) {

        var verify = participants[num].emojisCounter(user.id, reaction.emoji.name);

        if (verify) {
          return true;
        } else {
          participants[num].revert(reaction.emoji.name);
        }
        // Condition to make sure the bot will just delete unlisted reactions
        if (!verify && participants[num].findParticipant(user.id, reaction.emoji.name) == undefined) {
          reaction.users.remove(user.id);
        }
      }

      if (participants[num].findParticipant(user.id, '') != undefined) {
        var name = reaction.emoji.name;
        const userReactions = messageReaction.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

        try {
          for (const reaction of userReactions.values()) {
            if (reaction.emoji.name === name && participants[num].findParticipant(user.id, reaction.emoji.name) == undefined) {
              reaction.users.remove(user.id);
            }
          }
        } catch (error) {
          console.error('Failed to remove reactions.');
        }
      }
      return false;
    };

    const collector = messageReaction.createReactionCollector(filter, { time: time });

    collector.on('collect', (reaction, user) => {
      if (reaction.emoji.name != '🛑') {
        participants[num].addParticipant(user.id, reaction.emoji.name);
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        participants[num].editEmbed();
        messageReaction.channel.send(`${messageReaction.guild.members.cache.find(users => users.id == user.id)} signed up for **${participants[num].name}** as ${reaction.emoji.name}`).then(async function (messageRole) {
          var userRole = user;
          var reactionRole = reaction.emoji.name;
          await messageRole.react('🗑️');
          for (let index = 0; index < roles.length; index++) {
            if(roles[index] != reactionRole)
              await messageRole.react(roles[index]);
          }
          
          const filterRole = (reaction, user) => {

            if (messageRole.author.id != user.id && userRole.id == user.id) {
      
              switch (reaction.emoji.name) {
                case '🗑️':
                  return true;
                default:
                  if(reaction.emoji.name != reactionRole && roles.includes(reaction.emoji.name)){

                    let index = participants[num].findParticipant(user.id, '');
                    let oldRole = participants[num].participants[index].role;
                    participants[num].deleteParticipant(index, messageRole);

                    let verify = participants[num].emojisCounter(user.id, reaction.emoji.name);

                    if (verify) {
                      return true;
                    } else {
                      participants[num].revert(reaction.emoji.name);
                      participants[num].addParticipant(user.id, oldRole);
                      reaction.users.remove(user.id);
                    }
                  }

              }
            }else if(messageRole.author.id != user.id){
              reaction.users.remove(user.id);
            }
            
            return false;
          };

          const collectorRole = messageRole.createReactionCollector(filterRole, {});

          collectorRole.on('collect', async (reaction, user) => {
            switch (reaction.emoji.name) {
              case '🗑️':
                let index = participants[num].findParticipant(user.id, '');
                participants[num].deleteParticipant(index, messageRole);
                messageRole.delete();
                participants[num].editEmbed();
                break;
              default:
                participants[num].addParticipant(user.id, reaction.emoji.name);
                participants[num].editEmbed();
                await messageRole.reactions.cache.get(reaction.emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
                messageRole.react(reactionRole);
                reactionRole = reaction.emoji.name;
                messageRole.edit(`${messageRole.guild.members.cache.find(users => users.id == user.id)} signed up for **${participants[num].name}** as ${reactionRole}`);
                //*starttrial adasd 2 08/22/2020 18:00
                break;
            }
          });
        });
        
      } else {
        collector.stop('Collector stopped');
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason && reason === 'Collector stopped') {
        console.log('Collector has been stopped manually');
      } else {
        console.log('Collector has run out of time');
      }
      participants[num].listParticipants(messageReaction);
    });
  });
}

function recursiveTrial(channel) {
  let message = undefined;
  let fields;

  setTimeout(function () {
    channel.send(`Trial nº ${trialsCounter + 1}: type name, number of tanks, date and time`).then(() => {
      channel.awaitMessages(message => (adminID.includes(message.author.id)), { max: 1, time: 30000 }).then(collected => {

        if (collected.first().content != "cancel") {
          message = collected.first().content;

          fields = message.split(" ");
          startTrial(channel, fields);
          recursiveTrial(channel);
        } else {
          channel.send("Operation cancelled");
        }

      }).catch(() => {
        channel.send('No answer after 30 seconds, operation canceled.');
      });
    });
  }, 5000);
}

let scheduledTrial = new cron.CronJob('00 00 17 * * 4', () => {

  if (guildID != undefined && trialsActive) {

    let guild = client.guilds.cache.get(guildID);
    let channel = guild.channels.cache.get(channelID);

    recursiveTrial(channel);

  }
});

scheduledTrial.start();

let edgyTurn = new cron.CronJob('00 00 22 * * *', () => {
  if (guildID != undefined && edgyActive) {
    let guild = client.guilds.cache.get(guildID);
    let channel = guild.channels.cache.get(channelID);
    let randomID = selectRandomMember();

    channel.send(`Today is ${guild.members.cache.find(users => users.id == randomID)} 's turn`);
  }
});

edgyTurn.start();

function selectRandomMember() {
  const members = (client.guilds.cache.get(guildID)).members.cache.filter(member => !member.user.bot).array();
  return (members[Math.floor(Math.random() * members.length)]['user']['id']);
}

client.login(token);