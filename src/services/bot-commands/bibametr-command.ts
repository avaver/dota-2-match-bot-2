'use strict';

import { format } from 'util';
import { Message } from 'discord.js';
import { CommandBase } from './command';
import { BIBA_MIN_SIZE, BIBA_MAX_SIZE, BIBA_BOSS_MIN_SIZE } from '../../config/config';

export default class BibametrCommand extends CommandBase {
  public process(message: Message) {
    let x = this.random(this.isBoss(message) ? BIBA_BOSS_MIN_SIZE : BIBA_MIN_SIZE, BIBA_MAX_SIZE);
    message.channel.send(format('```cs\n%s, в тебе біба %s см\n```', message.author.username, x));
  }
}