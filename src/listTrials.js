const Trial = require('./trial.js');

class ListTrials {
    constructor () {
      this._trials = [];
      this._counter = 0;
    }
    
    get trials(){
      return this._trials;
    }

    get counter(){
      return this._counter;
    }

    addTrial(name, tMax){
      this._trials[this._counter] = new Trial(name, tMax);
      this._counter++;
    }

    findTrial(msgId){
      for (let index = 0; index < this._counter; index++) {
        const element = this._trials[index];
    
        if (element.msgId === msgId) {
            return element;
        }
      }
    
      return undefined;
    }
}
module.exports = ListTrials;