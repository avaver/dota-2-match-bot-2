'use strict';

export class CacheItem<T> {
  constructor(public item: T, public added: number) {}
}