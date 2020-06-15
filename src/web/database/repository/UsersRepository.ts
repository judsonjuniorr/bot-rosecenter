import User, { IUser } from '@web/database/entities/User';

interface ICreateUser {
  identifier: string;
  ip: string;
}

interface IUpdateIP {
  identifier: string;
  ip: string;
}

interface IUpdateDiscord {
  identifier: string;
  discordID: string;
}

export default class UsersRepository {
  public async findByIdentifier(identifier: string): Promise<IUser | null> {
    const search = await User.findOne({ identifier });

    return search;
  }

  public async createUser({ identifier, ip }: ICreateUser): Promise<IUser> {
    const user = await User.create({ identifier, ip });
    return user;
  }

  public async updateIP({ identifier, ip }: IUpdateIP): Promise<IUser | null> {
    const user = await User.findOneAndUpdate(
      { identifier },
      { $set: { ip } },
      { sort: { createdAt: -1 } },
    );

    return user;
  }

  public async findByIP(ip: string): Promise<IUser | null> {
    const user = await User.findOne({ ip }).sort({ createdAt: -1 });

    return user;
  }

  public async findByDiscordID(discordID: string): Promise<IUser[]> {
    const users = await User.find({ discordID });

    return users;
  }

  public async updateDiscordID({
    identifier,
    discordID,
  }: IUpdateDiscord): Promise<IUser> {
    const user = await User.updateOne({ identifier }, { discordID });

    return user;
  }
}
