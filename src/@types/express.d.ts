/* eslint-disable @typescript-eslint/interface-name-prefix */
import Discord from 'discord.js';

declare module 'express-serve-static-core' {
  interface Request {
    bot: Discord.Client;
  }
}
