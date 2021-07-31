const { deleteMessages } = require('../functions.js');

module.exports = {
    name: 'deletemessages',
    description: '',
    async execute(trials, client, msg, args) {
        await msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        if (parseInt(args[0]) == 0 || args[0] == undefined)
            return msg.channel.send(`The first argument is invalid`);

        deleteMessages(msg.channel, parseInt(args[0]));
    }
}