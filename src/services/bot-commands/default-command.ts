'use strict';

import { CommandBase } from "./command";
import { Message } from "discord.js";

export default class DefaultCommand extends CommandBase {
  public process(message: Message): void {
    this.logger.warn('There is no processor for command %s', this.getCommand(message.content));
  }
}