const Character = require("./character");

class ListCharacters {

    constructor() {
        this._characters = [];
        this._characters[0] = new Character(undefined, "tank", false);
        this._characters[1] = new Character(undefined, "healer", false);
        this._characters[2] = new Character(undefined, "stamina dd", false);
        this._characters[3] = new Character(undefined, "magicka dd", false);
    }

    get characters(){
        return this._characters;
    }

    getIndex(role) {
        switch (role) {
            case "tank":
                return 0;
            case "healer":
                return 1;
            case "stamina dd":
                return 2;
            case "magicka dd":
                return 3;
        }
    }

    setMainCharacter(role) {
        const index = this.getIndex(role);
        this._characters[index].main = true;
    }

    updateCharacter(clas, role, add = false) {
        if (add) {
            this.setMainCharacter(role);
        }
        const index = this.getIndex(role);
        this._characters[index].clas = clas;
    }

    getMainCharacter() {
        for (const character of this._characters) {
            if (character.main == true) {
                return character;
            }
        }
        return undefined;
    }

    getCharacter(role) {
        const index = this.getIndex(role);

        if (this._characters[index].clas != undefined) {
            return this._characters[index];
        }
        return false;
    }
}
module.exports = ListCharacters;