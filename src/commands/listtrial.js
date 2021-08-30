const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'listtrial',
    description: 'Lists all participants',
    options: [{
        name: 'trialid',
        type: ApplicationCommandOptionType.Integer,
        description: 'Trial ID',
        required: true,
    }],
    async execute(trials, client, interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply(`Not enough permissions`);

        const trialID = interaction.options.getInteger('trialid');

        if (trialID == 0 || (trialID - 1) > trials._counter)
            return await interaction.reply(`The first argument isn't valid`);

        await interaction.reply(`**${trials._trials[trialID - 1]._name} at ${trials._trials[trialID - 1]._date}**`);
        trials._trials[trialID - 1].listParticipants(interaction.channel);
    }
}