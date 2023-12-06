import Keys from './keys.js';
import { promises as fs } from 'fs';
import { AccessToken, RefreshingAuthProvider } from '@twurple/auth';
import { Bot, createBotCommand } from '@twurple/easy-bot';

const clientId = Keys.clientId as string;
const clientSecret = Keys.clientSecret as string;
const tokenData = JSON.parse(await fs.readFile('tokens.json', 'utf8'));

const authProvider = new RefreshingAuthProvider({ clientId, clientSecret });

authProvider.onRefresh(async (userId: any, newTokenData: AccessToken) => {
	await fs.writeFile('tokens.json', JSON.stringify(newTokenData, null, 4), 'utf-8');
});

await authProvider.addUserForToken(tokenData, ['chat']);

const bot = new Bot({
	authProvider,
	channels: ['cupcakehy'],
	commands: [
		createBotCommand('discord', (params, { reply }) => {
			reply("Servidor de Discord: https://discord.gg/s7EKyMm");
		})
	]
});

bot.onSub(({ broadcasterName, userName }) => {
	bot.say(broadcasterName, `¡Muchas gracias por suscribirte, @${userName}!`);
});

bot.onConnect(() => {
	console.log("[INFO]: Chatbot connected to Twitch chat.");
});