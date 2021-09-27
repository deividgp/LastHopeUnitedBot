const ListCharacters = require("../characters/listCharacters.js");
const Participant = require("./participant.js");

class MultiroleParticipant extends Participant {
    constructor(id, clas) {
        super(id, clas);
        this._characters = new ListCharacters();
    }

    get characters() {
        return this._characters;
    }
}
module.exports = MultiroleParticipant;