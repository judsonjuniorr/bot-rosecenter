import Banned from '@web/database/entities/Banned';
import UsersRepository from './UsersRepository';

export default class BannedsRepository {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  public async isBanned(discordID: string): Promise<boolean> {
    const user = await Banned.findOne({ discordID });

    return !!user;
  }

  public async banDiscordID(discordID: string): Promise<void> {
    const users = await this.usersRepository.findByDiscordID(discordID);

    if (!users) {
      await Banned.create({ discordID });
    } else {
      await Promise.all(
        users.map(async user => {
          await Banned.create({ discordID, identifier: user.identifier });
        }),
      );
    }
  }

  public async unbanDiscordID(discordID: string): Promise<void> {
    await Banned.deleteMany({ discordID });
  }
}
