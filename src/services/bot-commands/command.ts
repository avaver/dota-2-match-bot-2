'use strict';

import { Message } from 'discord.js';
import * as log from 'log4js';

export abstract class CommandBase implements Processor {
  protected logger = log.getLogger('bot-command');

  public process(message: Message): void {
    this.logger.info('processing bot command %s, sent by %s (%s) in channel %s', this.getCommand(message.content), message.author.username, message.author.id, message.channel.id);
  }

  protected getCommand(content: string): string {
    return content.split(' ')[0].substring(1).toLocaleUpperCase();
  }

  protected getArgs(content: string): string[] {
    return content.split(' ').slice(1);
  }
}

export interface Processor {
  process(message: Message): void;
}