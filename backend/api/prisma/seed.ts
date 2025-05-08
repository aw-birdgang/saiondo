import { PrismaClient, MessageSender, RelationshipStatus, ProfileSource } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('1. user1');
    const user1 = await prisma.user.create({
        data: {
            name: '김철수',
            gender: 'MALE',
            birthDate: new Date('1990-01-01'),
        },
    });

    console.log('2. user2');
    const user2 = await prisma.user.create({
        data: {
            name: '이영희',
            gender: 'FEMALE',
            birthDate: new Date('1992-02-02'),
        },
    });

    console.log('3. relationship');
    const relationship = await prisma.relationship.create({
        data: {
            user1Id: user1.id,
            user2Id: user2.id,
            status: RelationshipStatus.ACTIVE,
            startedAt: new Date(),
        },
    });

    console.log('4. room');
    const room = await prisma.room.create({
        data: {
            relationshipId: relationship.id,
        },
    });

    console.log('5. relationship update');
    await prisma.relationship.update({
        where: { id: relationship.id },
        data: { room: { connect: { id: room.id } } },
    });

    console.log('6. chatHistory');
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

    console.log('7. personaProfile');
    const categoryMbti = await prisma.categoryCode.create({
        data: { code: 'MBTI', description: 'MBTI 유형' },
    });
    const categoryHobby = await prisma.categoryCode.create({
        data: { code: 'HOBBY', description: '취미' },
    });
    const categoryValue = await prisma.categoryCode.create({
        data: { code: 'VALUE', description: '가치관' },
    });
    const categoryInterest = await prisma.categoryCode.create({
        data: { code: 'INTEREST', description: '관심사' },
    });
    const categoryJob = await prisma.categoryCode.create({
        data: { code: 'JOB', description: '직업' },
    });
    const categoryDream = await prisma.categoryCode.create({
        data: { code: 'DREAM', description: '꿈/목표' },
    });
    const categoryStrength = await prisma.categoryCode.create({
        data: { code: 'STRENGTH', description: '강점' },
    });
    const categoryWeakness = await prisma.categoryCode.create({
        data: { code: 'WEAKNESS', description: '약점' },
    });
    const categoryFavoriteFood = await prisma.categoryCode.create({
        data: { code: 'FAVORITE_FOOD', description: '좋아하는 음식' },
    });
    const categoryDislike = await prisma.categoryCode.create({
        data: { code: 'DISLIKE', description: '싫어하는 것' },
    });

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
                categoryCodeId: categoryHobby.id,
                content: '등산',
                isStatic: false,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.85,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryValue.id,
                content: '정직',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.9,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryInterest.id,
                content: '인공지능',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryJob.id,
                content: '개발자',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.95,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryDream.id,
                content: '세계 여행',
                isStatic: false,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryStrength.id,
                content: '문제 해결 능력',
                isStatic: true,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.88,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryWeakness.id,
                content: '조급함',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryFavoriteFood.id,
                content: '초밥',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.99,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryDislike.id,
                content: '곤충',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.95,
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
