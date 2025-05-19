import {MessageSender, PrismaClient, ProfileSource, QuestionType, RelationshipStatus} from '@prisma/client';
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
    const categoryStatus = await prisma.categoryCode.create({
        data: { code: 'STATUS', description: '상태' },
    });
    const categoryCharacter = await prisma.categoryCode.create({
        data: { code: 'CHARACTER', description: '성격' },
    });
    const categoryLoveStyle = await prisma.categoryCode.create({
        data: { code: 'LOVE_STYLE', description: '연애스타일' },
    });
    const categoryIdealType = await prisma.categoryCode.create({
        data: { code: 'IDEAL_TYPE', description: '이상형' },
    });
    const categoryFamily = await prisma.categoryCode.create({
        data: { code: 'FAMILY', description: '가족관계' },
    });
    const categoryLifestyle = await prisma.categoryCode.create({
        data: { code: 'LIFESTYLE', description: '라이프스타일' },
    });
    const categoryReligion = await prisma.categoryCode.create({
        data: { code: 'RELIGION', description: '종교' },
    });
    const categoryCareer = await prisma.categoryCode.create({
        data: { code: 'CAREER', description: '직업/학업' },
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

    // 4. 채널 및 Assistant 생성
    const channel = await prisma.channel.create({
        data: {
            user1Id: user1.id,
            user2Id: user2.id,
            status: 'ACTIVE',
            startedAt: new Date(),
            assistants: {
                create: [
                    { userId: user1.id },
                    { userId: user2.id },
                ],
            },
        },
        include: { assistants: true },
    });

    // 5. 채팅 기록 생성 (각각의 Assistant에 저장, channelId도 함께 저장)
    await prisma.chatHistory.createMany({
        data: [
            {
                assistantId: channel.assistants[0].id,
                channelId: channel.id,
                userId: user1.id,
                sender: 'USER',
                message: '안녕! 오늘 영화 볼래?',
                createdAt: new Date(),
            },
            {
                assistantId: channel.assistants[0].id,
                channelId: channel.id,
                userId: user1.id,
                sender: 'AI',
                message: '안녕하세요, 무엇을 도와드릴까요? (from AI to user1)',
                createdAt: new Date(),
            },
            {
                assistantId: channel.assistants[1].id,
                channelId: channel.id,
                userId: user2.id,
                sender: 'USER',
                message: '좋아! 몇 시에 볼까?',
                createdAt: new Date(),
            },
            {
                assistantId: channel.assistants[1].id,
                channelId: channel.id,
                userId: user2.id,
                sender: 'AI',
                message: '안녕하세요, 무엇을 도와드릴까요? (from AI to user2)',
                createdAt: new Date(),
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
            {
                userId: user1.id,
                categoryCodeId: categoryCharacter.id,
                content: '차분함',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.88,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryCharacter.id,
                content: '활발함',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.9,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryLoveStyle.id,
                content: '표현 많은',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.75,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryLoveStyle.id,
                content: '신중한',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.85,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryIdealType.id,
                content: '유머러스한 사람',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.93,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryIdealType.id,
                content: '책임감 있는 사람',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.91,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryFamily.id,
                content: '2남 1녀 중 장남',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryFamily.id,
                content: '외동',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.95,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryLifestyle.id,
                content: '아침형 인간',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.85,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryLifestyle.id,
                content: '저녁형 인간',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryReligion.id,
                content: '무교',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.99,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryReligion.id,
                content: '기독교',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.97,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryCareer.id,
                content: '개발자',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.95,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryCareer.id,
                content: '디자이너',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.82,
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
