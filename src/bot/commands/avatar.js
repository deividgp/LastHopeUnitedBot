const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = {
    name: 'avatar',
    type: 2,
    async execute(trials, client, interaction) {
        return await interaction.reply(`${interaction.options.getUser("user").displayAvatarURL({ dynamic: true })}`);
    }
}