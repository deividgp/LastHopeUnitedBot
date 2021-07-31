const {
  assignRole,
  deleteMessages,
} = require('../functions.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("!help", {
      type: "STREAMING",
      url: "https://www.twitch.tv/deividgp"
    });

    client.channels.fetch('811207960701042713')
      .then(channel => {
        deleteMessages(channel, 6);
        setTimeout(async function () {
          await assignRole(channel, "811207960671813646");
        }, 4000);
      })
      .catch(console.error);
    /*client.channels.fetch('863732362495262741')
      .then(channel => {
        deleteMessages(channel, 6);
        setTimeout(async function () {
          await assignRole(channel, "712978610562269235");
        }, 4000);
      })
      .catch(console.error);*/
  }
}