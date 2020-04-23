import Discord from 'discord.js';
import dotenv from 'dotenv';

import BotConfig from './config/botConfig';

import BotLoginService from './services/BotLoginService';
import BotReadyService from './services/BotReadyService';
import BotErrorService from './services/BotErrorService';
import BotMessageService from './services/BotMessageService';

dotenv.config();
process.setMaxListeners(0);

class Bot {
  private client = new Discord.Client();

  private Botcfg = new BotConfig({
    name: process.env.BOT_NAME,
    prefix: process.env.BOT_PREFIX,
    token: process.env.BOT_TOKEN,
    discordClient: this.client,
  });

  public login(): void {
    try {
      // Login
      new BotLoginService(this.client).execute(this.Botcfg);

      // Ready
      new BotReadyService(this.client).execute(this.Botcfg);

      // Message
      new BotMessageService(this.client).execute(this.Botcfg);

      // Error
      new BotErrorService(this.client).errorMonitor();
    } catch (error) {
      console.error(error);
    }
  }
}

export default Bot;
