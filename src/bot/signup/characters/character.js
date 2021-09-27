class Character {

    constructor(clas, role, main) {
        this._clas = clas;
        this._role = role;
        this._main = main;
    }

    get role() {
        return this._role;
    }

    set role(role) {
        this._role = role;
    }

    get clas() {
        return this._clas;
    }

    set clas(clas) {
        this._clas = clas;
    }

    get main() {
        return this._main;
    }

    set main(main) {
        this._main = main;
    }
}
module.exports = Character;