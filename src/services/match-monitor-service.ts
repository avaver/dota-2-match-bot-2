'use strict';

import * as log from 'log4js';
import OpenDota from '../api/opendota';
import { Match, Profile } from '../model/opendota-types';
import { Observable } from 'rxjs';
import AccountService from './accounts-service';

const logger = log.getLogger('match-monitor');

export default class MatchMonitorService {
  private accountService = new AccountService();

  public getMatchStream(): Observable<Match> {
    return Observable.interval(10000)
      .withLatestFrom(this.accountService.accounts).map(val => val[1])
      .switchMap(accs => accs.map(a => OpenDota.getLastMatchForPlayer(a.account_id))).mergeAll().distinct(m => m.match_id)
      .flatMap(m => OpenDota.getMatchDetails(m.match_id))
      .withLatestFrom(this.accountService.accounts)
      .map(val => this.transformMatch(val[0], val[1]));
  }

  private transformMatch(match: Match, profiles: Profile[]): Match {
    logger.info('processing match %s', match.match_id);
    // remove other players
    match.players = match.players.filter(pl => profiles.map(pr => pr.account_id).indexOf(pl.account_id) >= 0);
    // add avatar url
    match.players.forEach(pl => pl.avatar = (profiles.find(pr => pr.account_id == pl.account_id) as Profile).avatarfull);
    logger.debug('match %s - players: %s', match.match_id, match.players.map(p => p.personaname).join(', '));
    return match;
  }
}