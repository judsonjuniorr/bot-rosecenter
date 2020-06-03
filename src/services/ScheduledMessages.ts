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
      this.schedule({
        time: '30 21 * * *',
        channel,
        message:
          "@everyone 🏆 __**GUERRA DE FACÇÕES**__ 🏆\n\nAs inscrições já estão liberadas nos npc's abaixo:\n**Ferrell Guild** ❯ *Arothel*\n**Righteous Crusader** ❯ *Gawain*\n**Junon Order** ❯ *Raw*\n**Arumic** ❯ *Chester*\n\nO portal irá se abrir as **22h**",
      });

      this.schedule({
        time: '50 21 * * *',
        channel,
        message:
          "@everyone 🏆 __**GUERRA DE FACÇÕES**__ 🏆\n\n**FALTAM 10 MINUTOS PARA ENCERRAR AS INSCRIÇÕES!**\n\nInscrições nos npc's abaixo:\n**Ferrell Guild** ❯ *Arothel*\n**Righteous Crusader** ❯ *Gawain*\n**Junon Order** ❯ *Raw*\n**Arumic** ❯ *Chester*\n\nO portal irá se abrir as **22h**",
      });

      return true;
    });
  }

  public jmv(): void {
    this.channels.map(channelToSend => {
      const channel = this.client.channels.cache.find(
        c => c.id === channelToSend,
      );

      if (!channel) return undefined;

      // Inscrições
      this.schedule({
        time: '45 22 * * *',
        channel,
        message:
          '@everyone 🏆 __**JMV**__ 🏆\n\nAS INSCRIÇÕES JÁ ESTÃO LIBERADAS!!\nNPC: **Port** em *Junon Polis*',
      });

      return true;
    });
  }

  public dragonHunt(): void {
    this.channels.map(channelToSend => {
      const channel = this.client.channels.cache.find(
        c => c.id === channelToSend,
      );

      if (!channel) return undefined;

      const schedules = ['00 13 * * *', '28 19 * * *'];

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
