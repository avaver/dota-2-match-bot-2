'use strict';

import * as log from 'log4js';
import Axios from 'axios';
import { Message } from '../model/discord-types';
import { DISCORD_WEBHOOK_URL } from '../config/config';

const logger = log.getLogger('webhook');

export default class DiscordWebhook {
  public static post(message: Message): void {
    logger.info('post message to discord: %s', message.embeds[0].url);
    Axios.post(DISCORD_WEBHOOK_URL, message);
  }
}