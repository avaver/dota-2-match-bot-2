'use strict';
/*
import OpenDota from '../api/opendota';
import { RecentMatch } from '../api/opendota-types';
import { Observable, Subscription } from 'rxjs';

class MatchData {
  public matchId: number = 0;
  public playerIds: number[] = [];

  consctructor(matchId: number, playerIds: number[]){
    this.matchId = matchId;
    this.playerIds = playerIds;
  }
};

export default class MatchMonitorService {
  private _accounts: number[] = [];

  private scheduler = Observable.interval(1000);
  private subscription: Subscription | undefined;
  private publisher: Observable<MatchData> | undefined;

  public get accounts() {
    return this._accounts;
  }

  public set accounts(value: number[]) {
    this.stop();
    this._accounts = value;
    //this.start();
  }

  public start(): Observable<MatchData> {
    //this.publisher = new Observable<MatchData>().distinct(m => m.matchId);
    this.subscription = this.scheduler.subscribe(console.log);
    let s = this.scheduler.flatMap(this.requestMatchData).map((m) => { return new MatchData(m.match_id) });
  }

  public stop(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private requestMatchData(): Observable<RecentMatch> {
    return Observable.from(this.accounts.map(a => OpenDota.getLastMatchForPlayer(a))).flatMap(p => Observable.fromPromise(p)).map(m => m.);
  }
}
*/