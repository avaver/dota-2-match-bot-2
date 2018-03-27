'use strict';

import { CommandBase } from './command';
import { Message, Guild } from 'discord.js';
import { AccountService } from '../account-service';
import { format } from 'util';

export default class WatchlistCommand2 extends CommandBase {
  public process(message: Message) {
    AccountService.getAccounts2().take(1).subscribe(accounts => {
      message.channel.send(format('```bash\n%s\n```', accounts.map(a => format('$%s%s # %s (added by %s)', a.id, ' '.repeat(10 - a.id.toString().length), a.profile!.personaname, this.getUsername(message.guild, a.addedBy))).join('\n')));
    });
  }

  private getUsername(guild: Guild, userId: string): string {
    let user = guild.members.map(m => m.user).find(u => u.id == userId);
    return user ? user.username : '<unknown>';
  }
}