import { Request, Response } from 'express';
import axios from 'axios';

import UsersRepository from '@web/database/repository/UsersRepository';
import DiscordRepository from '@web/database/repository/DiscordRepository';
import { IUser } from '@web/database/entities/User';
import BannedsRepository from '@web/database/repository/BannedRepository';

export default class DiscordController {
  public async login(req: Request, res: Response): Promise<void> {
    console.log({ query: req.query });
    const account =
      typeof req.query.account === 'string' ? req.query.account : undefined;
    const redirectPostUrl = 'http://www.roseonline.com.br/Account/ControlPanel';
    const client_id = process.env.CLIENT_ID || '';
    const redirect_url = process.env.REDIRECT_URL || '';
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (typeof ip !== 'string') ip = '';

    if (!account) {
      console.log(`Invalid account`);
      return res.redirect(redirectPostUrl);
    }

    const usersRepository = new UsersRepository();
    const userExists = await usersRepository.findByIdentifier(account);

    if (!userExists)
      await usersRepository.createUser({ identifier: account, ip });
    else await usersRepository.updateIP({ identifier: account, ip });

    const state = JSON.stringify(userExists);
    const stateParsed = Buffer.from(state).toString('base64');

    return res.redirect(
      `https://discord.com/api/oauth2/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(
        redirect_url,
      )}&response_type=code&scope=identify&state=${stateParsed}`,
    );
  }

  public async verify(req: Request, res: Response): Promise<void> {
    const { code } = req.query;
    const state =
      typeof req.query.state === 'string' ? req.query.state : undefined;
    const client_id = process.env.CLIENT_ID || '';
    const client_secret = process.env.CLIENT_SECRET || '';
    const redirect_url = process.env.REDIRECT_URL || '';
    const redirectPostUrl = 'http://www.roseonline.com.br/Account/ControlPanel';
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (typeof ip !== 'string') ip = '';

    if (!state) {
      console.log(`State data not found`);
      return res.redirect(redirectPostUrl);
    }

    const stateParsed = Buffer.from(state, 'base64').toString('ascii');
    console.log(stateParsed);
    const userData = JSON.parse(stateParsed) as IUser;

    if (!userData?.identifier) {
      console.log(`Identifier not found`);
      return res.redirect(redirectPostUrl);
    }

    try {
      const params = new URLSearchParams();
      params.append('client_id', `${client_id}`);
      params.append('client_secret', `${client_secret}`);
      params.append('grant_type', 'authorization_code');
      params.append('code', `${code}`);
      params.append('redirect_uri', `${redirect_url}`);
      params.append('scope', 'identify');

      const response = await axios.post(
        'https://discord.com/api/oauth2/token',
        params,
        { headers: { 'Content-Type': `application/x-www-form-urlencoded` } },
      );

      const discordUserRequest = await axios.get(
        'https://discord.com/api/v6/users/@me',
        { headers: { Authorization: `Bearer ${response.data.access_token}` } },
      );

      const discordUser = discordUserRequest.data;
      const discordName = `${discordUser.username}#${discordUser.discriminator}`;

      const usersRepository = new UsersRepository();
      const discordRepository = new DiscordRepository(req.bot);
      const bannedsRepository = new BannedsRepository();

      const isBanned = await bannedsRepository.isBanned(discordUser.id);

      if (isBanned) {
        console.log(
          `User ${discordName} banned! Account: ${userData?.identifier}`,
        );
        return res.redirect(redirectPostUrl);
      }

      if (userData?.discordID) {
        const discordID = await usersRepository.findByDiscordID(
          userData.discordID,
        );
        if (discordID.length === 1) {
          console.log(
            `Remove perms for ${discordName} - account: ${userData?.identifier}`,
          );
          await discordRepository.removePerms(discordUser.id);
        }
      }

      await discordRepository.addPerms(discordUser.id);

      await usersRepository.updateDiscordID({
        identifier: userData?.identifier,
        discordID: discordUser.id,
      });

      console.log(`Account ${userData?.identifier} verified, ${discordName}`);
      return res.redirect(redirectPostUrl);
    } catch (error) {
      console.error(`Falha na verificação.\n${stateParsed}`);
      return res.redirect(redirectPostUrl);
    }
  }
}
