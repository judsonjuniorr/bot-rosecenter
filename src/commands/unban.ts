import { Client } from 'discord.js';

import BannedsRepository from '@web/database/repository/BannedRepository';
import ICommand from './Command';
import CommandContext from '../util/CommandContext';

export default class BanCommand implements ICommand {
  commandNames = ['unban'];

  commandHelp = 'unban usuario';

  commandPermission: any = 'BAN_MEMBERS';

  private unbanGifs = [
    'https://tenor.com/view/freedom-braveheart-gif-4392571',
    'https://tenor.com/view/freedom-gif-5757773',
    'https://tenor.com/view/genie-free-me-freedom-aladdin-youve-been-set-free-gif-12118740',
    'https://tenor.com/view/bts-freedom-im-free-running-gif-13472805',
    'https://tenor.com/view/to-freedom-freedom-cheers-weekend-free-gif-12552960',
    'https://tenor.com/view/im-free-gif-5607921',
    'https://tenor.com/view/freedom-futurama-gif-5757775',
  ];

  getHelpMessage(): string {
    return `Utilizado para desbloquear um usuário de se colocar como jogador verificado.`;
  }

  async run(parsedUserCommand: CommandContext, bot: Client): Promise<void> {
    const { args, originalMessage } = parsedUserCommand;

    const { author } = originalMessage;
    const guildMember = await originalMessage.guild?.member(author);

    try {
      if (guildMember?.hasPermission('BAN_MEMBERS')) {
        const unbanId = this.getUserID(args[0]);
        const bannedsRepository = new BannedsRepository();

        const isBanned = await bannedsRepository.isBanned(unbanId);

        if (isBanned) {
          await bannedsRepository.unbanDiscordID(unbanId);

          await originalMessage.delete();
          await originalMessage.channel.send(`${args[0]} ${
            this.unbanGifs[Math.floor(Math.random() * this.unbanGifs.length)]
          }
          `);
        } else await originalMessage.reply('Membro não se encontra banido!');
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
