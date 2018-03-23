'use strict';

import * as log from 'log4js';
import { Client, Message, TextChannel } from 'discord.js';
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
import ShitcannonCommand from './bot-commands/shitcannon-command';
import { format } from 'util';

export default class BotService implements Processor {
  private logger = log.getLogger('bot-service');
  private client = new Client();
  private analyzers = new Array<Processor>();

  private processors = new Map<string, Processor>();

  public run(): void {
    this.processors.set('bibametr', new BibametrCommand());
    this.processors.set('clear', new ClearCommand());
    this.processors.set('commands', this);
    this.processors.set('mmr', new MmrCommand());
    this.processors.set('register', new RegisterCommand());
    this.processors.set('shitcannon', new ShitcannonCommand());
    this.processors.set('unregister', new UnregisterCommand());
    this.processors.set('watchlist', new WatchlistCommand());
    this.processors.set('фас', new SwearCommand());
    this.analyzers.push(new NaviProcessor());

    this.client.on('ready', () => this.onReady());
    this.client.on('message', message => this.onMessage(message));
    
    this.client.login(DISCORD_API_KEY);
  }

  private onReady(): void {
    this.logger.info("connected to the discord server");
  }

  private onMessage(message: Message): void {
    const channel = message.channel as TextChannel;
    if (channel && !message.author.bot) {
      let command = this.getCommand(message.content);
      if (command) {
        this.logger.info('processing bot command %s, sent by %s in %s|%s', this.getCommand(message.content), message.author.username, message.guild.name, channel.name);
        let processor = this.processors.get(command) || new DefaultCommand();
        processor.process(message);
      }
      this.analyzers.forEach(analyzer => analyzer.process(message));
    }
  }

  public process(message: Message) {
    let commands = [...this.processors].map(p => '!' + p[0]).sort().join('\n');
    message.channel.send(format('```diff\n%s\n```', commands));
  }

  private getCommand(content: string): string | undefined {
    let args = content.split(' ');
    return args[0].startsWith('!') ? args[0].substring(1) : undefined;
  }
}