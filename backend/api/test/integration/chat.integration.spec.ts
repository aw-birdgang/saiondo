import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/prisma/prisma.service';
import { ChatService } from '../../src/modules/chat/chat.service';

describe('Chat Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let chatService: ChatService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    chatService = moduleFixture.get<ChatService>(ChatService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // 테스트 데이터 정리
    await prismaService.chat.deleteMany();
    await prismaService.user.deleteMany();
    await prismaService.channel.deleteMany();
  });

  describe('POST /chat', () => {
    it('should create a new chat message', async () => {
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

      // 테스트 채널 생성
      const channel = await prismaService.channel.create({
        data: {
          id: 'test-channel-id',
          inviteCode: 'TEST123',
          status: 'ACTIVE',
          startedAt: new Date(),
        },
      });

      const chatData = {
        userId: user.id,
        assistantId: 'test-assistant-id',
        channelId: channel.id,
        message: 'Hello, this is a test message',
        sender: 'USER',
      };

      const response = await request(app.getHttpServer()).post('/chat').send(chatData).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.message).toBe(chatData.message);
      expect(response.body.userId).toBe(user.id);
    });

    it('should return 400 for invalid chat data', async () => {
      const invalidChatData = {
        userId: 'invalid-user-id',
        message: '', // 빈 메시지
      };

      await request(app.getHttpServer()).post('/chat').send(invalidChatData).expect(400);
    });
  });

  describe('GET /chat/:channelId', () => {
    it('should return chat history for a channel', async () => {
      // 테스트 데이터 생성
      const user = await prismaService.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          gender: 'MALE',
          birthDate: new Date(),
        },
      });

      const channel = await prismaService.channel.create({
        data: {
          id: 'test-channel-id',
          inviteCode: 'TEST123',
          status: 'ACTIVE',
          startedAt: new Date(),
        },
      });

      // 테스트 채팅 메시지 생성
      await prismaService.chat.create({
        data: {
          userId: user.id,
          assistantId: 'test-assistant-id',
          channelId: channel.id,
          message: 'Test message 1',
          sender: 'USER',
        },
      });

      await prismaService.chat.create({
        data: {
          userId: user.id,
          assistantId: 'test-assistant-id',
          channelId: channel.id,
          message: 'Test message 2',
          sender: 'ASSISTANT',
        },
      });

      const response = await request(app.getHttpServer()).get(`/chat/${channel.id}`).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].message).toBe('Test message 1');
      expect(response.body[1].message).toBe('Test message 2');
    });

    it('should return 404 for non-existent channel', async () => {
      await request(app.getHttpServer()).get('/chat/non-existent-channel').expect(404);
    });
  });
});
