const ListCharacters = require("../characters/listCharacters");


class MultiroleParticipant {
    constructor(id, clas) {
        this._id = id;
        this._characters = new ListCharacters();
        this._newClass = clas;
        this._option = undefined;
        this._state = "partial";
    }

    get characters() {
        return this._characters;
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

    get option() {
        return this._option;
    }

    set option(option) {
        this._option = option;
    }
}
module.exports = MultiroleParticipant;