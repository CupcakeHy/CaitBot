import { getEnvVar } from "./utils/index.js";

export const Keys = {
	botToken: getEnvVar('BOT_TOKEN'),
	clientId: getEnvVar('CLIENT_ID'),
	clientSecret: getEnvVar('CLIENT_SECRET'),
	guild: getEnvVar('GUILD'),
	logsChannel: getEnvVar('LOGS_CHANNEL'),
	welcomeChannel: getEnvVar('WELCOME_CHANNEL'),
	announcementChannel: getEnvVar('ANNOUNCEMENT_CHANNEL'),
	forumChannel: getEnvVar('FORUM_CHANNEL'),
	roleId: getEnvVar('ROLE_ID'),
} as const;

export default Keys;