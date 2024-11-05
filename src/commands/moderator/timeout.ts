import config from 'config';
import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { command, Reply, Color } from '../../utils/index.js';

const logsChannel = config.get('discord.guild.channels.logs') as string;

const data = new SlashCommandBuilder()
	.setName('timeout')
	.setDescription("Aisla temporalmente a un usuario")
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription("Usuario a aislar temporalmente")
			.setRequired(true)
	)
	.addIntegerOption(option =>
		option
			.setName('duration')
			.setDescription("Duración del aislamiento temporal")
			.addChoices(
				{ name: "1 min", value: 60 },
				{ name: "5 min", value: 300 },
				{ name: "10 min", value: 600 },
				{ name: "1 hora", value: 3600 },
				{ name: "1 día", value: 86400 },
				{ name: "1 semana", value: 604800 },
			)
			.setRequired(true)
	)
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription("Motivo del aislamiento temporal")
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
	.setDMPermission(false);

export default command(data, async ({ interaction }) => {
	const user = interaction.options.getUser('user');
	const duration = interaction.options.getInteger('duration');
	const reason = interaction.options.getString('reason') ?? "No se ha proporcionado ningún motivo";

	if (user) {
		try {
			const member = await interaction.guild.members.fetch(user);

			if (member.manageable) {
				await member.timeout(duration, reason);

				await interaction.guild.channels.fetch(logsChannel)
					.then(logsChannel => {
						if (logsChannel?.type === ChannelType.GuildText) {
							logsChannel.send({ embeds: [{ color: Color.Info, description: `${interaction.user} ha aislado a ${user} durante ${duration} segundos. Motivo: ${reason}` }] });

						}
					});

				return interaction.reply(
					Reply(`Se ha aislado a ${user} durante ${duration} segundos. Motivo: ${reason}`, Color.Success)
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