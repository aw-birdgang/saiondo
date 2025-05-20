import admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';
import serviceAccount from '../../config/firebase-service-account.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    }
  }

  get messaging() {
    return admin.messaging();
  }
}
