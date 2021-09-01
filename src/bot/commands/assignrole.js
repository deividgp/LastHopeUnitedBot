const { assignRole } = require('../functions.js');
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = {
    name: 'assignrole',
    description: 'Assign role',
    options: [
        {
            name: 'role',
            type: ApplicationCommandOptionType.Role,
            description: 'Role',
            required: true,
        }
    ],
    async execute(trials, client, interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR"))
            return await interaction.reply({ content: 'Not enough permissions', ephemeral: true });

        const roleid = interaction.options.getRole("role").id;
        assignRole(interaction.channel, roleid);
        return await interaction.reply({ content: 'Assign role set', ephemeral: true });
    }
}