const Participant = require('./participant.js');

class ListParticipants {
    constructor (name, tMax, daytime) {

      this._name = name;
      this._hMax = 2;
      this._tMax = tMax;
      this._ddMax = 12 - (tMax + this._hMax);
      this._hCounter = 0;
      this._tCounter = 0;
      this._ddCounter = 0;
      this._daytime = daytime;
      this._participants = [];
      this._counter = 0;
    }

    get name(){
      return this._name;
    }

    get hMax(){
      return this._hMax;
    }

    get tMax(){
      return this._tMax;
    }

    get ddMax(){
      return this._ddMax;
    }

    get hCounter(){
      return this._hCounter;
    }

    get tCounter(){
      return this._tCounter;
    }

    get ddCounter(){
      return this._ddCounter;
    }

    get daytime(){
      return this._daytime;
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

    subtractHealer(){
      this._hCounter--;
    }

    subtractTank(){
      this._tCounter--;
    }

    subtractDD(){
      this._ddCounter--;
    }

    get participants(){
      return this._participants;
    }

    get counter(){
      return this._counter;
    }

    addParticipant(id, role){
      this._participants[this._counter] = new Participant(id, role);
      this._counter++;
    }
    
    deleteParticipant(index, message){

      if(index != undefined){

        switch(this._participants[index].role){
          case '🛡️':
            this.subtractTank();
            console.log(`deleted ${this._tCounter}`);
            break;
          case '🚑':
            this.subtractHealer();
            break;
          case '⚔️':
            this.subtractDD();
            //ddmCounter--;
            break;
          case '🏹':
            this.subtractDD();
            //ddrCounter--;
            break;
        }
        
        for (let index2 = index + 1; index2 < this._counter; index2++) {
          const element = this._participants[index2];
          this._participants[index2 - 1] = element;
        }
  
        this._counter--;
        this._participants[this._counter] = undefined;
        return true;

      }else{
        return message.channel.send(`Can't delete: id not found, ${message.author}!`);
      }

    }

    findParticipant(id, role){
      for (let index = 0; index < this._counter; index++) {
        const element = this._participants[index];
    
        if (id != '' && role === '' && element.id === id) {
          return index;
        }else if(id === '' && role != '' && element.role === role){
          return index;
        }else if (id != '' && role != '' && element.id === id && element.role === role){
          return index;
        }
      }
    
      return undefined;
    }

    manyMembersRole(role){
      var counter = 0;

      for (let index = 0; index < this._counter; index++) {
        const element = this._participants[index];
    
        if (element.role === role) {
          counter++;
        }
      }
      
      return counter;
    }

    async listParticipants(message){
      await await message.channel.send(`**${this._name} at ${this._daytime}**`);
      for (let index = 0; index < this._counter; index++) {
          const element = this._participants[index];
          
          await message.channel.send(`${message.guild.members.cache.find(users => users.id == element.id)} is ${element.role}`);
          
      }
    }
    
    emojisCounter(userId, role, message){
      //var counter = undefined;

      if(this.findParticipant(userId, '') == undefined){
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
        }
      
        return ((this._hCounter <= this._hMax && role === '🚑') || (this._tCounter <= this._tMax && role === '🛡️') || 
              (this._ddCounter <= this._ddMax && role === '⚔️') || (this._ddCounter <= this._ddMax && role === '🏹'));
        /*return (counter != undefined && ((this._hCounter <= this._hMax && role === '🚑') || (this._tCounter <= this._tMax && role === '🛡️') || 
        (this._ddCounter <= this._ddMax && role === '⚔️') || (this._ddCounter <= this._ddMax && role === '🏹')));*/
      }
    
      return false;
        
    }

    revert(role){
      var manyMembers = this.manyMembersRole(role);
      switch(role){
        case '🛡️':
          if(this._tCounter > manyMembers){
            this.subtractTank();
          }
          break;
        case '🚑':
          if(this._hCounter > manyMembers){
            this.subtractHealer();
          }
          break;
        case '⚔️':
          if(this._ddCounter > manyMembers){
            this.subtractDD();
          }
          break;
        case '🏹':
          if(this._ddCounter > manyMembers){
            this.subtractDD();
          }
          break;
      }
    }
}
module.exports = ListParticipants;