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
      ProfileService.getProfile(id).take(1).subscribe(profile => {
        if (profile) {
          DB.addAccount(new Account(id, message.author.id, message.guild.id, message.channel.id))
            .then(() => message.channel.send(format('```Аккаунт %s (%s) зареєстровано```', id, profile.personaname)))
            .catch(e => message.channel.send(format('Помилка: %s', e.message), { code: true }));
        } else {
          message.channel.send(format('```Не можу знайти аккаунт %s```', id));
        }
      });
    } else {
      this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
    }
  }
}