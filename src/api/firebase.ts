'use strict';

import * as api from 'firebase-admin';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/config';
import { Observable } from 'rxjs';

export default class Firebase {
  constructor() {
    api.initializeApp({
      credential: api.credential.cert(FIREBASE_CERT),
      databaseURL: FIREBASE_DB_URL
    });
  }

  public startMonitoring<T>(path: string): Observable<T> {
    return new Observable<T>(observer => {
      api.database().ref(path).on('value', snapshot => {
        if (snapshot) {
          let value = snapshot.val() as T;
          if (value) {
            console.log('value changed: "%s"', path);
            observer.next(value);
          }
        }
      });
    });
  }

  public stopMonitoring(path: string): void {
    api.database().ref(path).off('value');
  }
}