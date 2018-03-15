'use strict';

import { format } from 'util';
import { Message } from 'discord.js';
import { CommandBase } from './command';
import { DISCORD_BOSS_ID, BIBA_MIN_SIZE, BIBA_MAX_SIZE, BIBA_BOSS_MIN_SIZE } from '../../config/config';

export default class BibametrCommand extends CommandBase {
  public process(message: Message) {
    super.process(message);
    let x = this.random(message.author.id == DISCORD_BOSS_ID ? BIBA_BOSS_MIN_SIZE : BIBA_MIN_SIZE, BIBA_MAX_SIZE);
    message.channel.send(format('```cs\n%s, в тебе біба %s см\n```', message.author.username, x));
  }
}