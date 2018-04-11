'use strict';

import * as log from 'log4js';
import * as api from 'firebase-admin';
import { Observable, Subject } from 'rxjs';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/secure-config';
import { PUBLISHED_MATCH_STORAGE_S } from '../config/config';

const logger = log.getLogger('firebase');

logger.info('initializing firebase');
api.initializeApp({
  credential: api.credential.cert(FIREBASE_CERT),
  databaseURL: FIREBASE_DB_URL
});

export namespace Firebase {
  const subjects = new Map<string, Subject<any>>();
  
  export function startMonitoring<T>(path: string): Observable<T> {
    let subject = subjects.get(path) as Subject<T>;
    if (!subject) {
      logger.info('start monitoring firebase path "%s"', path);
      subject = new Subject<T>();
      subjects.set(path, subject);

      api.database().ref(path).on('value', snapshot => {
        if (snapshot) {
          let value = snapshot.val() as T;
          if (value) {
            logger.debug('firebase data changed at "%s"', path);
            subject.next(value);
          }
        }
      });
    }

    return subject;
  }

  export function stopMonitoring(path: string): void {
    logger.info('stop monitoring firebase path "%s"', path);
    api.database().ref(path).off('value');
    subjects.delete(path);
  }

  export function addAccount(id: number): void {
    api.database().ref('accounts').once('value').then(snapshot => {
      let accounts = snapshot.val() as number[];
      if (!accounts) {
        logger.debug('there are no accounts data in firebase yet');
        accounts = [];
      }

      let index = accounts.indexOf(id);
      if (index < 0) {
        accounts.push(id);
        api.database().ref('accounts').set(accounts);
        logger.info('account %s added to firebase', id);
      } else {
        logger.info('account %s is already in firebase', id);
      }
    });
  }

  export function removeAccount(id: number): void {
    api.database().ref('accounts').once('value').then(snapshot => {
      let accounts = snapshot.val() as number[];
      if (accounts) {
        let index = accounts.indexOf(id);
        if (index >= 0) {
          accounts.splice(index, 1);
          api.database().ref('accounts').set(accounts);
          logger.info('account %s removed from firebase', id);
        }
      }
    });
  }

  export function getAccounts(): Promise<number[]> {
    logger.trace('requesting accounts');
    return api.database().ref('accounts').once('value').then(snapshot => snapshot.val() as number[]);
  }

  export function addPublishedMatch(id: number, endTime: number): Promise<void> {
    logger.trace('saving published match %s finished at %s', id, new Date(endTime * 1000).toISOString());
    return api.database().ref('matches/' + id).set(endTime).then(() => cleanupOldPublishedMatches());
  }

  export function cleanupOldPublishedMatches(): Promise<void> {
    logger.trace('cleaning up outdated published matches');
    return api.database().ref('matches')
      .orderByValue()
      .endAt(Math.floor(Date.now() / 1000 - PUBLISHED_MATCH_STORAGE_S))
      .once('value').then(snapshot => snapshot.forEach((child: api.database.DataSnapshot) => { child.ref.remove(); return false; }));
  }

  export function getRecentPublishedMatches(): Promise<number[]> {
    logger.trace('requesting recently published matches');
    return api.database().ref('matches').once('value').then(snapshot => snapshot.val() ? Object.keys(snapshot.val()).map(key => parseInt(key)) : []);
  }
}