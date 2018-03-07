'use strict';

import * as api from 'firebase-admin';
import { FIREBASE_DB_URL, FIREBASE_CERT } from '../config/config';

export default class Firebase {
  constructor() {
    api.initializeApp({
      credential: api.credential.cert(FIREBASE_CERT),
      databaseURL: FIREBASE_DB_URL
    });
  }

  
}