import { ChannelType, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { command, Reply, Color } from '../../utils/index.js';

const data = new SlashCommandBuilder()
	.setName('rules')
	.setDescription('Envía un las reglas del servidor')
	.addChannelOption(option =>
		option
			.setName('channel')
			.setDescription('Canal al que enviar las reglas')
			.addChannelTypes(ChannelType.GuildText)
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.setDMPermission(false);

export default command(data, async ({ interaction }) => {
	const channel = interaction.options.getChannel('channel') ?? interaction.channel;

	const embed = new EmbedBuilder()
		.setColor(0x725c9d)
		.addFields(
			{ name: "👍`RESPETO`", value: "Respeta a los demás miembros. Si tienes una mala experiencia con alguien, limítate a bloquear y avisar a los moderadores." },
			{ name: "🤔`COMPORTAMIENTO`", value: "No se permite lenguaje despectivo, insultos, incitación al odio o comportamientos discriminatorios como, entre otros, racismo, transfobia, homofobia o cualquier otro que no sea adecuado en un entorno familiar." },
			{ name: "📃`CANALES`", value: "Usa los canales de texto y de voz adecuadamente según su descripción." },
			{ name: "⚠️`CONTENIDO`", value: "No está permitido el contenido explícito o NSFW." },
			{ name: "📨`SPAM`", value: "No se permite el spam ni la autopromoción (invitaciones al servidor, anuncios, etc.) sin permiso de un miembro del personal. Esto también incluye mandar MD a otros miembros." },
		)
		.setFooter({ text: "El incumplimiento de cualquiera de estas normas puede conllevar a mute, kick o ban." });

		if (channel?.type === ChannelType.GuildText) {
			channel.send({ files: [{ attachment: './img/rules.png' }], embeds: [embed] });
		}


	return interaction.reply(
		Reply(`Normas enviadas a ${channel}`, Color.Success)
	);
});