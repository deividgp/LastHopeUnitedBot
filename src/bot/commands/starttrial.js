const moment = require('moment');
const { ApplicationCommandOptionType } = require('discord-api-types/v9');

module.exports = {
    name: 'starttrial',
    description: 'Start trial',
    options: [{
        name: 'trial',
        type: ApplicationCommandOptionType.String,
        description: 'Trial name',
        required: true,
    },
    {
        name: 'tanks',
        type: ApplicationCommandOptionType.Integer,
        description: 'Number of tanks',
        required: true,
    },
    {
        name: 'date',
        type: ApplicationCommandOptionType.String,
        description: 'Date',
        required: true,
    },
    {
        name: 'time',
        type: ApplicationCommandOptionType.String,
        description: 'Time in UTC',
        required: true,
    },
    {
        name: 'multirole',
        type: ApplicationCommandOptionType.Boolean,
        description: 'Time in UTC',
        required: true,
    },
    {
        name: 'role',
        type: ApplicationCommandOptionType.Role,
        description: 'Role that will be pinged',
        required: true,
    },
    {
        name: 'description',
        type: ApplicationCommandOptionType.String,
        description: 'Trial description',
        required: false,
    },
    {
        name: 'raidleader',
        type: ApplicationCommandOptionType.User,
        description: 'Raidlead (leave it if you are the raidlead)',
        required: false,
    }],
    async execute(trials, client, interaction) {
        const options = interaction.options;
        const trial = options.getString('trial');
        const tanks = options.getInteger('tanks');
        const date = options.getString('date');
        const time = options.getString('time');
        const multirole = options.getBoolean('multirole');
        const role = options.getRole('role');
        const description = options.getString('description');
        const raidleader = options.getUser('raidleader');
        
        const datetime = moment(`${date} ${time}`, "DD/MM/YYYY HH:mm").toDate();

        if (tanks >= 1 && date.length == 10 && time.length == 5 && new Date() < datetime)
            return trials.addTrial(trial, tanks, datetime, multirole, role, description, interaction, raidleader, client);

        return await interaction.reply({ content: `Couldn't create trial`, ephemeral: true });
    }
}