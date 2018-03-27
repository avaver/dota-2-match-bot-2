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
  const COLLECTION_KEY = 'accounts';
  let subject = new Subject<Account[]>();
  let unsub: () => void;
  
  export function addAccount(account: Account): Promise<void> {
    return DB.getAccount(account.id)
      .then(() => Promise.reject(format('Аккаунт %s вже зареєстрований', account.id)))
      .catch(() => 
        db.collection(COLLECTION_KEY).add({
          id: account.id,
          addedBy: account.addedBy,
          serverId: account.serverId,
          channelId: account.channelId,
          timestamp: api.firestore.FieldValue.serverTimestamp()
        }).then(() => Promise.resolve()));
  }

  export function removeAccount(id: number, removedBy: string): Promise<void> {
    return db.collection(COLLECTION_KEY)
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
    return db.collection(COLLECTION_KEY).where('id', '==', id).get().then(snapshot => snapshot.docs[0].data() as Account);
  }

  export function startMonitoring(): Observable<Account[]> {
    if (!unsub) {
      unsub = db.collection(COLLECTION_KEY).onSnapshot(snapshot => {
        let accounts = snapshot.docs.map(doc => doc.data() as Account);
        if (accounts && accounts.length > 0) {
          subject.next(accounts);
        }
      });
    }

    return subject;
  }

  export function stopMonitoring(): void {
    if (unsub) {
      unsub();
    }
  }
}

process.on('SIGTERM', () => { logger.fatal('SIGTERM received.'); DB.stopMonitoring(); });