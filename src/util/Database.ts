import sql from 'mysql';
import ItemQueryService from '../services/ItemQueryService';

interface ItemQuery {
  id: number;
  name: string;
  htg: string;
  descr: string;
  dropp: string;
  type: string;
  category?: string;
  subcat?: string;
}

class Database {
  private connection: sql.Connection;

  constructor() {
    this.connection = sql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }

  async itemQuery(name: string): Promise<ItemQuery | undefined> {
    await this.connection.connect();

    const query = new ItemQueryService(this.connection);
    const item = await query.execute(name);

    this.connection.end();
    return item;
  }
}

export default Database;
