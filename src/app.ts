'use strict';

import * as log from 'log4js';
import * as raven from 'raven';
import { SENTRY_URL } from './config/secure-config';

let sentry = new raven.Client(SENTRY_URL);
sentry.install();

configureLogger();
const logger = log.getLogger();

import { MatchService } from './services/match-service';
import { MessageService } from './services/message-service';
import { DiscordWebhook } from './api/discord-webhook';
import BotService from './services/bot-service';

const botService = new BotService();

botService.run();

MatchService.getMatchStream()
  .map(MessageService.getMatchSummaryMessage)
  .subscribe(DiscordWebhook.post, handleError);

logger.info('application started');

function configureLogger(): void {
  const logLayout = process.env['HEROKU'] ? 
    { type: 'pattern', pattern: '[%p] %c - %m' } : 
    { type: 'colored' };
  log.configure({
    appenders: { out: { type: 'stdout', layout: logLayout } },
    categories: { default: { appenders: ['out'], level: 'debug' } }
  });
}

function handleError(error: any): void {
  logger.error(error); 
  raven.captureException(error);
}