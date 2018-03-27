'use strict';

import * as log from 'log4js';
import { OpenDota } from '../api/opendota';
import { Match, Hero, RecentMatch } from '../model/opendota-types';
import { Account } from '../model/matchbot-types';
import { Observable } from 'rxjs';
import { AccountService } from './account-service';
import { HeroService } from './hero-service';
import { MATCH_POLL_INTERVAL_MS, MATCH_RECENT_THRESHOLD_MS } from '../config/config';

export namespace MatchService {
  const logger = log.getLogger('match-service');

  export function getMatchStream(): Observable<Match> {
    return Observable.interval(MATCH_POLL_INTERVAL_MS)
      .withLatestFrom(AccountService.getAccounts()).map(val => { logger.trace('checking for matches'); return val[1]; })
      .switchMap(accs => accs.map(a => OpenDota.getLastMatchForPlayer(a.id))).mergeAll().distinct(m => m.match_id)
      .filter(m => recentMatch(m))
      .flatMap(m => OpenDota.getMatchDetails(m.match_id))
      .withLatestFrom(AccountService.getAccounts(), HeroService.getHeroes())
      .map(val => transformMatch(val[0], val[1], val[2]));
  }

  function transformMatch(match: Match, accounts: Account[], heroes: Hero[]): Match {
    logger.info('processing match %s', match.match_id);
    
    // remove other players
    match.players = match.players.filter(player => accounts.map(account => account.id).indexOf(player.account_id) >= 0);

    // add profile and hero information
    match.players.forEach(player => {
      player.profile = accounts.find(account => account.id == player.account_id)!.profile;
      player.hero = heroes.find(hero => hero.id == player.hero_id);
    });

    logger.debug('match %s - players: %s', match.match_id, match.players.map(p => p.personaname).join(', '));
    return match;
  }

  function recentMatch(match: RecentMatch): boolean {
    logger.trace('checking match %s', match.match_id);
    const matchEndTime = (match.start_time + match.duration) * 1000;
    const isRecent = Date.now() - matchEndTime < MATCH_RECENT_THRESHOLD_MS;
    if (!isRecent) {
      logger.info('skipping match %s as too old (finished on %s)', 
        match.match_id, 
        new Date(matchEndTime).toISOString());
    }
    return isRecent;
  }
}