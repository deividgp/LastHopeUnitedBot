const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token,
    client_id } = require.main.require(`../../config/${process.env.MODE}.json`);

const deploy = async (client) => {
    const commands = client.commands.map(({ execute, ...data }) => data);
    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');

        if (process.env.MODE == "development") {
            await rest.put(
                Routes.applicationGuildCommands(client_id, '874602860699082774'),
                { body: commands },
            );
        } else {
            await rest.put(
                Routes.applicationCommands(client_id),
                { body: commands },
            );
        }

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    deploy
};