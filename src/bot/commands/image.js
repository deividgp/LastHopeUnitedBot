// const { ApplicationCommandOptionType } = require('discord-api-types/v9');
// const htmlEntities = require('html-entities');
// const url = require('url');

// module.exports = {
//     name: 'image',
//     description: 'Returns a random image',
//     options: [{
//         name: 'type',
//         type: ApplicationCommandOptionType.String,
//         description: 'Image type',
//         required: true,
//     }],
//     async execute(trials, client, interaction) {
//         image(interaction, interaction.options.getString('type'));
//     }
// }

// const image = (interaction, srch) => {
//     /*var options = {
//         url: 'http://results.dogpile.com/serp?qc=images&q=' + srch,
//         method: 'GET',
//         headers: {
//             'Accept': 'text/html',
//             'User-Agent': 'Chrome'
//         }
//     };
//     request(options, async function (error, response, responseBody) {
//         if (error) {
//             return await interaction.reply({ content: "Error", ephemeral: true });
//         }
//         $ = cheerio.load(responseBody);
//         var links = $('.image a.link');
//         var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr('href'));
//         console.log(urls);
//         if (!urls.length) {
//             return await interaction.reply({ content: "Error", ephemeral: true });
//         }
//         return await interaction.reply(urls[Math.floor(Math.random() * urls.length)]);
//     });*/
//     cheerio.fetch("https://www.google.com/search", { q: srch, tbm: 'isch', tbs: 'isz:m', safe: 'active' }, async (err, $, res) => {
//         if (err) {
//             return await interaction.reply({ content: "Error", ephemeral: true });
//         }
//         let urls = $('.rg_l').map((index, element) => {
//             return url.parse(htmlEntities.decode($(element).attr('href')), true).query.imgurl
//         });
//         console.log(urls);
//     })
// }