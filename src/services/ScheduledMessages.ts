import cron from 'node-cron';
import { Client, TextChannel, Channel } from 'discord.js';

interface ScheduleConfig {
  time: string;
  channel: Channel;
  message: string;
}

class ScheduledMessages {
  private client: Client;

  private channels: string[] = [];

  constructor(client: Client) {
    this.client = client;
    this.channels.push('630536497807884302'); // geral RoseOn
    // this.channels.push('698959005833494579'); // staff rosecenter RoseOn
    // this.channels.push('699698186734010471'); // geral Server Teste
  }

  public iz(): void {
    this.channels.map(channelToSend => {
      const channel = this.client.channels.cache.find(
        c => c.id === channelToSend,
      );

      if (!channel) return undefined;

      return this.schedule({
        time: '0 20 * * *',
        channel,
        message:
          '@everyone 🏅 __**INVASÃO DE ZANT**__\n\nAS INSCRIÇÕES JÁ ESTÃO LIBERADAS!!\nNPC: **Port** em *Junon Polis*',
      });
    });
  }

  public factionWar(): void {
    this.channels.map(channelToSend => {
      const channel = this.client.channels.cache.find(
        c => c.id === channelToSend,
      );

      if (!channel) return undefined;

      // Inscrições
      return this.schedule({
        time: '30 21 * * *',
        channel,
        message:
          '@everyone 🏆 __**GUERRA DE FACÇÕES**__\n\nAS INSCRIÇÕES JÁ ESTÃO LIBERADAS!!\nNPC: **Port** em *Junon Polis*\n\nO portal irá se abrir as **22h**',
      });
    });
  }

  public dragonHunt(): void {
    this.channels.map(channelToSend => {
      const channel = this.client.channels.cache.find(
        c => c.id === channelToSend,
      );

      if (!channel) return undefined;

      const schedules = ['28 14 * * *', '28 20 * * *'];

      return schedules.map(time => {
        // Inscrições
        return this.schedule({
          time,
          channel,
          message:
            '@everyone 🐉 __**CAÇA AO DRAGÃO**__\n\nAS INSCRIÇÕES JÁ ESTÃO LIBERADAS!!\nNPC: **Magalen** em *Junon Polis*',
        });
      });
    });
  }

  private schedule({ time, channel, message }: ScheduleConfig): void {
    cron.schedule(
      time,
      () => {
        (channel as TextChannel).send(message);
      },
      { timezone: 'America/Sao_Paulo' },
    );
  }
}

export default ScheduledMessages;
