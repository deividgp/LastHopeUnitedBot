const Discord = require('discord.js');
const client = new Discord.Client();
const cron = require('cron');
const fetch = require('node-fetch');
const Twit = require('twit');
const moment = require('moment');
require('dotenv').config()
const { Translate } = require('@google-cloud/translate').v2;
const http = require('https');
const {
  prefix,
  token,
} = require(`../config/${process.env.MODE}.json`);
const {
  assignRole,
  deleteMessages,
  confirmTrial,
} = require('./functions.js');
const ListTrials = require('./trials/listTrials.js');
const Sheet = require('./sheet.js');
const sheet = new Sheet();
const translate = new Translate();

const T = new Twit({
  consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
  consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
  access_token: `${process.env.TWITTER_ACCESS_TOKEN}`,
  access_token_secret: `${process.env.TWITTER_ACCESS_TOKEN_SECRET}`,
});

const trials = new ListTrials();
let guildID;
let channelID;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("stabbing pizza", {
    type: "STREAMING",
    url: "https://www.twitch.tv/deividgp"
  });

  client.channels.fetch('811207960701042713')
    .then(channel => {
      deleteMessages(channel, 6);
      setTimeout(async function () {
        await assignRole(channel, "811207960671813646");
      }, 4000);
    })
    .catch(console.error);
  /*client.channels.fetch('863732362495262741')
    .then(channel => {
      deleteMessages(channel, 6);
      setTimeout(async function () {
        await assignRole(channel, "712978610562269235");
      }, 4000);
    })
    .catch(console.error);*/
});

client.on('guildMemberAdd', member => {
  if (!member.bot) {
    let role = member.guild.roles.cache.find(r => r.name === "Pleb");
    member.roles.add(role);
  }
});

client.on('guildMemberRemove', member => {
  client.channels.fetch('811207960701042715')
    .then(channel => {
      channel.send(`Goodbye ${member.user.tag}`);
    })
    .catch(console.error);
});

client.on('message', async msg => {

  if (!msg.content.startsWith(prefix) || msg.author.bot) {
    if (msg.content === "?XD" && !msg.author.bot) {
      return msg.channel.send("?XD");
    }
    return;
  }

  const args = msg.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'joker':
      msg.channel.send('https://tenor.com/view/you-wouldnt-get-it-joker-smoking-gif-15952801');
      break;
    case 'justice':
      const sadge = msg.guild.emojis.cache.find(e => e.name === 'sadge');
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
      msg.channel.send(`:wink: ${msg.guild.members.cache.find(u => u.id == '308653237211234317')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '655358675170361344')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '166585626425163776')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '303950858490740746')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '397899899255128064')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '312629007864823808')}\n:wink: ${msg.guild.members.cache.find(users => users.id == '502430932255375360')}`);
      break;
    case 'getall':
      /*msg.channel.send(msg.guild.members.fetch().filter(member => !member.user.bot).size);
      .then(console.log)
      .catch(console.error);*/
      const members = msg.guild.members.cache.filter(member => !member.user.bot).array();
      msg.channel.send(members.length);
      for (const member of members) {
        console.log(member['user']['id']);
      }
      break;
    case 'simpsonsquote':
      fetch('https://simpsons-quotes-api.herokuapp.com/quotes')
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
      let text = [];

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
      edgyTurn.start();
      break;
    /*case 'changepre':
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);
      prefix = args[0];
      break;*/
    case 'sheet':
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);

      sheet.runSheet(args[0], msg);
      break;
    case 'trials':
      msg.delete();
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);

      guildID = msg.guild.id;
      channelID = msg.channel.id;
      scheduledTrial.start();
      break;

    case 'starttrial':
      msg.delete();
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);

      let parseDate = moment(`${args[2]} ${args[3]}`, "DD/MM/YYYY HH:mm").toDate();

      if (parseInt(args[1]) >= 1 && args[2].length == 10 && args[3].length == 5 && new Date() < parseDate)
        trials.addTrial(args, msg.channel);

      break;
    //Lists all participants (!list trialid)
    case 'list':
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);

      if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
        return msg.channel.send(`The first argument isn't valid`);

      trials._trials[parseInt(args[0]) - 1].listParticipants(msg);
      break;
    //Adds a participant (!add trialid userid role)
    case 'add':

      if (!msg.member.hasPermission("ADMINISTRATOR"))
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

      if (!msg.member.hasPermission("ADMINISTRATOR"))
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
      if (!msg.member.hasPermission("ADMINISTRATOR"))
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
      if (!msg.member.hasPermission("ADMINISTRATOR"))
        return msg.channel.send(`Not enough permissions`);

      confirmTrial(msg.channel, client);

      break;
    case 'server':
    case 'servers':
      http.get("https://live-services.elderscrollsonline.com/status/realms", function (res) {
        let data = '',
          json_data;

        res.on('data', function (stream) {
          data += stream;
        });
        res.on('end', function () {
          json_data = JSON.parse(data);
          let serverInfo = json_data["zos_platform_response"]["response"];

          let serverEmbed = new Discord.MessageEmbed()
            .setTitle(`Server status`)

          for (let server in serverInfo) {
            serverEmbed.addField(`${server.substring(26, server.length - 1)}`, `${serverInfo[server]}`, true)
          }

          msg.channel.send(serverEmbed);
        });
      });
      break;
  }

});

const stream = T.stream('statuses/filter', { follow: '718475378751381504' });

stream.on('tweet', function (tweet) {
  let content = tweet.text;
  if (content.includes("ESO") && content.includes("European PC")) {
    /*client.channels.fetch('863732362495262741')
      .then(channel => {
        channel.send(tweet.text);
      })*/
    client.channels.fetch('811948277461024838')
      .then(channel => {
        channel.send(tweet.text);
      })
  }
});

const scheduledTrial = new cron.CronJob('00 00 17 * * 4', () => {
  let guild = client.guilds.cache.get(guildID);
  let channel = guild.channels.cache.get(channelID);

  trials.recursiveTrial(channel);
});

const edgyTurn = new cron.CronJob('00 00 22 * * *', () => {
  let guild = client.guilds.cache.get(guildID);
  let channel = guild.channels.cache.get(channelID);
  let randomID = selectRandomMember();

  channel.send(`Today is ${guild.members.cache.find(u => u.id == randomID)} 's turn`);
});

/*function selectRandomMember() {
  const members = (client.guilds.cache.get(guildID)).members.cache.filter(member => !member.user.bot).array();
  return (members[Math.floor(Math.random() * members.length)]['user']['id']);
}*/

client.login(token);