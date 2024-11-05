import config from 'config';
import { REST, Routes, APIUser } from 'discord.js';
import commands from '../commands/index.js';

const botToken = config.get('discord.bot.token') as string;
const guild = config.get('discord.guild.id') as string;

const body = commands.map(cmd => cmd.meta);

const rest = new REST({ version: '10' }).setToken(botToken);

async function main() {
	const currentUser = await rest.get(Routes.user()) as APIUser;

	const endpoint = process.env.NODE_ENV === 'production'
		? Routes.applicationCommands(currentUser.id)
		: Routes.applicationGuildCommands(currentUser.id, guild);

	await rest.put(endpoint, { body });

	return currentUser;
}

main()
	.then(user => {
		const tag = `${user.username}#${user.discriminator}`;
		const response = process.env.NODE_ENV === 'production'
			? `Deployed ${commands.length} commands globally as ${tag}.`
			: `Deployed ${commands.length} commands to ${guild} as ${tag}.`;

		console.log(response);
	})
	.catch(console.error);
