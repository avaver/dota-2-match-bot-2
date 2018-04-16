import { Profile } from "./opendota-types";

'use strict';

export class CacheItem<T> {
  constructor(public item: T, public added: number) {}
}

export class Account {
  public profile?: Profile;
  public timestamp?: Date;
  constructor(public id: number, public addedBy: string, public serverId: string, public channelId: string, public lastMatchId = 0) {}
}