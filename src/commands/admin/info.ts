import config from 'config';
import { ChannelType, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { command, Reply, Color } from '../../utils/index.js';

const announcementChannel = config.get('discord.guild.channels.announcement');
const forumChannel = config.get('discord.guild.channels.forum');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Envía la información del servidor')
	.addChannelOption(option =>
		option
			.setName('channel')
			.setDescription('Canal al que enviar la información')
			.addChannelTypes(ChannelType.GuildText)
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export default command(data, async ({ interaction }) => {
	const channel = interaction.options.getChannel('channel') ?? interaction.channel;

	const embed = new EmbedBuilder()
		.setColor(0x725c9d)
		.addFields(
			{ name: "📢`ANUNCIOS`", value: `En el canal <#${announcementChannel}> se publican noticias relevantes sobre el servidor y el canal de Twitch. Esto incluye avisos cuando empiezo un directo, cuando subo contenido a YouTube o cuando publico un Tweet importante o relevante.` },
			{ name: "❔`SOPORTE`", value: `Si tienes alguna duda o alguna aportación interesante para mejorar el servidor o el canal de Twitch puedes compartirla a través de <#${forumChannel}>. Puedes reportar a miembros problemáticos del mismo modo.` },
			{ name: "📎`INVITACIÓN`", value: "Agradecemos la incorporación de nuevos miembros en todo momento. Si quieres invitar a tus amistades al servidor, utiliza el enlace que se encuentra a continuación." },
		)

	if (channel?.type === ChannelType.GuildText) {
		channel.send({ files: [{ attachment: './img/info.png' }], embeds: [embed] })
			.then(() => {
				channel.send({ content: "https://discord.gg/s7EKyMm" });
			});
	}

	return interaction.reply(
		Reply(`Información enviada a ${channel}`, Color.Success)
	);
});