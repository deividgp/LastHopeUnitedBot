const Discord = require('discord.js');

class Trial {

    constructor(id, trial, tanks, datetime, description, client) {
        this._id = id;
        this._name = trial;
        this._hMax = 2;
        this._tMax = tanks;
        this._ddMax = 12 - (this._tMax + this._hMax);
        this._hCounter = 0;
        this._tCounter = 0;
        this._ddCounter = 0;
        this._datetime = datetime;
        this._description = description;
        this._message = undefined;
        this._client = client;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get hMax() {
        return this._hMax;
    }

    get tMax() {
        return this._tMax;
    }

    get ddMax() {
        return this._ddMax;
    }

    get hCounter() {
        return this._hCounter;
    }

    get tCounter() {
        return this._tCounter;
    }

    get ddCounter() {
        return this._ddCounter;
    }

    get datetime() {
        return this._datetime;
    }

    get client() {
        return this._client;
    }

    get message() {
        return this._message;
    }

    set message(message) {
        this._message = message;
    }

    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }

    addRole(role) {
        switch (role) {
            case 'tank':
                this._tCounter++;
                return (this._tCounter <= this._tMax);
            case 'healer':
                this._hCounter++;
                return (this._hCounter <= this._hMax);
            case 'stamina dd':
            case 'magicka dd':
                this._ddCounter++;
                return (this._ddCounter <= this._ddMax);
        }

        return false;
    }

    subtractRole(role) {
        switch (role) {
            case 'tank':
                this._tCounter--;
                break;
            case 'healer':
                this._hCounter--;
                break;
            case 'stamina dd':
            case 'magicka dd':
                this._ddCounter--;
                break;
        }
    }
}
module.exports = Trial;