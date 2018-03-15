'use strict';

import * as log from 'log4js';
import { OpenDota } from '../api/opendota';
import { Profile } from '../model/opendota-types';
import { Observable } from 'rxjs';
import { CacheItem } from '../model/matchbot-types';
import { CACHE_EXP_PROFILE_MS } from '../config/config';

export namespace ProfileService {
  const logger = log.getLogger('profile-service');
  const profileCache = new Map<number, CacheItem<Profile>>();

  export function getProfile(accountId: number): Observable<Profile> {
    logger.debug('loading profile for account %s', accountId);
    let cachedProfile = profileCache.get(accountId);

    if (cachedProfile && cachedProfile.added > Date.now() - CACHE_EXP_PROFILE_MS) {
      logger.debug('using cached profile for account %s', accountId);
      return Observable.of(cachedProfile.item);
    } else { 
      let profileObservable = OpenDota.getPlayer(accountId).map(p => p.profile);
      profileObservable.subscribe(profile => profileCache.set(accountId, new CacheItem(profile, Date.now())));
      return profileObservable;
    }
  }
}