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
    // this.channels.push('630536497807884302'); // geral RoseOn
    this.channels.push('698959005833494579'); // staff rosecenter RoseOn
    this.channels.push('699698186734010471'); // geral Server Teste
  }

  public iz(): void {
    this.channels.map(channelToSend => {
      const channel = this.client.channels.cache.find(
        c => c.id === channelToSend,
      );

      if (!channel) return undefined;

      this.schedule({
        time: '20 0 * * *',
        channel,
        message:
          '@everyone BOOOOOOORA QUE VAI COMEÇAR A **INVASÃO DE ZANT**!!\n CORRE LOGO QUE AS INSCRIÇÕES JÁ ESTÃO LIBERADAS!!\n\nNPC de Inscrição: *Port* em *Junon Polis*',
      });

      // Ultimo min
      this.schedule({
        time: '9 20 * * *',
        channel,
        message:
          '@everyone AS INSCRIÇÕES PARA A **INVASÃO DE ZANT** SE ENCERRAM EM **1min**!!\nNÃO FIQUE DE FORA DESSA',
      });

      // Abertura do portal
      this.schedule({
        time: '13 20 * * *',
        channel,
        message: '@everyone O PORTAL PARA A **INVASÃO DE ZANT** SE ABRIU!!',
      });

      return true;
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
          '@everyone BOOOOOOORA QUE VAI COMEÇAR A **GUERRA DE FACÇÕES**!!\n CORRE LOGO QUE AS INSCRIÇÕES JÁ ESTÃO LIBERADAS!!',
      });

      // Ultimo min
      this.schedule({
        time: '59 21 * * *',
        channel,
        message:
          '@everyone AS INSCRIÇÕES PARA A **FACTION WAR** SE ENCERRAM EM **1min**!!\nNÃO FIQUE DE FORA DESSA',
      });

      // Abertura do portal
      this.schedule({
        time: '0 22 * * *',
        channel,
        message:
          '@everyone UM PORTAL PARA A **FACTION WAR** SE ABRIU EM JUNON!!\nCHEGOU A HORA DE VENCER ESSA GUERRA!',
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

      const schedules = [
        {
          subscription: '28 14 * * *',
          lastMinute: '37 14 * * *',
          start: '38 14 * * *',
        },
        {
          subscription: '28 20 * * *',
          lastMinute: '37 20 * * *',
          start: '38 20 * * *',
        },
      ];

      schedules.map(time => {
        // Inscrições
        this.schedule({
          time: time.subscription,
          channel,
          message:
            '@everyone BOOOOOOORA QUE VAI COMEÇAR A **CAÇA AO DRAGÃO**!!\n CORRE LOGO QUE AS INSCRIÇÕES JÁ ESTÃO LIBERADAS!!\n\nNPC de Inscrição: *Magalen* em *Junon*',
        });

        // Ultimo min
        this.schedule({
          time: time.lastMinute,
          channel,
          message:
            '@everyone AS INSCRIÇÕES PARA A **CAÇA AO DRAGÃO** SE ENCERRAM EM **1min**!!\nNÃO FIQUE DE FORA DESSA',
        });

        // Abertura do portal
        this.schedule({
          time: time.start,
          channel,
          message:
            '@everyone UM PORTAL PARA A **CAÇA AO DRAGÃO** SE ABRIU!!\nCHEGOU A HORA DE VENCER ESSA GUERRA!',
        });

        return true;
      });
      return true;
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
