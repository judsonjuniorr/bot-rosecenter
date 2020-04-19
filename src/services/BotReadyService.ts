import { Client } from 'discord.js';
import path from 'path';

import BotConfig from '../config/botConfig';

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
      await user?.setActivity('Rose Online Brasil', { type: 'PLAYING' });

      if (!user?.avatar) {
        await user?.setAvatar(
          path.resolve(
            __dirname,
            'assets',
            env === 'development' ? 'devLogo.png' : 'logo.png',
          ),
        );
      }
    });
  }
}

export default BotReadyService;
