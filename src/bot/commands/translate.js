const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

module.exports = {
    name: 'translate',
    type: 3,
    async execute(trials, client, interaction) {
        const msg = interaction.options.getMessage('message');

        let [translations] = await translate.translate(msg.content, "en");
        translations = Array.isArray(translations) ? translations : [translations];
        await interaction.reply(`${translations[0]}`);
    }
}