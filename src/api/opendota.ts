'use strict';

import Axios from 'axios';
import Bottleneck from 'bottleneck';
import { Player, RecentMatch, Match } from './opendota-types';
import { format } from 'util';

const limiter: Bottleneck = new Bottleneck({
  maxConcurrent: 1,
  minTime: 400
});

export default class OpenDota { 
  public static async getPlayer(playerId: number): Promise<Player> {
    return await OpenDota.request<Player>(format('https://api.opendota.com/api/players/%s', playerId));
  }

  public static async getRecentMatchesForPlayer(playerId: number, count: number): Promise<RecentMatch[]> {
    return await OpenDota.request<RecentMatch[]>(format('https://api.opendota.com/api/players/%s/matches?limit=%s', playerId, count));
  }

  public static async getLastMatchForPlayer(playerId: number): Promise<RecentMatch> {
    return (await OpenDota.getRecentMatchesForPlayer(playerId, 1))[0];
  }

  public static async getMatchDetails(matchId: number): Promise<Match> {
    return await OpenDota.request<Match>(format('https://api.opendota.com/api/matches/%s', matchId));
  }

  private static async request<T>(url: string) : Promise<T> {
    return (await limiter.schedule(() => Axios.get<T>(url))).data;
  }
}