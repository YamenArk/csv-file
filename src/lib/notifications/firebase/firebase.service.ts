import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';  
import * as path from 'path';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private fcm: admin.messaging.Messaging;

  constructor(private readonly configService: ConfigService) {
    const firebaseCertPath = this.configService.get<string>('FIREBASE_CERT_PATH'); 

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          path.resolve(firebaseCertPath)  
        ),
      });
    }

    this.fcm = admin.messaging();
  }

  async sendNotification(token: string, title: string, body: string): Promise<void> {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        token,
      };
      await this.fcm.send(message);
      this.logger.log('Notification sent successfully');
    } catch (error) {
      this.logger.error('Error sending notification:', error);
    }
  }
}
