const {
    confirmTrial,
} = require('../functions.js');

module.exports = {
    name: 'confirmtrial',
    description: 'Confirm trial participants',
    execute(trials, client, msg, args) {
        msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        confirmTrial(msg.channel, client);
    }
}