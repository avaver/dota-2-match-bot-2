'use strict';

import Axios from 'axios';
import { Message } from '../model/discord-types';
import { DISCORD_WEBHOOK_URL } from '../config/config';

export default class DiscordWebhook {
  public static post(message: Message): void {
    Axios.post(DISCORD_WEBHOOK_URL, message);
  }
}