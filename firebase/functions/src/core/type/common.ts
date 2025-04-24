export interface BaseEntity {
    id: string;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
}

export interface BaseUser extends BaseEntity {
    email: string;
    name: string;
    mbti: string;
    coupleId?: string;
    partnerId?: string;
    gender?: 'male' | 'female';
}

export interface BaseCouple extends BaseEntity {
    user1Id: string;
    user2Id: string;
    status: 'pending' | 'active' | 'inactive';
}
