module.exports = {
    name: 'delete',
    description: 'Delete a participant (!delete trialid userid)',
    async execute(trials, client, msg, args) {
        await msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
            return msg.channel.send(`The first argument is invalid`);

        if (args[1] == undefined) {

            msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

        } else {
            trials._trials[parseInt(args[0]) - 1].deleteParticipantFinal(args[1]);
        }
    }
}