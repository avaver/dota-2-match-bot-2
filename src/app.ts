'use strict';

import MatchMonitorService from './services/match-monitor-service';
import DiscordMessageService from './services/discord-message-service';
import DiscordWebhook from './api/discord-webhook';
import { Match, MatchPlayer, HEROES, Hero } from './api/opendota-types';
import { format } from 'util';
import PlayerProfileService from './services/player-profile-service';
import { Observable } from 'rxjs';

const accounts = [298134653, 333303976, 118975931, 86848474, 314684987, 36753317];

const monitorService = new MatchMonitorService(accounts);
const messageService = new DiscordMessageService();
const profileService = new PlayerProfileService();

const avatars = new Map<number, string>();
Observable.from(accounts.map(account => profileService.getProfile(account))).mergeAll().subscribe(profile => { avatars.set(profile.account_id, profile.avatar); console.log(profile.personaname);});
let matchSubscribtion = monitorService.getMatchStream(10000)
.map(match => messageService.getMatchSummaryMessage(setAvatar(match)))
.subscribe(DiscordWebhook.post, console.log);

setTimeout(() => matchSubscribtion.unsubscribe(), 60000);

function setAvatar(match: Match): Match {
  console.log('asdasd');
  match.players.forEach(p => p.avatar = avatars.get(p.account_id));
  return match;
}