'use strict';

import { DB } from '../../api/firebase-db';
import { CommandBase } from './command';
import { Message } from 'discord.js';
import { format } from 'util';

export default class UnregisterCommand extends CommandBase {
  public process(message: Message) {
    let args = this.getArgs(message.content);
    let id = parseInt(args[0]);
    if (id) {
      DB.removeAccount(id, message.author.id)
        .then(() => message.channel.send(format('Аккаунт %s видалено', id), { code: true }))
        .catch(e => message.channel.send(format('Помилка: %s', e.message), { code: true }));
    } else {
      this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
    }
  }
}