'use strict';

import * as log from 'log4js';
import { Client, Message } from 'discord.js';
import { DISCORD_API_KEY } from '../config/secure-config';
import { Processor } from './bot-commands/command';
import BibametrCommand from './bot-commands/bibametr-command';
import DefaultCommand from './bot-commands/default-command';
import WatchlistCommand from './bot-commands/watchlist-command';
import ClearCommand from './bot-commands/clear-command';
import RegisterCommand from './bot-commands/register-command';
import UnregisterCommand from './bot-commands/unregister-command';
import SwearCommand from './bot-commands/swear-command';
import NaviProcessor from './bot-commands/navi-processor';
import MmrCommand from './bot-commands/mmr-command';
import ShitcannonCommand from './bot-commands/shitcannont-command';

const logger = log.getLogger('bot-service');

export default class BotService {
  private client = new Client();
  private processors = new Map<string, Processor>();
  private analyzers = new Array<Processor>();

  constructor() {
    this.processors.set('bibametr', new BibametrCommand());
    this.processors.set('watchlist', new WatchlistCommand());
    this.processors.set('register', new RegisterCommand());
    this.processors.set('unregister', new UnregisterCommand());
    this.processors.set('фас', new SwearCommand());
    this.processors.set('shitcannon', new ShitcannonCommand());
    this.processors.set('mmr', new MmrCommand());
    this.processors.set('clear', new ClearCommand());
    this.processors.set('default', new DefaultCommand());

    this.analyzers.push(new NaviProcessor());

    this.client.on('ready', () => this.onReady());
    this.client.on('message', message => this.onMessage(message));
  }

  public run(): void {
    this.client.login(DISCORD_API_KEY);
  }

  private onReady(): void {
    logger.info("connected to the discord server");
  }

  private onMessage(message: Message): void {
    let processor = this.getProcessor(this.getCommand(message.content));
    if (processor) {
      processor.process(message);
    }

    this.analyzers.forEach(analyzer => analyzer.process(message));
  }

  private getProcessor(command: string | undefined): Processor | undefined {
    if (command) {
      let processor = this.processors.get(command);
      return processor ? processor : this.processors.get('default');
    }

    return undefined;
  }

  private getCommand(content: string): string | undefined {
    let args = content.split(' ');
    return args[0].startsWith('!') ? args[0].substring(1) : undefined;
  }
}