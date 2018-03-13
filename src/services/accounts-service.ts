'use strict';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import Firebase from '../api/firebase';
import PlayerProfileService from './player-profile-service';
import { Profile } from '../model/opendota-types';

export default class AccountService {
  private firebase = new Firebase();
  private profileService = new PlayerProfileService();
  public accounts = new BehaviorSubject<Profile[]>([]);

  constructor() {
    this.firebase.startMonitoring<number[]>('accounts')
    .flatMap(ids => Observable.forkJoin(ids.map(id => this.profileService.getProfile(id))))
    .subscribe(this.accounts);
  }
}