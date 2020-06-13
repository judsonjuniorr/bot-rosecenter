import BetterSqlite3 from 'better-sqlite3';
import path from 'path';

interface User {
  id?: number;
  account_name?: string;
  discord_id?: string;
  ip?: string;
}

export default class WebDB {
  private db: BetterSqlite3.Database;

  constructor() {
    const dbFile = path.resolve(__dirname, 'verifiedPlayers.db');
    this.db = new BetterSqlite3(dbFile);

    this.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS Users ( id integer PRIMARY KEY, account_name varchar(255) NOT NULL UNIQUE, discord_id varchar(255) UNIQUE, ip varchar(255) )`,
      )
      .run();
  }

  public async findPrepare(account_name: string): Promise<User | undefined> {
    const query = this.db.prepare('SELECT * FROM Users WHERE account_name = ?');
    const user = await query.get(account_name.toLowerCase());

    return user;
  }

  public async prepareUser({ account_name, ip }: User): Promise<User> {
    const query = this.db.prepare(
      'INSERT INTO Users (account_name, ip) VALUES (?, ?)',
    );
    await query.run(account_name?.toLowerCase(), ip);

    return { account_name, ip };
  }

  public async userDiscordID({ ip, discord_id }: User): Promise<void> {
    console.log({ ip, discord_id });
    const query = this.db.prepare(
      `UPDATE Users SET discord_id = ? WHERE ip = ?`,
    );
    await query.run(discord_id, ip);
  }
}
