import { Message } from 'discord.js';

class CommandContext {
  readonly parsedCommandName: string;

  readonly args: string[];

  readonly argsString: string;

  readonly originalMessage: Message;

  readonly commandPrefix: string;

  constructor(message: Message, prefix: string) {
    this.commandPrefix = prefix;
    const splitMessage = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    this.parsedCommandName = splitMessage?.shift()?.toLowerCase() || '';
    this.args = splitMessage;
    this.argsString = splitMessage.join(' ');
    this.originalMessage = message;
  }
}

export default CommandContext;
