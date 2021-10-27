const ListSimpleParticipants = require('../../signup/participants/listSimpleParticipants.js');
const Trial = require('./trial.js');
const Discord = require('discord.js');

class SimpleTrial extends Trial {

    constructor(id, trial, tanks, datetime, description, interaction, raidleader, client) {
        super(id, trial, tanks, datetime, description, raidleader, client);
        this._participants = new ListSimpleParticipants();
        this.startTrial(interaction);
    }

    get participants() {
        return this._participants;
    }

    addParticipantFinal(participant, role) {
        const verify = super.addRole(role);

        if (verify) {
            this._participants.updateParticipant(participant, role, "in");
        } else {
            super.subtractRole(role);
            this._participants.updateParticipant(participant, role, "backup");
        }
        this.editEmbed();
        return verify;
    }

    deleteParticipantFinal(participant) {
        const role = participant.character.role;
        const state = participant.state;
        this._participants.deleteParticipant(participant);
        if (state == "in") {
            super.subtractRole(role);
        }
        this.updateBackupParticipant(role);
        this.editEmbed();
    }

    updateParticipantFinal(participant, role) {
        const oldRole = participant.character.role;
        const oldState = participant.state;

        if (oldState == "in") {
            super.subtractRole(oldRole);
        }
        const verify = super.addRole(role);
        if (verify) {
            this._participants.updateParticipant(participant, role, "in");
        } else {
            super.subtractRole(role);
            this._participants.updateParticipant(participant, role, "backup");
        }
        this.updateBackupParticipant(oldRole);
        this.editEmbed();
        return verify;
    }

    updateBackupParticipant(role) {
        const verify = super.addRole(role);
        if (verify) {
            for (let index = 0; index < this._participants._counter; index++) {
                const element = this._participants.participants[index];
                if (element.state == "backup") {
                    const character = element.character;
                    if (character.role == role) {
                        element.state = "in";
                        return;
                    }
                }

            }
        }
        super.subtractRole(role);
    }

    async listParticipants(channel) {
        let msgBlock = "";
        for (let index = 0; index < this._participants._counter; index++) {
            const element = this._participants.participants[index];
            if (element.state != "partial") {
                const character = element.character;
                msgBlock = msgBlock + `${super.message.guild.members.cache.find(m => m.id == element.id)} is **${element.state}** as ${character.clas} ${character.role}\n`;
            }
        }
        if(msgBlock.length > 0){
            channel.send(msgBlock);
        }
    }

    async editEmbed() {
        let trialEmbed = new Discord.MessageEmbed()
        trialEmbed.addField('Tanks', `${super.tCounter}/${super.tMax}`, true);
        trialEmbed.addField('Healers', `${super.hCounter}/${super.hMax}`, true);
        trialEmbed.addField('Damage Dealers', `${super.ddCounter}/${super.ddMax}`, true);
        for (let index = 0; index < this._participants._counter; index++) {
            const element = this._participants.participants[index];
            if (element.state != "partial") {
                let fieldName = `${super.client.emojis.cache.find(emoji => emoji.name === `${element.character.role.split(" ")[0]}_${element.character.clas}`)}  `;
                if (!element.character.role.includes("dd")) {
                    fieldName = `${super.client.emojis.cache.find(emoji => emoji.name === element.character.clas)} ${element.character.role}  `;
                }
                if (element.state == "backup") {
                    fieldName = fieldName + "(backup)  ";
                }
                if (element.portal == true) {
                    fieldName = fieldName + "(portal)";
                }
                let fieldValue = `${super.message.guild.members.cache.find(m => m.id == element.id)}`;
                trialEmbed.addField(fieldName, fieldValue, false);
            }
        }
        await super.message.edit({ embeds: [trialEmbed] });
    }

    async startTrial(interaction) {
        const optionsRow = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('option')
                    .setPlaceholder('Options')
                    .addOptions([
                        {
                            label: 'Set portal dd (if applies)',
                            value: 'portal',
                        },
                        {
                            label: 'Remove portal',
                            value: 'removeportal',
                        },
                        {
                            label: 'Delete sign up',
                            value: 'delete',
                        },
                    ]),
            );

        const auxDatetime = new Date(super.datetime.getTime());
        const time = auxDatetime.setMinutes(auxDatetime.getMinutes() - 15) - new Date();
        super.message = await interaction.channel.send({ embeds: [super.participantsEmbed] });
        const messageReaction = await interaction.reply({ embeds: [super.infoEmbed], components: [optionsRow, super.classesRow, super.rolesRow], fetchReply: true });

        const collector = messageReaction.createMessageComponentCollector({ time: time });

        collector.on('collect', async i => {
            try {
                await i.deferReply({ ephemeral: true });
                const findResult = this._participants.getParticipant(i.user.id);
                const partialPart = this._participants.getPartialParticipant(i.user.id);
                if (i.isSelectMenu()) {
                    const selectValue = i.values[0];

                    if (i.customId == "option" && findResult != undefined && partialPart == undefined) {
                        switch (selectValue) {
                            case "portal":
                                if (findResult.character.role.includes("dd")) {
                                    findResult.portal = true;
                                    this.editEmbed();
                                    return await i.editReply('You are portal now');
                                }
                                return await i.editReply("Your current role can't be portal");
                            case "removeportal":
                                if (findResult.portal) {
                                    findResult.portal = false;
                                    this.editEmbed();
                                    return await i.editReply('Portal removed');
                                }
                                return await i.editReply("Portal isn't set");
                            case "delete":
                                this.deleteParticipantFinal(findResult);
                                return await i.editReply('Removed');
                        }
                    } else if (i.customId == "option" && (findResult == undefined || partialPart != undefined)) {
                        return await i.editReply('You are not signed up');
                    }
                    this._participants.addPartialParticipant(i.user.id, selectValue);
                    return await i.editReply(`${selectValue.charAt(0).toUpperCase() + selectValue.slice(1)} selected. Now select a role.`);

                } else if (i.isButton()) {

                    if (partialPart == undefined) {
                        if (findResult == undefined) {
                            return await i.editReply('Select a class first');
                        } else {
                            const update = this.updateParticipantFinal(findResult, i.customId);
                            if (update) {
                                return await i.editReply('Role updated succesfully');
                            }
                            return await i.editReply('Added as backup');
                        }
                    } else {
                        const add = this.addParticipantFinal(findResult, i.customId);
                        if (add) {
                            return await i.editReply('Added');
                        }
                        await i.editReply('Added as backup');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        });

        collector.on('end', () => {
            this.listParticipants(super.message.channel);
        });
    }
}
module.exports = SimpleTrial;