import { PrismaClient, ProfileSource, QuestionType, RelationshipStatus, MessageSender } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 1. 카테고리 코드 생성
    const categoryMbti = await prisma.categoryCode.create({
        data: { code: 'MBTI', description: 'MBTI 유형' },
    });
    const categoryHobby = await prisma.categoryCode.create({
        data: { code: 'HOBBY', description: '취미' },
    });
    const categoryValue = await prisma.categoryCode.create({
        data: { code: 'VALUE', description: '가치관' },
    });

    // 2. 질문 템플릿 생성
    await prisma.questionTemplate.createMany({
        data: [
            {
                categoryCodeId: categoryMbti.id,
                questionText: '당신의 MBTI는 무엇인가요?',
                tier: 1,
                type: QuestionType.MBTI,
                createdAt: new Date(),
            },
            {
                categoryCodeId: categoryHobby.id,
                questionText: '가장 좋아하는 취미는 무엇인가요?',
                tier: 1,
                type: QuestionType.PERSONALITY,
                createdAt: new Date(),
            },
            {
                categoryCodeId: categoryValue.id,
                questionText: '인생에서 가장 중요하게 생각하는 가치는 무엇인가요?',
                tier: 2,
                type: QuestionType.PERSONALITY,
                createdAt: new Date(),
            },
            {
                categoryCodeId: categoryHobby.id,
                questionText: '최근에 새로 시작한 취미가 있나요?',
                tier: 2,
                type: QuestionType.DAILY,
                createdAt: new Date(),
            },
            {
                categoryCodeId: categoryValue.id,
                questionText: '친구를 사귈 때 가장 중요하게 생각하는 점은?',
                tier: 1,
                type: QuestionType.RELATIONSHIP,
                createdAt: new Date(),
            },
        ],
    });

    // 3. 유저 생성
    const hash = await bcrypt.hash('password123', 10);
    const user1 = await prisma.user.create({
        data: {
            name: '김철수',
            gender: 'MALE',
            birthDate: new Date('1990-01-01'),
            email: 'kim@example.com',
            password: hash,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: '이영희',
            gender: 'FEMALE',
            birthDate: new Date('1992-02-02'),
            email: 'lee@example.com',
            password: hash,
        },
    });

    // 4. 관계 및 방 생성
    const relationship = await prisma.relationship.create({
        data: {
            user1Id: user1.id,
            user2Id: user2.id,
            status: RelationshipStatus.ACTIVE,
            startedAt: new Date(),
        },
    });

    const room = await prisma.room.create({
        data: {
            relationshipId: relationship.id,
        },
    });

    // 5. 채팅 기록 생성
    await prisma.chatHistory.createMany({
        data: [
            {
                roomId: room.id,
                userId: user1.id,
                message: '안녕! 오늘 영화 볼래?',
                sender: MessageSender.USER,
                isQuestionResponse: false,
                isUserInitiated: true,
                analyzedByLlm: false,
                timestamp: new Date(),
            },
            {
                roomId: room.id,
                userId: user2.id,
                message: '좋아! 어떤 영화 볼까?',
                sender: MessageSender.USER,
                isQuestionResponse: true,
                isUserInitiated: false,
                analyzedByLlm: false,
                timestamp: new Date(),
            },
            {
                roomId: room.id,
                userId: user1.id,
                message: '로맨틱 코미디 어때?',
                sender: MessageSender.USER,
                isQuestionResponse: false,
                isUserInitiated: true,
                analyzedByLlm: false,
                timestamp: new Date(),
            },
        ],
    });

    // 6. 페르소나 프로필 생성
    await prisma.personaProfile.createMany({
        data: [
            {
                userId: user1.id,
                categoryCodeId: categoryMbti.id,
                content: 'INTJ',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.95,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryMbti.id,
                content: 'ENFP',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.92,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryHobby.id,
                content: '영화 감상',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryValue.id,
                content: '정직',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.9,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
    });

    console.log('Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
