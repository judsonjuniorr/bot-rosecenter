// import sql from 'mysql';

// interface ItemQuery {
//   id: number;
//   name: string;
//   htg: string; // 1 - dropado; 2 - craft; 3 - Vendido em NPC; 4 - Item Mall
//   descr: string;
//   dropp: string;
//   type: string;
//   category?: string;
//   subcat?: string;
// }

// class MobQueryService {
//   private connection: sql.Connection;

//   constructor(connection: sql.Connection) {
//     this.connection = connection;
//   }

//   async itemQuery(name: string): Promise<ItemQuery | undefined> {
//     await this.connection.connect();

//     const item = await this.execute(name);

//     await this.connection.end();
//     return item;
//   }

//   async execute(name: string): Promise<ItemQuery | undefined> {
//     try {
//       const query = `SELECT name, mapID FROM mobs WHERE name LIKE '%${name}%' LIMIT 1`;

//       const querySQL: [] = await new Promise((resolve, reject) =>
//         this.connection.query(query, (e, result) => {
//           if (e) reject(e);
//           else resolve(result);
//         }),
//       );

//       if (querySQL.length > 0) return JSON.parse(JSON.stringify(querySQL))[0];
//     } catch (error) {
//       throw Error('Falha na busca pelo item');
//     }
//     return undefined;
//   }
// }

// export default MobQueryService;
