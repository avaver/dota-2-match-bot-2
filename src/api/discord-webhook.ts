'use strict';

import Axios from 'axios';
import { Message } from './discord-types';
import { DISCORD_WEBHOOK_URL } from '../config/config';

export default class DiscordWebhook {
  public static post(message: Message): void {
    console.log('posting message to discord: "%s"', message.content);
    Axios.post(DISCORD_WEBHOOK_URL, message);
  }
}