module.exports = {
    name: 'update',
    description: 'Update a participant (!update trialid userid newRole)',
    async execute(trials, client, msg, args) {
        await msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
            return msg.channel.send(`The first argument is invalid`);

        if (args[1] == undefined || args[2] == undefined) {

            msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

        } else {
            let update = trials._trials[parseInt(args[0]) - 1].updateParticipantFinal(args[1], args[2]);
            if (!update)
                msg.channel.send(`Can't update participant, ${msg.author}!`);
        }
    }
}