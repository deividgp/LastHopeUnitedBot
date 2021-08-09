const Discord = require('discord.js');

const assignRole = async (channel, roleID) => {
    let role = channel.guild.roles.cache.find(r => r.id === roleID);

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
                    default:
                        reaction.users.remove(user.id);
                        break;
                }

                return false;
            }
        };

        const collector = messageReaction.createReactionCollector(filter, {});

        collector.on('collect', (reaction, user) => {
            let member = channel.guild.members.cache.find(u => u.id == user.id);
            let plebRole = channel.guild.roles.cache.find(r => r.name === "Pleb");
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


const deleteMessages = async (channel, max) => {
    channel.messages.fetch({
        limit: max
    }).then((messages) => {
        let msgArray = [];
        messages.forEach((msg) => {
            msgArray.push(msg);
        })
        channel.bulkDelete(msgArray);
    })
}

const confirmTrial = async (channel, client) => {

    channel.awaitMessages(message => (message.member.hasPermission("ADMINISTRATOR")), { max: 1, time: 30000 }).then(async collected => {

        if (collected.first().content != "cancel") {
            message = collected.first();
            let messageContent = message.content;
            let indexIds = 0;
            let idsConfirmation = [];

            for (let index = 0; index < messageContent.length; index++) {
                if (messageContent.charAt(index) == '<') {
                    idsConfirmation[indexIds] = messageContent.substring(index + 3, (index + 3) + 18);
                    indexIds++;
                    index = (index + 3) + 19;
                }
            }

            let counter = 0;
            await message.react('✔️');

            const filter = (reaction, user) => {

                if (message.member.id == user.id && reaction.emoji.name == '🛑') {
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
                    let member = channel.guild.members.cache.find(users => users.id == user.id);
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

module.exports = {
    assignRole,
    deleteMessages,
    confirmTrial,
    isReply
}