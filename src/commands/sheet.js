const { runSheet } = require('../sheet.js');

module.exports = {
    name: 'sheet',
    description: 'a',
    async execute(trials, client, interaction) {
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        runSheet(args[0], msg);
    }
}