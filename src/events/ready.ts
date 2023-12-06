import { ActivityType } from 'discord.js';
import { event, Events } from '../utils/index.js';

export default event(Events.ClientReady, async ({ log }, client) => {
	client.user.setPresence({ activities: [{ name: 'CupcakeHy', type: ActivityType.Streaming, url: "https://www.twitch.tv/cupcakehy" }] });

	return log(`Discord bot logged in as ${client.user.username}.`);
});