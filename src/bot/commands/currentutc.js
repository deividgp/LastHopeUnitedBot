module.exports = {
    name: 'currentutc',
    description: 'Current UTC',
    async execute(trials, client, interaction) {
        await interaction.reply(`${(new Date().getUTCHours() < 10 ? '0' + (new Date().getUTCHours()) : new Date().getUTCHours()) + ":" + (new Date().getUTCMinutes() < 10 ? '0' + (new Date().getUTCMinutes()) : new Date().getUTCMinutes())}`);
    }
}