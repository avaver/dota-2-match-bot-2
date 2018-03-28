'use strict';

import * as log from 'log4js';
import { OpenDota } from '../api/opendota';
import { Profile } from '../model/opendota-types';
import { CacheItem } from '../model/matchbot-types';
import { CACHE_EXP_PROFILE_MS } from '../config/config';

export namespace ProfileService {
  const logger = log.getLogger('profile-service');
  const profileCache = new Map<number, CacheItem<Profile>>();

  export function getProfile(accountId: number): Promise<Profile> {
    let cachedProfile = profileCache.get(accountId);

    if (cachedProfile && cachedProfile.added > Date.now() - CACHE_EXP_PROFILE_MS) {
      logger.debug('using cached profile for account %s', accountId);
      return Promise.resolve(cachedProfile.item);
    } else { 
      logger.trace('loading profile for account %s', accountId);
      return OpenDota.getPlayer(accountId).then(player => {
        if (player.profile) {
          profileCache.set(accountId, new CacheItem(player.profile, Date.now()));
          return player.profile;
        } else {
          throw new Error('player not found');
        }
      });
    }
  }
}