import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@common/prisma/prisma.service";
import {Advice} from '@prisma/client';
import {UpdateAdviceDto} from './dto/update-advice.dto';
import {LlmService} from "@modules/llm/llm.service";

@Injectable()
export class AdviceService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly llmService: LlmService,
  ) {}

  private readonly logger = new Logger(AdviceService.name);


  async createAdvice(channelId: string) {
    // 1. 커플(채널) 및 유저 정보 조회
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        user1: true,
        user2: true,
      },
    });
    if (!channel) throw new NotFoundException('채널(커플)을 찾을 수 없습니다.');

    // 2. 유저별 페르소나(카테고리별 특징) 정보 취합
    const [user1Personas, user2Personas] = await Promise.all([
      this.prisma.personaProfile.findMany({
        where: { userId: channel.user1Id },
        include: { categoryCode: true },
      }),
      this.prisma.personaProfile.findMany({
        where: { userId: channel.user2Id },
        include: { categoryCode: true },
      }),
    ]);

    // 3. 최근 키워드, 기념일 등 추가 정보
    const keywords: string[] = channel.keywords ? JSON.parse(channel.keywords) : [];
    const anniversary = channel.anniversary
        ? channel.anniversary.toISOString().split('T')[0]
        : '미입력';

    // 4. 유저별 프로필/페르소나 요약 문자열 생성
    const user1PersonaSummary = this.buildPersonaSummary(user1Personas, 'user1');
    const user2PersonaSummary = this.buildPersonaSummary(user2Personas, 'user2');

    const user1Mbti = this.extractMbti(user1Personas);
    const user2Mbti = this.extractMbti(user2Personas);

    const user1Profile = this.buildUserProfile(channel.user1, user1Mbti, user1PersonaSummary);
    const user2Profile = this.buildUserProfile(channel.user2, user2Mbti, user2PersonaSummary);

    // 5. AI 프롬프트 생성
    const prompt = this.buildAdvicePrompt(user1Profile, user2Profile, anniversary, keywords);

    this.logger.log(`createAdvice>> prompt ::\n${prompt}`);

    // 6. AI 호출
    const aiResult = await this.llmService.analyzeCouple(prompt);

    // aiResult가 undefined/null이면 기본값 처리
    const rawResult =
        aiResult !== undefined && aiResult !== null
            ? typeof aiResult === 'string'
                ? aiResult
                : JSON.stringify(aiResult)
            : '';

    if (!rawResult) {
      throw new Error('AI 분석 결과가 비어 있습니다.');
    }

    // 7. DB에 LLM 원본 응답 저장
    return this.prisma.advice.create({
      data: {
        channelId,
        advice: rawResult,
      },
    });
  }

  private buildPersonaSummary(personas: any[], userLabel: string): string {
    if (!personas.length) {
      this.logger.log(`[personaSummary][${userLabel}] 없음`);
      return '없음';
    }
    const summary = personas
        .map(
            (p) =>
                `${p.categoryCode.description || p.categoryCode.code}: ${p.content} (${p.source === 'USER_INPUT' ? '직접입력' : 'AI분석'})`
        )
        .join(', ');
    this.logger.log(`[personaSummary][${userLabel}] ${summary}`);
    return summary;
  }

  private extractMbti(personas: any[]): string {
    const mbtiProfile = personas.find((p) => p.categoryCode.code === 'MBTI');
    return mbtiProfile?.content || '미입력';
  }

  private buildUserProfile(user: any, mbti: string, personaSummary: string): string {
    return `
이름: ${user.name}
성별: ${user.gender}
생년월일: ${user.birthDate?.toISOString().split('T')[0] || '미입력'}
MBTI: ${mbti}
페르소나: ${personaSummary}
  `.trim();
  }

  private buildAdvicePrompt(
      user1Profile: string,
      user2Profile: string,
      anniversary: string,
      keywords: string[]
  ): string {
    return `
아래는 커플의 상세 정보 입니다.

[유저1]
${user1Profile}

[유저2]
${user2Profile}

[커플 정보]
- 기념일: ${anniversary}
- 최근 키워드: ${JSON.stringify(keywords)}

이 커플의 관계의 발전을 위해서, 조언을 한 문장 으로 해줘.
  `.trim();
  }


  async getAdviceHistory(channelId: string): Promise<Advice[]> {
    return this.prisma.advice.findMany({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLatestAdvice(channelId: string): Promise<Advice | null> {
    return this.prisma.advice.findFirst({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllAdvices(): Promise<Advice[]> {
    return this.prisma.advice.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdviceById(adviceId: string): Promise<Advice | null> {
    return this.prisma.advice.findUnique({
      where: { id: adviceId },
    });
  }

  // 채널 내에서 adviceId로 조회
  async getAdviceInChannel(channelId: string, adviceId: string): Promise<Advice | null> {
    return this.prisma.advice.findFirst({
      where: {
        id: adviceId,
        channelId,
      },
    });
  }

  // update
  async updateAdvice(channelId: string, adviceId: string, updateAdviceDto: UpdateAdviceDto): Promise<Advice> {
    // 존재 여부 확인
    const advice = await this.getAdviceInChannel(channelId, adviceId);
    if (!advice) throw new NotFoundException('Advice not found in this channel');
    return this.prisma.advice.update({
      where: { id: adviceId },
      data: {
        advice: updateAdviceDto.advice,
      },
    });
  }

  // delete
  async deleteAdvice(channelId: string, adviceId: string): Promise<Advice> {
    // 존재 여부 확인
    const advice = await this.getAdviceInChannel(channelId, adviceId);
    if (!advice) throw new NotFoundException('Advice not found in this channel');
    return this.prisma.advice.delete({
      where: { id: adviceId },
    });
  }
}
