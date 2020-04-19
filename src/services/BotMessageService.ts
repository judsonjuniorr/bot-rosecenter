import { Client, Message } from 'discord.js';
import BotConfig from '../config/botConfig';
import CommandHandler from '../commands/CommandHandler';

class BotMessageService {
  private client: Client;

  private command: CommandHandler;

  constructor(client: Client) {
    this.client = client;
    this.command = new CommandHandler(client);
  }

  public execute(config: BotConfig): Promise<string> | void {
    const prefix = config.getPrefix();

    this.client.on('message', (message: Message) => {
      const isCommand = message.content
        .toLowerCase()
        .startsWith(prefix.toLowerCase());

      if (message.author.bot || !isCommand) {
        return null;
      }

      return this.command.execute(message, prefix);
    });
  }
}

export default BotMessageService;
