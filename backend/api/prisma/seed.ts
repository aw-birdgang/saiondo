import {PrismaClient, ProfileSource, User, Channel} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {createWalletFromEnvMnemonic, encrypt} from '../src/common/utils/wallet.util';
import {ethers} from 'ethers';
import * as fs from 'fs/promises';
import * as path from 'path';

const prisma = new PrismaClient();

// === 환경변수 체크 및 Web3 관련 정보 읽기 ===
function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`환경변수 ${key}가 설정되어 있지 않습니다.`);
  return value;
}

const rpcUrl = getEnvOrThrow('WEB3_RPC_URL');
const contractAddress = getEnvOrThrow('TOKEN_CONTRACT_ADDRESS');
const abiPath = getEnvOrThrow('TOKEN_CONTRACT_ABI_PATH');

// === Ethers.js 인스턴스 준비 ===
let tokenContract: ethers.Contract;
async function setupTokenContract() {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const abiRaw = await fs.readFile(path.resolve(abiPath), 'utf-8');
  const abi = JSON.parse(abiRaw);
  tokenContract = new ethers.Contract(contractAddress, abi, provider);
}

async function getTokenBalance(address: string): Promise<string> {
  const decimals = await tokenContract.decimals();
  const balance = await tokenContract.balanceOf(address);
  return ethers.formatUnits(balance, decimals);
}

// ===== 카테고리 및 질문 데이터 =====
const categories = [
  { code: 'PERSONALITY', name: '성격/성향' },
  { code: 'RELATIONSHIP', name: '연애관/가치관' },
  { code: 'DAILY', name: '일상/취미' },
  { code: 'ATTACHMENT', name: '애착/신뢰도' },
  { code: 'LOVE_LANGUAGE', name: '사랑의 언어' },
  { code: 'MBTI', name: 'MBTI/심리' },
];

const questionsByCategory: Record<string, { question: string, options: string[] }[]> = {
  PERSONALITY: [
    { question: '혼자 있는 게 편해요?', options: ['네, 혼자가 좋아요', '상황에 따라 달라요', '친구들이랑 있는 게 더 좋아요'] },
    { question: '새로운 걸 시도해보는 걸 좋아해요?', options: ['도전하는 게 재밌어요', '가끔 해봐요', '익숙한 게 더 편해요'] },
    { question: '스트레스를 받으면 어떻게 풀어요?', options: ['운동이나 산책', '쉬거나 잠자기', '친구/가족과 얘기', '맛있는 거 먹기'] },
    { question: '계획을 세우고 움직이는 걸 좋아해요?', options: ['네, 계획적으로 움직여요', '상황에 따라 달라요', '즉흥적으로 하는 게 좋아요'] },
    { question: '기분을 솔직히 말하는 편이에요?', options: ['네, 솔직해요', '조금은 말해요', '잘 표현하지 않아요'] },
    { question: '상대방 기분을 잘 알아채요?', options: ['네, 눈치가 빠른 편이에요', '가끔 알아차려요', '잘 모르겠어요'] },
    { question: '새로운 사람 만나는 걸 좋아해요?', options: ['네, 새로운 만남 좋아요', '상황에 따라 달라요', '친한 사람만 편해요'] },
    { question: '집중을 잘하는 편이에요?', options: ['몰입 잘해요', '보통이에요', '쉽게 산만해져요'] },
    { question: '낙천적인 성격이라고 생각해요?', options: ['네, 긍정적이에요', '보통이에요', '약간 부정적인 편이에요'] },
    { question: '친구나 가족에게 조언 자주 해주나요?', options: ['네, 자주 해줘요', '가끔만 해요', '거의 안 해요'] },
  ],
  RELATIONSHIP: [
    { question: '연애할 때 제일 중요한 건?', options: ['신뢰', '대화/소통', '스킨십', '각자의 공간 존중'] },
    { question: '자주 연락하는 걸 좋아해요?', options: ['매일 자주 하고 싶어요', '적당히만 하면 돼요', '연락이 많지 않아도 괜찮아요'] },
    { question: '다툼이 생기면 먼저 화해하려는 편이에요?', options: ['네, 먼저 풀어요', '상황에 따라 달라요', '상대방이 먼저 해줬으면 해요'] },
    { question: '연애 중에 각자만의 시간이 필요하다고 느끼세요?', options: ['네, 중요해요', '가끔 필요해요', '별로 필요 없어요'] },
    { question: '연애할 땐 자주 만나고 싶은 편이에요?', options: ['네, 자주 보고 싶어요', '적당히만 보면 돼요', '자주 안 봐도 돼요'] },
    { question: '상대방의 작은 변화도 잘 알아차려요?', options: ['네, 금방 알아차려요', '가끔만 알아차려요', '잘 모르겠어요'] },
    { question: '데이트 비용은 어떻게 나누면 좋다고 생각해요?', options: ['반반씩 나누는 게 좋아요', '상황마다 달라요', '상대방이 더 내주면 좋아요'] },
    { question: '연애하면서 서로에게 기대는 게 중요하다고 생각해요?', options: ['네, 서로 의지해야 해요', '가끔 기대면 돼요', '각자도 잘 지내야 해요'] },
    { question: '상대방이 갑자기 연락을 안 하면?', options: ['걱정돼서 바로 연락해요', '조금 기다려봐요', '별로 신경 안 써요'] },
    { question: '연애할 때 자주 하는 말/행동이 있나요?', options: ['"사랑해"나 애정 표현', '작은 선물/배려', '함께하는 시간 만들기', '큰 이벤트 없이 자연스럽게'] },
  ],
  DAILY: [
    { question: '주말엔 주로 뭐하면서 보내요?', options: ['집에서 쉬어요', '친구나 가족 만나기', '취미/운동', '여행이나 외출'] },
    { question: '집에서 보내는 시간 vs 밖에서 활동하는 시간?', options: ['집이 좋아요', '반반이 좋아요', '밖에서 보내는 게 좋아요'] },
    { question: '새로운 취미나 활동 해보고 싶은 게 있나요?', options: ['네, 있어요', '아직 고민 중이에요', '잘 모르겠어요'] },
    { question: '파트너랑 하고 싶은 데이트는?', options: ['맛집/카페', '영화나 공연', '운동/활동', '여행/야외 데이트'] },
    { question: '여행 가는 걸 좋아해요?', options: ['네, 좋아해요', '가끔 좋아해요', '잘 안 가요'] },
    { question: '평소 좋아하는 영화/음악 장르는?', options: ['로맨스/드라마', '코미디/가벼운 내용', '액션/스릴러', '다큐/조용한 장르'] },
    { question: '평일 저녁엔 주로 뭐해요?', options: ['쉬어요', '친구 만나거나 외출', '취미나 운동', '넷플릭스/영화 보기'] },
    { question: '새로운 카페나 맛집 찾는 거 좋아해요?', options: ['좋아해요', '가끔만 해요', '잘 안 해요'] },
    { question: '운동이나 활동적인 걸 좋아해요?', options: ['운동 좋아해요', '가끔만 해요', '잘 안 해요'] },
    { question: '파트너와 함께하는 소소한 루틴이 있나요?', options: ['네, 있어요', '가끔 해요', '없어요'] },
  ],
  ATTACHMENT: [
    { question: '연애할 때 상대방에게 의지하는 편이에요?', options: ['네, 많이 의지해요', '적당히 의지해요', '거의 의지하지 않아요'] },
    { question: '연락이 늦으면 어떤 기분이에요?', options: ['걱정돼요', '조금 기다릴 수 있어요', '별로 신경 안 써요'] },
    { question: '상대방이 바쁠 땐 어떻게 해요?', options: ['이해하고 기다려요', '조금 서운해요', '무심하게 넘어가요'] },
    { question: '외로움을 자주 느끼는 편이에요?', options: ['자주 느껴요', '가끔만 느껴요', '거의 안 느껴요'] },
    { question: '서운하면 바로 말하는 편이에요?', options: ['네, 바로 말해요', '조금 생각하다 말해요', '말 안 하고 넘어가요'] },
    { question: '상대방의 기분을 잘 맞춰주려고 해요?', options: ['네, 맞춰주려 해요', '가끔만 해요', '잘 안 맞춰요'] },
    { question: '나만의 시간이 꼭 필요하다고 느껴요?', options: ['네, 꼭 필요해요', '가끔만 필요해요', '없어도 괜찮아요'] },
    { question: '싸우고 나면 어떻게 풀고 싶어요?', options: ['바로 얘기해서 풀어요', '서로 시간을 가지면 좋아요', '상대방이 먼저 풀어줬으면 해요'] },
    { question: '상대방의 말과 행동 중 뭐가 더 믿음직해요?', options: ['말이 중요해요', '행동이 중요해요', '둘 다 중요해요'] },
    { question: '가까운 사람과 오래 잘 지내는 편이에요?', options: ['네, 친하게 오래 지내요', '보통이에요', '오래 유지하기 어렵더라고요'] },
  ],
  LOVE_LANGUAGE: [
    {
      question: '파트너가 어떤 방식으로 사랑을 표현해주면 좋아요?',
      options: [
        '말로 표현 (고마워, 사랑해 등)',
        '스킨십 (포옹, 손잡기 등)',
        '선물 주기',
        '함께 시간 보내기',
        '작은 행동이나 배려',
      ],
    },
    {
      question: '내가 파트너에게 사랑을 표현할 때 편한 방식은?',
      options: [
        '말로 표현',
        '행동으로 보여주기',
        '스킨십',
        '선물이나 이벤트',
        '같이 있는 시간 늘리기',
      ],
    },
    {
      question: '파트너가 "사랑해"나 "고마워"를 자주 말해주면?',
      options: [
        '기분이 좋아져요',
        '가끔이면 충분해요',
        '꼭 필요하진 않아요',
      ],
    },
    {
      question: '스킨십을 자주 하고 싶어요?',
      options: [
        '네, 좋아요',
        '가끔만 해도 돼요',
        '스킨십은 별로 중요하지 않아요',
      ],
    },
    {
      question: '함께 있는 시간 자체가 중요하다고 생각해요?',
      options: [
        '네, 중요해요',
        '어느 정도는 필요해요',
        '함께 있는 시간보다 각자도 중요해요',
      ],
    },
    {
      question: '파트너가 작은 선물이나 이벤트를 해주면?',
      options: [
        '너무 기분 좋아요',
        '고마운 마음은 있어요',
        '없어도 괜찮아요',
      ],
    },
    {
      question: '파트너가 내 얘기를 잘 들어줄 때 어떤 기분이에요?',
      options: [
        '큰 위로를 받아요',
        '고맙긴 한데 괜찮아요',
        '별로 중요하지 않아요',
      ],
    },
    {
      question: '사랑 표현을 주로 어디서 받길 원해요?',
      options: [
        '집에서, 편안할 때',
        '데이트할 때',
        '상황에 따라 달라요',
      ],
    },
    {
      question: '내가 가장 "사랑받는다"고 느낄 땐 언제에요?',
      options: [
        '스킨십할 때',
        '말로 고백할 때',
        '함께 여행가거나 놀 때',
        '선물 받았을 때',
      ],
    },
  ],
  MBTI: [
    {
      question: '본인 MBTI를 알고 있나요?',
      options: [
        '네, 정확히 알아요',
        '대략은 알아요',
        '잘 모르겠어요',
      ],
    },
    {
      question: '파트너의 MBTI를 알고 있나요?',
      options: [
        '네, 알아요',
        '들은 적 있어요',
        '전혀 몰라요',
      ],
    },
    {
      question: 'MBTI가 연애할 때 도움이 된다고 느끼세요?',
      options: [
        '네, 이해에 도움이 돼요',
        '조금은 그래요',
        '전혀 상관없어요',
      ],
    },
    {
      question: '성격 차이 때문에 다툰 적이 있나요?',
      options: [
        '네, 종종 있어요',
        '가끔 있어요',
        '거의 없어요',
      ],
    },
    {
      question: '외향적인 성격과 내향적인 성격 중 누구랑 잘 맞아요?',
      options: [
        '외향적인 성격',
        '내향적인 성격',
        '상관없어요',
      ],
    },
    {
      question: '파트너와 성격이 비슷할 때 더 편해요?',
      options: [
        '네, 비슷하면 편해요',
        '조금은 그래요',
        '달라도 괜찮아요',
      ],
    },
    {
      question: '에너지를 충전할 땐 어떻게 해요?',
      options: [
        '혼자만의 시간 가지기',
        '사람들과 어울리기',
        '상황에 따라 달라요',
      ],
    },
    {
      question: '성격이 달라도 노력하면 잘 맞출 수 있다고 생각해요?',
      options: [
        '네, 충분히 가능해요',
        '조금 어렵지만 할 수 있어요',
        '어려울 것 같아요',
      ],
    },
    {
      question: '파트너와 성격이 달라서 오히려 좋은 점이 있나요?',
      options: [
        '서로 보완돼서 좋아요',
        '가끔 힘들긴 해도 괜찮아요',
        '달라서 어려워요',
      ],
    },
    {
      question: 'MBTI 테스트를 해보는 걸 좋아해요?',
      options: [
        '네, 재밌어요',
        '가끔은 좋아요',
        '별로 관심 없어요',
      ],
    },
  ],
};

const categoryCodes = [
  { code: 'MBTI', description: 'MBTI 유형' },
  { code: 'BLOOD_TYPE', description: '혈액형' },
  { code: 'HOBBY', description: '취미' },
  { code: 'VALUE', description: '가치관' },
  { code: 'STATUS', description: '상태' },
  { code: 'CHARACTER', description: '성격' },
  { code: 'LOVE_STYLE', description: '연애스타일' },
  { code: 'IDEAL_TYPE', description: '이상형' },
  { code: 'FAMILY', description: '가족관계' },
  { code: 'LIFESTYLE', description: '라이프스타일' },
  { code: 'RELIGION', description: '종교' },
  { code: 'CAREER', description: '직업/학업' },
];

// ===== 유닛 함수들 =====

// 1. 카테고리 및 질문 생성
async function upsertCategoriesAndQuestions() {
  const categoryMap = Object.fromEntries(
    await Promise.all(
      categories.map(async c => [
        c.code,
        await prisma.basicQuestionCategory.upsert({
          where: { code: c.code },
          update: {},
          create: { code: c.code, name: c.name },
        }),
      ])
    )
  );

  await Promise.all(
    Object.entries(questionsByCategory).flatMap(([catCode, questions]) =>
      questions.map(q =>
        prisma.basicQuestion.create({
          data: {
            question: q.question,
            categoryId: categoryMap[catCode].id,
            options: q.options,
          },
        })
      )
    )
  );
  return categoryMap;
}

// 2. 카테고리 코드 생성
async function createCategoryCodes() {
  return Object.fromEntries(
    await Promise.all(
      categoryCodes.map(async c => [
        c.code,
        await prisma.categoryCode.create({ data: c }),
      ])
    )
  );
}

// 3. 유저 생성
async function createUsers(): Promise<[User, User]> {
  const hash = await bcrypt.hash('password123', 10);
  return Promise.all([
    prisma.user.create({
      data: {
        name: '오성균',
        gender: 'MALE',
        birthDate: new Date('1982-06-08'),
        email: 'kim@example.com',
        password: hash,
        fcmToken: 'test_token_1',
      },
    }),
    prisma.user.create({
      data: {
        name: '최지우',
        gender: 'FEMALE',
        birthDate: new Date('1982-05-18'),
        email: 'lee@example.com',
        password: hash,
        fcmToken: 'test_token_2',
      },
    }),
  ]);
}

// 4. 채널 및 어시스턴트 생성
async function createChannelAndAssistants(user1: User, user2: User): Promise<Channel & { assistants: any[] }> {
  return prisma.channel.create({
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
}

// 5. 채팅 기록 생성
async function createChatHistory(channel: Channel & { assistants: any[] }, user1: User, user2: User) {
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
}

// 6. 페르소나 프로필 생성
async function createPersonaProfiles(categoryCodeMap, user1, user2) {
  await prisma.personaProfile.createMany({
    data: [
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['MBTI'].id,
        content: 'ISTJ',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['HOBBY'].id,
        content: '영화 감상',
        isStatic: false,
        source: ProfileSource.AI_ANALYSIS,
        confidenceScore: 0.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['CHARACTER'].id,
        content: '차분함',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.88,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['LOVE_STYLE'].id,
        content: '신중한',
        isStatic: false,
        source: ProfileSource.AI_ANALYSIS,
        confidenceScore: 0.75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['MBTI'].id,
        content: 'ESFJ',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.92,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['VALUE'].id,
        content: '정직',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['CHARACTER'].id,
        content: '활발함',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['LOVE_STYLE'].id,
        content: '표현 많은',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.85,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['IDEAL_TYPE'].id,
        content: '책임감 있는 사람',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.93,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['IDEAL_TYPE'].id,
        content: '행복을 추구하는 사람',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.91,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['FAMILY'].id,
        content: '외동',
        isStatic: false,
        source: ProfileSource.AI_ANALYSIS,
        confidenceScore: 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['FAMILY'].id,
        content: '3녀 중 막내',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['LIFESTYLE'].id,
        content: '저녁형 인간',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.85,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['LIFESTYLE'].id,
        content: '아침형 인간',
        isStatic: false,
        source: ProfileSource.AI_ANALYSIS,
        confidenceScore: 0.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['RELIGION'].id,
        content: '무교',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['RELIGION'].id,
        content: '기독교',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.97,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['CAREER'].id,
        content: '개발자',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['CAREER'].id,
        content: '디자이너',
        isStatic: false,
        source: ProfileSource.AI_ANALYSIS,
        confidenceScore: 0.82,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user1.id,
        categoryCodeId: categoryCodeMap['BLOOD_TYPE'].id,
        content: 'O형',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: user2.id,
        categoryCodeId: categoryCodeMap['BLOOD_TYPE'].id,
        content: 'A형',
        isStatic: true,
        source: ProfileSource.USER_INPUT,
        confidenceScore: 0.92,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
}

// 7. 조언 생성
async function createAdvices(channel) {
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
}

// 8. 이벤트 생성
async function createEvents(user1, user2) {
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
}

// 9. 유저별 지갑 생성 및 연결
async function createWalletsForUsers() {
  const users = await prisma.user.findMany({ where: { walletId: null } });
  await Promise.all(users.map(async (user, idx) => {
    const { address, mnemonic, privateKey } = createWalletFromEnvMnemonic(idx);
    const encryptedMnemonic = encrypt(mnemonic ?? '');
    const encryptedPrivateKey = encrypt(privateKey ?? '');
    const tokenBalance = await getTokenBalance(address);
    const wallet = await prisma.wallet.create({
      data: {
        address,
        mnemonic: encryptedMnemonic,
        privateKey: encryptedPrivateKey,
        tokenBalance,
        derivationIndex: idx,
        user: { connect: { id: user.id } },
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { walletId: wallet.id },
    });
    console.log(`User ${user.email}에 지갑 연결: ${wallet.address}`);
  }));
}

// ===== 메인 실행 함수 =====
async function main() {
  await setupTokenContract();
  const [categoryMap, categoryCodeMap, [user1, user2]] = await Promise.all([
    upsertCategoriesAndQuestions(),
    createCategoryCodes(),
    createUsers(),
  ]);
  const channel = await createChannelAndAssistants(user1, user2);
  await Promise.all([
    createChatHistory(channel, user1, user2),
    createPersonaProfiles(categoryCodeMap, user1, user2),
    createAdvices(channel),
    createEvents(user1, user2),
    createWalletsForUsers(),
  ]);
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
