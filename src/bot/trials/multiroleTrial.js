const Discord = require('discord.js');
const ListMultiroleParticipants = require('../participants/listMultiroleParticipants.js');

class MultiroleTrial {

    constructor(id, trial, tanks, datetime, description, interaction, client) {
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
        this._participants = new ListMultiroleParticipants();
        this._client = client;
        this.startTrial(interaction);
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

    get participants() {
        return this._participants;
    }

    get counter() {
        return this._counter;
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

    addParticipantFinal(participant, role) {
        const verify = this.addRole(role);

        if (verify) {
            this._participants.addParticipant(participant, role);
        } else {
            this.subtractRole(role);
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
            this.subtractRole(mainChar.role);
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
            this.subtractRole(oldMainChar.role);
        }
        const verify = this.addRole(role);
        if (verify) {
            this._participants.updateCharMain(participant, role, "in");
        } else {
            this.subtractRole(role);
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
        const verify = this.addRole(role);
        if (verify) {
            for (let index = 0; index < this._participants._counter; index++) {
                const element = this._participants.participants[index];
                const mainChar = this._participants.participants[index].characters.getMainCharacter();
                if (mainChar.role == role && element.state == "backup") {
                    element.state = "in";
                    return;
                }
            }
        }
        this.subtractRole(role);
    }

    async listParticipants(channel) {
        let msgBlock = "";
        for (let index = 0; index < this._participants._counter; index++) {
            const element = this._participants.participants[index];
            const mainChar = participant.characters.getMainCharacter();
            if (element.state != "partial") {
                msgBlock = msgBlock + `${this._message.guild.members.cache.find(m => m.id == element.id)} is **${element.state}** as ${mainChar.clas} ${mainChar.role}\n`;
            }
        }
        channel.send(msgBlock);
    }

    async editEmbed() {
        let trialEmbed = new Discord.MessageEmbed()
        trialEmbed.addField('Tanks', `${this._tCounter}/${this._tMax}`, true);
        trialEmbed.addField('Healers', `${this._hCounter}/${this._hMax}`, true);
        trialEmbed.addField('Damage Dealers', `${this._ddCounter}/${this._ddMax}`, true);
        for (let index = 0; index < this._participants._counter; index++) {
            const participant = this._participants.participants[index];
            if (participant.state != "partial") {
                let fieldName = "";
                const mainChar = participant.characters.getMainCharacter();
                if (!mainChar.role.includes("dd")) {
                    fieldName = fieldName + `${this._client.emojis.cache.find(emoji => emoji.name === mainChar.clas)} ${mainChar.role}  `;
                } else {
                    fieldName = fieldName + `${this._client.emojis.cache.find(emoji => emoji.name === `${mainChar.role.split(" ")[0]}_${mainChar.clas}`)}  `;
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
                            fieldName = fieldName + `${this._client.emojis.cache.find(emoji => emoji.name === character.clas)} ${character.role}  `;
                        } else {
                            fieldName = fieldName + `${this._client.emojis.cache.find(emoji => emoji.name === `${character.role.split(" ")[0]}_${character.clas}`)}  `;
                        }
                    }
                }
                const fieldValue = `${this._message.guild.members.cache.find(m => m.id == participant.id)}`;
                trialEmbed.addField(fieldName, fieldValue, false);
                fieldName = "";
            }
        }
        await this._message.edit({ embeds: [trialEmbed] });
    }

    async startTrial(interaction) {
        const infoEmbed = new Discord.MessageEmbed()
            .setTitle(`Trial nº ${this._id + 1}: ${this._name}`)
            .addField('Date and time', `<t:${this._datetime.getTime() / 1000}>`, false)
        if (this._description != undefined) {
            infoEmbed.setDescription(this._description);
        }
        const participantsEmbed = new Discord.MessageEmbed()
            .addFields(
                { name: 'Tanks', value: `0/${this._tMax}`, inline: true },
                { name: 'Healers', value: `0/2`, inline: true },
                { name: 'Damage Dealers', value: `0/${this._ddMax}`, inline: true },
            )
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
        const classesRow = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('class')
                    .setPlaceholder('Classes')
                    .addOptions([
                        {
                            label: 'Dragonknight',
                            value: 'dragonknight',
                            emoji: '876758966653296661',
                        },
                        {
                            label: 'Sorcerer',
                            value: 'sorcerer',
                            emoji: '876758967047557140',
                        },
                        {
                            label: 'Nightblade',
                            value: 'nightblade',
                            emoji: '876758967039197224',
                        },
                        {
                            label: 'Templar',
                            value: 'templar',
                            emoji: '876758967005626408',
                        },
                        {
                            label: 'Warden',
                            value: 'warden',
                            emoji: '876758967068524544',
                        },
                        {
                            label: 'Necromancer',
                            value: 'necromancer',
                            emoji: '876758967005622302',
                        }
                    ]),
            );
        const rolesRow = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('tank')
                    .setLabel('Tank')
                    .setStyle('PRIMARY')
                    .setEmoji('876758966720405535'),
                new Discord.MessageButton()
                    .setCustomId('healer')
                    .setLabel('Healer')
                    .setStyle('PRIMARY')
                    .setEmoji('876758967018197032'),
                new Discord.MessageButton()
                    .setCustomId('stamina dd')
                    .setLabel('Stam DD')
                    .setStyle('PRIMARY')
                    .setEmoji('876758967014010880'),
                new Discord.MessageButton()
                    .setCustomId('magicka dd')
                    .setLabel('Mag DD')
                    .setStyle('PRIMARY')
                    .setEmoji('876758967014010880'),
            );

        const auxDatetime = new Date(this._datetime.getTime());
        const time = auxDatetime.setMinutes(auxDatetime.getMinutes() - 15) - new Date();
        this._message = await interaction.channel.send({ embeds: [participantsEmbed] });
        const messageReaction = await interaction.reply({ embeds: [infoEmbed], components: [optionsRow, classesRow, rolesRow], fetchReply: true });

        const collector = messageReaction.createMessageComponentCollector({ time: time });

        collector.on('collect', async i => {
            const findResult = this._participants.getParticipant(i.user.id);
            if (i.isSelectMenu()) {
                const selectValue = i.values[0];

                if (i.customId == "option" && findResult != undefined) {
                    switch (selectValue) {
                        case "main":
                        case "deleteRole":
                            findResult.option = selectValue;
                            return await i.reply({ content: 'Option registered. Now select a role', ephemeral: true });
                        case "portal":
                            const mainChar = findResult.characters.getMainCharacter();
                            if (mainChar.role.includes("dd")) {
                                findResult.portal = true;
                                this.editEmbed();
                                return await i.reply({ content: 'Your main role is now portal', ephemeral: true });
                            }
                            return await i.reply({ content: "Your current main role can't be portal", ephemeral: true });
                        case "removeportal":
                            if (findResult.portal) {
                                findResult.portal = false;
                                this.editEmbed();
                                return await i.reply({ content: 'Portal removed', ephemeral: true });
                            }
                            return await i.reply({ content: "Portal isn't set", ephemeral: true });
                        case "delete":
                            this.deleteParticipantFinal(findResult);
                            return await i.reply({ content: 'Removed', ephemeral: true });
                    }
                } else if (i.customId == "option" && findResult == undefined) {
                    return await i.reply({ content: 'You are not signed up', ephemeral: true });
                }
                this._participants.addPartialParticipant(i.user.id, selectValue);
                return await i.reply({ content: `${selectValue.charAt(0).toUpperCase() + selectValue.slice(1)} selected. Now select a role.`, ephemeral: true });
            } else if (i.isButton()) {

                const partialPart = this._participants.getPartialParticipant(i.user.id);

                if (partialPart == undefined) {
                    if (findResult == undefined) {
                        return await i.reply({ content: 'Select a class first', ephemeral: true });
                    } else {
                        switch (findResult.option) {
                            case "main":
                                const updateMain = this.updateCharMain(findResult, i.customId);
                                switch (updateMain) {
                                    case undefined:
                                        return await i.reply({ content: 'Need to define the role first (add a class)', ephemeral: true });
                                    case true:
                                        return await i.reply({ content: 'Updated succesfully', ephemeral: true });
                                    case false:
                                        return await i.reply({ content: 'Added as backup', ephemeral: true });
                                }
                            case "delete":
                                const deleteChar = this.deleteChar(findResult, i.customId);
                                switch (deleteChar) {
                                    case undefined:
                                        return await i.reply({ content: 'Role not defined (class)', ephemeral: true });
                                    case true:
                                        return await i.reply({ content: 'Deleted succesfully', ephemeral: true });
                                    case false:
                                        return await i.reply({ content: "Can't delete main roles. Need to set another main role", ephemeral: true });
                                }
                            default:
                                const update = this.updateChar(findResult, i.customId);
                                if (update) {
                                    return await i.reply({ content: "Role updated succesfully", ephemeral: true });
                                }
                                return await i.reply({ content: "Need to select an option first", ephemeral: true });

                        }
                    }
                } else {
                    const add = this.addParticipantFinal(findResult, i.customId);
                    if (add) {
                        return await i.reply({ content: 'Added', ephemeral: true });
                    }
                    await i.reply({ content: 'Added as backup', ephemeral: true });
                }
            }
        });

        collector.on('end', () => {
            this.listParticipants(this._message.channel);
        });
    }
}
module.exports = MultiroleTrial;