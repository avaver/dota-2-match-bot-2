'use strict';

import { Message } from 'discord.js';
import { CommandBase } from './command';
import { format } from 'util';

export default class BibametrCommand extends CommandBase {
  public process(message: Message) {
    super.process(message);
    let x = this.random(message.author.id == "407971834689093632" ? 18 : 1, 30);
    message.channel.send(format('```cs\n%s, в тебе біба %s см\n```', message.author.username, x));
  }

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}