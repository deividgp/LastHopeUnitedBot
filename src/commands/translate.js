const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

module.exports = {
    name: 'translate',
    description: '',
    async execute(trials, client, msg, args) {
        let text = [];

        for (let index = 0; index < args.length; index++) {
            await msg.channel.messages.fetch(args[index])
                .then(message => {
                    text[index] = message.content;
                })
                .catch(console.error);
        }

        let [translations] = await translate.translate(text, "en");
        translations = Array.isArray(translations) ? translations : [translations];
        translations.forEach(translation => {
            msg.channel.send(`${translation}`);
        });
    }
}