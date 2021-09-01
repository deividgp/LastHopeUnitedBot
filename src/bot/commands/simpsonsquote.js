const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'simpsonsquote',
    description: 'Simpsons quote',
    async execute(trials, client, interaction) {
        fetch('https://simpsons-quotes-api.herokuapp.com/quotes')
            .then(response => response.json())
            .then(async (data) => {
                let quoteEmbed = new Discord.MessageEmbed()
                    .addFields(
                        { name: 'SimpsonsQuote', value: `${data[0]['quote']}`, inline: false },
                        { name: 'Character', value: `${data[0]['character']}`, inline: false },
                    )
                    .setImage(`${data[0]['image']}`)
                await interaction.reply({ embeds: [quoteEmbed] });
            })
            .catch(err => {
                console.log(err);
            })
    }
}