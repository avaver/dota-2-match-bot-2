'use strict';

import Firebase from '../../api/firebase';
import PlayerProfileService from '../player-profile-service';
import { CommandBase } from './command';
import { Message } from 'discord.js';
import { format } from 'util';

export default class RegisterCommand extends CommandBase {
  private firebase = new Firebase();
  private profileService = new PlayerProfileService();

  public process(message: Message) {
    super.process(message);
    let args = this.getArgs(message.content);
    let id = parseInt(args[0].trim());
    if (args.length > 0 && id) {
      this.profileService.getProfile(id).take(1).subscribe(profile => {
        if (profile) {
          this.firebase.addAccount(id);
          message.channel.send(format('```account %s (%s) registered```', id, profile.personaname));
        } else {
          message.channel.send(format('```account %s not found```', id));
        }
      });
    } else {
      this.logger.warn('incorrect parameters for command %s. expected number, actual: %s', this.getCommand(message.content), message.content);
    }
  }
}