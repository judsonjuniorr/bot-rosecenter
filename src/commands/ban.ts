import { Client } from 'discord.js';

import DiscordRepository from '@web/database/repository/DiscordRepository';

import BannedsRepository from '@web/database/repository/BannedRepository';
import ICommand from './Command';
import CommandContext from '../util/CommandContext';

export default class BanCommand implements ICommand {
  commandNames = ['ban'];

  commandHelp = 'ban usuario';

  commandPermission: any = 'BAN_MEMBERS';

  private banGifs = [
    'https://tenor.com/view/ban-banned-gif-8540512',
    'https://tenor.com/view/ban-banned-gif-8540510',
    'https://tenor.com/view/ban-oprah-gif-10045949',
    'https://tenor.com/view/thor-banhammer-discord-banned-banned-by-admin-gif-12646581',
    'https://tenor.com/view/ban-banned-gif-8540509',
    'https://tenor.com/view/blob-banned-ban-hammer-blob-ban-emoji-gif-16021044',
    'https://tenor.com/view/ban-hammer-avengers-endgame-captain-america-mjolnir-gif-14678194',
    'https://tenor.com/view/ban-hammer-ban-hammer-thor-mjolner-gif-17447371',
    'https://tenor.com/view/star-wars-banhammer-moderator-ban-discord-gif-17302394',
  ];

  getHelpMessage(): string {
    return `Utilizado para bloquear um usuário de se colocar como jogador verificado.`;
  }

  async run(parsedUserCommand: CommandContext, bot: Client): Promise<void> {
    const { args, originalMessage } = parsedUserCommand;

    const { author } = originalMessage;
    const guildMember = await originalMessage.guild?.member(author);

    try {
      if (guildMember?.hasPermission('BAN_MEMBERS')) {
        const banId = this.getUserID(args[0]);
        const bannedsRepository = new BannedsRepository();

        const isBanned = await bannedsRepository.isBanned(banId);

        if (!isBanned) {
          await bannedsRepository.banDiscordID(banId);

          const discordRepository = new DiscordRepository(bot);
          await discordRepository.removePerms(banId);

          await originalMessage.delete();
          await originalMessage.channel.send(`${args[0]} ${
            this.banGifs[Math.floor(Math.random() * this.banGifs.length)]
          }
          `);

          // const mentioned = await originalMessage.mentions.members?.first();
        } else await originalMessage.reply('Membro já se encontra banido!');
      } else throw Error('Does not have perms');
    } catch (error) {
      await originalMessage.react('👎');
    }
  }

  private getUserID(mention: string): string {
    let userMention = mention;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      userMention = mention.slice(2, -1);
      if (userMention.startsWith('!')) userMention = userMention.slice(1);
    }
    return userMention;
  }
}
