module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(member, client, trials) {
        if (!member.bot) {
            let role = member.guild.roles.cache.find(r => r.name === "Pleb");
            member.roles.add(role);
        }
    }
}