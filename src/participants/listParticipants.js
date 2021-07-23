const Participant = require('./participant.js');
const Discord = require('discord.js');

class ListParticipants {
  constructor() {
    this._participants = [];
    this._counter = 0;
  }

  get participants() {
    return this._participants;
  }

  get counter() {
    return this._counter;
  }

  set counter(counter) {
    this._counter = counter;
  }

  addParticipant(id, role) {
    this._participants[this._counter] = new Participant(id, role);
    this._counter++;
  }

  deleteParticipant(index) {
    for (let index2 = index + 1; index2 < this._counter; index2++) {
      const element = this._participants[index2];
      this._participants[index2 - 1] = element;
    }

    this._counter--;
    this._participants[this._counter] = undefined;
  }

  findParticipant(id, role) {
    for (let index = 0; index < this._counter; index++) {
      const element = this._participants[index];

      if(id != '' && element.id === id){
        if (role === '' || (role != '' && element.role === role)) {
          return index;
        }
      }
    }

    return undefined;
  }
}
module.exports = ListParticipants;