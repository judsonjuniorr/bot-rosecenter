import { Message, Client } from 'discord.js';
import ICommand from './Command';
import CommandContext from '../util/CommandContext';

// Comandos
import HelpCommand from './help';
import BanCommand from './ban';
import UnbanCommand from './unban';
// import ItemCommand from './item';
// import MobCommand from './mob';

class CommandHandler {
  private commands: ICommand[] = [];

  private bot: Client;

  constructor(bot: Client) {
    const commandClasses = [BanCommand, UnbanCommand];
    this.bot = bot;

    this.commands = commandClasses.map(CommandClass => new CommandClass());
    this.commands.push(new HelpCommand(this.commands, bot));
  }

  public async execute(message: Message, prefix: string): Promise<void> {
    const commandContext = new CommandContext(message, prefix);
    const matchedCommand = this.commands.find(command =>
      command.commandNames.includes(commandContext.parsedCommandName),
    );
    if (!matchedCommand) {
      await message.reply(`Comando não encontrado. Digite **${prefix}help**`);
    } else {
      await matchedCommand.run(commandContext, this.bot);
    }
  }
}

export default CommandHandler;
