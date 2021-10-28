const SimpleTrial = require('./simpleTrial.js');
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

  addTrial(trial, tanks, datetime, multirole, role, description, interaction, raidleader, client) {
    if (multirole) {
      this._trials[this._counter] = new MultiroleTrial(this._counter, trial, tanks, datetime, role, description, interaction, raidleader, client);
    } else {
      this._trials[this._counter] = new SimpleTrial(this._counter, trial, tanks, datetime, role, description, interaction, raidleader, client);
    }

    this._counter++;
  }
}
module.exports = ListTrials;