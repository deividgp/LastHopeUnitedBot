const { assignRole } = require('../functions.js');

module.exports = {
    name: 'assignrole',
    description: '',
    async execute(trials, client, msg, args) {
        await msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);
        assignRole(msg.channel, args[0]);
    }
}