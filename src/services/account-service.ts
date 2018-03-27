'use strict';

import { Observable, BehaviorSubject } from 'rxjs';
import { ProfileService } from './profile-service';
import { Account } from '../model/matchbot-types';
import { DB } from '../api/firebase-db';

export namespace AccountService {
  const accounts = new BehaviorSubject<Account[]>([]);

  DB.startMonitoring()
    .flatMap(accs => Observable.forkJoin(accs.map(a => ProfileService.getProfile(a.id))), (accs, profs) => accs.map(a => { a.profile = profs.find(p => p.account_id === a.id); return a; }))
    .subscribe(accounts);

  export function getAccounts(): Observable<Account[]> {
    return accounts;
  }
}