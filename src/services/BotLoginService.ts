import { Client } from 'discord.js';

import BotConfig from '../config/botConfig';

class BotLoginService {
  private bot: Client;

  constructor(client: Client) {
    this.bot = client;
  }

  public execute(config: BotConfig): Promise<string> | void {
    const token = config.getToken();

    if (!token) {
      throw Error('Token not provided.');
    }

    this.bot.login(token);
  }
}

export default BotLoginService;
