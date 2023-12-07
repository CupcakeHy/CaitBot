import { ChannelType, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { event, Events } from '../utils/index.js';
import Keys from '../keys.js';

export default event(Events.GuildMemberAdd, async ({ log }, member) => {
	const channel = member.guild.channels.cache.get(Keys.welcomeChannel);
	const role = member.guild.roles.cache.get(Keys.roleId);

	const canvas = createCanvas(1700, 650);
	const ctx = canvas.getContext('2d');

	const background = await loadImage('./img/welcome.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.fillStyle = '#f2f2f2';
	
	var textString = `${member.user.username}`;
	if (textString.length >= 14) {
		ctx.font = 'bold 100px Rubik';
	} else {
		ctx.font = 'bold 150px Rubik';
	}
	ctx.fillText(textString, 520, canvas.height / 2 - 25);
	ctx.strokeText(textString, 520, canvas.height / 2 - 25);

	var textString2 = `¡Disfruta de tu estancia!`;
	ctx.font = 'bold 80px Rubik';
	ctx.fillText(textString2, 520, canvas.height / 2 + 100);
	ctx.strokeText(textString2, 520, canvas.height / 2 + 100);

	ctx.beginPath();
	ctx.arc(264, canvas.height / 2, 200, 0, Math.PI * 2, true);
	ctx.stroke();
	ctx.clip();

	const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'jpg' }));
	ctx.drawImage(avatar, 64, canvas.height / 2 - 200, 400, 400);

	const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });

	const welcomeEmbed = new EmbedBuilder()
        .setColor(0x725c9d)
        .setDescription(`**¡Te doy la bienvenida, ${member.user}!**`)
        .setImage('attachment://welcome.png');

	if (channel?.type === ChannelType.GuildText) {
		channel.send({ embeds: [welcomeEmbed], files: [attachment] });
	}

	if (role) {
		member.roles.add(role);
	}

	return log(`${member.user.username} joined the server.`);
});