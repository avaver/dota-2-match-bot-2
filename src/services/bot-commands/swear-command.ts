'use strict';

import { CommandBase } from './command';
import { Message } from 'discord.js';
import { format } from 'util';
import { SWEARS } from '../../config/config';

export default class SwearCommand extends CommandBase {
  public process(message: Message) {
    super.process(message);
    message.mentions.users.forEach(user => message.channel.send(format(this.randomItem(SWEARS), user.toString())));
  }
}