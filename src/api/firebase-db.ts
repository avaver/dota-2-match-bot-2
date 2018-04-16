'use strict';

import * as log from 'log4js';
import * as api from 'firebase-admin';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/secure-config';
import { DISCORD_BOSS_ID } from '../config/config';
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
  let subjectAccounts = new Subject<Account[]>();
  let unsubAccounts: () => void;
  
  export function addAccount(account: Account): Promise<void> {
    logger.trace('adding account %s', account.id);
    return DB.getAccount(account.id)
      .then(() => Promise.reject(format('Аккаунт %s вже зареєстрований', account.id)))
      .catch(() => 
        db.collection(ACCOUNTS_KEY).add({
          id: account.id,
          addedBy: account.addedBy,
          serverId: account.serverId,
          channelId: account.channelId,
          lastMatchId: 0,
          timestamp: api.firestore.FieldValue.serverTimestamp()
        }).then(() => Promise.resolve()));
  }

  export function updateLastMatch(accountId: number, matchId: number) {
    logger.trace('updating last match for account %s (match id: %s)', accountId, matchId);
    db.collection(ACCOUNTS_KEY).where('id', '==', accountId).get().then(snapshot => snapshot.docs[0].ref.update({ lastMatchId: matchId }));
  }

  export function removeAccount(id: number, removedBy: string): Promise<void> {
    logger.trace('removing account %s', id);
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
    logger.trace('getting account %s from db', id);
    return db.collection(ACCOUNTS_KEY).where('id', '==', id).get().then(snapshot => snapshot.docs[0].data() as Account);
  }

  export function startMonitoringAccounts(): Observable<Account[]> {
    if (!unsubAccounts) {
      unsubAccounts = db.collection(ACCOUNTS_KEY).onSnapshot(snapshot => {
        let accounts = snapshot.docs.map(doc => doc.data() as Account);
        if (accounts && accounts.length > 0) {
          logger.trace('accounts changed');
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
}

process.on('SIGTERM', () => { logger.fatal('SIGTERM received.'); DB.stopMonitoringAccounts(); });