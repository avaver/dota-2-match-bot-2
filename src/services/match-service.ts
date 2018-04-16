'use strict';

import * as log from 'log4js';
import { OpenDota } from '../api/opendota';
import { Match, Hero, RecentMatch } from '../model/opendota-types';
import { Account } from '../model/matchbot-types';
import { Observable } from 'rxjs';
import { AccountService } from './account-service';
import { HeroService } from './hero-service';
import { MATCH_POLL_INTERVAL_MS } from '../config/config';
import { DB } from '../api/firebase-db';

class MatchStreamData {
  constructor(public accounts: Account[], public heroes: Hero[], public match: Match | RecentMatch, public currentAccount: number) {}
}

export namespace MatchService {
  const logger = log.getLogger('match-service');

  export function getMatchStream(): Observable<Match> {
    return Observable.interval(MATCH_POLL_INTERVAL_MS)
      .do(() => logger.debug('checking for new matches'))
      .withLatestFrom(AccountService.getAccounts(), HeroService.getHeroes())
      .do(() => logger.trace('loaded accounts and heroes'))
      .switchMap(data => data[1].map(account => Observable.fromPromise(OpenDota.getLastMatchForPlayer(account.id).then(recentMatch => new MatchStreamData(data[1], data[2], recentMatch, account.id))))).mergeAll()
      .do(data => logger.trace('checking match %s', data.match.match_id))
      .distinct(data => data.match.match_id)
      .do(data => logger.trace('match %s passed distinct check', data.match.match_id))
      .filter(data => data.accounts.map(account => account.lastMatchId).indexOf(data.match.match_id) === -1)
      .do(data => logger.trace('match %s passed latest matches check', data.match.match_id))
      .do(data => DB.updateLastMatch(data.currentAccount, data.match.match_id))
      .do(data => logger.trace('updated last match id for account %s', data.currentAccount))
      .flatMap(data => OpenDota.getMatchDetails(data.match.match_id), (data, matchDetails) => { data.match = matchDetails; return data; })
      .do(data => logger.trace('loaded match %s details', data.match.match_id))
      .map(data => {
        let match = data.match as Match;
        match.players = match.players.filter(player => data.accounts.map(account => account.id).indexOf(player.account_id) >= 0);
        match.players.forEach(player => {
          player.profile = data.accounts.find(account => account.id === player.account_id)!.profile;
          player.hero = data.heroes.find(hero => hero.id === player.hero_id);
          logger.trace('resolved profile and hero information for account %s (%s, %s)', player.account_id, player.profile!.personaname, player.hero!.localized_name);
        });
        return match;
      });
  }
}