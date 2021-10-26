const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    type: 2,
    async execute(trials, client, interaction) {
        await interaction.deferReply();
        const user = interaction.options.getUser('user');
        const avatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${user.tag}`)
            .setImage(`${user.displayAvatarURL({ dynamic: true, size: 2048 })}`)
        
        return await interaction.editReply({ embeds: [avatarEmbed] });
    }
}