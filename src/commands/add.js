module.exports = {
    name: 'add',
    description: 'Adds a participant (!add trialid userid role)',
    async execute(trials, client, msg, args) {

        if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.channel.send(`Not enough permissions`);

        if (parseInt(args[0]) == 0 || (parseInt(args[0]) - 1) > trials._counter)
            return msg.channel.send(`The first argument is invalid`);

        if (args[1] == undefined || args[2] == undefined) {

            msg.channel.send(`You didn't provide enough arguments, ${msg.author}!`);

        } else {
            let add = trials._trials[parseInt(args[0]) - 1].addParticipantFinal(args[1], args[2]);
            if (!add)
                msg.channel.send(`Can't add participant, ${msg.author}!`);
        }
    }
}