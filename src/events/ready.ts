import config from 'config';
import { ActivityType } from 'discord.js';
import { event, Events } from '../utils/index.js';

const channel = config.get('twitch.broadcaster')

export default event(Events.ClientReady, async ({ log }, client) => {
	client.user.setPresence({ activities: [{ name: 'Caitlyn64', type: ActivityType.Streaming, url: `https://www.twitch.tv/${channel}` }] });

	return log(`Discord bot logged in as ${client.user.username}.`);
});