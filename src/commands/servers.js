const http = require('https');
const Discord = require('discord.js');

module.exports = {
    name: 'servers',
    description: '',
    async execute(trials, client, msg, args) {
        http.get("https://live-services.elderscrollsonline.com/status/realms", function (res) {
            let data = '',
                json_data;

            res.on('data', function (stream) {
                data += stream;
            });
            res.on('end', function () {
                json_data = JSON.parse(data);
                let serverInfo = json_data["zos_platform_response"]["response"];

                let serverEmbed = new Discord.MessageEmbed()
                    .setTitle(`Server status`)

                for (let server in serverInfo) {
                    serverEmbed.addField(`${server.substring(26, server.length - 1)}`, `${serverInfo[server]}`, true)
                }

                msg.channel.send(serverEmbed);
            });
        });
    }
}