const MultiroleParticipant = require('./multiroleParticipant.js');

class ListMultiroleParticipants {
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
    const participant = this.findParticipant(id);
    if (participant == undefined) {
      this._participants[this._counter] = new MultiroleParticipant(id, clas);
      this._counter++;
    } else {
      participant.newClass = clas;
      participant.option = undefined;
    }
  }

  addParticipant(participant, role, state = "in") {
    participant.state = state;
    participant.characters.updateCharacter(participant.newClass, role, true);
  }

  updateParticipant(participant, newRole, newClass, newState) {
    participant.state = newState;
    participant.characters.updateCharacter(newClass, newRole, main);
  }

  updateCharMain(participant, role, newState) {
    participant.state = newState;
    participant.characters.setMainCharacter(role);
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

  findParticipant(id) {
    for (let index = 0; index < this._counter; index++) {
      const element = this._participants[index];

      if (element.id === id) {
        return element;
      }
    }

    return undefined;
  }

  findPartialParticipant(id) {
    for (let index = 0; index < this._counter; index++) {
      const element = this._participants[index];

      if (element.id === id && element.state == "partial") {
        return element;
      }
    }
    return undefined;
  }

}
module.exports = ListMultiroleParticipants;