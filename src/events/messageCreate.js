const {
    prefix
} = require.main.require(`../config/${process.env.MODE}.json`);

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(msg, client, trials) {
        if (!msg.content.startsWith(prefix) || msg.author.bot) {
            if (msg.content === "?XD" && !msg.author.bot) {
                return msg.channel.send("?XD");
            }
            return;
        }

        /*const args = msg.content.slice(prefix.length).split(' ');
        const command = args.shift().toLowerCase();

        if (client.commands.has(command) && command == "confirmtrial")
            client.commands.get(command).execute(trials, client, msg, args);*/
    }
}