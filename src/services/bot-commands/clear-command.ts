'use strict';

import { CommandBase } from './command';
import { Message } from 'discord.js';

export default class ClearCommand extends CommandBase {

  public process(message: Message) {
    super.process(message);
    let args = this.getArgs(message.content);
    if (args.length > 0 && parseInt(args[0])) {
      message.channel.bulkDelete(parseInt(args[0])).catch(error => this.logger.error('error processing command "%s". %s', this.getCommand(message.content), error.message));
    } else {
      this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
    }
  }
}