const fs = require('fs');

module.exports = (client, trials) => {
    const load_dir = () => {
        const event_files = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of event_files) {
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client, trials));
            }
        }
    }

    load_dir();
}