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

export default class BotService {
  private logger = log.getLogger('bot-service');
  private client = new Client();
  private analyzers = new Array<Processor>();

  private processors2: Map<string, new() => Processor> = new Map([
    ['bibametr', BibametrCommand],
    ['watchlist', WatchlistCommand],
    ['register', RegisterCommand],
    ['unregister', UnregisterCommand],
    ['фас', SwearCommand],
    ['shitcannon', ShitcannonCommand],
    ['mmr', MmrCommand],
    ['clear', ClearCommand]
  ]);

  private createProcessor<T extends Processor>(type: new() => T): T {
    return new (type)();
  }

  public run(): void {

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
        if (command === 'commands') {
          let commands = [...this.processors2].map(p => '!' + p[0]).sort().join('\n');
          message.channel.send(format('```diff\n%s\n```', commands));
        } else {
          let processorType = this.processors2.get(command) || DefaultCommand;
          this.createProcessor(processorType).process(message);
        }
      }
      this.analyzers.forEach(analyzer => analyzer.process(message));
    }
  }

  private getCommand(content: string): string | undefined {
    let args = content.split(' ');
    return args[0].startsWith('!') ? args[0].substring(1) : undefined;
  }
}