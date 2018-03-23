'use strict';

import { CommandBase } from './command';
import { Message } from 'discord.js';

export default class ClearCommand extends CommandBase {

  public process(message: Message) {
    if (!this.isBoss(message)) {
      message.channel.send('```cs\n#у тебе немає прав на цю команду\n```');
    } else {
      let args = this.getArgs(message.content);
      let count = args.length == 0 ? 100 : parseInt(args[0])
      if (!isNaN(count)) {
        message.channel.bulkDelete(count).catch(error => this.logger.error('error processing command "%s". %s', this.getCommand(message.content), error.message));
      } else {
        this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
      }
    }
  }
}