'use strict';

import MatchMonitorService from './services/match-monitor-service';
import DiscordMessageService from './services/discord-message-service';
import DiscordWebhook from './api/discord-webhook';
import { Match, MatchPlayer, HEROES, Hero } from './api/opendota-types';
import { format } from 'util';
import AccountService from './services/accounts-service';
import { Observable } from 'rxjs';
import Firebase from './api/firebase';
import OpenDota from './api/opendota';

const accountService = new AccountService();
const monitorService = new MatchMonitorService();

monitorService.getMatchStream(accountService.accounts, 5000).subscribe(m => console.log(m.match_id));

/*
const messageService = new DiscordMessageService();
const accountService = new AccountService();
const monitorService = new MatchMonitorService();

monitorService.getMatchStream(accountService.accounts, 10000).subscribe(match => console.log(match.match_id));

let matchSubscribtion = monitorService.getMatchStream(accountService.accounts, 10000) // get match stream
.map(match => messageService.getMatchSummaryMessage(match)) // generate discord message for each incoming match
.subscribe(DiscordWebhook.post, error => console.log(error.message)); // and finally post it

setTimeout(() => matchSubscribtion.unsubscribe(), 60000);
*/
