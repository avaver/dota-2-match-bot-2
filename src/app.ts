'use strict';

import * as log from 'log4js';

const logLayout = process.env['HEROKU'] ? 
  { type: 'pattern', pattern: '%[[%p] %c - %m%]' } : 
  { type: 'colored' };
log.configure({
  appenders: { out: { type: 'stdout', layout: logLayout } },
  categories: { default: { appenders: ['out'], level: 'debug' } }
});
const logger = log.getLogger();

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