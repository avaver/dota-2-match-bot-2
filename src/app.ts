'use strict';

import * as log from 'log4js';
const logger = log.getLogger();
log.configure({
  appenders: { out: { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'debug' } }
});

import MatchMonitorService from './services/match-monitor-service';
import DiscordMessageService from './services/discord-message-service';
import DiscordWebhook from './api/discord-webhook';
import BotService from './services/bot-service';

const botService = new BotService();
const monitorService = new MatchMonitorService();
const messageService = new DiscordMessageService();

logger.info('application started');

botService.run();

monitorService.getMatchStream()
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