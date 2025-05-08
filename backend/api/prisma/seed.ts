import { PrismaClient, MessageSender, RelationshipStatus } from '@prisma/client';

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
