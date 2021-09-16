const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = {
    name: 'update',
    description: 'Update a participant (update trialid userid class role)',
    options: [
        {
            name: 'trialid',
            type: ApplicationCommandOptionType.Integer,
            description: 'Trial ID',
            required: true,
        },
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'User',
            required: true,
        },
        {
            name: 'class',
            type: ApplicationCommandOptionType.String,
            description: 'Class',
            required: true,
            choices: [
                {
                    name: "Dragonknight",
                    value: "dragonknight"
                },
                {
                    name: "Sorcerer",
                    value: "sorcerer"
                },
                {
                    name: "Nightblade",
                    value: "nightblade"
                },
                {
                    name: "Templar",
                    value: "templar"
                },
                {
                    name: "Warden",
                    value: "warden"
                },
                {
                    name: "Necromancer",
                    value: "necromancer"
                }
            ]
        },
        {
            name: 'role',
            type: ApplicationCommandOptionType.String,
            description: 'Role',
            required: true,
            choices: [
                {
                    name: "Tank",
                    value: "tank"
                },
                {
                    name: "Healer",
                    value: "healer"
                },
                {
                    name: "Stam DD",
                    value: "stamina dd"
                },
                {
                    name: "Mag DD",
                    value: "magicka dd"
                }
            ]
        }],
    async execute(trials, client, interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply({ content: 'Not enough permissions', ephemeral: true });

        const trialid = interaction.options.getInteger("trialid");
        const userid = interaction.options.getInteger("userid").id;
        const clas = interaction.options.getString("class");
        const role = interaction.options.getString("role");

        if (trialid == 0 || (trialid - 1) > trials._counter)
            return await interaction.reply({ content: 'The first argument is invalid', ephemeral: true });

        const trial = trials.trials[trialid - 1];
        const participant = trial.participants.getParticipant(userid);

        if(participant == undefined){
            return await interaction.reply({ content: 'The participant is not registered', ephemeral: true });
        }
        
        let update;
        if (typeof trial == "Trial") {
            update = trial.updateParticipantFinal(participant, role, clas);
        } else if (typeof trial == "MultiroleTrial") {
            update = trial.updateChar(participant, role);
        }

        if (!update) {
            return await interaction.reply({ content: "Can't update participant", ephemeral: true });
        }
        return await interaction.reply({ content: "Participant updated", ephemeral: true });
    }
}