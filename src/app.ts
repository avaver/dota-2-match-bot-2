'use strict';

import MatchMonitorService from './services/match-monitor-service';
import DiscordMessageService from './services/discord-message-service';
import DiscordWebhook from './api/discord-webhook';
import { MatchPlayer, HEROES, Hero } from './api/opendota-types';
import { format } from 'util';

const accounts = [298134653, 333303976, 118975931, 86848474, 314684987, 36753317];

const monitorService = new MatchMonitorService(accounts);
const messageService = new DiscordMessageService();

let matchSubscribtion = monitorService.getMatchStream(10000)
.map(match => messageService.getMatchSummaryMessage(match, accounts))
.subscribe(DiscordWebhook.post, console.log);

setTimeout(() => matchSubscribtion.unsubscribe(), 60000);