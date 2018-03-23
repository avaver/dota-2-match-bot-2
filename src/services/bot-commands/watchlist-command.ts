'use strict';

import { CommandBase } from './command';
import { Message } from 'discord.js';
import { AccountService } from '../account-service';
import { format } from 'util';

export default class WatchlistCommand extends CommandBase {
  public process(message: Message) {
    AccountService.getAccounts().take(1).subscribe(accounts => {
      message.channel.send(format('```bash\n%s\n```', accounts.map(a => format('$%s%s # %s', a.account_id, ' '.repeat(10 - a.account_id.toString().length), a.personaname)).join('\n')));
    });
  }
}