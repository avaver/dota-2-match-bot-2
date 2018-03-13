'use strict';

import * as log from 'log4js';
import * as discord from 'discord.js';
import { DISCORD_API_KEY } from '../config/config';
import * as util from 'util';

const logger = log.getLogger('bot-service');

export default class BotService {
  private client = new discord.Client();

  constructor() {
    this.client.on('ready', () => this.onReady());
    this.client.on('message', message => this.onMessage(message));
  }

  public run(): void {
    this.client.login(DISCORD_API_KEY);
  }

  private onReady(): void {
    logger.info("connected to the discord server");
  }

  private onMessage(message: discord.Message): void {
    let args = message.content.split(" ");
    if (args[0].startsWith('!')) {
      let command = args[0].substring(1);
      logger.info('Processing command "%s"', command.toLocaleUpperCase());
      switch (command.toLocaleLowerCase()) {
        case "bibametr":
          let x = this.random(message.author.username.toLocaleLowerCase() == "dno" ? 18 : 1, 26);
          message.reply(util.format('в тебе біба %s см', x));
          break;
        default:
          break;
      }
    }
  }

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}