module.exports = {
    name: 'currentutc',
    description: 'Current UTC',
    async execute(trials, client, interaction) {
        await interaction.reply(`${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`);
    }
}