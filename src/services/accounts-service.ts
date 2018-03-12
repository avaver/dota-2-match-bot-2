'use strict';

import { Observable } from 'rxjs';
import { Player } from '../api/opendota-types';
import OpenDota from '../api/opendota';
import Firebase from '../api/firebase';

export class Account {
  constructor(public id: number, public name?: string, public avatarUrl?: string) {}
}

export default class AccountService {
  private firebase = new Firebase();
  public accounts: Account[] = [];
  /*[
    new Account(298134653),
    new Account(333303976),
    new Account(118975931),
    new Account(86848474),
    new Account(314684987),
    new Account(36753317),
  ];*/

  constructor() {
    this.firebase.startMonitoring<number[]>('accounts').subscribe(ids => this.updateAccounts(ids));
    Observable.interval(60 * 1000)
      .flatMap(() => this.accounts.map(account => OpenDota.getPlayer(account.id))).mergeAll()
      .subscribe(account => this.updateAccountDetails(account));
  }

  private updateAccounts(ids: number[]): void {
    Observable
      .forkJoin(ids.filter(id => id).map(OpenDota.getPlayer))
      .subscribe(players => {
        this.accounts = players.map(p => new Account(p.profile.account_id, p.profile.personaname, p.profile.avatarfull))
      });
  }

  private updateAccountDetails(player: Player): void {
    let account = this.accounts.find(account => account.id == player.profile.account_id);
    if (account) {
      console.log('updating account details for %s', account.id);
      account.name = player.profile.personaname;
      account.avatarUrl = player.profile.avatarfull;
    }
  }
}