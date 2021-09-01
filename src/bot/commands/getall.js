module.exports = {
    name: 'getall',
    description: 'a',
    async execute(trials, client, interaction) {
        interaction.guild.members.fetch()
            .then(members => {
                interaction.reply((members.size).toString());
            });
    }
}