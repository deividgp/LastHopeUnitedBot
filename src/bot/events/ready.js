const {
  assignRole
} = require('../functions.js');
const {
  deploy
} = require('../slashDeployment.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);

    /*client.channels.fetch('874602861399539724')
      .then(channel => {
        channel.bulkDelete(6);s
        setTimeout(async function () {
          await assignRole(channel, "877111337690472448");
        }, 4000);
      })
      .catch(console.error);*/
    client.channels.fetch('811207960701042713')
      .then(channel => {
        channel.bulkDelete(6);
        setTimeout(async function () {
          await assignRole(channel, "811207960671813646");
        }, 4000);
        setTimeout(async function () {
          await assignRole(channel, "811207960691867663");
        }, 4000);
        
      })
    //   .catch(console.error);
    /*client.channels.fetch('863732362495262741')
      .then(channel => {
        channel.bulkDelete(6);
        setTimeout(async function () {
          await assignRole(channel, "712978610562269235");
        }, 4000);
      })
      .catch(console.error);*/

    deploy(client);
  }
}