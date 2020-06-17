const Discord = require('discord.js');
const client = new Discord.Client();
const startMessage = '!';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === startMessage + 'cheese') {
    const kekw = msg.guild.emojis.cache.find(emojis => emojis.name === 'kekw');
    msg.channel.send(`${kekw}`);
  }

  if (msg.content === startMessage + 'quint' || msg.content === startMessage + 'mike') {
    const ahegao = msg.guild.emojis.cache.find(emojis => emojis.name === 'ahegao');
    msg.channel.send(`${ahegao}`);
  }

  if (msg.content === startMessage + 'nex') {
    const disgust = new Discord.MessageAttachment('https://cdn.discordapp.com/emojis/684133015043178526.png');
    msg.channel.send(disgust);
  }

  if (msg.content === startMessage + 'wink') {
    msg.channel.send(`:wink:`);
  }

  if (msg.content === startMessage + 'winkall') {
    msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '308653237211234317')}\n
    :wink: ${msg.guild.members.cache.find(users => users.id == '655358675170361344')}\n
    :wink: ${msg.guild.members.cache.find(users => users.id == '166585626425163776')}\n
    :wink: ${msg.guild.members.cache.find(users => users.id == '303950858490740746')}\n
    :wink: ${msg.guild.members.cache.find(users => users.id == '312629007864823808')}\n
    :wink: ${msg.guild.members.cache.find(users => users.id == '397899899255128064')}`);
  }
});

client.login('NTExMTc3MzA2NDc2MzgwMTg5.Xund7w.sA6jNZpC-4tAbMp88wYMiPIN2AE');