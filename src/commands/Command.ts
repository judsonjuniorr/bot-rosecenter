import { Client } from 'discord.js';
import CommandContext from '../util/CommandContext';

export default interface Command {
  readonly commandNames: string[];

  readonly commandHelp: string;

  /** Usage documentation. */
  getHelpMessage(commandPrefix?: string): string;

  /** Execute the command. */
  run(parsedUserCommand: CommandContext, bot?: Client): Promise<void>;
}
