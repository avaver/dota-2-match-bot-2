'use strict';

import OpenDota from '../api/opendota';
import { Match } from '../api/opendota-types';
import { Observable } from 'rxjs';
import { Account } from './accounts-service';

export default class MatchMonitorService {
  public getMatchStream(accounts: Account[], pollInterval: number): Observable<Match> {
    let stream = Observable.interval(pollInterval)
    .flatMap(() => accounts.map(account => OpenDota.getLastMatchForPlayer(account.id)))
    .mergeAll()
    .distinct(m => m.match_id)
    .flatMap(m => OpenDota.getMatchDetails(m.match_id))
    .map(m => {
      m.players = m.players.filter(p => accounts.find(a => a.id == p.account_id));
      return m;
    });

    return stream;
  }
}