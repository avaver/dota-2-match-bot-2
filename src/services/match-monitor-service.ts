'use strict';

import OpenDota from '../api/opendota';
import { Match } from '../api/opendota-types';
import { Observable } from 'rxjs';

export default class MatchMonitorService {
  constructor(public accounts: number[]) {}

  public getMatchStream(pollInterval: number): Observable<Match> {
    return Observable.interval(pollInterval)
    .flatMap(() => this.accounts.map(OpenDota.getLastMatchForPlayer))
    .mergeAll()
    .distinct(m => m.match_id)
    .flatMap(m => OpenDota.getMatchDetails(m.match_id))
    .map(m => {m.players = m.players.filter(p => this.accounts.indexOf(p.account_id) >= 0); return m});
  }
}