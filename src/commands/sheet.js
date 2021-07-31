const { runSheet } = require('../sheet.js');

module.exports = {
    name: 'sheet',
    description: '',
    async execute(trials, client, msg, args) {
        await msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        runSheet(args[0], msg);
    }
}