import { AccessToken } from "@twurple/auth";
import Keys from "../keys.js";
import {
	EmbedBuilder,
	AttachmentBuilder,
	Client,
	ChannelType,
	Channel,
} from "discord.js";

export async function getStreamStatus(appAccessToken: AccessToken) {
	const url = "https://api.twitch.tv/helix/streams?user_login=cupcakehy";

	const options = {
		headers: {
			Authorization: 'Bearer ' + appAccessToken.accessToken,
			'Client-Id': Keys.clientId,
		},
	};

	try {
		const response = await fetch(url, options);
		const data = await response.json();

		if (data.length > 0) {
			const streamData = { gameName: data.game_name, title: data.title };
			return streamData;
		}

		return false;
	} catch (err) {
		console.error("[ERROR]:", err);
	}
}

async function getGameThumbnail(gameName: string, appAccessToken: AccessToken) {
	const url = "https://api.twitch.tv/helix/games?name=" + gameName;

	const options = {
		headers: {
			Authorization: 'Bearer ' + appAccessToken.accessToken,
			'Client-Id': Keys.clientId,
		},
	};

	try {
		const response = await fetch(url, options);
		const data = await response.json();

		if (typeof data.box_art_url === 'string') {
			const rawThumbnail = data.box_art_url;
			const gameThumbnail = rawThumbnail.replace('{width}x{height}', '570x760');
			return gameThumbnail;
		}
	} catch (err) {
		console.error("[ERROR]:", err);
	}
}

export async function postStreamEmbed(client: Client, streamData: { gameName: string; title: string; }, channel: Channel, appAccessToken: AccessToken) {
	const gameName = streamData.gameName;
	const title = streamData.title;

	const gameThumbnail = await getGameThumbnail(gameName, appAccessToken);
	const thumbFile = new AttachmentBuilder(gameThumbnail);

	const streamEmbed = new EmbedBuilder()
		.setColor("#7557ad")
		.setTitle(title)
		.setAuthor({
			name: "\u00A1CupcakeHy est\u00E1 en directo!",
			iconURL:
				"https://static-cdn.jtvnw.net/jtv_user_pictures/c6a9639d-6812-440f-b166-28a011de93ba-profile_image-300x300.png",
			url: "https://www.twitch.tv/cupcakehy",
		})
		.setURL("https://www.twitch.tv/cupcakehy")
		.addFields({
			name: "Jugando " + gameName,
			value: "[Ver directo](https://www.twitch.tv/cupcakehy)",
			inline: true,
		})
		.setImage(thumbFile.attachment.toString())
		.setFooter({
			text: "Fecha de inicio: " + getCurrentDate(),
		});

	if (channel.type === ChannelType.GuildText) {
		channel.send({ content: "@everyone", embeds: [streamEmbed] });
	}

	console.log("[INFO]: Discord stream embed sent.");
}

function getCurrentDate() {
	var date = new Date();
	var localDate = date.toLocaleString();
	return localDate;
}