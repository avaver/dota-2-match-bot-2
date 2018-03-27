'use strict';

import * as log from 'log4js';
import * as api from 'firebase-admin';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/secure-config';
import { Account } from '../model/matchbot-types';
import { Subject, Observable } from 'rxjs';
import { format } from 'util';

const logger = log.getLogger('firebase-firestore');

logger.info('initializing firebase again');
const api2 = api.initializeApp({
  credential: api.credential.cert(FIREBASE_CERT),
  databaseURL: FIREBASE_DB_URL
}, '[FIRESTORE]');

const db = api2.firestore();

export namespace Firestore {
  const COLLECTION_KEY = 'accounts';
  let subject = new Subject<Account[]>();
  let unsub: () => void;
  
  export function addAccount(account: Account): Promise<FirebaseFirestore.DocumentReference> {
    return db.collection(COLLECTION_KEY).add({
      id: account.id,
      addedBy: account.addedBy,
      serverId: account.serverId,
      channelId: account.channelId,
      timestamp: api.firestore.FieldValue.serverTimestamp()
    });
  }

  export function removeAccount(id: number, removedBy: string): Promise<FirebaseFirestore.WriteResult> {
    return db.collection(COLLECTION_KEY)
      .where('id', '==', id)
      .get().then(snapshot => {
        if (snapshot.empty) {
          throw new Error(format('Аккаунту #%s немає в базі', id));
        } else if (snapshot.docs[0].data().addedBy != removedBy) {
          throw new Error('Ти не можеш видалити цей аккаунт, тому що ти його не реєстрував');
        } else {
          return snapshot.docs[0].ref.delete();
        }
      });
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

process.on('SIGTERM', () => { logger.fatal('SIGTERM received.'); Firestore.stopMonitoring(); });