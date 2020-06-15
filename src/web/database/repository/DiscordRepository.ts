import { Client, Guild, Role } from 'discord.js';

export default class DiscordRepository {
  private bot: Client;

  private guild: Guild | undefined;

  private role: Role | undefined;

  constructor(discordBot: Client) {
    this.bot = discordBot;
    const guilds = this.bot.guilds.cache;
    const guildName =
      process.env.NODE_ENV === 'development'
        ? 'RoseCenter'
        : 'RoseOnBr - Oficial';
    this.guild = guilds.find(guild => guild.name === guildName);
    this.role = this.guild?.roles.cache.find(
      role => role.name === 'Player verificado',
    );
  }

  public async removePerms(userID: string): Promise<void> {
    const user = this.guild?.members.cache.find(
      discordUser => discordUser.id === userID,
    );

    if (user && this.role) await user.roles.remove(this.role);
  }

  public async addPerms(userID: string): Promise<void> {
    const user = this.guild?.members.cache.find(
      discordUser => discordUser.id === userID,
    );

    if (user && this.role) await user.roles.add(this.role);
  }
}
