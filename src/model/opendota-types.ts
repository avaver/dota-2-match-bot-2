export interface Match {
  match_id: number;
  barracks_status_dire: number;
  barracks_status_radiant: number;
  chat: [
      {
          time: number;
          unit: string;
          key: string;
          slot: number;
          player_slot: number
      }
  ];
  cluster: number;
  cosmetics: {};
  dire_score: number;
  draft_timings: [
      {
          order: number;
          pick: boolean;
          active_team: number;
          hero_id: number;
          player_slot: number;
          extra_time: number;
          total_time_taken: number
      }
  ];
  duration: number;
  engine: number;
  first_blood_time: number;
  game_mode: number;
  human_players: number;
  leagueid: number;
  lobby_type: number;
  match_seq_num: number;
  negative_votes: number;
  objectives: [{
      key: [string];
      player_slot: number;
      type: string;
  }];
  picks_bans: {};
  positive_votes: number;
  radiant_gold_adv: {};
  radiant_score: number;
  radiant_win: boolean;
  radiant_xp_adv: {};
  start_time: number;
  teamfights: {};
  tower_status_dire: number;
  tower_status_radiant: number;
  version: number;
  replay_salt: number;
  series_id: number;
  series_type: number;
  radiant_team: {};
  dire_team: {};
  league: {};
  skill: number;
  patch: number;
  region: number;
  all_word_counts: {};
  my_word_counts: {};
  throw: number;
  loss: number;
  replay_url: string;
  players: MatchPlayer[];
}

export interface MatchPlayer {
  firstblood_claimed: number;
  match_id: number;
  player_slot: number;
  ability_upgrades_arr: [
      number
  ];
  ability_uses: {};
  ability_targets: {};
  account_id: number;
  avatar?: string;
  actions: {};
  additional_units: {};
  assists: number;
  backpack_number: number;
  backpack_1: number;
  backpack_2: number;
  buyback_log: [
      {
          time: number;
          slot: number;
          player_slot: number
      }
  ];
  camps_stacked: number;
  creeps_stacked: number;
  damage: {};
  damage_inflictor: {};
  damage_inflictor_received: {};
  damage_taken: {};
  deaths: number;
  denies: number;
  dn_t: [
      number
  ];
  gold: number;
  gold_per_min: number;
  gold_reasons: {};
  gold_spent: number;
  gold_t: [
      number
  ];
  hero_damage: number;
  hero_healing: number;
  hero_hits: {};
  hero_id: number;
  item_number: number;
  item_1: number;
  item_2: number;
  item_3: number;
  item_4: number;
  item_5: number;
  item_uses: {};
  kill_streaks: {};
  killed: {};
  killed_by: {};
  kills: number;
  kills_log: [
      {
          time: number;
          key: string
      }
  ];
  lane_pos: {};
  last_hits: number;
  leaver_status: number;
  level: number;
  lh_t: [
      number
  ];
  life_state: {};
  max_hero_hit: { value: number };
  multi_kills: {};
  obs: {};
  obs_left_log: [
      {}
  ];
  obs_log: [
      {}
  ];
  obs_placed: number;
  party_id: number;
  permanent_buffs: [
      {}
  ];
  pings: number;
  purchase: {};
  purchase_log: [
      {
          time: number;
          key: string
      }
  ];
  rune_pickups: number;
  runes: {
      property1: number;
      property2: number
  };
  runes_log: [
      {
          time: number;
          key: number
      }
  ];
  sen: {};
  sen_left_log: [
      {}
  ];
  sen_log: [
      {}
  ];
  sen_placed: number;
  stuns: number;
  times: [
      number
  ];
  tower_damage: number;
  xp_per_min: number;
  xp_reasons: {};
  xp_t: [
      number
  ];
  personaname: string;
  name: string;
  last_login: number;
  radiant_win: boolean;
  start_time: number;
  duration: number;
  cluster: number;
  lobby_type: number;
  game_mode: number;
  patch: number;
  region: number;
  isRadiant: boolean;
  win: number;
  lose: number;
  total_gold: number;
  total_xp: number;
  kills_per_min: number;
  kda: number;
  abandons: number;
  neutral_kills: number;
  tower_kills: number;
  courier_kills: number;
  lane_kills: number;
  hero_kills: number;
  observer_kills: number;
  sentry_kills: number;
  roshan_kills: number;
  necronomicon_kills: number;
  ancient_kills: number;
  buyback_count: number;
  observer_uses: number;
  sentry_uses: number;
  lane_efficiency: number;
  lane_efficiency_pct: number;
  lane: number;
  lane_role: number;
  is_roaming: boolean;
  purchase_time: {};
  first_purchase_time: {};
  item_win: {};
  item_usage: {};
  purchase_tpscroll: {};
  actions_per_min: number;
  life_state_dead: number;
  rank_tier: number;
  cosmetics: [
      number
  ];
}

export interface Player {
  tracked_until: string;
  solo_competitive_rank: string;
  competitive_rank: string;
  rank_tier: number;
  leaderboard_rank: number;
  mmr_estimate: {
      estimate: number;
      stdDev: number;
      n: number
  };
  profile: Profile;
}

export interface Profile {
  account_id: number;
  personaname: string;
  name: string;
  cheese: number;
  steamid: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  profileurl: string;
  last_login: string;
  loccountrycode: string;
}

export interface RecentMatch {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  duration: number;
  game_mode: number;
  lobby_type: number;
  hero_id: number;
  start_time: number;
  version: number;
  kills: number;
  deaths: number;
  assists: number;
  skill: number;
  lane: number;
  lane_role: number;
  is_roaming: boolean;
  cluster: number;
  leaver_status: number;
  party_size: number;
}

export interface Hero {
    id: number;
    name: string;
    localized_name: string;
}

export const HEROES: Hero[] = [
    {
        "name": "antimage",
        "id": 1,
        "localized_name": "Anti-Mage"
    },
    {
        "name": "axe",
        "id": 2,
        "localized_name": "Axe"
    },
    {
        "name": "bane",
        "id": 3,
        "localized_name": "Bane"
    },
    {
        "name": "bloodseeker",
        "id": 4,
        "localized_name": "Bloodseeker"
    },
    {
        "name": "crystal_maiden",
        "id": 5,
        "localized_name": "Crystal Maiden"
    },
    {
        "name": "drow_ranger",
        "id": 6,
        "localized_name": "Drow Ranger"
    },
    {
        "name": "earthshaker",
        "id": 7,
        "localized_name": "Earthshaker"
    },
    {
        "name": "juggernaut",
        "id": 8,
        "localized_name": "Juggernaut"
    },
    {
        "name": "mirana",
        "id": 9,
        "localized_name": "Mirana"
    },
    {
        "name": "nevermore",
        "id": 11,
        "localized_name": "Shadow Fiend"
    },
    {
        "name": "morphling",
        "id": 10,
        "localized_name": "Morphling"
    },
    {
        "name": "phantom_lancer",
        "id": 12,
        "localized_name": "Phantom Lancer"
    },
    {
        "name": "puck",
        "id": 13,
        "localized_name": "Puck"
    },
    {
        "name": "pudge",
        "id": 14,
        "localized_name": "Pudge"
    },
    {
        "name": "razor",
        "id": 15,
        "localized_name": "Razor"
    },
    {
        "name": "sand_king",
        "id": 16,
        "localized_name": "Sand King"
    },
    {
        "name": "storm_spirit",
        "id": 17,
        "localized_name": "Storm Spirit"
    },
    {
        "name": "sven",
        "id": 18,
        "localized_name": "Sven"
    },
    {
        "name": "tiny",
        "id": 19,
        "localized_name": "Tiny"
    },
    {
        "name": "vengefulspirit",
        "id": 20,
        "localized_name": "Vengeful Spirit"
    },
    {
        "name": "windrunner",
        "id": 21,
        "localized_name": "Windranger"
    },
    {
        "name": "zuus",
        "id": 22,
        "localized_name": "Zeus"
    },
    {
        "name": "kunkka",
        "id": 23,
        "localized_name": "Kunkka"
    },
    {
        "name": "lina",
        "id": 25,
        "localized_name": "Lina"
    },
    {
        "name": "lich",
        "id": 31,
        "localized_name": "Lich"
    },
    {
        "name": "lion",
        "id": 26,
        "localized_name": "Lion"
    },
    {
        "name": "shadow_shaman",
        "id": 27,
        "localized_name": "Shadow Shaman"
    },
    {
        "name": "slardar",
        "id": 28,
        "localized_name": "Slardar"
    },
    {
        "name": "tidehunter",
        "id": 29,
        "localized_name": "Tidehunter"
    },
    {
        "name": "witch_doctor",
        "id": 30,
        "localized_name": "Witch Doctor"
    },
    {
        "name": "riki",
        "id": 32,
        "localized_name": "Riki"
    },
    {
        "name": "enigma",
        "id": 33,
        "localized_name": "Enigma"
    },
    {
        "name": "tinker",
        "id": 34,
        "localized_name": "Tinker"
    },
    {
        "name": "sniper",
        "id": 35,
        "localized_name": "Sniper"
    },
    {
        "name": "necrolyte",
        "id": 36,
        "localized_name": "Necrophos"
    },
    {
        "name": "warlock",
        "id": 37,
        "localized_name": "Warlock"
    },
    {
        "name": "beastmaster",
        "id": 38,
        "localized_name": "Beastmaster"
    },
    {
        "name": "queenofpain",
        "id": 39,
        "localized_name": "Queen of Pain"
    },
    {
        "name": "venomancer",
        "id": 40,
        "localized_name": "Venomancer"
    },
    {
        "name": "faceless_void",
        "id": 41,
        "localized_name": "Faceless Void"
    },
    {
        "name": "skeleton_king",
        "id": 42,
        "localized_name": "Wraith King"
    },
    {
        "name": "death_prophet",
        "id": 43,
        "localized_name": "Death Prophet"
    },
    {
        "name": "phantom_assassin",
        "id": 44,
        "localized_name": "Phantom Assassin"
    },
    {
        "name": "pugna",
        "id": 45,
        "localized_name": "Pugna"
    },
    {
        "name": "templar_assassin",
        "id": 46,
        "localized_name": "Templar Assassin"
    },
    {
        "name": "viper",
        "id": 47,
        "localized_name": "Viper"
    },
    {
        "name": "luna",
        "id": 48,
        "localized_name": "Luna"
    },
    {
        "name": "dragon_knight",
        "id": 49,
        "localized_name": "Dragon Knight"
    },
    {
        "name": "dazzle",
        "id": 50,
        "localized_name": "Dazzle"
    },
    {
        "name": "rattletrap",
        "id": 51,
        "localized_name": "Clockwerk"
    },
    {
        "name": "leshrac",
        "id": 52,
        "localized_name": "Leshrac"
    },
    {
        "name": "furion",
        "id": 53,
        "localized_name": "Nature's Prophet"
    },
    {
        "name": "life_stealer",
        "id": 54,
        "localized_name": "Lifestealer"
    },
    {
        "name": "dark_seer",
        "id": 55,
        "localized_name": "Dark Seer"
    },
    {
        "name": "clinkz",
        "id": 56,
        "localized_name": "Clinkz"
    },
    {
        "name": "omniknight",
        "id": 57,
        "localized_name": "Omniknight"
    },
    {
        "name": "enchantress",
        "id": 58,
        "localized_name": "Enchantress"
    },
    {
        "name": "huskar",
        "id": 59,
        "localized_name": "Huskar"
    },
    {
        "name": "night_stalker",
        "id": 60,
        "localized_name": "Night Stalker"
    },
    {
        "name": "broodmother",
        "id": 61,
        "localized_name": "Broodmother"
    },
    {
        "name": "bounty_hunter",
        "id": 62,
        "localized_name": "Bounty Hunter"
    },
    {
        "name": "weaver",
        "id": 63,
        "localized_name": "Weaver"
    },
    {
        "name": "jakiro",
        "id": 64,
        "localized_name": "Jakiro"
    },
    {
        "name": "batrider",
        "id": 65,
        "localized_name": "Batrider"
    },
    {
        "name": "chen",
        "id": 66,
        "localized_name": "Chen"
    },
    {
        "name": "spectre",
        "id": 67,
        "localized_name": "Spectre"
    },
    {
        "name": "doom_bringer",
        "id": 69,
        "localized_name": "Doom"
    },
    {
        "name": "ancient_apparition",
        "id": 68,
        "localized_name": "Ancient Apparition"
    },
    {
        "name": "ursa",
        "id": 70,
        "localized_name": "Ursa"
    },
    {
        "name": "spirit_breaker",
        "id": 71,
        "localized_name": "Spirit Breaker"
    },
    {
        "name": "gyrocopter",
        "id": 72,
        "localized_name": "Gyrocopter"
    },
    {
        "name": "alchemist",
        "id": 73,
        "localized_name": "Alchemist"
    },
    {
        "name": "invoker",
        "id": 74,
        "localized_name": "Invoker"
    },
    {
        "name": "silencer",
        "id": 75,
        "localized_name": "Silencer"
    },
    {
        "name": "obsidian_destroyer",
        "id": 76,
        "localized_name": "Outworld Devourer"
    },
    {
        "name": "lycan",
        "id": 77,
        "localized_name": "Lycanthrope"
    },
    {
        "name": "brewmaster",
        "id": 78,
        "localized_name": "Brewmaster"
    },
    {
        "name": "shadow_demon",
        "id": 79,
        "localized_name": "Shadow Demon"
    },
    {
        "name": "lone_druid",
        "id": 80,
        "localized_name": "Lone Druid"
    },
    {
        "name": "chaos_knight",
        "id": 81,
        "localized_name": "Chaos Knight"
    },
    {
        "name": "meepo",
        "id": 82,
        "localized_name": "Meepo"
    },
    {
        "name": "treant",
        "id": 83,
        "localized_name": "Treant Protector"
    },
    {
        "name": "ogre_magi",
        "id": 84,
        "localized_name": "Ogre Magi"
    },
    {
        "name": "undying",
        "id": 85,
        "localized_name": "Undying"
    },
    {
        "name": "rubick",
        "id": 86,
        "localized_name": "Rubick"
    },
    {
        "name": "disruptor",
        "id": 87,
        "localized_name": "Disruptor"
    },
    {
        "name": "nyx_assassin",
        "id": 88,
        "localized_name": "Nyx Assassin"
    },
    {
        "name": "naga_siren",
        "id": 89,
        "localized_name": "Naga Siren"
    },
    {
        "name": "keeper_of_the_light",
        "id": 90,
        "localized_name": "Keeper of the Light"
    },
    {
        "name": "wisp",
        "id": 91,
        "localized_name": "Io"
    },
    {
        "name": "visage",
        "id": 92,
        "localized_name": "Visage"
    },
    {
        "name": "slark",
        "id": 93,
        "localized_name": "Slark"
    },
    {
        "name": "medusa",
        "id": 94,
        "localized_name": "Medusa"
    },
    {
        "name": "troll_warlord",
        "id": 95,
        "localized_name": "Troll Warlord"
    },
    {
        "name": "centaur",
        "id": 96,
        "localized_name": "Centaur Warrunner"
    },
    {
        "name": "magnataur",
        "id": 97,
        "localized_name": "Magnus"
    },
    {
        "name": "shredder",
        "id": 98,
        "localized_name": "Timbersaw"
    },
    {
        "name": "bristleback",
        "id": 99,
        "localized_name": "Bristleback"
    },
    {
        "name": "tusk",
        "id": 100,
        "localized_name": "Tusk"
    },
    {
        "name": "skywrath_mage",
        "id": 101,
        "localized_name": "Skywrath Mage"
    },
    {
        "name": "abaddon",
        "id": 102,
        "localized_name": "Abaddon"
    },
    {
        "name": "elder_titan",
        "id": 103,
        "localized_name": "Elder Titan"
    },
    {
        "name": "legion_commander",
        "id": 104,
        "localized_name": "Legion Commander"
    },
    {
        "name": "ember_spirit",
        "id": 106,
        "localized_name": "Ember Spirit"
    },
    {
        "name": "earth_spirit",
        "id": 107,
        "localized_name": "Earth Spirit"
    },
    {
        "name": "abyssal_underlord",
        "id": 108,
        "localized_name": "Underlord"
    },
    {
        "name": "terrorblade",
        "id": 109,
        "localized_name": "Terrorblade"
    },
    {
        "name": "phoenix",
        "id": 110,
        "localized_name": "Phoenix"
    },
    {
        "name": "techies",
        "id": 105,
        "localized_name": "Techies"
    },
    {
        "name": "oracle",
        "id": 111,
        "localized_name": "Oracle"
    },
    {
        "name": "winter_wyvern",
        "id": 112,
        "localized_name": "Winter Wyvern"
    },
    {
        "name": "arc_warden",
        "id": 113,
        "localized_name": "Arc Warden"
    }
];