'use strict';

import * as log from 'log4js';
const logger = log.getLogger();
log.configure({
  appenders: { out: { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'debug' } }
});

import { MatchService } from './services/match-service';
import MessageService from './services/message-service';
import { DiscordWebhook } from './api/discord-webhook';
import BotService from './services/bot-service';

const botService = new BotService();
const messageService = new MessageService();

botService.run();

MatchService.getMatchStream()
  .map(match => messageService.getMatchSummaryMessage(match))
  .subscribe(DiscordWebhook.post, logger.error);

logger.info('application started');