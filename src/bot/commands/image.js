const { ApplicationCommandOptionType } = require('discord-api-types/v9');
const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch("Your Private Key")

module.exports = {
    name: 'image',
    description: 'Returns a random image',
    options: [{
        name: 'search',
        type: ApplicationCommandOptionType.String,
        description: 'Image type',
        required: true,
    }],
    async execute(trials, client, interaction) {
        try {
            search.json({
                api_key: process.env.SERPAPI_KEY,
                q: interaction.options.getString('search'),
                tbm: "isch",
            }, async (data) => {
                const imageResults = data["images_results"];
                const position = Math.floor(Math.random() * imageResults.length);
                await interaction.reply(imageResults[position]["original"]);
            })
        } catch {
            await interaction.reply({ content: `Error`, ephemeral: true });
        }
    }
}