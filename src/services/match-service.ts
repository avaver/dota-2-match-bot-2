'use strict';

import * as log from 'log4js';
import { OpenDota } from '../api/opendota';
import { Match, Hero, RecentMatch } from '../model/opendota-types';
import { Account } from '../model/matchbot-types';
import { Observable } from 'rxjs';
import { AccountService } from './account-service';
import { HeroService } from './hero-service';
import { MATCH_POLL_INTERVAL_MS, MATCH_RECENT_THRESHOLD_MS } from '../config/config';
import { PublishedService } from './published-service';
import { DB } from '../api/firebase-db';

export namespace MatchService {
  const logger = log.getLogger('match-service');

  export function getMatchStream(): Observable<Match> {
    return Observable.interval(MATCH_POLL_INTERVAL_MS)
      .withLatestFrom(AccountService.getAccounts())
      .map(val => { logger.trace('checking for matches'); return val[1]; })
      .switchMap(accs => accs.map(a => Observable.fromPromise(OpenDota.getLastMatchForPlayer(a.id)))).mergeAll()
      .distinct(m => m.match_id)
      .withLatestFrom(PublishedService.getMatches())
      .filter(val => recentMatch(val[0], val[1]))
      .map(val => val[0])
      .flatMap(m => OpenDota.getMatchDetails(m.match_id))
      .withLatestFrom(AccountService.getAccounts(), HeroService.getHeroes())
      .map(val => transformMatch(val[0], val[1], val[2]))
      .catch((error, source) => { logger.error('Error getting match stream: %s. Trying to recover', error.message); return source; });
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

    // save match as already published
    DB.addPublishedMatch(match.match_id, match.start_time + match.duration);

    logger.info('match %s - players: %s', match.match_id, match.players.map(p => p.personaname).join(', '));
    return match;
  }

  function recentMatch(match: RecentMatch, publishedMatches: number[]): boolean {
    const matchEndTime = (match.start_time + match.duration) * 1000;
    let isRecent = true;
    if (Date.now() - matchEndTime > MATCH_RECENT_THRESHOLD_MS) {
      logger.info('skipping match %s as too old (finished on %s)', match.match_id, new Date(matchEndTime).toISOString());
      isRecent = false;
    } else if (publishedMatches.indexOf(match.match_id) != -1) {
      logger.info('skipping match %s as already published', match.match_id);
      isRecent = false;
    }

    return isRecent;
  }
}