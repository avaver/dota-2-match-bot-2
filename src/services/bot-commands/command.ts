'use strict';

import * as log from 'log4js';
import { Message } from 'discord.js';
import { DISCORD_BOSS_ID } from '../../config/config';

export abstract class CommandBase implements Processor {
  protected logger = log.getLogger('bot-command');

  public abstract process(message: Message): void;

  protected isBoss(message: Message): boolean {
    return message.author.id == DISCORD_BOSS_ID;
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

  protected randomItem<T>(items: ArrayLike<T>): T {
    return items[this.random(0, items.length)];
  }
}

export interface Processor {
  process(message: Message): void;
}