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
    isReply,
}