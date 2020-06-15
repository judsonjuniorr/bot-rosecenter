import { Client } from 'discord.js';

import ICommand from './Command';
import CommandContext from '../util/CommandContext';
import EmbedMessage from '../util/EmbedMessage';

class HelpCommand implements ICommand {
  commandNames = ['help', 'halp', 'hlep'];

  commandHelp = 'help (comando desejado)';

  private commands: ICommand[];

  private bot: Client;

  constructor(commands: ICommand[], bot: Client) {
    this.commands = commands;
    this.bot = bot;
  }

  async run(commandContext: CommandContext): Promise<void> {
    const { commandPrefix, originalMessage } = commandContext;
    const botAvatar = this.bot.user?.avatarURL();
    const botName = this.bot.user?.username;

    if (commandContext.args.length === 0) {
      // Nenhum comando inserido ao help, listar todos

      // Gerar embed
      const embed = new EmbedMessage().generateEmbed({
        author: { name: botName, avatarURL: botAvatar || undefined },
      });
      const guildMember = await originalMessage.guild?.member(
        originalMessage.author,
      );

      // Adicionar comandos ao embed
      let commandList = `Aqui se encontra uma lista de comandos que você poderá utilizar.\n\n`;
      if (this.commands.length > 0)
        this.commands.map((command, index) => {
          if (
            (command.commandPermission &&
              guildMember?.hasPermission(command.commandPermission)) ||
            !command.commandPermission
          ) {
            commandList += `**${
              commandPrefix + command.commandHelp
            }** - *${command.getHelpMessage()}*`;
          }

          if (index + 1 !== this.commands.length) commandList += '\n';
          return commandList;
        });
      else commandList += '**Nenhum comando cadastrado.**';
      embed.addField('Comandos', commandList);

      embed.addField(
        'Ajuda',
        'Se você deseja **contactar o desenvolvedor**, **relatar um problema**, **sugerir uma função**, entre em contato pelo discord **HΞRØw#2096**.',
      );

      embed.addField(
        'Discord oficial Rose Online',
        'https://discord.gg/teyJu4y',
      );

      try {
        const dm = await guildMember?.createDM();
        await dm?.send(embed);
        await originalMessage.react('🇩');
        await originalMessage.react('🇲');
      } catch (error) {
        await originalMessage.reply(
          'Ative as mensagens diretas para receber os comandos',
        );
      }
    } else {
      const matchedCommand = this.commands.find(command =>
        command.commandNames.includes(commandContext.args[0]),
      );

      if (!matchedCommand) {
        await commandContext.originalMessage.reply(
          `Desculpe mas não reconheci esse comando, digite ${commandPrefix}help e conheça os comandos disponíveis`,
        );
        throw Error('Comando não reconhecido.');
      }
      if (this.commands.includes(matchedCommand)) {
        await commandContext.originalMessage.reply(
          this.buildHelpMessageForCommand(matchedCommand, commandContext),
        );
      }
    }
  }

  private buildHelpMessageForCommand(
    command: ICommand,
    context: CommandContext,
  ): string {
    return `${command.getHelpMessage(
      context.commandPrefix,
    )}\nAliases do comando: ${command.commandNames.join(', ')}`;
  }

  getHelpMessage(): string {
    return 'Para saber mais informações sobre um comando específico.';
  }
}

export default HelpCommand;
