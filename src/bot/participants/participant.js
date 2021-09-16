const Character = require("../characters/character");

class Participant {
    constructor(id, clas) {
        this._id = id;
        this._character = new Character(undefined, undefined, false);
        this._newClass = clas;
        this._state = "partial";
    }

    get id() {
        return this._id;
    }

    get newClass() {
        return this._newClass;
    }

    set newClass(newClass) {
        this._newClass = newClass;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;
    }

    get character() {
        return this._character;
    }
}
module.exports = Participant;