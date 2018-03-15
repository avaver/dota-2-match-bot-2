'use strict';

import * as log from 'log4js';
import { Processor } from './command';
import { Message } from 'discord.js';

export default class NaviProcessor implements Processor {
  private logger = log.getLogger('bot-processor');
  
  public process(message: Message) {
    if (message.content.toLowerCase().search(/(^|\s+)(наві|navi|na\'vi)($|[^A-Za-zА-Яа-я0-9]|\s+)/) >= 0) {
      this.logger.info('found NaVi mention in message: %s', message.content);
      message.channel.send('```cs\n#НАВІ В КАНАВІ\n```');
    }
  }
}