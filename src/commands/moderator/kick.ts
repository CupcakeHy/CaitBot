import config from 'config';
import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { command, Reply, Color } from '../../utils/index.js';

const logsChannel = config.get('discord.guild.channels.logs') as string;

const data = new SlashCommandBuilder()
	.setName('kick')
	.setDescription("Expulsa a un usuario")
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription("Usuario a expulsar")
			.setRequired(true)
	)
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription("Motivo de la expulsión")
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
	.setDMPermission(false);

export default command(data, async ({ interaction }) => {
	const user = interaction.options.getUser('user');
	const reason = interaction.options.getString('reason') ?? "No se ha proporcionado ningún motivo";

	if (user) {
		try {
			const member = await interaction.guild.members.fetch(user);

			if (member.kickable) {
				await member.kick(reason);

				await interaction.guild.channels.fetch(logsChannel)
					.then(logsChannel => {
						if (logsChannel?.type === ChannelType.GuildText) {
							logsChannel.send({ embeds: [{ color: Color.Info, description: `${interaction.user} ha expulsado a ${user}. Motivo: ${reason}` }] });

						}
					});

				return interaction.reply(
					Reply(`Se ha expulsado a ${user}. Motivo: ${reason}`, Color.Success)
				);
			} else {
				return interaction.reply(
					Reply("Permisos insuficientes", Color.Error)
				);
			}
		} catch (error) {
			return interaction.reply(
				Reply(`El usuario ${user} no es miembro del servidor`, Color.Error)
			);
		}
	}
});