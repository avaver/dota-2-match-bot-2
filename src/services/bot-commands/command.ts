'use strict';

import { Message, TextChannel } from 'discord.js';
import * as log from 'log4js';

export abstract class CommandBase implements Processor {
  protected logger = log.getLogger('bot-command');

  public process(message: Message): void {
    let textChannel = message.channel as TextChannel;
    this.logger.info('processing bot command %s, sent by %s in %s%s', this.getCommand(message.content), message.author.username, message.guild.name, textChannel ? '|' + textChannel.name : '');
  }

  protected getCommand(content: string): string {
    return content.split(' ')[0].substring(1).toLocaleUpperCase();
  }

  protected getArgs(content: string): string[] {
    return content.split(' ').slice(1);
  }

  protected random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

export interface Processor {
  process(message: Message): void;
}