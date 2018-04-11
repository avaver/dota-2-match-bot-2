'use strict';

import { Observable, BehaviorSubject } from 'rxjs';
import { DB } from '../api/firebase-db';

export namespace PublishedService {
  const published = new BehaviorSubject<number[]>([]);

  DB.startMonitoringMatches().subscribe(published);

  export function getMatches(): Observable<number[]> {
    return published;
  }
}