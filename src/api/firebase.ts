'use strict';

import * as log from 'log4js';
import * as api from 'firebase-admin';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/secure-config';
import { Observable, Subject } from 'rxjs';

const logger = log.getLogger('firebase');

logger.info('initializing firebase');
api.initializeApp({
  credential: api.credential.cert(FIREBASE_CERT),
  databaseURL: FIREBASE_DB_URL
});

const db = api.firestore();
db.collection('accounts').get().then(s => {
  console.log(s.docs.map(d => d.data()));
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
            logger.info('firebase data changed at "%s"', path);
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
    return api.database().ref('accounts').once('value').then(snapshot => snapshot.val() as number[]);
  }
}