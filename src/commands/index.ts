import { Command } from '../utils/index.js';
import info from './admin/info.js';
import rules from './admin/rules.js'
import ban from './moderator/ban.js';
import kick from './moderator/kick.js';
import timeout from './moderator/timeout.js';
import unban from './moderator/unban.js';

export default [
	info,
	rules,
	ban,
	unban,
	kick,
	timeout
] as Command[];
