import { Client } from 'discord.js';
import path from 'path';

import BotConfig from '../config/botConfig';

import ScheduleMessages from './ScheduledMessages';

class BotReadyService {
  private bot: Client;

  constructor(client: Client) {
    this.bot = client;
  }

  public async execute(config: BotConfig): Promise<void> {
    this.bot.on('ready', async () => {
      const { user, guilds } = this.bot;
      const guildSize = guilds.cache.size;
      const env = process.env.NODE_ENV;

      console.log(`🚀 Conectado
        Usuário ${user?.tag}
        ${guildSize} servidor${guildSize !== 1 ? 'es' : ''}
        Prefixo: ${config.getPrefix()}`);

      await user?.setUsername(process.env.BOT_NAME || 'RoseCenter');
      await user?.setStatus('online');

      const activitiesList = ['Rose Online Brasil', 'http://roseonline.com.br'];
      setInterval(async () => {
        const index = Math.floor(
          Math.random() * (activitiesList.length - 1) + 1,
        );
        await user?.setActivity(activitiesList[index], { type: 'PLAYING' });
      }, 10000);

      if (!user?.avatar) {
        await user?.setAvatar(
          path.resolve(
            __dirname,
            'assets',
            env === 'development' ? 'devLogo.png' : 'logo.png',
          ),
        );
      }

      const scheduleMessage = new ScheduleMessages(this.bot);
      scheduleMessage.iz();
      scheduleMessage.factionWar();
      scheduleMessage.dragonHunt();
      scheduleMessage.jmv();
    });
  }
}

export default BotReadyService;
