// import { Client } from 'discord.js';
// import Command from './Command';

// import CommandContext from '../util/CommandContext';
// import Database from '../util/Database';
// import EmbedMessage from '../util/EmbedMessage';
// import MobQueryService from '../services/MobQueryService';
// import Logger from '../util/Logger';

// class MobCommand implements Command {
//   commandNames = ['mob', 'm'];

//   commandHelp = 'mob <nome>';

//   getHelpMessage(): string {
//     return `Utilizado para obter informaçoes sobre um mob específico.`;
//   }

//   async run(parsedUserCommand: CommandContext, bot: Client): Promise<void> {
//     const { argsString, originalMessage } = parsedUserCommand;
//     const timestamp = originalMessage.createdTimestamp;
//     const { username, discriminator } = originalMessage.author;
//     const userAvatar = originalMessage.author.avatarURL();

//     const botAvatar = bot.user?.avatarURL() || undefined;
//     const botName = bot.user?.username;

//     const log = Logger.mob({
//       request: `${username}#${discriminator}`,
//       query: argsString,
//     });

//     log.info(`REQUEST`);

//     await originalMessage.delete();
//     const embed = new EmbedMessage().generateEmbed({
//       title: 'Pesquisa de mob',
//       color: '#ff8d3c',
//       description: `Buscando no banco de dados pelo mob:\n**${argsString}**`,
//       author: {
//         name: botName,
//         url: 'http://rosecenter.provisorio.ws/',
//         avatarURL: botAvatar,
//       },
//       timestamp,
//       footer: {
//         text: `Solicitado por ${username}#${discriminator}`,
//         imageURL: userAvatar || undefined,
//       },
//     });
//     const message = await originalMessage.reply(embed);

//     const db = new Database().db();
//     await db.connect();
//     try {
//       const mobInfo = await new MobQueryService(db).execute(argsString);

//       if (!mobInfo) {
//         const notFoundEmbed = new EmbedMessage().generateEmbed({
//           title: 'Não encontrado',
//           description: `Desculpe mas o mob **${argsString}** não foi encontrado no nosso banco de dados.`,
//           color: '#ff6961',
//           author: {
//             name: botName,
//             url: 'http://rosecenter.provisorio.ws/',
//             avatarURL: botAvatar,
//           },
//           footer: {
//             text: `Solicitado por ${username}#${discriminator}`,
//             imageURL: userAvatar || undefined,
//           },
//         });
//         await message.edit(notFoundEmbed);
//         log.warn('NOT FOUND');
//       } else {
//         console.log(mobInfo);
//         log.info('SEND');
//       }
//     } catch (error) {
//       const errorEmbed = new EmbedMessage().generateEmbed({
//         title: 'Erro ao buscar o mob',
//         description: `Desculpe mas não foi possível pesquisar o mob **${argsString}** agora, tente mais tarde ou relate o erro.`,
//         author: {
//           name: botName,
//           url: 'http://rosecenter.provisorio.ws/',
//           avatarURL: botAvatar,
//         },
//         color: '#ff6961',
//         footer: {
//           text: `Solicitado por ${username}#${discriminator}`,
//           imageURL: userAvatar || undefined,
//         },
//       });

//       message.edit(errorEmbed);
//       log.error('ERROR');
//     }
//     await db.end();
//   }
// }

// export default MobCommand;
