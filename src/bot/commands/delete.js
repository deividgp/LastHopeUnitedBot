const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = {
    name: 'delete',
    description: 'Delete a participant (delete trialid userid)',
    options: [
        {
            name: 'trialid',
            type: ApplicationCommandOptionType.Integer,
            description: 'Trial ID',
            required: true,
        },
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'User',
            required: true,
        }
    ],
    async execute(trials, client, interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply({ content: 'Not enough permissions', ephemeral: true });

        const trialid = interaction.options.getInteger("trialid");
        const userid = interaction.options.getUser("userid").id;

        if (trialid == 0 || (trialid - 1) > trials._counter)
            return await interaction.reply({ content: 'The first argument is invalid', ephemeral: true });

        const trial = trials.trials[trialid - 1];
        const participant = trial.participants.getParticipant(userid);

        if(participant == undefined){
            return await interaction.reply({ content: 'The participant is not registered', ephemeral: true });
        }
        trial.deleteParticipantFinal(participant);
        return await interaction.reply({ content: 'Deleted succesfully', ephemeral: true });
    }
}