module.exports = {
    name: 'listtrial',
    description: 'Lists all participants (!list trialid)',
    async execute(trials, client, msg, args) {
        await msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
            return msg.channel.send(`The first argument isn't valid`);

        trials._trials[parseInt(args[0]) - 1].listParticipants(msg);
    }
}