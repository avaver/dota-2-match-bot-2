'use strict';

import { Observable, BehaviorSubject } from 'rxjs';
import { Firebase } from '../api/firebase';

export namespace PublishedService {
  const published = new BehaviorSubject<number[]>([]);

  Firebase.startMonitoring<any>('matches').map(data => data ? Object.keys(data).map(key => parseInt(key)) : []).subscribe(published);

  export function getMatches(): Observable<number[]> {
    return published;
  }
}