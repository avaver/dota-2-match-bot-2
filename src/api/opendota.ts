'use strict';

import * as log from 'log4js';
import Axios from 'axios';
import Bottleneck from 'bottleneck';
import { format } from 'util';
import { OPENDOTA_MIN_REQUEST_FREQ_MS, OPENDOTA_MAX_RETRIES } from '../config/config';
import { Player, RecentMatch, Match, Hero } from '../model/opendota-types';

const logger = log.getLogger('opendota');

logger.info('initializing request limiter');
const limiter: Bottleneck = new Bottleneck({
  maxConcurrent: 1,
  minTime: OPENDOTA_MIN_REQUEST_FREQ_MS
});

export namespace OpenDota {
  const API_URL = 'https://api.opendota.com/api';

  export function getPlayer(playerId: number): Promise<Player> {
    return requestWithRetry<Player>(format('%s/players/%s', API_URL, playerId));
  }

  export function getRecentMatchesForPlayer(playerId: number, count: number): Promise<RecentMatch[]> {
    return requestWithRetry<RecentMatch[]>(format('%s/players/%s/matches?limit=%s', API_URL, playerId, count));
  }

  export function getLastMatchForPlayer(playerId: number): Promise<RecentMatch> {
    return getRecentMatchesForPlayer(playerId, 1).then(matches => matches[0]);
  }

  export function getMatchDetails(matchId: number): Promise<Match> {
    return requestWithRetry<Match>(format('%s/matches/%s', API_URL, matchId));
  }

  export function getHeroes(): Promise<Hero[]> {
    return requestWithRetry<Hero[]>(format('%s/heroes', API_URL));
  }

  function requestWithRetry<T>(url: string, attempt = 1): Promise<T> {
    return limiter.schedule(() => { 
      logger.trace('[attempt %s] %s', attempt, url.replace(API_URL, '')); 
      return Axios.get<T>(url); 
    })
    .then(response => response.data)
    .catch(error => {
      logger.warn('[attempt %s] %s failed with error: %s', attempt, url.replace(API_URL, ''), error.message); 
      if (attempt <= OPENDOTA_MAX_RETRIES) { 
        logger.trace('%s retrying', url.replace(API_URL, ''));
        return delay(1000 * attempt).then(() => requestWithRetry<T>(url, attempt + 1));
      } else {
        logger.error('%s failed, giving up after %s attempts', url.replace(API_URL, ''), attempt - 1);
        return Promise.reject(error);
      }
    });
  }

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}