'use strict';

import { Firestore } from '../../api/firebase-firestore';
import { ProfileService } from '../profile-service';
import { CommandBase } from './command';
import { Message } from 'discord.js';
import { format } from 'util';
import { Account } from '../../model/matchbot-types';

export default class RegisterCommand2 extends CommandBase {
  public process(message: Message) {
    let args = this.getArgs(message.content);
    let id = parseInt(args[0].trim());
    if (args.length > 0 && id) {
      ProfileService.getProfile(id).take(1).subscribe(profile => {
        if (profile) {
          Firestore.addAccount(new Account(id, message.author.id, message.guild.id, message.channel.id))
            .then(() => message.channel.send(format('```account %s (%s) registered```', id, profile.personaname)));
        } else {
          message.channel.send(format('```account %s not found```', id));
        }
      });
    } else {
      this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
    }
  }
}