import { PrismaClient, Gender, MessageSender, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 👤 1. 기본 유저 생성
    const user = await prisma.user.upsert({
        where: { id: 'seed-user-id' },
        update: {},
        create: {
            id: 'seed-user-id',
            name: '민수',
            birthDate: new Date('1995-08-15'),
            gender: Gender.MALE,
            mbti: 'INFP',
        },
    });
    console.log('👤 User upserted:', user);

    // ❓ 2. 질문 템플릿 생성
    const questionTemplates = [
        {
            id: 'q1',
            categoryCode: 'A7',
            questionText: '사랑을 어떻게 표현하는 걸 좋아하시나요?',
            tier: 1,
            type: QuestionType.RELATIONSHIP,
        },
        {
            id: 'q2',
            categoryCode: 'C1',
            questionText: '오늘 기분은 어때요?',
            tier: 1,
            type: QuestionType.DAILY,
        },
    ];
    await prisma.questionTemplate.createMany({
        data: questionTemplates,
        skipDuplicates: true,
    });
    console.log('❓ Question templates seeded');

    // 💬 3. 샘플 대화 기록
    if (!user.id) throw new Error('User ID is missing!');
    await prisma.chatHistory.create({
        data: {
            userId: user.id,
            message: '요즘 일이 너무 많아서 연락이 늦었어 😢',
            sender: MessageSender.USER,
            isQuestionResponse: false,
            isUserInitiated: true,
            analyzedByLlm: false,
        },
    });
    console.log('💬 Chat history seeded');

    console.log('✅ Seed complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
