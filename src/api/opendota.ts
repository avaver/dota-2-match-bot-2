'use strict';

import Axios from 'axios';
import Bottleneck from 'bottleneck';
import { PlayerProfileJson, ProfileJson, RecentMatchJson, MatchJson } from './opendota-types';
import { format } from 'util';

const limiter: Bottleneck = new Bottleneck({
  maxConcurrent: 1,
  minTime: 400
});

export default class OpenDota { 
  public static async getPlayer(playerId: number): Promise<ProfileJson> {
    return (await OpenDota.request<PlayerProfileJson>(format('https://api.opendota.com/api/players/%s', playerId))).profile;
  }

  public static async getRecentMatchesForPlayer(playerId: number, count: number): Promise<RecentMatchJson[]> {
    return await OpenDota.request<RecentMatchJson[]>(format('https://api.opendota.com/api/players/%s/matches?limit=%s', playerId, count));
  }

  public static async getMatchDetails(matchId: number): Promise<MatchJson> {
    return await OpenDota.request<MatchJson>(format('https://api.opendota.com/api/matches/%s', matchId));
  }

  private static async request<T>(url: string) : Promise<T> {
    return (await limiter.schedule(() => Axios.get<T>(url))).data;
  }
}