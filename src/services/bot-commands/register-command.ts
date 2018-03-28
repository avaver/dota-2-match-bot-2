'use strict';

import { DB } from '../../api/firebase-db';
import { ProfileService } from '../profile-service';
import { CommandBase } from './command';
import { Message } from 'discord.js';
import { format } from 'util';
import { Account } from '../../model/matchbot-types';

export default class RegisterCommand extends CommandBase {
  public process(message: Message) {
    let args = this.getArgs(message.content);
    let id = parseInt(args[0].trim());
    if (args.length > 0 && id) {
      ProfileService.getProfile(id)
        .then(profile => {
            DB.addAccount(new Account(id, message.author.id, message.guild.id, message.channel.id));
            message.channel.send(format('```account %s (%s) registered```', id, profile.personaname));
        })
        .catch(() => message.channel.send(format('```account %s not found```', id)));
    } else {
      this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
    }
  }
}