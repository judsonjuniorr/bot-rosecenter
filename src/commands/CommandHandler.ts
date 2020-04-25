import { Message, Client, TextChannel } from 'discord.js';
import Command from './Command';
import CommandContext from '../util/CommandContext';

// Comandos
import HelpCommand from './help';
import ItemCommand from './item';

class CommandHandler {
  private commands: Command[];

  private bot: Client;

  constructor(bot: Client) {
    const commandClasses = [ItemCommand];
    this.bot = bot;

    this.commands = commandClasses.map(CommandClass => new CommandClass());
    this.commands.push(new HelpCommand(this.commands, bot));
  }

  public async execute(message: Message, prefix: string): Promise<void> {
    const commandContext = new CommandContext(message, prefix);

    const matchedCommand = this.commands.find(command =>
      command.commandNames.includes(commandContext.parsedCommandName),
    );

    const { name, guild } = commandContext.originalMessage
      .channel as TextChannel;
    const allowedChannels = ['rosecenter', 'rc-staff'];
    if (!allowedChannels.includes(name) && guild.id !== '699698186734010468')
      return;

    if (!matchedCommand) {
      await message.reply(`Comando não encontrado. Digite **${prefix}help**`);
    } else {
      await matchedCommand.run(commandContext, this.bot);
    }
  }
}

export default CommandHandler;
