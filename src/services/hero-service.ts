'use strict';

import * as log from 'log4js';
import { OpenDota } from '../api/opendota';
import { Hero } from '../model/opendota-types';
import { CacheItem } from '../model/matchbot-types';
import { CACHE_EXP_HEROES_MS } from '../config/config';

export namespace HeroService {
  const logger = log.getLogger('hero-service');
  let heroCache = new CacheItem(new Array<Hero>(), 0);

  export function getHeroes(): Promise<Hero[]> {
    if (heroCache && heroCache.added > Date.now() - CACHE_EXP_HEROES_MS) {
      logger.debug('using cached heroes list');
      return Promise.resolve(heroCache.item);
    } else { 
      logger.info('loading heroes');
      return OpenDota.getHeroes().then(heroes => { 
        heroCache = new CacheItem(heroes, Date.now()); 
        return heroes; 
      });
    }
  }
}