import { Client } from 'discord.js';

class BotErrorService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public errorMonitor(): void {
    this.client.on('error', e => {
      console.error('Discord client error!', e);
    });
  }
}

export default BotErrorService;
