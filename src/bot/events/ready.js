const {
  assignRole,
  assignGameRole,
  twitter,
} = require('../functions.js');
const {
  deploy
} = require('../slashDeployment.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.fetch('811207960701042713')
      .then(async (channel) => {
        await assignRole(channel, "890275137662894090");
        await assignRole(channel, "890275250976227329");
        await assignGameRole(channel, "890275204696277045");
      })

    deploy(client);

    client.channels.fetch('811948277461024838')
      .then(channel => {
        twitter(channel);
      })
  }
}