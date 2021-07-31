const moment = require('moment');

module.exports = {
    name: 'starttrial',
    description: '',
    async execute(trials, client, msg, args) {
        msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        let parseDate = moment(`${args[2]} ${args[3]}`, "DD/MM/YYYY HH:mm").toDate();

        if (parseInt(args[1]) >= 1 && args[2].length == 10 && args[3].length == 5 && new Date() < parseDate)
            trials.addTrial(args, msg.channel);
    }
}