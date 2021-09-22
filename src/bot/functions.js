const Discord = require('discord.js');
const Twit = require('twit');

const assignRole = async (channel, msgID) => {
    channel.messages.fetch(msgID)
        .then(async (message) => {
            const role = channel.guild.roles.cache.find(r => r.name == message.content);
            await message.react('✔️');
            await message.react('❌');

            const filter = (reaction, user) => {

                switch (reaction.emoji.name) {
                    case '✔️':
                    case '❌':
                        return true;
                    default:
                        reaction.users.remove(user.id);
                        return false;
                }
            };

            const collector = message.createReactionCollector({ filter });

            collector.on('collect', (reaction, user) => {
                const member = channel.guild.members.cache.find(u => u.id == user.id);
                const plebRole = channel.guild.roles.cache.find(r => r.name == "Pleb");
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
        })
        .catch(console.error);
}

const assignGameRole = async (channel, msgID) => {
    channel.messages.fetch(msgID)
        .then(async (message) => {
            const tank = channel.guild.roles.cache.find(r => r.name == "Tank");
            const healer = channel.guild.roles.cache.find(r => r.name == "Healer");
            const dd = channel.guild.roles.cache.find(r => r.name == "DD");
            await message.react('876758966720405535');
            await message.react('876758967018197032');
            await message.react('876758967014010880');
            const filter = (reaction, user) => {

                if (channel.guild.members.cache.find(u => u.id == user.id).roles.cache.find(r => r.name == "Elder Scrolls Online")) {

                    switch (reaction.emoji.id) {
                        case '876758966720405535':
                        case '876758967018197032':
                        case '876758967014010880':
                            return true;
                    }
                }
                reaction.users.remove(user.id);
                return false;
            };

            const collector = message.createReactionCollector({ filter });

            collector.on('collect', (reaction, user) => {
                console.log("hi");
                const member = channel.guild.members.cache.find(u => u.id == user.id);
                switch (reaction.emoji.id) {
                    case '876758966720405535':
                        member.roles.add(tank);
                        break;
                    case '876758967018197032':
                        member.roles.add(healer);
                        break;
                    case '876758967014010880':
                        member.roles.add(dd);
                        break;
                }
            });
        })
        .catch(console.error);
}

const twitter = (channel) => {
    try {
        const T = new Twit({
            consumer_key: `${process.env.TWITTER_CONSUMER_KEY}`,
            consumer_secret: `${process.env.TWITTER_CONSUMER_SECRET}`,
            access_token: `${process.env.TWITTER_ACCESS_TOKEN}`,
            access_token_secret: `${process.env.TWITTER_ACCESS_TOKEN_SECRET}`,
        });
        const tweetKeywords = ["ESO", "European megaservers", "European PC"];

        const stream = T.stream('statuses/filter', { follow: '718475378751381504' });

        stream.on('tweet', function (tweet) {
            let content = tweet.text;
            if (tweetKeywords.some(keyword => content.includes(keyword)) && !isReply(tweet)) {
                channel.send(tweet.text);
            }
        });
    } catch(error) {
        console.error(error);
    }
}

const isReply = (tweet) => {
    if (tweet.retweeted_status
        || tweet.in_reply_to_status_id
        || tweet.in_reply_to_status_id_str
        || tweet.in_reply_to_user_id
        || tweet.in_reply_to_user_id_str
        || tweet.in_reply_to_screen_name)
        return true;

    return false;
}

String.prototype.replaceAt = function (index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}

module.exports = {
    assignRole,
    twitter,
    assignGameRole,
}