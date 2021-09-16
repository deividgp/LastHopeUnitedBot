const Participant = require('./participant.js');

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
    const participant = this.getParticipant(id);
    if (participant == undefined) {
      this._participants[this._counter] = new Participant(id, clas);
      this._counter++;
    } else {
      participant.newClass = clas;
    }
  }

  updateParticipant(participant, role, state, update = false) {
    participant.state = state;
    participant.character.role = role;
    participant.character.clas = participant.newClass;
  }

  deleteParticipant(participant) {
    let index3;
    for (let index = 0; index < this._counter; index++) {
      const element = this._participants[index];

      if (participant === element) {
        index3 = index;
      }
    }

    for (let index2 = index3 + 1; index2 < this._counter; index2++) {
      const element = this._participants[index2];
      this._participants[index2 - 1] = element;
    }

    this._counter--;
    this._participants[this._counter] = undefined;
  }

  getParticipant(id) {
    for (let index = 0; index < this._counter; index++) {
      const element = this._participants[index];

      if (element.id === id) {
        return element;
      }
    }
    return undefined;
  }

  getPartialParticipant(id) {
    for (let index = 0; index < this._counter; index++) {
      const element = this._participants[index];

      if (element.id === id && element.state == "partial") {
        return element;
      }
    }
    return undefined;
  }
}
module.exports = ListParticipants;