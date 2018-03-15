'use strict';

import { Observable, BehaviorSubject } from 'rxjs';
import { Firebase } from '../api/firebase';
import { ProfileService } from './profile-service';
import { Profile } from '../model/opendota-types';

export namespace AccountService {
  const accounts = new BehaviorSubject<Profile[]>([]);

  Firebase.startMonitoring<number[]>('accounts')
    .flatMap(ids => Observable.forkJoin(ids.map(id => ProfileService.getProfile(id))))
    .subscribe(accounts);

  export function getAccounts(): Observable<Profile[]> {
    return accounts;
  }
}