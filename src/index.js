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
const maxSize = 12;
var trialsCounter = 0;
var edgyActive = false;
var trialsActive = false;

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

  switch(command){
    case 'justice':
      const sadge = msg.guild.emojis.cache.find(emoji => emoji.name === 'sadge');
      msg.channel.send(`${sadge} without justice there is no prevail ${sadge} and without prevail there is no life ${sadge} but afterall life is suffering and pain ${sadge} so why even have justice afterall? ${sadge}`);
      break;
    case 'cheese':
      //var now = new Date();
      //const kekw = msg.guild.emojis.cache.find(emoji => emoji.name === 'kekw');
      //await msg.channel.send(`${kekw}`);
      msg.channel.send('https://cdn.discordapp.com/emojis/715902179902488597.png')
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
      msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '308653237211234317')}`);
      msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '655358675170361344')}`);
      msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '166585626425163776')}`);
      msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '303950858490740746')}`);
      msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '312629007864823808')}`);
      msg.channel.send(`:wink: ${msg.guild.members.cache.find(users => users.id == '397899899255128064')}`);
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
  }

  /*Admin only commands*/
  if(msg.member.roles.cache.has('729347913188376647') || adminID.includes(msg.author.id)){
    switch(command){
      case 'changepre':
        prefix = args[0];
        break;
      case 'trials':
        guildID = msg.guild.id;
        channelID = msg.channel.id;
        trialsActive = true;
        msg.delete();
        break;
      case 'start':
        startTrial(msg, msg.channel, args);
        msg.delete();
        break;
      case 'dailyedgy':
        guildID = msg.guild.id;
        channelID = msg.channel.id;
        edgyActive = true;
        msg.delete();
        break;
    }

    if(parseInt(args[0]) != 0 && parseInt(args[0]) <= trialsCounter){

      switch(command){
        //Lists all participants (!list trial)
        case 'list':
          participants[parseInt(args[0])-1].listParticipants(msg);
          break;
        //Adds a participant (!add trial userid role)
        case 'add':
          
          if (args[1] == undefined || args[2] == undefined) {
  
            msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);
    
          }else{
            let verify = participants[parseInt(args[0])-1].emojisCounter(args[1], args[2]);
  
            if(verify){
              participants[parseInt(args[0])-1].addParticipant(args[1], args[2]);
              participants[parseInt(args[0])-1].editEmbed();
            }else{
              participants[parseInt(args[0])-1].revert(args[2]);
              msg.channel.send(`Can't add participant, ${msg.author}!`);
            }
          }
          break;
        //Update a participant (!update trial userid newRole)
        case 'update':
          if (args[1] == undefined || args[2] == undefined) {
  
            msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);
    
          }else{
            let index = participants[parseInt(args[0])-1].findParticipant(args[1], '');
            let oldRole = participants[parseInt(args[0])-1].participants[index].role;
            console.log(oldRole);
            participants[parseInt(args[0])-1].deleteParticipant(index, msg);
  
            let verify = participants[parseInt(args[0])-1].emojisCounter(args[1], args[2]);
  
            if(verify){
              participants[parseInt(args[0])-1].addParticipant(args[1], args[2]);
              participants[parseInt(args[0])-1].editEmbed();
            }else{
              participants[parseInt(args[0])-1].revert(args[2]);
              participants[parseInt(args[0])-1].addParticipant(args[1], oldRole);
              msg.channel.send(`Can't update participant, ${msg.author}!`);
            }
          }
          break;
        //Delete a participant (!delete trial userid)
        case 'delete':
          if (args[1] == undefined) {
  
            msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);
    
          }else{
  
            let index = participants[parseInt(args[0])-1].findParticipant(args[1], '');
            participants[parseInt(args[0])-1].deleteParticipant(index, msg);
            participants[parseInt(args[0])-1].editEmbed();
          }
          break;
      }
    }
  }

});

async function startTrial(msg, channel, args){
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

  channel.send(trialEmbed).then(async function (messageReaction) {
    
    participants[num].message = messageReaction;
    await messageReaction.react('🛡️');
    await messageReaction.react('🚑');
    await messageReaction.react('⚔️');
    await messageReaction.react('🏹');
    
    const filter = (reaction, user) => {
      if(adminID.includes(user.id) && reaction.emoji.name == '🛑'){
        return true;
      }
      
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
      if(reaction.emoji.name != '🛑'){
        participants[num].addParticipant(user.id, reaction.emoji.name);
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        messageReaction.channel.send(`${messageReaction.guild.members.cache.find(users => users.id == user.id)} signed up for **${participants[num].name}** as ${reaction.emoji.name}`);
        participants[num].editEmbed();
      }else{
        collector.stop('Collector stopped');
      }

      if(participants[num].counter === maxSize){
        collector.stop('Collector stopped');
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason && reason === 'Collector stopped') {
        console.log('Collector has been stopped manually');
        participants[num].listParticipants(messageReaction);
      }
    });
  });
}

function recursiveTrial(channel){
  let message = undefined;
  let fields;

  setTimeout(function(){ channel.send(`Trial nº ${trialsCounter+1}: type name, number of tanks, date and time`).then(()=>{
    channel.awaitMessages(message=>(adminID.includes(message.author.id)),{max: 1, time: 30000}).then(collected => {
      
      if(collected.first().content != "cancel"){
        message = collected.first().content;
        
        fields = message.split(" ");
        startTrial(undefined, channel, fields);
        recursiveTrial(channel);
      }else{
        channel.send("Operation cancelled");
      }
      
      }).catch(() => {
          channel.send('No answer after 30 seconds, operation canceled.');
      });
    });
  }, 5000);
}

let scheduledTrial = new cron.CronJob('00 00 17 * * 4', ()=>{
  
  if(guildID != undefined && trialsActive){

    let guild = client.guilds.cache.get(guildID);
    let channel = guild.channels.cache.get(channelID);
    
    recursiveTrial(channel);

  }
});

scheduledTrial.start();

let edgyTurn = new cron.CronJob('00 00 22 * * *', () => {
  if(guildID != undefined && edgyActive){
    let guild = client.guilds.cache.get(guildID);
    let channel = guild.channels.cache.get(channelID);
    let randomID = selectRandomMember();
    
    channel.send(`Today is ${guild.members.cache.find(users => users.id == randomID)} 's turn`);
  }
});

edgyTurn.start();

function selectRandomMember(){
  const members = (client.guilds.cache.get(guildID)).members.cache.filter(member => !member.user.bot).array();
  return (members[Math.floor(Math.random() * members.length)]['user']['id']);
}

client.login('NTExMTc3MzA2NDc2MzgwMTg5.Xuo6FA.kuvT0a7ama0eO8aGalioQFCAyK0');