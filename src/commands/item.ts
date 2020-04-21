import { Client } from 'discord.js';
import Command from './Command';

import CommandContext from '../util/CommandContext';
import Database from '../util/Database';
import EmbedMessage from '../util/EmbedMessage';
import ItemQueryService from '../services/ItemQueryService';
import ItemDropService from '../services/ItemDropService';
import Logger from '../util/Logger';

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

    const log = Logger.item({
      request: `${username}#${discriminator}`,
      query: argsString,
    });

    log.info(`REQUEST`);

    await originalMessage.delete();
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

    const db = new Database().db();
    await db.connect();
    try {
      const itemDB = await new ItemQueryService(db).execute(argsString);

      if (!itemDB) {
        const notFoundEmbed = new EmbedMessage().generateEmbed({
          title: 'Não encontrado',
          description: `Desculpe mas o item **${argsString}** não foi encontrado no nosso banco de dados.`,
          color: '#ff6961',
          author: {
            name: botName,
            url: 'http://rosecenter.provisorio.ws/',
            avatarURL: botAvatar,
          },
          footer: {
            text: `Solicitado por ${username}#${discriminator}`,
            imageURL: userAvatar || undefined,
          },
        });
        await message.edit(notFoundEmbed);
        log.warn('NOT FOUND');
      } else {
        const howToGet = itemDB.htg.split(',').map(htg => {
          switch (htg) {
            case '1':
              return 'Drop';

            case '2':
              return 'Craft';

            case '3':
              return 'Vendido em NPC';

            case '4':
              return 'Item Mall';
            default:
              return null;
          }
        });

        const itemEmbed = new EmbedMessage().generateEmbed({
          title: itemDB.name,
          color: '#3e69fe',
          description: itemDB.descr,
          thumbnailURL: `http://rosecenter.provisorio.ws/item/ico/${itemDB.id}`,
          author: {
            name: 'Mais detalhes do item',
            url: `http://rosecenter.provisorio.ws/item/${itemDB.id}`,
          },
          timestamp,
          footer: {
            text: `Solicitado por ${username}#${discriminator}`,
            imageURL: userAvatar || undefined,
          },
        });

        if (howToGet.length > 0)
          itemEmbed.addField('Obtido por', howToGet.join(' | '), false);

        itemEmbed.addField('Tipo', itemDB.type, true);
        if (itemDB.category)
          itemEmbed.addField('Categoria', itemDB.category, true);

        if (itemDB.subcat)
          itemEmbed.addField('Sub-Categoria', itemDB.subcat, true);

        if (howToGet.includes('Drop'))
          itemEmbed.addField('Drops', 'Carregando, aguarde...', false);

        await message.edit(itemEmbed);

        if (howToGet.includes('Drop')) {
          const dropService = new ItemDropService({
            drops: itemDB.dropp,
            embed: itemEmbed,
            db,
            message,
          });
          await dropService.execute();
        }

        log.info('SEND');
      }
    } catch (error) {
      const errorEmbed = new EmbedMessage().generateEmbed({
        title: 'Erro ao buscar o item',
        description: `Desculpe mas não foi possível pesquisar o item **${argsString}** agora, tente mais tarde ou relate o erro.`,
        author: {
          name: botName,
          url: 'http://rosecenter.provisorio.ws/',
          avatarURL: botAvatar,
        },
        color: '#ff6961',
        footer: {
          text: `Solicitado por ${username}#${discriminator}`,
          imageURL: userAvatar || undefined,
        },
      });

      message.edit(errorEmbed);
      log.error('ERROR');
    }
    await db.end();
  }
}

export default ItemCommand;
