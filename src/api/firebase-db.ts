'use strict';

import * as log from 'log4js';
import * as api from 'firebase-admin';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/secure-config';
import { DISCORD_BOSS_ID, PUBLISHED_MATCH_STORAGE_S } from '../config/config';
import { Account } from '../model/matchbot-types';
import { Subject, Observable } from 'rxjs';
import { format } from 'util';

const logger = log.getLogger('firebase-db');

logger.info('initializing firebase');
const db = api.initializeApp({
  credential: api.credential.cert(FIREBASE_CERT),
  databaseURL: FIREBASE_DB_URL
}, '[FIRESTORE]').firestore();

export namespace DB {
  const ACCOUNTS_KEY = 'accounts';
  const MATCHES_KEY = 'matches';
  let subjectAccounts = new Subject<Account[]>();
  let subjectMatches = new Subject<number[]>();
  let unsubAccounts: () => void;
  let unsubMatches: () => void;
  
  export function addAccount(account: Account): Promise<void> {
    return DB.getAccount(account.id)
      .then(() => Promise.reject(format('Аккаунт %s вже зареєстрований', account.id)))
      .catch(() => 
        db.collection(ACCOUNTS_KEY).add({
          id: account.id,
          addedBy: account.addedBy,
          serverId: account.serverId,
          channelId: account.channelId,
          timestamp: api.firestore.FieldValue.serverTimestamp()
        }).then(() => Promise.resolve()));
  }

  export function removeAccount(id: number, removedBy: string): Promise<void> {
    return db.collection(ACCOUNTS_KEY)
      .where('id', '==', id)
      .get().then(snapshot => {
        if (snapshot.empty) {
          Promise.reject(format('Аккаунту #%s немає в базі', id));
        } else if (removedBy != DISCORD_BOSS_ID && snapshot.docs[0].data().addedBy != removedBy) {
          Promise.reject('Ти не можеш видалити цей аккаунт, тому що ти його не реєстрував');
        }
        return snapshot.docs[0].ref.delete().then(() => Promise.resolve());
      });
  }

  export function getAccount(id: number): Promise<Account> {
    return db.collection(ACCOUNTS_KEY).where('id', '==', id).get().then(snapshot => snapshot.docs[0].data() as Account);
  }

  export function startMonitoringAccounts(): Observable<Account[]> {
    if (!unsubAccounts) {
      unsubAccounts = db.collection(ACCOUNTS_KEY).onSnapshot(snapshot => {
        let accounts = snapshot.docs.map(doc => doc.data() as Account);
        if (accounts && accounts.length > 0) {
          subjectAccounts.next(accounts);
        }
      });
    }

    return subjectAccounts;
  }

  export function stopMonitoringAccounts(): void {
    if (unsubAccounts) {
      unsubAccounts();
    }
  }

  export function startMonitoringMatches(): Observable<number[]> {
    if (!unsubMatches) {
      unsubMatches = db.collection(MATCHES_KEY).onSnapshot(snapshot => {
        let matches = snapshot.empty ? [] : snapshot.docs.map(doc => doc.data().id as number);
        if (matches && matches.length > 0) {
          subjectMatches.next(matches);
        }
      });
    }

    return subjectMatches;
  }

  export function stopMonitoringMatches(): void {
    if (unsubMatches) {
      unsubMatches();
    }
  }

  export function addPublishedMatch(id: number, endTime: number): Promise<void> {
    logger.trace('saving published match %s finished at %s', id, new Date(endTime * 1000).toISOString());
    return db.collection(MATCHES_KEY).add({id: id, endTime: endTime}).then(() => cleanupOldPublishedMatches());
  }

  export function cleanupOldPublishedMatches(): Promise<void> {
    logger.trace('cleaning up outdated published matches');
    return db.collection(MATCHES_KEY)
      .where('endTime', '<=', Math.floor(Date.now() / 1000 - PUBLISHED_MATCH_STORAGE_S))
      .get()
      .then(snapshot => snapshot.docs.forEach(d => d.ref.delete()));
  }

  export function getRecentPublishedMatches(): Promise<number[]> {
    logger.trace('requesting recently published matches');
    return db.collection(MATCHES_KEY).get().then(snapshot => snapshot.empty ? [] : snapshot.docs.map(doc => doc.data().id as number));
  }
}

process.on('SIGTERM', () => { logger.fatal('SIGTERM received.'); DB.stopMonitoringAccounts(); DB.stopMonitoringMatches(); });