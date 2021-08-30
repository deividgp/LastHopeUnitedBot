const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();
const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'translate',
    description: 'Translate multiple messages',
    options: [{
        name: 'ids',
        type: ApplicationCommandOptionType.String,
        description: `Message ID's separated by space`,
        required: true,
    }],
    async execute(trials, client, interaction) {
        let text = [];
        const ids = interaction.options.getString('ids').split(' ');

        for (let index = 0; index < ids.length; index++) {
            await interaction.channel.messages.fetch(ids[index])
                .then(message => {
                    text[index] = message.content;
                })
                .catch(console.error);
        }
        let messages = "";
        let [translations] = await translate.translate(text, "en");
        translations = Array.isArray(translations) ? translations : [translations];
        translations.forEach(async(translation) => {
            //await interaction.reply(`${translation}`);
            messages = messages + translation + "\n";
        });
        await interaction.reply(`${messages}`);
    }
}