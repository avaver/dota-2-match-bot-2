'use strict';

import { Message, Embed, Author } from '../api/discord-types';
import { Match, MatchPlayer, HEROES, Hero } from '../api/opendota-types';
import { format } from 'util';

export default class DiscordMessageService {
  public getMatchSummaryMessage(match: Match, accounts: number[]): Message {
    const players = match.players.filter(player => accounts.indexOf(player.account_id) >= 0);
    const playerNames = players.reduce(this.combinePlayerNames, '');
    const winLoss = this.getWinLossWord(players, match.radiant_win);
    const title = format('%s %s матч за сили %s тривалістю %s',
      playerNames, 
      winLoss, 
      players[0].player_slot >= 128 ? 'теряви' : 'світла',
      this.getGameDurationPhrase(match.duration)
    );

    let description = format('Загальний рахунок %s - %s на користь %s\n\n',
      match.radiant_score,
      match.dire_score,
      match.radiant_score > match.dire_score ? 'світла' : 'темряви'
    );

    players.forEach(player => 
      description += format('%s зіграв на %s з рахунком %s/%s/%s\n',
        player.personaname,
        (HEROES.find(h => h.id == player.hero_id) as Hero).localized_name,
        player.kills, player.deaths, player.assists));

    const url = format('https://www.dotabuff.com/matches/%s', match.match_id);
    return new Message([new Embed(title, description, this.isWin(players, match.radiant_win) ? 0xb1e85e : 0xe8635f, url)]);
  }

  private combinePlayerNames(accumulator: string, current: MatchPlayer, index: number, array: MatchPlayer[]): string {
    if (index == 0) {
      return current.personaname;
    } else if (array.length - 1 == index) {
      return accumulator + ' і ' + current.personaname;
    } else {
      return accumulator + ', ' + current.personaname;
    }
  }

  private getWinLossWord(players: MatchPlayer[], radiantWin: boolean): string {
    let word = this.isWin(players, radiantWin) ? 'виграв' : 'програв';
    return players.length > 1 ? word.substring(0, word.length - 1) + 'ли' : word;
  }
  
  private getGameDurationPhrase(duration: number): string {
    let minutes = Math.round(duration / 60);
    let phrase = minutes.toString() + ' хвилин';
    if (minutes % 10 == 1) {
      phrase += 'у';
    } else if (minutes % 10 > 1 && minutes % 10 < 5) {
      phrase += 'и';
    }  
    return phrase;
  }

  private isWin(players: MatchPlayer[], radiantWin: boolean): boolean {
    return players[0].player_slot >= 128 != radiantWin;
  }
}