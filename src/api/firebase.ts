'use strict';

import * as log from 'log4js';
import * as api from 'firebase-admin';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/config';
import { Observable, Subject } from 'rxjs';

const logger = log.getLogger('firebase');

logger.info('initializing firebase');
api.initializeApp({
  credential: api.credential.cert(FIREBASE_CERT),
  databaseURL: FIREBASE_DB_URL
});

export default class Firebase {
  private static subjects = new Map<string, Subject<any>>();
  
  public startMonitoring<T>(path: string): Observable<T> {
    let subject = Firebase.subjects.get(path) as Subject<T>;
    if (!subject) {
      logger.info('start monitoring firebase path "%s"', path);
      subject = new Subject<T>();
      Firebase.subjects.set(path, subject);

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

  public stopMonitoring(path: string): void {
    logger.info('stop monitoring firebase path "%s"', path);
    api.database().ref(path).off('value');
    Firebase.subjects.delete(path);
  }

  public addAccount(id: number): void {
    logger.info('add account %s to firebase', id);
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

  public removeAccount(id: number): void {
    logger.info('remove account %s to firebase', id);
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
}