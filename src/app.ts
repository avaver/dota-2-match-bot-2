'use strict';

import MatchMonitorService from './services/match-monitor-service';
import DiscordMessageService from './services/discord-message-service';
import DiscordWebhook from './api/discord-webhook';
import { Match, MatchPlayer, HEROES, Hero } from './api/opendota-types';
import { format } from 'util';
import PlayerProfileService from './services/player-profile-service';
import { Observable } from 'rxjs';

const messageService = new DiscordMessageService();
const profileService = new PlayerProfileService();

const accounts = [298134653, 333303976, 118975931, 86848474, 314684987, 36753317];
const avatars = new Map<number, string>();

const monitorService = new MatchMonitorService(accounts);

Observable.from(accounts.map(account => profileService.getProfile(account))).mergeAll() // get profiles
  .subscribe(profile => avatars.set(profile.account_id, profile.avatar)); // and save them in local map

let matchSubscribtion = monitorService.getMatchStream(10000) // get match stream
.map(match => messageService.getMatchSummaryMessage(setAvatar(match))) // generate discord message for each incoming match
.subscribe(DiscordWebhook.post, error => console.log(error.message)); // and finally post it

setTimeout(() => matchSubscribtion.unsubscribe(), 60000);

function setAvatar(match: Match): Match {
  console.log('processing match %s', match.match_id);
  match.players.forEach(p => { p.avatar = avatars.get(p.account_id); console.log('avatar set for %s', p.personaname); });
  return match;
}