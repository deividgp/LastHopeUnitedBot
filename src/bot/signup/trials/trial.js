const Discord = require('discord.js');

class Trial {

    constructor(id, trial, tanks, datetime, role, description, raidleader, interaction, client) {
        this._id = id;
        this._name = trial;
        this._hMax = 2;
        this._tMax = tanks;
        this._ddMax = 12 - (this._tMax + this._hMax);
        this._hCounter = 0;
        this._tCounter = 0;
        this._ddCounter = 0;
        this._datetime = datetime;
        this._role = role;
        this._description = description;
        this._raidleader = raidleader;
        this._message = undefined;
        this._client = client;
        this._participantsEmbed = new Discord.MessageEmbed()
            .addFields(
                { name: 'Tanks', value: `0/${this._tMax}`, inline: true },
                { name: 'Healers', value: `0/2`, inline: true },
                { name: 'Damage Dealers', value: `0/${this._ddMax}`, inline: true },
            )
        this._infoEmbed = new Discord.MessageEmbed()
            .setTitle(`${this._name}`)
            .addField(`ID`, `${this._id + 1}`)
            .addField('Date and time', `<t:${this._datetime.getTime() / 1000}>`, false)
        if (this._raidleader != undefined) {
            this._infoEmbed.addField('Raidleader', `${this._raidleader}`);
        }else{
            this._infoEmbed.addField('Raidleader', `${interaction.user}`);
        }
        if (this._description != undefined) {
            this._infoEmbed.setDescription(this._description);
        }
        this._classesRow = new Discord.MessageActionRow()
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
        this._rolesRow = new Discord.MessageActionRow()
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

    get role() {
        return this._role;
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

    get raidleader() {
        return this._raidleader;
    }

    set raidleader(raidleader) {
        this._raidleader = raidleader;
    }

    get infoEmbed() {
        return this._infoEmbed;
    }

    get rolesRow() {
        return this._rolesRow;
    }

    get classesRow() {
        return this._classesRow;
    }

    get participantsEmbed() {
        return this._participantsEmbed;
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