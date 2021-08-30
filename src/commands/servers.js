const http = require('https');
const Discord = require('discord.js');

module.exports = {
    name: 'servers',
    description: 'Servers',
    async execute(trials, client, interaction) {
        http.get("https://live-services.elderscrollsonline.com/status/realms", function (res) {
            let data = '',
                json_data;

            res.on('data', function (stream) {
                data += stream;
            });
            res.on('end', async function () {
                json_data = JSON.parse(data);
                let serverInfo = json_data["zos_platform_response"]["response"];

                let serverEmbed = new Discord.MessageEmbed()
                    .setTitle(`Server status`)

                for (let server in serverInfo) {
                    serverEmbed.addField(`${server.substring(26, server.length - 1)}`, `${serverInfo[server]}`, true)
                }

                await interaction.reply({ embeds: [serverEmbed] });
            });
        });
    }
}