'use strict';

import { CommandBase } from './command';
import { Message } from 'discord.js';
import { format } from 'util';
import { SWEARS } from '../../config/config';

export default class ShitcannonCommand extends CommandBase {
  public process(message: Message) {
    let realUsers = message.guild.members.map(m => m.user).filter(u => !u.bot && u.presence.status != 'offline');
    let randomUser = this.randomItem(realUsers);

    message.channel.send(format(SWEARS[this.random(0, SWEARS.length)], randomUser))
  }
}