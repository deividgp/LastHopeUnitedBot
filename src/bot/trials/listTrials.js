const Trial = require('./trial.js');
const MultiroleTrial = require('./multiroleTrial.js');

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

  addTrial(trial, tanks, datetime, multirole, description, interaction, client) {
    if (multirole) {
      this._trials[this._counter] = new MultiroleTrial(this._counter, trial, tanks, datetime, description, interaction, client);
    } else {
      this._trials[this._counter] = new Trial(this._counter, trial, tanks, datetime, description, interaction, client);
    }

    this._counter++;
  }
}
module.exports = ListTrials;