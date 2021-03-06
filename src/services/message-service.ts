'use strict';

import { Message, Embed, Author, Thumbnail, Field, Footer } from '../model/discord-types';
import { Match, MatchPlayer, Hero, Profile } from '../model/opendota-types';
import { format } from 'util';

export namespace MessageService {
  export function getMatchSummaryMessage(match: Match): Message {
    const win = isWin(match);

    let content = format('```%s %s матч за сили %s\nРахунок: %s - %s\nТривалість: %s```',
      match.players.reduce(combinePlayerNames, ''), 
      getWinLossWord(match), 
      match.players[0].player_slot >= 128 ? 'темряви' : 'світла',
      match.radiant_score,
      match.dire_score,
      getGameDurationPhrase(match.duration)
    );
   
    const url = format('https://www.dotabuff.com/matches/%s', match.match_id);

    const embeds = match.players.map(player => {
      const fields: Field[] = [];
      const hero = player.hero as Hero;
      const profile = player.profile as Profile;

      fields.push(new Field('Last hits/Denies', format('%s/%s', player.last_hits, player.denies), true));
      fields.push(new Field('Networth', numberToText(player.total_gold), true));
      fields.push(new Field('GPM', player.gold_per_min.toString(), true));
      fields.push(new Field('XPM', player.xp_per_min.toString(), true));
      fields.push(new Field('Hero Damage', numberToText(player.hero_damage), true));
      fields.push(new Field('Tower Damage', numberToText(player.tower_damage), true));
      return new Embed(
        format('%s / %s /%s', player.kills, player.deaths, player.assists),
        '___',
        win ? 0xb1e85e : 0xe8635f,
        url,
        new Thumbnail(getHeroIconUrl(hero)),
        new Author(player.personaname, 'https://www.dotabuff.com/players/' + player.account_id, profile.avatarfull),
        new Date(match.start_time * 1000).toISOString(),
        fields,
        new Footer(hero.localized_name, getHeroIconUrl(hero))
      );
    });

    return new Message(embeds, content, match.match_id.toString());
  }

  function combinePlayerNames(accumulator: string, current: MatchPlayer, index: number, array: MatchPlayer[]): string {
    if (index == 0) {
      return current.personaname;
    } else if (array.length - 1 == index) {
      return accumulator + ' і ' + current.personaname;
    } else {
      return accumulator + ', ' + current.personaname;
    }
  }

  function getWinLossWord(match: Match): string {
    let word = isWin(match) ? 'виграв' : 'програв';
    return match.players.length > 1 ? word.substring(0, word.length - 1) + 'ли' : word;
  }
  
  function getGameDurationPhrase(duration: number): string {
    let minutes = Math.round(duration / 60);
    let phrase = minutes.toString() + ' хвилин';
    if (minutes % 10 == 1) {
      phrase += 'у';
    } else if (minutes % 10 > 1 && minutes % 10 < 5) {
      phrase += 'и';
    }  
    return phrase;
  }

  function numberToText(x: number): string {
    return x > 1000 ? (x / 1000).toFixed(1) + 'k' : x.toString();
  }

  function isWin(match: Match): boolean {
    return match.players[0].player_slot >= 128 != match.radiant_win;
  }

  function getHeroIconUrl(hero: Hero): string {
    return format('https://api.opendota.com/apps/dota2/images/heroes/%s_full.png', hero.name.replace('npc_dota_hero_', ''))
  }
}