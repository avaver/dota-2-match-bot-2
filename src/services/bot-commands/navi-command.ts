'use strict';

import { CommandBase } from './command';
import { Message } from 'discord.js';

export default class NaviCommand extends CommandBase {

  public process(message: Message) {
    super.process(message);
    message.channel.send('```cs\n#НАВІ В КАНАВІ\n```');
  }
}