const { deleteMessages } = require('../functions.js');
const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'deletemessages',
    description: 'Delete messages',
    options: [{
        name: 'nummessages',
        type: ApplicationCommandOptionType.Integer,
        description: 'Number of messages to delete',
        required: true,
    }],
    async execute(trials, client, interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply(`Not enough permissions`);

        const number = interaction.options.getInteger('nummessages');
        if (number == 0 || number == undefined)
            return await interaction.reply(`The first argument is invalid`);

        deleteMessages(interaction.channel, number);
    }
}