import { Client } from 'discord.js';

export interface ConfigInterface {
  name?: string;
  prefix?: string;
  token?: string;
  discordClient: Client;
}

class BotConfig {
  private name: string;

  private prefix: string;

  private token: string | undefined;

  private discordClient: Client;

  constructor({ name, prefix, token, discordClient }: ConfigInterface) {
    this.name = name || 'RoseCenter';
    this.prefix = prefix || 'rc.';
    this.token = token || undefined;
    this.discordClient = discordClient;
  }

  public getName(): string {
    return this.name;
  }

  public getPrefix(): string {
    return this.prefix;
  }

  public getToken(): string | undefined {
    return this.token;
  }
}

export default BotConfig;
