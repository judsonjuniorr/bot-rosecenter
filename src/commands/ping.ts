import Command from './Command';
import CommandContext from '../util/CommandContext';
import EmbedMessage from '../util/EmbedMessage';

class PingCommand implements Command {
  commandNames = ['ping', 'hello'];

  commandHelp = 'ping';

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}greet to get a greeting.`;
  }

  async run(parsedUserCommand: CommandContext): Promise<void> {
    const embed = new EmbedMessage().generateEmbed({});
    await parsedUserCommand.originalMessage.reply(embed);
  }
}

export default PingCommand;
