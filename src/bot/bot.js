const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
require('dotenv').config()
const {
  token
} = require(`../../config/${process.env.MODE}.json`);
const ListTrials = require('./trials/listTrials.js');
const trials = new ListTrials();
client.commands = new Collection();
client.events = new Collection();

['command_handler', 'event_handler'].forEach(handler => {
  if (handler == "event_handler") {
    require(`./handlers/${handler}`)(client, trials);
  } else {
    require(`./handlers/${handler}`)(client);
  }
})

client.login(token);