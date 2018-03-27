'use strict';

import { Observable, BehaviorSubject } from 'rxjs';
import { Firebase } from '../api/firebase';
import { ProfileService } from './profile-service';
import { Profile } from '../model/opendota-types';
import { Account } from '../model/matchbot-types';
import { Firestore } from '../api/firebase-firestore';

export namespace AccountService {
  const accounts = new BehaviorSubject<Profile[]>([]);
  const accounts2 = new BehaviorSubject<Account[]>([]);

  Firebase.startMonitoring<number[]>('accounts')
    .flatMap(ids => Observable.forkJoin(ids.map(id => ProfileService.getProfile(id))))
    .subscribe(accounts);

  Firestore.startMonitoring()
    .flatMap(accs => Observable.forkJoin(accs.map(a => ProfileService.getProfile(a.id))), (accs, profs) => accs.map(a => { a.profile = profs.find(p => p.account_id === a.id); return a; }))
    .subscribe(accounts2);

  export function getAccounts(): Observable<Profile[]> {
    return accounts;
  }

  export function getAccounts2(): Observable<Account[]> {
    return accounts2;
  }
}