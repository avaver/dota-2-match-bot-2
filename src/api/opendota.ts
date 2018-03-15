'use strict';

import * as log from 'log4js';
import Axios from 'axios';
import Bottleneck from 'bottleneck';
import { format } from 'util';
import { Observable } from 'rxjs';
import { OPENDOTA_MIN_REQUEST_FREQ_MS } from '../config/config';
import { Player, RecentMatch, Match, Hero } from '../model/opendota-types';

const logger = log.getLogger('opendota');

logger.info('initializing request limiter');
const limiter: Bottleneck = new Bottleneck({
  maxConcurrent: 1,
  minTime: OPENDOTA_MIN_REQUEST_FREQ_MS
});

export namespace OpenDota {
  export function getPlayer(playerId: number): Observable<Player> {
    return request<Player>(format('https://api.opendota.com/api/players/%s', playerId));
  }

  export function getRecentMatchesForPlayer(playerId: number, count: number): Observable<RecentMatch[]> {
    return request<RecentMatch[]>(format('https://api.opendota.com/api/players/%s/matches?limit=%s', playerId, count));
  }

  export function getLastMatchForPlayer(playerId: number): Observable<RecentMatch> {
    return getRecentMatchesForPlayer(playerId, 1).flatMap(matches => Observable.of(matches[0]));
  }

  export function getMatchDetails(matchId: number): Observable<Match> {
    return request<Match>(format('https://api.opendota.com/api/matches/%s', matchId));
  }

  export function getHeroes(): Observable<Hero[]> {
    return request<Hero[]>('https://api.opendota.com/api/heroes');
  }

  function request<T>(url: string) : Observable<T> {
    return Observable.fromPromise(limiter.schedule(() => { logger.trace('api call %s', url); return Axios.get<T>(url); })).map(response => response.data);
  }
}