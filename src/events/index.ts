import { Event } from '../utils/index.js';
import ready from './ready.js';
import guildMemberAdd from './guildMemberAdd.js'
import interactionCreate from './interactionCreate.js';

export default [
	ready,
	guildMemberAdd,
	interactionCreate
] as Event[];