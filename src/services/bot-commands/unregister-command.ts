'use strict';

import { Firebase } from '../../api/firebase';
import { CommandBase } from './command';
import { Message } from 'discord.js';
import { format } from 'util';

export default class UnregisterCommand extends CommandBase {
  public process(message: Message) {
    super.process(message);
    let args = this.getArgs(message.content);
    let id = parseInt(args[0]);
    if (args.length > 0 && id) {
      Firebase.removeAccount(id);
      message.channel.send(format('account %s unregistered', id), { code: true });
    } else {
      this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
    }
  }
}