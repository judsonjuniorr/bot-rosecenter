import { Request, Response, NextFunction } from 'express';
import Discord from 'discord.js';

export default function ensureHasBot(bot: Discord.Client) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!bot) throw new Error('Bot missing');

    req.bot = bot;

    next();
  };
}
