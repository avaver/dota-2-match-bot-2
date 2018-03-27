'use strict';

import { CommandBase } from './command';
import { Message, Guild } from 'discord.js';
import { AccountService } from '../account-service';
import { format } from 'util';
import { Account } from '../../model/matchbot-types';

export default class WatchlistCommand extends CommandBase {
  public process(message: Message) {
    AccountService.getAccounts().take(1).subscribe(accounts => {
      let lines = accounts.map(a => this.formatAccount(a) + format(' (додав %s)', this.getUsername(message.guild, a.addedBy)));
      message.channel.send(format('```bash\n%s\n```', lines.join('\n')));
    });
  }

  private formatAccount(account: Account): string {
    return format('$%s%s # %s', 
      account.id, 
      ' '.repeat(10 - account.id.toString().length), 
      account.profile? account.profile.personaname : '');
  }
  
  private getUsername(guild: Guild, userId: string): string {
    let user = guild.members.map(m => m.user).find(u => u.id == userId);
    return user ? user.username : '<невідомий>';
  }
}