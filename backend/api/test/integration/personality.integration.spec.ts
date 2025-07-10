import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/prisma/prisma.service';
import { PersonalityService } from '../../src/modules/personality/personality.service';

describe('Personality Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let personalityService: PersonalityService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    personalityService = moduleFixture.get<PersonalityService>(PersonalityService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // 테스트 데이터 정리
    await prismaService.personaProfile.deleteMany();
    await prismaService.user.deleteMany();
  });

  describe('POST /personality/analyze-conversation', () => {
    it('should analyze conversation and return personality traits', async () => {
      // 테스트 사용자 생성
      const user = await prismaService.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          gender: 'MALE',
          birthDate: new Date(),
        },
      });

      const conversationData = {
        userId: user.id,
        partnerId: 'test-partner-id',
        messages: [
          { role: 'user', content: '안녕하세요!' },
          { role: 'partner', content: '안녕하세요! 오늘 날씨가 좋네요.' },
          { role: 'user', content: '네, 정말 좋은 날씨입니다.' }
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/personality/analyze-conversation')
        .send(conversationData)
        .expect(201);

      expect(response.body).toHaveProperty('personalityTraits');
      expect(response.body).toHaveProperty('feedback');
      expect(response.body).toHaveProperty('score');
      expect(typeof response.body.score).toBe('number');
    });

    it('should handle invalid conversation data', async () => {
      const invalidData = {
        userId: 'invalid-user-id',
        messages: [], // 빈 메시지 배열
      };

      await request(app.getHttpServer())
        .post('/personality/analyze-conversation')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('POST /personality/analyze-mbti', () => {
    it('should analyze MBTI and return personality type', async () => {
      const user = await prismaService.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          gender: 'MALE',
          birthDate: new Date(),
        },
      });

      const mbtiData = {
        userId: user.id,
        data: {
          answers: ['A', 'B', 'A', 'B', 'A'],
          conversation_samples: [
            '저는 혼자 있는 시간을 좋아해요.',
            '새로운 사람들을 만나는 것이 즐거워요.'
          ]
        },
      };

      const response = await request(app.getHttpServer())
        .post('/personality/analyze-mbti')
        .send(mbtiData)
        .expect(201);

      expect(response.body).toHaveProperty('mbti');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('match');
    });
  });

  describe('POST /personality/analyze-communication', () => {
    it('should analyze communication style', async () => {
      const user = await prismaService.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          gender: 'MALE',
          birthDate: new Date(),
        },
      });

      const communicationData = {
        userId: user.id,
        messages: [
          { role: 'user', content: '직접적으로 말씀드리겠습니다.' },
          { role: 'partner', content: '감사합니다. 솔직한 대화가 좋네요.' }
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/personality/analyze-communication')
        .send(communicationData)
        .expect(201);

      expect(response.body).toHaveProperty('style');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('feedback');
    });
  });
});
