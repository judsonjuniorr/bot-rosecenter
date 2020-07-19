// import { MessageEmbed, Message } from 'discord.js';
// import sql from 'mysql';

// interface IRequest {
//   drops: string;
//   embed: MessageEmbed;
//   message: Message;
//   db: sql.Connection;
// }

// interface IMobResult {
//   name: string;
//   level: number;
// }

// class ItemDropService {
//   private mapDrops: Array<string | undefined | null>;

//   private mobDrops: Array<string | undefined | null>;

//   private embed: MessageEmbed;

//   private message: Message;

//   private connection: sql.Connection;

//   constructor({ drops, embed, db, message }: IRequest) {
//     const map: string[] = [];
//     const mob: string[] = [];

//     drops.split(';').map((dropId: string) => {
//       const idOnly = dropId.match(/\d+/g);
//       if (dropId.includes('M')) return map.push(`${idOnly}`);
//       return mob.push(`${idOnly}`);
//     });

//     this.embed = embed;
//     this.mapDrops = map;
//     this.mobDrops = mob;
//     this.connection = db;
//     this.message = message;
//   }

//   async execute(): Promise<void> {
//     const dropFieldIndex = this.embed.fields.findIndex(
//       field => field.name === 'Drops',
//     );
//     try {
//       const mapResult = await this.mapSearch();
//       const mobResult = await this.mobSearch();

//       const dropResult: string | string[] = [...mapResult, ...mobResult];

//       let results = dropResult.join('\n').substr(0, 979).split('\n');
//       if (dropResult.length > results.length) {
//         results = results.slice(0, -1);
//         results.push('\n⚠️ Confira mais clicando em detalhes');
//       }
//       this.embed.fields[dropFieldIndex].value = results.join('\n');
//     } catch (error) {
//       this.embed.fields[dropFieldIndex].value =
//         'Ocorreu um erro ao buscar os drops deste item\nConfira mais informações clicando em mais detalhes.';
//     }
//     await this.message.edit(this.embed);
//   }

//   private async mobSearch(): Promise<string[]> {
//     if (this.mobDrops.length <= 0) return [];

//     const mobs: Array<IMobResult> = [];

//     await Promise.all(
//       this.mobDrops.map(async mobId => {
//         const query = `SELECT name, level FROM mobs WHERE id = ${mobId} LIMIT 1`;
//         const mobRow: [] = await new Promise((resolve, reject) =>
//           this.connection.query(query, (e, result) => {
//             if (e) reject(e);
//             else resolve(result);
//           }),
//         );
//         if (mobRow.length > 0) {
//           const { name, level } = JSON.parse(JSON.stringify(mobRow))[0];
//           mobs.push({ name, level });
//         }
//       }),
//     );

//     mobs.sort((a, b) => a.level - b.level);
//     return mobs.map(mob => `🦖 Mob: **${mob.name}** | Nível: ${mob.level}`);
//   }

//   private async mapSearch(): Promise<string[]> {
//     if (this.mapDrops.length <= 0) return [];

//     const maps: string[] = [];

//     await Promise.all(
//       this.mapDrops.map(async mapId => {
//         const query = `SELECT M.name as map, P.name as planet FROM maps as M JOIN planets as P on M.planetID = P.id WHERE M.id = ${mapId} LIMIT 1`;
//         const mapRow: [] = await new Promise((resolve, reject) =>
//           this.connection.query(query, (e, result) => {
//             if (e) reject(e);
//             else resolve(result);
//           }),
//         );
//         if (mapRow.length > 0) {
//           const { map, planet } = JSON.parse(JSON.stringify(mapRow))[0];
//           maps.push(`🌎 Planeta: ${planet} | Mapa: **${map}**`);
//         }
//       }),
//     );

//     return maps;
//   }
// }

// export default ItemDropService;
