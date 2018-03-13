'use strict';

import * as api from 'firebase-admin';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/config';
import { Observable, Subject } from 'rxjs';

api.initializeApp({
  credential: api.credential.cert(FIREBASE_CERT),
  databaseURL: FIREBASE_DB_URL
});

export default class Firebase {
  private static subjects = new Map<string, Subject<any>>();
  
  public startMonitoring<T>(path: string): Observable<T> {
    let subject = Firebase.subjects.get(path) as Subject<T>;
    if (!subject) {
      subject = new Subject<T>();
      Firebase.subjects.set(path, subject);

      api.database().ref(path).on('value', snapshot => {
        if (snapshot) {
          let value = snapshot.val() as T;
          if (value) {
            subject.next(value);
          }
        }
      });
    }

    return subject;
  }

  public stopMonitoring(path: string): void {
    api.database().ref(path).off('value');
    Firebase.subjects.delete(path);
  }
}