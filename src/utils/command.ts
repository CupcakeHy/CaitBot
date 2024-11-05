import { LogMethod } from './index.js';
import type {
	Awaitable,
	Client,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	RESTPostAPIApplicationCommandsJSONBody,
	SlashCommandOptionsOnlyBuilder,
} from 'discord.js'

export interface CommandProps {
	interaction: ChatInputCommandInteraction<'cached'>,
	client: Client,
	log: LogMethod,
};

export type CommandCallback = (props: CommandProps) => Awaitable<unknown>;

export type CommandMeta =
	| SlashCommandBuilder
	| SlashCommandOptionsOnlyBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
	| RESTPostAPIApplicationCommandsJSONBody

export interface Command {
	meta: CommandMeta,
	callback: CommandCallback,
}

export function command(meta: CommandMeta, callback: CommandCallback): Command {
	return { meta, callback };
}
