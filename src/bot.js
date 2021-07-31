const Discord = require('discord.js');
const client = new Discord.Client();
const Twit = require('twit');
require('dotenv').config()
const {
  token
} = require(`../config/${process.env.MODE}.json`);
const ListTrials = require('./trials/listTrials.js');
const trials = new ListTrials();
const T = new Twit({
  consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
  consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
  access_token: `${process.env.TWITTER_ACCESS_TOKEN}`,
  access_token_secret: `${process.env.TWITTER_ACCESS_TOKEN_SECRET}`,
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
  if(handler == "event_handler"){
    require(`./handlers/${handler}`)(client, trials);
  }else{
    require(`./handlers/${handler}`)(client);
  }
})

const stream = T.stream('statuses/filter', { follow: '718475378751381504' });

stream.on('tweet', function (tweet) {
  let content = tweet.text;
  if (content.includes("ESO") && content.includes("European PC")) {
    client.channels.fetch('811948277461024838')
      .then(channel => {
        channel.send(tweet.text);
      })
  }
});

client.login(token);