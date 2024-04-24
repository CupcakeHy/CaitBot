import { ActivityType } from 'discord.js';
import { event, Events } from '../utils/index.js';
import Keys from '../keys.js';

export default event(Events.ClientReady, async ({ log }, client) => {
	client.user.setPresence({ activities: [{ name: 'Caitlyn64', type: ActivityType.Streaming, url: `https://www.twitch.tv/${Keys.channel}` }] });

	return log(`Discord bot logged in as ${client.user.username}.`);
});