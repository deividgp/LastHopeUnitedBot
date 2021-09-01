const Discord = require('discord.js');

const assignRole = async (channel, roleID) => {
    let role = channel.guild.roles.cache.find(r => r.id === roleID);

    let roleEmbed = new Discord.MessageEmbed()
        .addField(`${role.name}?`, `✔️ if yes or ❌ if not. React to have access to most channels if you are new.`, false)

    channel.send({ embeds: [roleEmbed] }).then(async (messageReaction) => {

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

        const collector = messageReaction.createReactionCollector({ filter });

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

const confirmTrial = async (interaction, client) => {
    interaction.channel.awaitMessages({ max: 1, time: 15000 }).then(async collected => {

        if (collected.first().content != "cancel") {
            collected.first().delete();
            const message = await interaction.channel.send(collected.first().content);
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

            await message.react('✔️');
            await message.react('❌');
            const filter = (reaction, user) => {

                if ((message.member.id == user.id && reaction.emoji.name == '🛑') || (idsConfirmation.includes(user.id) && user.id != client.user.id && (reaction.emoji.name === '✔️' || reaction.emoji.name === '❌'))) {
                    return true;
                }

                return false;
            };

            const collector = message.createReactionCollector({ filter });

            collector.on('collect', (reaction, user) => {
                if (reaction.emoji.name != '🛑') {
                    const index = messageContent.search(user.id);
                    messageContent = messageContent.replaceAt(index + 19, reaction.emoji.name);
                    message.edit(messageContent);

                } else {
                    collector.stop('Collector stopped');
                }
            });

        } else {
            interaction.channel.send("Operation cancelled");
        }

    }).catch(() => {
        interaction.channel.send('Operation canceled.');
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

String.prototype.replaceAt = function (index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}

module.exports = {
    assignRole,
    confirmTrial,
    isReply
}