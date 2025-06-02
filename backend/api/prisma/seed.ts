import {MessageSender, PrismaClient, ProfileSource, QuestionType, RelationshipStatus} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { code: 'PERSONALITY', name: '성격/성향' },
    { code: 'RELATIONSHIP', name: '연애관/가치관' },
    { code: 'DAILY', name: '일상/취미' },
    { code: 'ATTACHMENT', name: '애착/신뢰도' },
    { code: 'LOVE_LANGUAGE', name: '사랑의 언어' },
    { code: 'MBTI', name: 'MBTI/심리' },
  ];

  const categoryMap: Record<string, any> = {};
  for (const c of categories) {
    const cat = await prisma.basicQuestionCategory.upsert({
      where: { code: c.code },
      update: {},
      create: { code: c.code, name: c.name },
    });
    categoryMap[c.code] = cat;
  }

  // 2. 질문 생성 (카테고리별)
  const questionsByCategory: Record<string, string[]> = {
    PERSONALITY: [
      '혼자 있는 걸 좋아하세요? 아니면 친구들과 함께 있는 걸 더 좋아하세요?',
      '새로운 도전을 즐기는 편인가요?',
      '스트레스를 받으면 주로 어떻게 푸세요?',
      '평소에 계획을 세우고 움직이는 걸 좋아하나요?',
      '감정 표현을 자주 하는 편인가요?',
      '상대방의 기분을 잘 알아채는 편이에요?',
      '새로운 사람을 만나는 걸 즐기세요?',
      '일이나 취미를 할 때 집중을 잘하는 편인가요?',
      '평소에 스스로를 낙천적인 사람이라고 생각하나요?',
      '친구나 가족에게 조언을 자주 해주는 편인가요?',
    ],
    RELATIONSHIP: [
      '연애에서 가장 중요하게 생각하는 건 뭔가요?',
      '연애할 때 상대방과 자주 연락하는 걸 중요하게 생각하나요?',
      '다투면 먼저 화해하려는 편인가요?',
      '연애할 때 자주 만나는 게 좋다고 생각하나요?',
      '서로의 공간을 존중하는 게 중요하다고 생각하나요?',
      '데이트 비용은 어떻게 나누는 게 좋다고 생각해요?',
      '연애할 때 상대방의 작은 변화도 금방 알아차리나요?',
      '연애 중에도 개인의 성장과 시간을 중요하게 생각하나요?',
      '상대방이 갑자기 연락을 안 하면 불안함을 느끼나요?',
      '연애할 때 자주 하는 말이나 행동이 있나요?',
    ],
    DAILY: [
      '평소 주말에는 뭘 하면서 시간을 보내세요?',
      '집에서 보내는 시간을 좋아하나요, 아니면 밖에 나가는 걸 더 좋아하나요?',
      '최근에 관심 있는 취미가 있나요?',
      '파트너와 함께 해보고 싶은 활동이 있나요?',
      '여행 가는 걸 좋아하나요? 주로 어떤 여행 스타일을 선호해요?',
      '평소 음악이나 영화는 어떤 걸 즐겨 보세요?',
      '평일 저녁에는 주로 뭘 하며 보내세요?',
      '새로운 카페나 맛집 찾는 걸 좋아하시나요?',
      '운동이나 활동적인 걸 즐기는 편인가요?',
      '파트너와 평소에 함께하는 소소한 루틴이 있나요?',
    ],
    ATTACHMENT: [
      '연애할 때 상대방에게 얼마나 의지하는 편이에요?',
      '연락이 늦으면 어떤 생각이 드나요?',
      '상대방이 바쁠 때는 어떻게 대처해요?',
      '외로움을 많이 느끼는 편인가요?',
      '상대방에게 서운함이 생기면 바로 표현하는 편인가요?',
      '상대방의 기분을 잘 맞춰주려고 노력하나요?',
      '나만의 시간이 꼭 필요하다고 느낄 때가 있나요?',
      '다툼이 생기면 어떤 식으로 푸는 게 편해요?',
      '연애할 때 상대방의 말과 행동 중 어떤 걸 더 신뢰하나요?',
      '가까운 사람과의 관계를 오래 유지하는 편인가요?',
    ],
    LOVE_LANGUAGE: [
      '사랑을 표현할 때 어떤 방식이 가장 자연스러워요?',
      '선물, 스킨십, 대화 중 어떤 걸 가장 중요하게 생각하세요?',
      '상대방이 무심코 한 말에 쉽게 상처를 받나요?',
      '함께 보내는 시간이 중요하다고 생각하세요?',
      '파트너가 요리를 해주거나 돌봐줄 때 어떤 기분이 드나요?',
      '상대방의 말을 잘 들어주는 게 사랑이라고 느끼나요?',
      '파트너가 선물을 주면 기분이 어떤가요?',
      '연인과 함께 있을 때 어떤 순간에 가장 행복함을 느끼세요?',
      '스킨십을 통해 애정을 느끼는 편인가요?',
      '파트너에게 자주 “고마워”나 “사랑해”라고 말하나요?',
    ],
    MBTI: [
      '본인의 MBTI를 알고 있나요?',
      '그 MBTI가 연애할 때 도움이 된다고 느끼세요?',
      '성격 유형 때문에 다툰 적이 있나요?',
      'MBTI 테스트 결과가 신뢰할 만하다고 생각하세요?',
      '내향적인 사람과 외향적인 사람 중 누구와 더 잘 맞는다고 느끼세요?',
      '상대방과 성격이 비슷할 때 편안함을 느끼나요?',
      '평소에 사람들과 있을 때 에너지를 얻나요, 아니면 혼자 있을 때 충전되나요?',
      '성격 유형과 상관없이, 중요한 건 서로의 이해라고 생각하세요?',
      '서로 다른 성격을 이해하는 게 쉽다고 느끼세요?',
      '성격이 다른 파트너와의 관계에서 배운 점이 있나요?',
    ],
  };

  // 3. 질문 생성
  const questionMap: Record<string, any[]> = {};
  for (const [catCode, questions] of Object.entries(questionsByCategory)) {
    questionMap[catCode] = [];
    for (const q of questions) {
      const question = await prisma.basicQuestion.create({
        data: {
          question: q,
          categoryId: categoryMap[catCode].id,
        },
      });
      questionMap[catCode].push(question);
    }
  }

    // 1. 카테고리 코드 생성
    const categoryMbti = await prisma.categoryCode.create({
        data: { code: 'MBTI', description: 'MBTI 유형' },
    });
    const categoryBloodType = await prisma.categoryCode.create({
        data: { code: 'BLOOD_TYPE', description: '혈액형' },
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
            name: '오성균',
            gender: 'MALE',
            birthDate: new Date('1982-06-08'),
            email: 'kim@example.com',
            password: hash,
            fcmToken: 'test_token_1',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: '최지우',
            gender: 'FEMALE',
            birthDate: new Date('1982-05-18'),
            email: 'lee@example.com',
            password: hash,
            fcmToken: 'test_token_2',
        },
    });

    // 4. 채널 및 Assistant 생성
    const channel = await prisma.channel.create({
        data: {
            user1Id: user1.id,
            user2Id: user2.id,
            status: 'ACTIVE',
            startedAt: new Date(),
            inviteCode: 'TESTCODE123',
            anniversary: new Date('2022-05-20'),
            keywords: JSON.stringify(['사랑', '신뢰', '소통']),
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
                content: 'ISTJ',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.95,
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
                userId: user1.id,
                categoryCodeId: categoryLoveStyle.id,
                content: '신중한',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.75,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryMbti.id,
                content: 'ESFJ',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.92,
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
                userId: user2.id,
                categoryCodeId: categoryLoveStyle.id,
                content: '표현 많은',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.85,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryIdealType.id,
                content: '책임감 있는 사람',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.93,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryIdealType.id,
                content: '행복을 추구하는 사람',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.91,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryFamily.id,
                content: '외동',
                isStatic: false,
                source: ProfileSource.AI_ANALYSIS,
                confidenceScore: 0.7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryFamily.id,
                content: '3녀 중 막내',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.95,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                categoryCodeId: categoryLifestyle.id,
                content: '저녁형 인간',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.85,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryLifestyle.id,
                content: '아침형 인간',
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
            {
                userId: user1.id,
                categoryCodeId: categoryBloodType.id,
                content: 'O형',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.95,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                categoryCodeId: categoryBloodType.id,
                content: 'A형',
                isStatic: true,
                source: ProfileSource.USER_INPUT,
                confidenceScore: 0.92,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
    });

    await prisma.advice.createMany({
        data: [
            {
                channelId: channel.id,
                advice: '서로의 차이를 인정하고 존중하세요.',
                createdAt: new Date('2024-06-01T12:00:00Z'),
            },
            {
                channelId: channel.id,
                advice: '대화를 자주 나누세요.',
                createdAt: new Date('2024-06-02T12:00:00Z'),
            },
            {
                channelId: channel.id,
                advice: '함께 취미를 만들어보세요.',
                createdAt: new Date('2024-06-03T12:00:00Z'),
            },
        ],
    });

    // 7. 이벤트(Event) 생성
    await prisma.event.createMany({
        data: [
            {
                userId: user1.id,
                title: '커플 데이트',
                description: '카페에서 만남',
                startTime: new Date('2024-06-10T14:00:00Z'),
                endTime: new Date('2024-06-10T16:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                title: '운동',
                description: '헬스장 방문',
                startTime: new Date('2024-06-12T18:00:00Z'),
                endTime: new Date('2024-06-12T19:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                title: '친구 모임',
                description: '저녁 식사',
                startTime: new Date('2024-06-11T19:00:00Z'),
                endTime: new Date('2024-06-11T21:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            // === 2025년 5월 일정 추가 ===
            {
                userId: user1.id,
                title: '2025년 5월 회의',
                description: '중요한 프로젝트 회의',
                startTime: new Date('2025-05-03T10:00:00Z'),
                endTime: new Date('2025-05-03T11:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                title: '2025년 5월 데이트',
                description: '영화관에서 데이트',
                startTime: new Date('2025-05-05T18:00:00Z'),
                endTime: new Date('2025-05-05T21:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user1.id,
                title: '2025년 5월 운동',
                description: '헬스장 방문',
                startTime: new Date('2025-05-10T07:00:00Z'),
                endTime: new Date('2025-05-10T08:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                title: '2025년 5월 친구 모임',
                description: '친구들과 저녁 식사',
                startTime: new Date('2025-05-12T19:00:00Z'),
                endTime: new Date('2025-05-12T22:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                title: '2025년 5월 워크샵',
                description: '회사 워크샵',
                startTime: new Date('2025-05-20T09:00:00Z'),
                endTime: new Date('2025-05-20T17:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: user2.id,
                title: '2025년 5월 여행',
                description: '가족과 제주도 여행',
                startTime: new Date('2025-05-25T08:00:00Z'),
                endTime: new Date('2025-05-28T20:00:00Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            // === 2025년 5월 일정 끝 ===
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
