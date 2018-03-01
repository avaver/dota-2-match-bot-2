'use strict';

import OpenDota from './api/opendota';

const players = [298134653, 333303976, 118975931];

players.forEach(processPlayer);

async function processPlayer(id: number) {
  try {
    let profile = await OpenDota.getPlayer(id);
    let match = (await OpenDota.getRecentMatchesForPlayer(id, 1))[0];
    console.log('%s %s свій останній матч з рахунком %s/%s/%s', profile.personaname, match.player_slot >= 128 != match.radiant_win ? 'виграв' : 'програв', match.kills, match.deaths, match.assists);
  } catch (error) {
    console.log(error.message);
  }
} 