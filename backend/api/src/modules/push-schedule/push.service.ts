import { Injectable } from '@nestjs/common';
import { FirebaseService } from '@common/firebase/firebase.service';

@Injectable()
export class PushService {
    constructor(private readonly firebaseService: FirebaseService) {}

    async sendPush(token: string, title: string, body: string, data?: any) {
        const message = {
            token,
            notification: { title, body },
            data,
        };
        return this.firebaseService.messaging.send(message);
    }
}
