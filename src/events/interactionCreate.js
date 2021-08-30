module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client, trials) {
        if(!interaction.isCommand()) return;

        if (client.commands.has(interaction.commandName))
            client.commands.get(interaction.commandName).execute(trials, client, interaction);
    }
}