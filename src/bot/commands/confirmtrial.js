const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'confirmtrial',
    description: 'Confirm trial participants',
    async execute(trials, client, interaction) {

        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply({ content: 'Not enough permissions', ephemeral: true });

        await interaction.reply({ content: "Send roster", ephemeral: true })
            .then(async () => {
                await wait(1000);
                confirmTrial(interaction, client);
            });
    }
}

const confirmTrial = async (interaction, client) => {
    interaction.channel.awaitMessages({ max: 1, time: 15000 }).then(async collected => {

        if (collected.first().content != "cancel") {
            collected.first().delete();
            const message = await interaction.channel.send(collected.first().content);
            let messageContent = message.content;
            let indexIds = 0;
            let idsConfirmation = [];

            for (let index = 0; index < messageContent.length; index++) {
                if (messageContent.charAt(index) == '<') {
                    idsConfirmation[indexIds] = messageContent.substring(index + 3, (index + 3) + 18);
                    indexIds++;
                    index = (index + 3) + 19;
                }
            }

            await message.react('✔️');
            await message.react('❌');
            const filter = (reaction, user) => {

                if ((message.member.id == user.id && reaction.emoji.name == '🛑') || (idsConfirmation.includes(user.id) && user.id != client.user.id && (reaction.emoji.name === '✔️' || reaction.emoji.name === '❌'))) {
                    return true;
                }

                return false;
            };

            const collector = message.createReactionCollector({ filter });

            collector.on('collect', (reaction, user) => {
                if (reaction.emoji.name != '🛑') {
                    const index = messageContent.search(user.id);
                    messageContent = messageContent.replaceAt(index + 19, reaction.emoji.name);
                    message.edit(messageContent);

                } else {
                    collector.stop('Collector stopped');
                }
            });

        } else {
            interaction.channel.send("Operation cancelled");
        }

    }).catch(() => {
        interaction.channel.send('Operation canceled.');
    });
}