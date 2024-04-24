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
	const url = `https://api.twitch.tv/helix/streams?user_login=${Keys.channel}`;

	const options = {
		headers: {
			Authorization: 'Bearer ' + appAccessToken.accessToken,
			'Client-Id': Keys.clientId,
		},
	};

	try {
		const response = await fetch(url, options);
		const json = await response.json();
		const data = json.data;

		if (data.length > 0) {
			const streamData = { gameName: data[0].game_name, title: data[0].title };
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
		const json = await response.json();
		const data = json.data;

		const rawThumbnail = data[0].box_art_url;
		const gameThumbnail = rawThumbnail.replace('{width}x{height}', '570x760');
		return gameThumbnail;
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
			name: "\u00A1Caitlyn64 est\u00E1 en directo!",
			iconURL: Keys.iconUrl,
			url: `https://www.twitch.tv/${Keys.channel}`,
		})
		.setURL(`https://www.twitch.tv/${Keys.channel}`)
		.addFields({
			name: "Jugando " + gameName,
			value: `[Ver directo](https://www.twitch.tv/${Keys.channel})`,
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