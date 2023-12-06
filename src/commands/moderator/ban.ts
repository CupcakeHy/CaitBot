import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { command, Reply, Color } from '../../utils/index.js';
import Keys from '../../keys.js';

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription("Banea a un usuario")
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription("Usuario a banear")
			.setRequired(true)
	)
	.addIntegerOption(option =>
		option
			.setName('delete_messages')
			.setDescription("Eliminar mensajes en el periodo seleccionado")
			.addChoices(
				{ name: "Última hora", value: 1 },
				{ name: "Últimas 6 horas", value: 6 },
				{ name: "Últimas 12 horas", value: 12 },
				{ name: "Últimas 24 horas", value: 24 },
				{ name: "Últimos 3 días", value: 72 },
				{ name: "Últimos 7 días", value: 168 },
			)
	)
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription("Motivo del baneo")
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setDMPermission(false);

export default command(data, async ({ interaction }) => {
	const user = interaction.options.getUser('user');
	const deleteMessages = interaction.options.getInteger('delete_messages') ?? 0;
	const reason = interaction.options.getString('reason') ?? "No se ha proporcionado ningún motivo";

	if (user) {
		try {
			const banList = await interaction.guild.bans.fetch();
			const bannedUser = banList.find(ban => ban.user === user);

			if (bannedUser) {
				return interaction.reply(
					Reply(`El usuario ${user} ya está baneado`, Color.Error)
				);
			} else {
				try {
					const member = await interaction.guild.members.fetch(user);
	
					if (member.bannable) {
						await member.ban({ reason: reason, deleteMessageSeconds: deleteMessages * 3600 });
		
						await interaction.guild.channels.fetch(Keys.logsChannel)
						.then(logsChannel => {
							if (logsChannel?.type === ChannelType.GuildText) {
								logsChannel.send({ embeds: [{ color: Color.Info, description: `${interaction.user} ha baneado a ${user}. Motivo: ${reason}` }] });
					
							}
						});
						
						return interaction.reply(
							Reply(`Se ha baneado a ${user}. Motivo: ${reason}`, Color.Success)
						);
					} else {
						return interaction.reply(
							Reply("Permisos insuficientes", Color.Error)
						);
					}
				} catch (error) {
					await interaction.guild.members.ban(user);

					await interaction.guild.channels.fetch(Keys.logsChannel)
						.then(logsChannel => {
							if (logsChannel?.type === ChannelType.GuildText) {
								logsChannel.send({ embeds: [{ color: Color.Info, description: `${interaction.user} ha baneado a ${user}. Motivo: ${reason}` }] });
					
							}
						});
	
					return interaction.reply(
						Reply(`Se ha baneado a ${user}. Motivo: ${reason}`, Color.Success)
					);
				}
			}
		} catch (err) {
			console.error("[ERROR]:", err);
		}
	}
});