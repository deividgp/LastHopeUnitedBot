const Discord = require('discord.js');
const Trial = require('./trial.js');
const ListMultiroleParticipants = require('../participants/listMultiroleParticipants.js');

class MultiroleTrial extends Trial {

    constructor(id, trial, tanks, datetime, role, description, interaction, raidleader, client) {
        super(id, trial, tanks, datetime, role, description, raidleader, interaction, client);
        this._participants = new ListMultiroleParticipants();
        this.startTrial(interaction);
    }

    get participants() {
        return this._participants;
    }

    addParticipantFinal(participant, role) {
        const verify = super.addRole(role);

        if (verify) {
            this._participants.addParticipant(participant, role);
        } else {
            super.subtractRole(role);
            this._participants.addParticipant(participant, role, "backup");
        }
        this.editEmbed();
        return verify;
    }

    deleteParticipantFinal(participant) {
        const mainChar = participant.characters.getMainCharacter();
        const state = participant.state;
        this._participants.deleteParticipant(participant);
        if (state == "in") {
            super.subtractRole(mainChar.role);
        }
        this.updateBackupParticipant(mainChar.role);
        this.editEmbed();
    }

    updateCharMain(participant, role) {
        if (!participant.characters.getCharacter(role)) {
            return undefined;
        }

        const oldMainChar = participant.characters.getMainCharacter();
        oldMainChar.main = false;
        participant.portal = false;

        if (participant.state == "in") {
            super.subtractRole(oldMainChar.role);
        }
        const verify = super.addRole(role);
        if (verify) {
            this._participants.updateCharMain(participant, role, "in");
        } else {
            super.subtractRole(role);
            this._participants.updateCharMain(participant, role, "backup");
        }
        this.updateBackupParticipant(oldMainChar.role);
        this.editEmbed();
        return verify;
    }

    updateChar(participant, role) {
        if (participant.newClass != undefined) {
            participant.characters.updateCharacter(participant.newClass, role);
            this.editEmbed();
            return true;
        }
        return false;
    }

    deleteChar(participant, role) {
        const char = participant.characters.getCharacter(role);

        if (char == false) {
            return undefined;
        }

        if (char.main == true) {
            return false;
        }

        participant.characters.updateCharacter(undefined, role);
        this.editEmbed();

        return true;
    }

    updateBackupParticipant(role) {
        const verify = super.addRole(role);
        if (verify) {
            for (let index = 0; index < this._participants._counter; index++) {
                const element = this._participants.participants[index];
                if (element.state == "backup") {
                    const mainChar = element.characters.getMainCharacter();
                    if (mainChar.role == role) {
                        element.state = "in";
                        return;
                    }
                }
            }
        }
        super.subtractRole(role);
    }

    async listParticipants(channel) {
        try {
            let msgBlock = "";
            for (let index = 0; index < this._participants._counter; index++) {
                const element = this._participants.participants[index];
                if (element.state != "partial") {
                    const mainChar = element.characters.getMainCharacter();
                    msgBlock = msgBlock + `${super.message.guild.members.cache.find(m => m.id == element.id)} is **${element.state}** as ${mainChar.clas} ${mainChar.role}\n`;
                }
            }
            if (msgBlock.length > 0) {
                channel.send(msgBlock);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async editEmbed() {
        let trialEmbed = new Discord.MessageEmbed()
        trialEmbed.addField('Tanks', `${super.tCounter}/${super.tMax}`, true);
        trialEmbed.addField('Healers', `${super.hCounter}/${super.hMax}`, true);
        trialEmbed.addField('Damage Dealers', `${super.ddCounter}/${super.ddMax}`, true);
        for (let index = 0; index < this._participants._counter; index++) {
            const participant = this._participants.participants[index];
            if (participant.state != "partial") {
                let fieldName = "";
                const mainChar = participant.characters.getMainCharacter();
                if (!mainChar.role.includes("dd")) {
                    fieldName = fieldName + `${super.client.emojis.cache.find(emoji => emoji.name === mainChar.clas)} ${mainChar.role}  `;
                } else {
                    fieldName = fieldName + `${super.client.emojis.cache.find(emoji => emoji.name === `${mainChar.role.split(" ")[0]}_${mainChar.clas}`)}  `;
                }
                if (participant.state == "backup") {
                    fieldName = fieldName + "(backup)  "
                }
                if (participant.portal == true) {
                    fieldName = fieldName + "(portal)  "
                }
                for (const character of participant.characters.characters) {

                    if (character.clas != undefined && character.main == false) {
                        if (!character.role.includes("dd")) {
                            fieldName = fieldName + `${super.client.emojis.cache.find(emoji => emoji.name === character.clas)} ${character.role}  `;
                        } else {
                            fieldName = fieldName + `${super.client.emojis.cache.find(emoji => emoji.name === `${character.role.split(" ")[0]}_${character.clas}`)}  `;
                        }
                    }
                }
                const fieldValue = `${super.message.guild.members.cache.find(m => m.id == participant.id)}`;
                trialEmbed.addField(fieldName, fieldValue, false);
                fieldName = "";
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
                            label: 'Set main role',
                            value: 'main',
                        },
                        {
                            label: 'Delete role',
                            value: 'deleteRole',
                        },
                        {
                            label: 'Set main dd portal (if applies)',
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
        super.message = await interaction.channel.send({ content: `${super.role}`, embeds: [super.participantsEmbed] });
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
                            case "main":
                            case "deleteRole":
                                findResult.option = selectValue;
                                return await i.editReply('Option registered. Now select a role');
                            case "portal":
                                const mainChar = findResult.characters.getMainCharacter();
                                if (mainChar.role.includes("dd")) {
                                    findResult.portal = true;
                                    this.editEmbed();
                                    return await i.editReply('Your main role is now portal');
                                }
                                return await i.editReply("Your current main role can't be portal");
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
                            switch (findResult.option) {
                                case "main":
                                    const updateMain = this.updateCharMain(findResult, i.customId);
                                    switch (updateMain) {
                                        case undefined:
                                            return await i.editReply('Need to define the role first (add a class)');
                                        case true:
                                            return await i.editReply('Updated succesfully');
                                        case false:
                                            return await i.editReply('Added as backup');
                                    }
                                case "deleteRole":
                                    const deleteChar = this.deleteChar(findResult, i.customId);
                                    switch (deleteChar) {
                                        case undefined:
                                            return await i.editReply('Role not defined (class)');
                                        case true:
                                            return await i.editReply('Deleted succesfully');
                                        case false:
                                            return await i.editReply("Can't delete main roles. Need to set another main role");
                                    }
                                default:
                                    const update = this.updateChar(findResult, i.customId);
                                    if (update) {
                                        return await i.editReply("Role updated succesfully");
                                    }
                                    return await i.editReply("Need to select an option first");
                            }
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
module.exports = MultiroleTrial;