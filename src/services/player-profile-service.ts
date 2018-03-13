'use strict';

import * as log from 'log4js';
import OpenDota from '../api/opendota';
import { Profile } from '../model/opendota-types';
import { Observable } from 'rxjs';

class CacheItem<T> {
  constructor(public item: T, public added: number) {}
}

const logger = log.getLogger('profile-service');

export default class PlayerProfileService {
  static CACHE_EXPIRATION_PERIOD_MS = 60 * 1000;
  private profileCache = new Map<number, CacheItem<Profile>>();

  public getProfile(accountId: number): Observable<Profile> {
    logger.debug('loading profile for account %s', accountId);
    let cachedProfile = this.profileCache.get(accountId);
    if (cachedProfile && cachedProfile.added > Date.now() - PlayerProfileService.CACHE_EXPIRATION_PERIOD_MS) {
      logger.debug('using cached profile for account %s', accountId);
      return Observable.of(cachedProfile.item);
    } else { 
      let profileObservable = OpenDota.getPlayer(accountId).map(p => p.profile);
      profileObservable.subscribe(profile => this.profileCache.set(accountId, new CacheItem(profile, Date.now())));
      return profileObservable;
    }
  }
}