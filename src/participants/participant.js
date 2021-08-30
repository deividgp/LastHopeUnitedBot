class Participant {
    constructor(id, clas) {
        this._id = id;
        this._clas = clas;
        this._role = undefined;
        this._newClass = undefined;
        this._state = "partial";
    }

    get id() {
        return this._id;
    }

    get clas() {
        return this._clas;
    }

    set clas(clas) {
        this._clas = clas;
    }

    get role() {
        return this._role;
    }

    set role(role) {
        this._role = role;
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
}
module.exports = Participant;