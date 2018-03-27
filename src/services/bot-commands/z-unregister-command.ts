'use strict';

import { Firestore } from '../../api/firebase-firestore';
import { CommandBase } from './command';
import { Message } from 'discord.js';
import { format } from 'util';

export default class UnregisterCommand2 extends CommandBase {
  public process(message: Message) {
    let args = this.getArgs(message.content);
    let id = parseInt(args[0]);
    if (id) {
      Firestore.removeAccount(id, '123')
        .then(() => message.channel.send(format('account %s unregistered', id), { code: true }))
        .catch(e => message.channel.send(format('Помилка: %s', e.message), { code: true }));
    } else {
      this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
    }
  }
}