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
            return await interaction.reply({ content: 'Not enough permissions', ephemeral: true });

        const number = interaction.options.getInteger('nummessages');
        if (number == 0 || number == undefined)
            return await interaction.reply({ content: 'Number is invalid', ephemeral: true });

        interaction.channel.bulkDelete(number).then(async () => {
            return await interaction.reply({ content: 'Messages deleted', ephemeral: true });
        }).catch(e => console.log(e));;
    }
}