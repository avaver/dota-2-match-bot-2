'use strict';

import OpenDota from './api/opendota';
import { Observable } from 'rxjs';
import { RecentMatch } from './api/opendota-types';
import Bottleneck from 'bottleneck';

const players = [298134653, 333303976, 118975931];

//players.forEach(processPlayer);

async function processPlayer(id: number) {
  try {
    let player = await OpenDota.getPlayer(id);
    let match = (await OpenDota.getRecentMatchesForPlayer(id, 1))[0];
    console.log('%s %s свій останній матч з рахунком %s/%s/%s', player.profile.personaname, match.player_slot >= 128 != match.radiant_win ? 'виграв' : 'програв', match.kills, match.deaths, match.assists);
  } catch (error) {
    console.log(error.message);
  }
} 

class MatchData {
  constructor(public playerId: number, public matchId: number) {}
}

class GroupedMatchData {
  constructor(public matchId: number, public playerIds: number[]) {}
}

const limiter: Bottleneck = new Bottleneck({
  maxConcurrent: 1,
  minTime: 500
});

async function getMatch(id: number): Promise<number> {
  return limiter.schedule(() => new Promise<number>(r => r(100 + id % 2)));
}

const accounts = [1, 2, 3];
const scheduler = Observable.interval(3000);

function requestMatchData(): Observable<MatchData> {
  let gamers = Observable.from(accounts);
  let matches = Observable.from(accounts.map(a => getMatch(a))).flatMap(p => Observable.fromPromise(p));
  
  let result = Observable.zip(gamers, matches, (g, m) => new MatchData(g, m));

  result.groupBy(md => md.matchId, md => md.playerId).subscribe(console.log);

  return result;
}

(async () => {
  let x = scheduler.flatMap(requestMatchData);
  x.take(3).subscribe(m => console.log(m));
})();