import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { command, Reply, Color } from '../../utils/index.js';
import Keys from '../../keys.js';

const data = new SlashCommandBuilder()
	.setName('unban')
	.setDescription("Desbanea a un usuario")
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription("Usuario a desbanear")
			.setRequired(true)
	)
	.addStringOption(option => 
		option
			.setName('reason')
			.setDescription("Motivo del desbaneo")
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setDMPermission(false);

data.options

export default command(data, async ({ interaction }) => {
	const user = interaction.options.getUser('user');
	const reason = interaction.options.getString('reason') ?? "No se ha proporcionado ningún motivo";

	if (user) {
		try {
			const banList = await interaction.guild.bans.fetch();
			const bannedUser = banList.find(ban => ban.user === user);

			if (bannedUser) {
				await interaction.guild.members.unban(user, reason);

				await interaction.guild.channels.fetch(Keys.logsChannel)
					.then(logsChannel => {
						if (logsChannel?.type === ChannelType.GuildText) {
							logsChannel.send({ embeds: [{ color: Color.Info, description: `${interaction.user} ha desbaneado a ${user}. Motivo: ${reason}` }] });

						}
					});

				return interaction.reply(
					Reply(`El usuario ${user} ha sido desbaneado`, Color.Success)
				);
			} else {
				return interaction.reply(
					Reply(`El usuario ${user} no está baneado`, Color.Error)
				);
			}
		} catch (err) {
			console.error("[ERROR]:", err);
		}
	}
});