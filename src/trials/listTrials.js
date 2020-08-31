const Trial = require('./trial.js');

class ListTrials {
  constructor() {
    this._trials = [];
    this._counter = 0;
  }

  get trials() {
    return this._trials;
  }

  get counter() {
    return this._counter;
  }

  addTrial(args, channel) {
    this._trials[this._counter] = new Trial(this._counter, args[0], parseInt(args[1]), `${args[2]} ${args[3]}`, undefined, channel);
    this._counter++;
  }

  recursiveTrial(channel) {
    let message = undefined;
    let args;

    setTimeout(function () {
      channel.send(`Trial nº ${this._counter + 1}: type name, number of tanks, date and time`).then(() => {
        channel.awaitMessages(message => (adminID.includes(message.author.id)), { max: 1, time: 30000 }).then(collected => {

          if (collected.first().content != "cancel") {
            message = collected.first().content;
            args = message.split(" ");
            if ((parseInt(args[1]) >= 1 && parseInt(args[1]) <= 2) && args[2].length == 10 && args[3].length == 5 && new Date() < new Date(`${args[2]} ${args[3]}`))
              this.addTrial(args, channel);
            this.recursiveTrial(channel);
          } else {
            channel.send("Operation cancelled");
          }

        }).catch(() => {
          channel.send('No answer after 30 seconds, operation canceled.');
        });
      });
    }, 5000);
  }
}
module.exports = ListTrials;