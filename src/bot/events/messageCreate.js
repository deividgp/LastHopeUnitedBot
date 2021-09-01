const {
    prefix
} = require(`../../../config/${process.env.MODE}.json`);

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
    }
}