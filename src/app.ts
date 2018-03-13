'use strict';

import MatchMonitorService from './services/match-monitor-service';
import DiscordMessageService from './services/discord-message-service';
import DiscordWebhook from './api/discord-webhook';
import { Match, MatchPlayer, HEROES, Hero, Profile } from './model/opendota-types';
import { format } from 'util';
import AccountService from './services/accounts-service';
import { Observable } from 'rxjs';
import Firebase from './api/firebase';
import OpenDota from './api/opendota';

const monitorService = new MatchMonitorService();
const messageService = new DiscordMessageService();

let x = monitorService.getMatchStream()
  .map(match => messageService.getMatchSummaryMessage(match))
  .subscribe(DiscordWebhook.post);

/*[
    new Account(298134653),
    new Account(333303976),
    new Account(118975931),
    new Account(86848474),
    new Account(314684987),
    new Account(36753317),
  ];*/