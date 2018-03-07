'use strict';

import Axios from 'axios';
import Bottleneck from 'bottleneck';
import { Player, RecentMatch, Match } from './opendota-types';
import { format } from 'util';
import { Observable } from 'rxjs';

const limiter: Bottleneck = new Bottleneck({
  maxConcurrent: 1,
  minTime: 400
});

export default class OpenDota { 
  public static getPlayer(playerId: number): Observable<Player> {
    return OpenDota.request<Player>(format('https://api.opendota.com/api/players/%s', playerId));
  }

  public static getRecentMatchesForPlayer(playerId: number, count: number): Observable<RecentMatch[]> {
    return OpenDota.request<RecentMatch[]>(format('https://api.opendota.com/api/players/%s/matches?limit=%s', playerId, count));
  }

  public static getLastMatchForPlayer(playerId: number): Observable<RecentMatch> {
    return OpenDota.getRecentMatchesForPlayer(playerId, 1).flatMap(matches => Observable.of(matches[0]));
  }

  public static getMatchDetails(matchId: number): Observable<Match> {
    return OpenDota.request<Match>(format('https://api.opendota.com/api/matches/%s', matchId));
  }

  private static request<T>(url: string) : Observable<T> {
    console.log('api call %s', url);
    return Observable.fromPromise(limiter.schedule(() => Axios.get<T>(url))).map(response => response.data);
  }
}