import { Client, PermissionString } from 'discord.js';
import CommandContext from '../util/CommandContext';

export default interface ICommand {
  readonly commandNames: string[];

  readonly commandHelp: string;

  readonly commandPermission?: PermissionString | undefined;

  /** Usage documentation. */
  getHelpMessage(commandPrefix?: string): string;

  /** Execute the command. */
  run(parsedUserCommand: CommandContext, bot?: Client): Promise<void>;
}
