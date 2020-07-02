const ListParticipants = require('./listParticipants.js');

class Trial{

    constructor (name, tMax, msgId) {

        this._name = name;
        this._hMax = 2;
        this._tMax = tMax;
        this._ddMax = 12 - (tMax + this._hMax);
        this._hCounter = 0;
        this._tCounter = 0;
        this._ddCounter = 0;
        this._msgId = msgId;
        this._participants = new ListParticipants();
    }

    get name(){
        return this._name;
    }

    get hMax(){
        return this._hMax;
    }

    get tMax(){
        return this.tMax;
    }

    get ddMax(){
        return this.ddMax;
    }

    addHealer(){
        this._hCounter++;
    }

    addTank(){
        this._tCounter++;
    }

    addDD(){
        this._ddCounter++;
    }

    get msgId(){
      return this._msgId;
    }

    set msgId(msgId){
      this._msgId = msgId;
    }

    get participants(){
        return this._participants;
    }

    emojisCounter(userId, role, author){

      if(this._participants.findParticipant(userId, '') == undefined){
        switch(role){
          case '🛡️':
            this.addTank();
            break;
          case '🚑':
            this.addHealer();
            break;
          case '⚔️':
            this.addDD();
            //ddmCounter++;
            break;
          case '🏹':
            this.addDD();
            //ddrCounter++;
            break;
          default:
            return msg.channel.send(`Role isn't right, ${author}!`);
        }
      
        return ((this._hCounter <= this._hMax && role === '🚑') || (this._tCounter <= this._tMax && role === '🛡️') || 
              (this._ddCounter <= this._ddMax && role === '⚔️') || (this._ddCounter <= this._ddMax && role === '🏹'));
      }
    
      return false;
        
    }
}
module.exports = Trial;