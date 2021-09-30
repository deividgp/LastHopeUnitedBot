const ListSimpleParticipants = require('../../signup/participants/listSimpleParticipants.js');
const Trial = require('./trial.js');
const Discord = require('discord.js');

class SimpleTrial extends Trial {

    constructor(id, trial, tanks, datetime, description, interaction, client) {
        super(id, trial, tanks, datetime, description, client);
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
        channel.send(msgBlock);
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
        const infoEmbed = new Discord.MessageEmbed()
            .setTitle(`Trial nº ${super.id + 1}: ${super.name}`)
            .addField('Date and time', `<t:${super.datetime.getTime() / 1000}>`, false)
        if (super.description != undefined) {
            infoEmbed.setDescription(super.description);
        }
        const participantsEmbed = new Discord.MessageEmbed()
            .addFields(
                { name: 'Tanks', value: `0/${super.tMax}`, inline: true },
                { name: 'Healers', value: `0/2`, inline: true },
                { name: 'Damage Dealers', value: `0/${super.ddMax}`, inline: true },
            )
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
        const classesRow = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('class')
                    .setPlaceholder('Class')
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
                        },
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

        const auxDatetime = new Date(super.datetime.getTime());
        const time = auxDatetime.setMinutes(auxDatetime.getMinutes() - 15) - new Date();
        super.message = await interaction.channel.send({ embeds: [participantsEmbed] });
        const messageReaction = await interaction.reply({ embeds: [infoEmbed], components: [optionsRow, classesRow, rolesRow], fetchReply: true });

        const collector = messageReaction.createMessageComponentCollector({ time: time });

        collector.on('collect', async i => {
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
                                return await i.reply({ content: 'You are portal now', ephemeral: true });
                            }
                            return await i.reply({ content: "Your current role can't be portal", ephemeral: true });
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
                } else if (i.customId == "option" && (findResult == undefined || partialPart != undefined)) {
                    return await i.reply({ content: 'You are not signed up', ephemeral: true });
                }
                this._participants.addPartialParticipant(i.user.id, selectValue);
                return await i.reply({ content: `${selectValue.charAt(0).toUpperCase() + selectValue.slice(1)} selected. Now select a role.`, ephemeral: true });

            } else if (i.isButton()) {

                if (partialPart == undefined) {
                    if (findResult == undefined) {
                        return await i.reply({ content: 'Select a class first', ephemeral: true });
                    } else {
                        const update = this.updateParticipantFinal(findResult, i.customId);
                        if (update) {
                            return await i.reply({ content: 'Role updated succesfully', ephemeral: true });
                        }
                        return await i.reply({ content: 'Added as backup', ephemeral: true });
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
            this.listParticipants(super.message.channel);
        });
    }
}
module.exports = SimpleTrial;