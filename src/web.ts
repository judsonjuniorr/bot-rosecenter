import express, { Express } from 'express';
import Discord from 'discord.js';
import axios from 'axios';
import cors from 'cors';

import WebDB from './webDB';

export default class Web {
  private bot: Discord.Client;

  private app: Express;

  private client_secret = process.env.CLIENT_SECRET;

  private client_id = process.env.CLIENT_ID;

  private redirect_url = process.env.REDIRECT_URL || '';

  private webDB: WebDB;

  constructor(discordBot: Discord.Client) {
    this.bot = discordBot;
    this.app = express();
    this.webDB = new WebDB();
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
      'https://45.55.49.211:3005',
      'http://45.55.49.211:3005',
    ];
    const corsOptions = {
      origin(origin: any, callback: any): void {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.get('/discord/login', async (req, res) => {
      const account = `${req.query.account}`;
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      if (!req.query.account) return res.status(400).send();

      const userExists = await this.webDB.findPrepare(account);

      if (userExists && userExists.discord_id) return res.status(400).send();

      if (!userExists)
        await this.webDB.prepareUser({ ip: `${ip}`, account_name: account });

      return res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=${
          this.client_id
        }&redirect_uri=${encodeURIComponent(
          this.redirect_url,
        )}&response_type=code&scope=identify`,
      );
    });

    this.app.get('/discord/verify-user', async (req, res) => {
      const { code } = req.query;
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      try {
        const params = new URLSearchParams();
        params.append('client_id', `${this.client_id}`);
        params.append('client_secret', `${this.client_secret}`);
        params.append('grant_type', 'authorization_code');
        params.append('code', `${code}`);
        params.append('redirect_uri', `${this.redirect_url}`);
        params.append('scope', 'identify');

        const response = await axios.post(
          'https://discord.com/api/oauth2/token',
          params,
          { headers: { 'Content-Type': `application/x-www-form-urlencoded` } },
        );

        const user = await axios.get('https://discord.com/api/v6/users/@me', {
          headers: { Authorization: `Bearer ${response.data.access_token}` },
        });

        const guilds = this.bot.guilds.cache;
        const roseCenter = guilds.find(
          guild => guild.name === 'RoseOnBr - Oficial',
        );
        const verifiedRole = roseCenter?.roles.cache.find(
          role => role.name === 'Player verificado',
        );

        const userFound = roseCenter?.members.cache.find(
          discordUser => discordUser.id === user.data.id,
        );

        if (userFound && verifiedRole) await userFound.roles.add(verifiedRole);

        if (ip)
          await this.webDB.userDiscordID({
            ip: `${ip}`,
            discord_id: user.data.id,
          });

        return res.json({ status: 'Player verified', user: user.data });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
      }
    });
  }

  private start(): void {
    this.app.listen(3005, () => {
      console.log('Web server on');
    });
  }
}
