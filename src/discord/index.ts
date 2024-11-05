import config from 'config';
import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "../utils/event.js";
import Events from '../events/index.js';

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});

registerEvents(client, Events);

client.login(config.get('discord.bot.token'))
	.catch((err) => {
		console.error('[ERROR]: Could not login Discord client', err);
		process.exit(1);
	});