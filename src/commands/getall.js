module.exports = {
    name: 'getall',
    description: '',
    execute(trials, client, msg, args) {
        const members = msg.guild.members.cache.filter(member => !member.user.bot).array();
        msg.channel.send(members.length);
        for (const member of members) {
            console.log(member['user']['id']);
        }
    }
}