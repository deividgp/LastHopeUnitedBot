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

  addPartialParticipant(id, clas) {
    const index = this.findParticipant(id);
    if (index == undefined) {
      this._participants[this._counter] = new Participant(id, clas);
      this._counter++;
    } else {
      if (this.findPartialParticipant(id) == undefined) {
        this._participants[index].newClass = clas;
      } else {
        this._participants[index].clas = clas;
      }
    }
  }

  addParticipant(id, role, state = "in") {
    const index = this.findParticipant(id);
    this._participants[index].state = state;
    this._participants[index].role = role;
    this._participants[index].newClass = this._participants[index].clas;
  }

  updateParticipant(index, newRole, newClass, newState) {
    this._participants[index].role = newRole;
    this._participants[index].clas = newClass;
    this._participants[index].state = newState;
  }

  deleteParticipant(index) {
    for (let index2 = index + 1; index2 < this._counter; index2++) {
      const element = this._participants[index2];
      this._participants[index2 - 1] = element;
    }

    this._counter--;
    this._participants[this._counter] = undefined;
  }

  findParticipant(id, role = '') {
    for (let index = 0; index < this._counter; index++) {
      const element = this._participants[index];

      if (element.id === id && (role === '' || (role != '' && element.role === role))) {
        return index;
      }
    }

    return undefined;
  }

  findPartialParticipant(id) {
    for (let index = 0; index < this._counter; index++) {
      const element = this._participants[index];

      if (element.id === id && element.state == "partial") {
        return index;
      }
    }

    return undefined;
  }
}
module.exports = ListParticipants;