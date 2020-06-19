const Discord = require('discord.js');
const cron = require('cron');
const client = new Discord.Client();
const prefix = '!';
var guildID;
var channelID;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === prefix + 'cheese') {
    const kekw = msg.guild.emojis.cache.find(emoji => emoji.name === 'kekw');
    msg.channel.send(`${kekw}`);
  }

  if (msg.content === prefix + 'quint' || msg.content === prefix + 'mike') {
    const ahegao = msg.guild.emojis.cache.find(emojis => emojis.name === 'ahegao');
    msg.channel.send(`${ahegao}`);
  }

  if (msg.content === prefix + 'nex') {
    const disgust = new Discord.MessageAttachment('https://cdn.discordapp.com/emojis/684133015043178526.png');
    msg.channel.send(disgust);
  }

  if (msg.content === prefix + 'wink') {
    msg.channel.send(`:wink:`);
  }

  if (msg.content === prefix + 'brb') {
    msg.channel.send(`gtg eat`);
  }

  if (msg.content === prefix + 'winkall') {
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '308653237211234317')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '655358675170361344')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '166585626425163776')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '303950858490740746')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '312629007864823808')}`);
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '397899899255128064')}`);
  }

  /*if (msg.author.id === '655358675170361344') {
    const kekw = msg.guild.emojis.cache.find(emojis => emojis.name === 'kekw');
    msg.channel.send(`simp ${kekw}`);
  }*/

  if (msg.content === prefix + 'getAll') {
    /*msg.channel.send(msg.guild.members.fetch().filter(member => !member.user.bot).size);
    .then(console.log)
    .catch(console.error);*/
    const members = msg.guild.members.cache.filter(member => !member.user.bot).array();
    msg.channel.send(members.length);
    for (let index = 0; index < members.length; index++) {
      console.log(members[index]['user']['id']);
    }
  }

  if (msg.content === prefix + 'dailyEdgy') {
    guildID = msg.guild.id;
    channelID = msg.channel.id;
  }
});

let scheduledMessage = new cron.CronJob('00 00 00 * * *', () => {
  if(guildID != undefined){
    let guild = client.guilds.cache.get(guildID);
    let channel = guild.channels.cache.get(channelID);
    let randomID = selectRandomMember();

    channel.send(`Today is ${guild.members.cache.find(users => users.id == randomID)} 's turn`);
  }
});

scheduledMessage.start();

function selectRandomMember(){
  const members = (client.guilds.cache.get(guildID)).members.cache.filter(member => !member.user.bot).array();
  return (members[Math.floor(Math.random() * members.length)]['user']['id'])
}

client.login('NTExMTc3MzA2NDc2MzgwMTg5.Xuo6FA.kuvT0a7ama0eO8aGalioQFCAyK0');