const {
    confirmTrial,
} = require('../functions.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'confirmtrial',
    description: 'Confirm trial participants',
    async execute(trials, client, interaction) {

        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply({ content: 'Not enough permissions', ephemeral: true });

        await interaction.reply({ content: "Send roster", ephemeral: true })
            .then(async () => {
                await wait(1000);
                confirmTrial(interaction, client);
            });
    }
}