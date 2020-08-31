class Participant {
    constructor (id, role) {
        this._id = id;
        this._role = role;
    }

    get id(){
        return this._id;
    }

    get role(){
        return this._role;
    }
}
module.exports = Participant;