import sql from 'mysql';

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

  db(): sql.Connection {
    // Add handlers.
    // this.addDisconnectHandler();

    // this.connection.connect();
    // console.log('Connected to database.');
    return this.connection;
  }

  private addDisconnectHandler(): void {
    this.connection.on('error', error => {
      if (error instanceof Error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error(error.stack);
          console.log('Lost connection. Reconnecting...');

          this.db();
        } else if (error.fatal) {
          throw error;
        }
      }
    });
  }
}

export default Database;
