const cron = require('cron');

module.exports = {
    name: 'trials',
    description: '',
    async execute(trials, client, msg, args) {
        await msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        const scheduledTrial = new cron.CronJob('00 00 17 * * 4', () => {
            client.channels.fetch(msg.channel.id)
                .then(channel => {
                    trials.recursiveTrial(channel);
                })
        });

        scheduledTrial.start();
    }
}