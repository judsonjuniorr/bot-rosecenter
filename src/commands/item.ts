import { Client } from 'discord.js';
import Command from './Command';
import CommandContext from '../util/CommandContext';
import Database from '../util/Database';
import EmbedMessage from '../util/EmbedMessage';

class ItemCommand implements Command {
  commandNames = ['item', 'i'];

  commandHelp = 'item <nome>';

  getHelpMessage(): string {
    return `Utilizado para obter informaçoes sobre um item específico.`;
  }

  async run(parsedUserCommand: CommandContext, bot: Client): Promise<void> {
    const { argsString, originalMessage } = parsedUserCommand;
    const timestamp = originalMessage.createdTimestamp;
    const { username, discriminator } = originalMessage.author;
    const userAvatar = originalMessage.author.avatarURL();

    const botAvatar = bot.user?.avatarURL() || undefined;
    const botName = bot.user?.username;

    originalMessage.delete();
    const embed = new EmbedMessage().generateEmbed({
      title: 'Pesquisa de item',
      color: '#ff8d3c',
      description: `Buscando no banco de dados pelo item:\n**${argsString}**`,
      author: {
        name: botName,
        url: 'http://rosecenter.provisorio.ws/',
        avatarURL: botAvatar,
      },
      timestamp,
      footer: {
        text: `Solicitado por ${username}#${discriminator}`,
        imageURL: userAvatar || undefined,
      },
    });
    const message = await originalMessage.reply(embed);

    try {
      const db = new Database();
      const item = await db.itemQuery(argsString);

      console.log(item);
    } catch (error) {
      message.edit('Ocorreu um erro na busca pelo item.');
      console.log(error);
    }
  }
}

export default ItemCommand;
