module.exports = {
    name: 'guildMemberRemove',
    once: false,
    async execute(member, client, trials) {
        client.channels.fetch('811207960701042715')
            .then(channel => {
                if (channel.guild == member.guild)
                    channel.send(`Goodbye ${member.user.tag}`);
            })
            .catch(console.error);
    }
}