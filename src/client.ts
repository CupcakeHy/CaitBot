import { Client, GatewayIntentBits, Options } from 'discord.js';
import { AppTokenAuthProvider } from '@twurple/auth';
import { CronJob } from 'cron';
import Events from './events/index.js';
import Keys from './keys.js';
import {
	getStreamStatus,
	postStreamEmbed,
	registerEvents,
} from './utils/index.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});

registerEvents(client, Events);

client.login(Keys.botToken)
	.catch((err) => {
		console.error("[ERROR]:", err);
		process.exit(1);
	});

const authProvider = new AppTokenAuthProvider(
	Keys.clientId,
	Keys.clientSecret
);

var appAccessToken = await authProvider.getAppAccessToken();

var isStreamOnline = false;

const job = CronJob.from({
	cronTime: '0 * * * * *',
	onTick: async function () {
		try {
			const streamData = await getStreamStatus(appAccessToken);

			if (streamData) {
				console.log('received stream data');
				if (!isStreamOnline) {
					const channel = client.channels.cache.get(Keys.announcementChannel);

					if (channel) {
						postStreamEmbed(client, streamData, channel, appAccessToken);
						isStreamOnline = true;
					}
				}
			} else {
				isStreamOnline = false;
			}
		} catch (err) {
			console.error("[ERROR]:", err);
		}
	},
	start: true,
	timeZone: 'Europe/Madrid'
});