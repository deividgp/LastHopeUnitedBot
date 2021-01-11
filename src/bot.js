const Discord = require('discord.js');
const cron = require('cron');
const fetch = require('node-fetch');
var Twit = require('twit');
const moment = require('moment');
require('dotenv').config()
const { Translate } = require('@google-cloud/translate').v2;
const {
  prefix,
  token,
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
} = require(`../config/${process.env.MODE}.json`);
const ListTrials = require('./trials/listTrials.js');
const Sheet = require('./sheet.js');
var sheet = new Sheet();
const translate = new Translate();
const client = new Discord.Client();
var T = new Twit({
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
});
const specificRole = "Strong mental";
const adminID = ['308653237211234317', '124949555337887744'];
const generalChannels = ['639444161954840618', '639746140186869801', '706792008345190440', '778277022442586183', '674268979157794875', '718911455096995900', '639746208428195850', '798153323991662592'];
var guildID;
var channelID;
var trials = new ListTrials();
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
      deleteMessages(channel, 5);
      setTimeout(function(){
        assignRole(channel, "744166758813794454");
        assignRole(channel, "744166758813794454");
      }, 4000);
    })
    .catch(console.error);*/

  client.channels.fetch('744202016024297472')
    .then(channel => {
      deleteMessages(channel, 6);
      setTimeout(function () {
        assignRole(channel, "682206766456373352");
        assignRole(channel, "675006815091687425");
        assignRole(channel, "764456928041500672");
      }, 4000);
    })
    .catch(console.error);
});

client.on('guildMemberAdd', member => {
  if (!member.bot) {
    var role = member.guild.roles.cache.find(role => role.id === "744202122739843112");
    member.roles.add(role);
  }
});

client.on('guildMemberRemove', member => {
  client.channels.fetch('639444161954840618')
    .then(channel => {
      channel.send(`Suck SpoonMan ${member.user.tag}`);
    })
    .catch(console.error);
});

client.on('message', async msg => {

  if (msg.author.bot) return;

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
      msg.channel.send('https://cdn.discordapp.com/emojis/715902179902488597.png');
      break;
    case 'quint':
    case 'mike':
      msg.channel.send('https://cdn.discordapp.com/emojis/715902487781048321.png?v=1');
      break;
    case 'nex':
      msg.channel.send('https://cdn.discordapp.com/emojis/684133015043178526.png');
      break;
    case 'thot':
      msg.channel.send('https://media1.tenor.com/images/c0086dbd46e551b5aa1ea42de6960b3b/tenor.gif?itemid=10386441');
      break;
    case 'putin':
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
    case 'currentutc':
      msg.channel.send(`${new Date()}`);
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
          { name: `${prefix}deleteMessages [messagedNº]`, value: `Remove X number of messages`, inline: false },
        )
      msg.channel.send(helpEmbed);
      break;
    case 'assignrole':
      msg.delete();
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);
      assignRole(msg.channel, args[0]);

      break;
    case 'deletemessages':
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || args[0] == undefined)
        return msg.channel.send(`The first argument is invalid`);

      deleteMessages(msg.channel, parseInt(args[0]));
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
    case 'slowmode':
      msg.delete();
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);

      for (let index = 0; index < generalChannels.length; index++) {
        let auxChannel = msg.guild.channels.cache.find(channel => channel.id === generalChannels[index]);
        auxChannel.setRateLimitPerUser(parseInt(args[0]), "");
      }
      break;
    case 'sheet':
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author.id))
        return msg.channel.send(`Not enough permissions`);

      sheet.runSheet(args[0], msg);
      break;
    case 'trials':
      msg.delete();
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author.id))
        return msg.channel.send(`Not enough permissions`);

      guildID = msg.guild.id;
      channelID = msg.channel.id;
      trialsActive = true;
      break;

    case 'starttrial':
      msg.delete();
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author.id))
        return msg.channel.send(`Not enough permissions`);

      var parseDate = moment(`${args[2]} ${args[3]}`, "DD/MM/YYYY HH:mm").toDate();

      if (parseInt(args[1]) >= 1 && args[2].length == 10 && args[3].length == 5 && new Date() < parseDate)
        trials.addTrial(args, msg.channel);

      break;
    //Lists all participants (!list trialid)
    case 'list':
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author.id))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
        return msg.channel.send(`The first argument isn't valid`);

      trials._trials[parseInt(args[0]) - 1].listParticipants(msg);
      break;
    //Adds a participant (!add trialid userid role)
    case 'add':

      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author.id))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
        return msg.channel.send(`The first argument is invalid`);

      if (args[1] == undefined || args[2] == undefined) {

        msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

      } else {
        let add = trials._trials[parseInt(args[0]) - 1].addParticipantFinal(args[1], args[2]);
        if (!add)
          msg.channel.send(`Can't add participant, ${msg.author}!`);
      }

      break;
    //Update a participant (!update trialid userid newRole)
    case 'update':

      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author.id))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
        return msg.channel.send(`The first argument is invalid`);

      if (args[1] == undefined || args[2] == undefined) {

        msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

      } else {
        let update = trials._trials[parseInt(args[0]) - 1].updateParticipantFinal(args[1], args[2]);
        if (!update)
          msg.channel.send(`Can't update participant, ${msg.author}!`);
      }

      break;
    //Delete a participant (!delete trialid userid)
    case 'delete':
      msg.delete();
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author.id))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
        return msg.channel.send(`The first argument is invalid`);

      if (args[1] == undefined) {

        msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

      } else {
        trials._trials[parseInt(args[0]) - 1].deleteParticipantFinal(args[1]);
      }

      break;
    //Confirm trial participants
    case 'confirmtrial':
      msg.delete();
      if (!msg.member.roles.cache.some(role => role.name === specificRole) && !adminID.includes(msg.author.id))
        return msg.channel.send(`Not enough permissions`);

      confirmTrial(msg.channel);

      break;
  }

});

async function assignRole(channel, roleID) {
  var role = channel.guild.roles.cache.find(role => role.id === roleID);

  let roleEmbed = new Discord.MessageEmbed()
    .addField(`${role.name}?`, `✔️ if yes or ❌ if not. React to have access to most channels if you are new.`, false)

  channel.send(roleEmbed).then(async (messageReaction) => {

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

let scheduledTrial = new cron.CronJob('00 00 17 * * 4', () => {

  if (guildID != undefined && trialsActive) {

    let guild = client.guilds.cache.get(guildID);
    let channel = guild.channels.cache.get(channelID);

    trials.recursiveTrial(channel);

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

var stream = T.stream('statuses/filter', { follow: '308503953' });

stream.on('tweet', function (tweet) {
  console.log(`${tweet.text}`);
  var content = tweet.text;
  if (content.includes("#ESO") && content.includes("TESOnline")) {
    console.log("suh dude");
    switch (true) {
      case content.includes("PC/Mac"):
        switch (true) {
          case content.includes(" available"):

            break;
          case content.includes(" unavailable"):

            break;
        }
        break;
      case content.includes("XboxOne"):

        break;
      case content.includes("PS4"):

        break;
      case content.includes("console"):

        break;
    }
  }
});

function confirmTrial(channel) {

  channel.awaitMessages(message => (adminID.includes(message.author.id)), { max: 1, time: 30000 }).then(async collected => {

    if (collected.first().content != "cancel") {
      message = collected.first();
      var messageContent = message.content;
      var indexIds = 0;
      var idsConfirmation = [];

      for (let index = 0; index < messageContent.length; index++) {
        if (messageContent.charAt(index) == '<') {
          idsConfirmation[indexIds] = messageContent.substring(index + 3, (index + 3) + 18);
          indexIds++;
          index = (index + 3) + 19;
        }
      }

      var counter = 0;
      await message.react('✔️');

      const filter = (reaction, user) => {

        if (adminID.includes(user.id) && reaction.emoji.name == '🛑') {
          return true;
        }

        if (idsConfirmation.includes(user.id) && user.id != client.user.id && reaction.emoji.name === '✔️' && counter <= idsConfirmation.length) {
          counter++;
          return true;
        }

        return false;
      };

      const collector = message.createReactionCollector(filter, {});

      collector.on('collect', (reaction, user) => {
        if (reaction.emoji.name != '🛑') {
          var member = channel.guild.members.cache.find(users => users.id == user.id);
          channel.send(`${member} confirmed attendance.`);

          for (let index = 0; index < idsConfirmation.length; index++) {
            if (user.id == idsConfirmation[index]) {
              idsConfirmation[index] = undefined;
              break;
            }
          }
        } else {
          collector.stop('Collector stopped');
        }
      });

    } else {
      channel.send("Operation cancelled");
    }

  }).catch(() => {
    channel.send('No answer after 30 seconds, operation canceled.');
  });
}

function deleteMessages(channel, max) {
  channel.messages.fetch({
    limit: max
  }).then((messages) => {
    var msgArray = [];
    messages.forEach(msg => msgArray.push(msg));
    channel.bulkDelete(msgArray);
  })
}

/*function availableUnavailable(tweet, platform){
  switch (true) {
    case tweet.includes(" available"):
      serverStatus = new Discord.MessageEmbed()
      .setTitle(`ESO SERVER STATUS`)
      
      .addFields(
        { name: 'Tanks', value: `0/${this._tMax}`, inline: true },
        { name: 'Healers', value: `0/2`, inline: true },
        { name: 'Damage Dealers', value: `0/${this._ddMax}`, inline: true },
      )
      break;
    case tweet.includes(" unavailable"):

      break;
  }
}*/

client.login(token);