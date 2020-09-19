const ListParticipants = require('../participants/listParticipants.js');
const Discord = require('discord.js');
const moment = require('moment');
const roles = ['🛡️', '🚑', '⚔️', '🏹'];
const adminID = ['308653237211234317', '124949555337887744'];

class Trial {

  constructor(id, name, tMax, date, message, channel) {
    this._id = id;
    this._name = name;
    this._hMax = 2;
    this._tMax = tMax;
    this._ddMax = 12 - (tMax + this._hMax);
    this._hCounter = 0;
    this._tCounter = 0;
    this._ddCounter = 0;
    this._date = date;
    this._message = message;
    this._participants = new ListParticipants();

    this.startTrial(channel);
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

  get date() {
    return this._date;
  }

  get message() {
    return this._message;
  }

  set message(message) {
    this._message = message;
  }

  get participants() {
    return this._participants;
  }

  get counter() {
    return this._counter;
  }

  emojisCounter(userId, role) {

    if (this._participants.findParticipant(userId, '') == undefined) {
      switch (role) {
        case '🛡️':
          this._tCounter++;
          break;
        case '🚑':
          this._hCounter++;
          break;
        case '⚔️':
          this._ddCounter++;
          //ddmCounter++;
          break;
        case '🏹':
          this._ddCounter++;
          //ddrCounter++;
          break;
      }

      return ((this._hCounter <= this._hMax && role === '🚑') || (this._tCounter <= this._tMax && role === '🛡️') ||
        (this._ddCounter <= this._ddMax && role === '⚔️') || (this._ddCounter <= this._ddMax && role === '🏹'));
    }

    return false;

  }

  revertDeleteParticipantFinal(role, index) {
    if (index != undefined && role == undefined) {
      role = this._participants.participants[index].role;
      this._participants.deleteParticipant(index);
    }

    switch (role) {
      case '🛡️':
        this._tCounter--;
        break;
      case '🚑':
        this._hCounter--;
        break;
      case '⚔️':
        this._ddCounter--;
        break;
      case '🏹':
        this._ddCounter--;
        break;
    }
  }

  addParticipantFinal(id, role) {
    let verify = this.emojisCounter(id, role);

    if (verify) {
      this._participants.addParticipant(id, role);
      this.editEmbed();
      return true;
    } else {
      this.revertDeleteParticipantFinal(role, undefined);
      return false;
    }
  }

  deleteParticipantFinal(id) {
    let index = this._participants.findParticipant(id, '');
    this.revertDeleteParticipantFinal(undefined, index);
    this.editEmbed();
  }

  updateParticipantFinal(id, role) {
    let index = this._participants.findParticipant(id, '');
    let oldRole = this._participants.participants[index].role;
    this.revertDeleteParticipantFinal(undefined, index);

    let verify = this.emojisCounter(id, role);

    if (verify) {
      this._participants.addParticipant(id, role);
      this.editEmbed();
      return true;
    } else {
      this.revertDeleteParticipantFinal(role, undefined);
      this._participants.addParticipant(id, oldRole);
      return false;
    }
  }

  async listParticipants(message) {
    await await message.channel.send(`**${this._name} at ${this._date}**`);
    for (let index = 0; index < this._participants._counter; index++) {
      const element = this._participants.participants[index];

      await message.channel.send(`${message.guild.members.cache.find(users => users.id == element.id)} is ${element.role}`);
    }
  }

  editEmbed() {

    var trialEmbed = new Discord.MessageEmbed()
      .setTitle(`Trial nº ${this._id + 1}: ${this._name}`)
      .addField('Day and time (UTC)', `${this._date}`, false)
      .addFields(
        { name: 'Tanks', value: `${this._tCounter}/${this._tMax}`, inline: true },
        { name: 'Healers', value: `${this._hCounter}/2`, inline: true },
        { name: 'Damage Dealers', value: `${this._ddCounter}/${this._ddMax}`, inline: true },
      )

    this._message.edit(trialEmbed);
  }

  async startTrial(channel) {

    let trialEmbed = new Discord.MessageEmbed()
      .setTitle(`Trial nº ${this._id + 1}: ${this._name}`)
      .addField('Date (UTC)', `${this._date}`, false)
      .addFields(
        { name: 'Tanks', value: `0/${this._tMax}`, inline: true },
        { name: 'Healers', value: `0/2`, inline: true },
        { name: 'Damage Dealers', value: `0/${this._ddMax}`, inline: true },
      )
    
    var parseDate = moment(this._date, "DD/MM/YYYY HH:mm").toDate();
    var time = parseDate.setMinutes(parseDate.getMinutes() - 15) - new Date();

    channel.send(trialEmbed).then(async (messageReaction) => {

      this._message = messageReaction;
      for (let index = 0; index < roles.length; index++) {
        await messageReaction.react(roles[index]);
      }

      const filter = (reaction, user) => {
        if (adminID.includes(user.id) && reaction.emoji.name == '🛑') {
          return true;
        }

        if (messageReaction.author.id != user.id) {
          let add = this.addParticipantFinal(user.id, reaction.emoji.name);

          if (add) {
            return true;
          }

          // Condition to make sure the bot will just delete unlisted reactions
          if (!add && this._participants.findParticipant(user.id, reaction.emoji.name) == undefined) {
            reaction.users.remove(user.id);
          }
        }

        if (this._participants.findParticipant(user.id, '') != undefined) {
          var name = reaction.emoji.name;
          const userReactions = messageReaction.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

          try {
            for (const reaction of userReactions.values()) {
              if (reaction.emoji.name === name && this._participants.findParticipant(user.id, reaction.emoji.name) == undefined) {
                reaction.users.remove(user.id);
              }
            }
          } catch (error) {
            console.error('Failed to remove reactions.');
          }
        }
        return false;
      };

      const collector = messageReaction.createReactionCollector(filter, { time: time });

      collector.on('collect', (reaction, user) => {
        if (reaction.emoji.name != '🛑') {
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
          messageReaction.channel.send(`${messageReaction.guild.members.cache.find(users => users.id == user.id)} signed up for **${this._name}** as ${reaction.emoji.name}`).then(async (messageRole) => {
            var userRole = user;
            var reactionRole = reaction.emoji.name;
            await messageRole.react('🗑️');
            for (let index = 0; index < roles.length; index++) {
              if (roles[index] != reactionRole)
                await messageRole.react(roles[index]);
            }

            const filterRole = (reaction, user) => {

              if (messageRole.author.id != user.id && userRole.id == user.id) {

                switch (reaction.emoji.name) {
                  case '🗑️':
                    this.deleteParticipantFinal(user.id);
                    return true;
                  default:
                    if (reaction.emoji.name != reactionRole && roles.includes(reaction.emoji.name)) {
                      let update = this.updateParticipantFinal(user.id, reaction.emoji.name);

                      if (update) {
                        return true;
                      } else {
                        reaction.users.remove(user.id);
                        return false;
                      }
                    }

                }
              } else if (messageRole.author.id != user.id) {
                reaction.users.remove(user.id);
              }

              return false;
            };

            const collectorRole = messageRole.createReactionCollector(filterRole, {});

            collectorRole.on('collect', async (reaction, user) => {
              switch (reaction.emoji.name) {
                case '🗑️':
                  messageRole.delete();
                  break;
                default:
                  await messageRole.reactions.cache.get(reaction.emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
                  messageRole.react(reactionRole);
                  reactionRole = reaction.emoji.name;
                  messageRole.edit(`${messageRole.guild.members.cache.find(users => users.id == user.id)} signed up for **${this._name}** as ${reactionRole}`);
                  break;
              }
            });
          });

        } else {
          collector.stop('Collector stopped');
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason && reason === 'Collector stopped') {
          console.log('Collector has been stopped manually');
        } else {
          console.log('Collector has run out of time');
        }
        this.listParticipants(messageReaction);
      });
    });
  }
}
module.exports = Trial;