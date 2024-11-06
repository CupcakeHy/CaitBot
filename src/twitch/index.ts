import config from 'config';
import { promises as fs } from 'fs';
import { AccessToken, RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient, UserIdResolvable } from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { ChannelType, EmbedBuilder } from 'discord.js';
import { client } from '../discord/index.js';
import { ChatClient } from '@twurple/chat';

// Discord vars
const announcementChannel = config.get('discord.guild.channels.announcement') as string;

// Twitch vars
const broadcaster = config.get('twitch.broadcaster') as string;
const bot = config.get('twitch.bot') as string;
const clientId = config.get('twitch.clientId') as string;
const clientSecret = config.get('twitch.clientSecret') as string;
const appImpliedScopes = [ "chat:edit", "chat:read", "channel:read:redemptions", "channel:manage:redemptions" ];

const authProvider = new RefreshingAuthProvider({ clientId, clientSecret, appImpliedScopes });
const apiClient = new ApiClient({ authProvider });
const broadcasterUser = await apiClient.users.getUserByName(broadcaster);
const botUser = await apiClient.users.getUserByName(bot);

const tokenData = JSON.parse(await fs.readFile('tokens.json', 'utf8'));

authProvider.onRefresh(async (userId: string, newTokenData: AccessToken) => {
	await fs.writeFile('tokens.json', JSON.stringify(newTokenData, null, 4), 'utf-8');
});

authProvider.addUser(botUser as UserIdResolvable, tokenData, ['chat']);

const chatClient = new ChatClient({
	authProvider,
	channels: [ broadcaster ]
});

chatClient.connect();

chatClient.onAuthenticationSuccess(async () => {
	console.log('[INFO]: Chatbot connected and authenticated to Twitch chat.');
});

const listener = new EventSubWsListener({ apiClient });
listener.start();

const commandListener = listener.onChannelChatMessage(broadcasterUser!, botUser!, async (e) => {
	const text = e.messageText;

	switch (text) {
		case '!discord':
			chatClient.say(broadcaster, 'Servidor de Discord: https://discord.gg/s7EKyMm');
			break;
	}
});

const onSubListener = listener.onChannelSubscription(broadcasterUser!, async (e) => {
	const user = await e.getUser();
	chatClient.say(broadcaster, `¡Muchas gracias por suscribirte, @${user.name}!`);
});

const onStreamOnlineListener = listener.onStreamOnline(broadcasterUser!, async (e) => {
	const stream = await e.getStream();
	const userInfo = await e.getBroadcaster();

	const streamEmbed = new EmbedBuilder()
		.setColor('#7557ad')
		.setTitle(`${stream?.title}`)
		.setAuthor({
			name: `¡${userInfo.displayName} está en directo!`,
			iconURL: `${userInfo.profilePictureUrl}`
		})
		.addFields({
			name: 'Jugando ' + stream?.gameName,
			value: `[Ver directo](https://www.twitch.tv/${userInfo.name})`
		})
		.setURL(`https://www.twitch.tv/${userInfo.name}`)
		.setTimestamp();
	try {
		const game = await stream?.getGame();
		const gameThumbnail = game?.getBoxArtUrl(570, 760);
		if (gameThumbnail) {
			streamEmbed.setImage(gameThumbnail);
		}

		const channel = client.channels.cache.get(announcementChannel);

		if (channel && channel.type === ChannelType.GuildText) {
			await channel.send({ content: '@everyone', embeds: [ streamEmbed ] });
		} else {
			console.error('[ERROR]: Discord stream online embed failed to send');
		}

		console.log('[INFO]: Discord stream online embed sent.');
	} catch (err) {
		console.error('[ERROR]: Discord stream online embed failed to send', err);
	}
});

//const onRedemptionAdd = listener.onChannelRedemptionAdd(userId!, async(e) => {
//	e.rewardId
//});