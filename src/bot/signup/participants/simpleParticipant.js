const Character = require("../characters/character");
const Participant = require("./participant.js");

class SimpleParticipant extends Participant {
    constructor(id, clas) {
        super(id, clas);
        this._character = new Character(undefined, undefined, false);
    }

    get character() {
        return this._character;
    }
}
module.exports = SimpleParticipant;