import express, { Express } from 'express';
import Discord from 'discord.js';
import cors from 'cors';

import discordRoutes from './routes/discord.routes';
import ensureHasBot from './middlewares/ensureHasBot';

export default class Web {
  private bot: Discord.Client;

  private app: Express;

  constructor(discordBot: Discord.Client) {
    this.bot = discordBot;
    this.app = express();
    this.middlewares();
  }

  public async initialize(): Promise<void> {
    this.routes();
    this.start();
  }

  private middlewares(): void {
    const whitelist = [
      'http://www.roseonline.com.br',
      'http://roseonline.com.br',
    ];
    const corsOptions = {
      origin(origin: any, callback: any): void {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(ensureHasBot(this.bot));
  }

  private routes(): void {
    this.app.use('/discord', discordRoutes);
  }

  private start(): void {
    this.app.listen(3005, () => {
      console.log('Web server on');
    });
  }
}
