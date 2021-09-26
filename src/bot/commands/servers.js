const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'servers',
    description: 'Servers',
    async execute(trials, client, interaction) {
        await interaction.deferReply();
        fetch('https://live-services.elderscrollsonline.com/status/realms')
            .then(response => response.json())
            .then(async (data) => {
                const serverInfo = data["zos_platform_response"]["response"];

                const serverEmbed = new Discord.MessageEmbed()
                    .setTitle(`Server status`)

                for (let server in serverInfo) {
                    serverEmbed.addField(`${server.substring(26, server.length - 1)}`, `${serverInfo[server]}`, true)
                }
                await interaction.editReply({ embeds: [serverEmbed] });
            })
            .catch(async () => {
                await interaction.editReply("API error");
            })
    }
}