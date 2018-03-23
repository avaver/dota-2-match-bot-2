'use strict';

import { format } from 'util';
import { Message } from 'discord.js';
import { CommandBase } from './command';
import { DISCORD_BOSS_ID, MMR_MIN, MMR_MAX, MMR_BOSS_MIN } from '../../config/config';

export default class MmrCommand extends CommandBase {
  public process(message: Message) {
    let x = this.random(message.author.id == DISCORD_BOSS_ID ? MMR_BOSS_MIN : MMR_MIN, MMR_MAX);
    message.channel.send(format('```cs\n%s, твій психологічний MMR %s\n```', message.author.username, x));
  }
}