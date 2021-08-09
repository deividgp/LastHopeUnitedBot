const Discord = require('discord.js');
const client = new Discord.Client();
const Twit = require('twit');
const http = require('https');
require('dotenv').config()
const {
  token
} = require(`../config/${process.env.MODE}.json`);
const {
  isReply,
} = require('./functions.js');
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
  if (handler == "event_handler") {
    require(`./handlers/${handler}`)(client, trials);
  } else {
    require(`./handlers/${handler}`)(client);
  }
})

const stream = T.stream('statuses/filter', { follow: '718475378751381504' });

stream.on('tweet', function (tweet) {
  let content = tweet.text;
  if (content.includes("ESO") && content.includes("European PC") && !isReply(tweet)) {
    client.channels.fetch('811948277461024838')
      .then(channel => {
        channel.send(tweet.text);
      })
  }
});

/*setInterval(function () {
  http.get("https://live-services.elderscrollsonline.com/status/realms", function (res) {
    let data = '',
      json_data;

    res.on('data', function (stream) {
      data += stream;
    });
    res.on('end', function () {
      json_data = JSON.parse(data);
      let serverInfo = json_data["zos_platform_response"]["response"];

      for (let server in serverInfo) {
        if (){
          
        }
        serverEmbed.addField(`${server.substring(26, server.length - 1)}`, `${serverInfo[server]}`, true)
      }

      console
    });
  });

}, 1000);*/

client.login(token);