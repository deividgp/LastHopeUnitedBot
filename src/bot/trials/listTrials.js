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

  addTrial(interaction, client) {
    this._trials[this._counter] = new Trial(this._counter, interaction.options.getString('trial'), interaction.options.getInteger('tanks'), `${interaction.options.getString('date')} ${interaction.options.getString('time')}`, interaction, client);
    this._counter++;
  }
}
module.exports = ListTrials;