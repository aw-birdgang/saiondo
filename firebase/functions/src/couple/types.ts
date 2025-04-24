import {BaseEntity} from "../core/type/common";

export interface CoupleInviteData {
    partnerEmail: string;
}

export interface Couple extends BaseEntity {
    user1Id: string;
    user2Id: string;
    status: 'pending' | 'active' | 'inactive';
}

export interface CoupleInvite extends BaseEntity {
    fromUserId: string;
    toUserId: string;
    status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
    expiredAt: FirebaseFirestore.Timestamp;
}
