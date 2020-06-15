import { Router } from 'express';

import DiscordController from '../controllers/discordController';

const discordRouter = Router();
const discordController = new DiscordController();

discordRouter.get('/login', discordController.login);
discordRouter.get('/verify-user', discordController.verify);

export default discordRouter;
