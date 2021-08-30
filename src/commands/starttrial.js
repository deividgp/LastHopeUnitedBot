const moment = require('moment');
const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'starttrial',
    description: 'Start trial',
    options: [{
        name: 'trial',
        type: ApplicationCommandOptionType.String,
        description: 'Trial name',
        required: true,
    },
    {
        name: 'tanks',
        type: ApplicationCommandOptionType.Integer,
        description: 'Number of tanks',
        required: true,
    },
    {
        name: 'date',
        type: ApplicationCommandOptionType.String,
        description: 'Date',
        required: true,
    },
    {
        name: 'time',
        type: ApplicationCommandOptionType.String,
        description: 'Time in UTC',
        required: true,
    }],
    async execute(trials, client, interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply({ content: 'Not enough permissions', ephemeral: true });

        const options = interaction.options;
        const parseDate = moment(`${options.getString('date')} ${options.getString('time')}`, "DD/MM/YYYY HH:mm").toDate();

        if (options.getInteger('tanks') >= 1 && options.getString('date').length == 10 && options.getString('time').length == 5 && new Date() < parseDate)
            return trials.addTrial(interaction, client);

        return await interaction.reply({ content: `Couldn't create trial`, ephemeral: true });
    }
}