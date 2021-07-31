module.exports = {
    name: 'currentutc',
    description: '',
    async execute(trials, client, msg, args) {
        await msg.channel.send(`${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`);
    }
}