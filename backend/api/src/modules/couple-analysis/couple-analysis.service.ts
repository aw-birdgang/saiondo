import {Injectable, Logger, NotFoundException, BadRequestException} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {LlmService} from '@modules/llm/llm.service';

@Injectable()
export class CoupleAnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  private readonly logger = new Logger(CoupleAnalysisService.name);

  async getAllAnalyses(channelId: string) {
    const analyses = await this.prisma.coupleAnalysis.findMany({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
    });
    if (!analyses.length) throw new NotFoundException('분석 정보가 없습니다.');
    return analyses;
  }

  // 최신 커플 분석 조회
  async getLatestAnalysis(channelId: string) {
    const analysis = await this.prisma.coupleAnalysis.findFirst({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
    });
    if (!analysis) throw new NotFoundException('분석 정보가 없습니다.');
    return analysis;
  }

  // AI 기반 커플 상태/페르소나 분석 생성
  async createAnalysisByAI(channelId: string) {
    // 1. 커플(채널) 및 유저 정보 조회
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { members: { include: { user: true } } },
    });
    if (!channel) throw new BadRequestException('채널 없음');

    // 2. 역할별 멤버 추출
    const user1Member = channel.members.find(m => m.role === 'OWNER');
    const user2Member = channel.members.find(m => m.role === 'MEMBER');
    const user1 = user1Member?.user;
    const user2 = user2Member?.user;

    // 3. userId 사용 부분
    // 기존: where: { userId: channel.user1Id }
    // 변경:
    await this.prisma.personaProfile.findFirst({
      where: { userId: user1?.id },
    });
    await this.prisma.personaProfile.findFirst({
      where: { userId: user2?.id },
    });

    // 4. user 정보 사용 부분
    // 기존: channel.user1.name, channel.user1.gender, ...
    // 변경:
    const user1Name = user1?.name ?? '미입력';
    const user1Gender = user1?.gender ?? '미입력';
    const user1Birth = user1?.birthDate?.toISOString().split('T')[0] ?? '미입력';

    const user2Name = user2?.name ?? '미입력';
    const user2Gender = user2?.gender ?? '미입력';
    const user2Birth = user2?.birthDate?.toISOString().split('T')[0] ?? '미입력';

    // 5. 유저별 페르소나(카테고리별 특징) 정보 취합
    const [user1Personas, user2Personas] = await Promise.all([
      this.prisma.personaProfile.findMany({
        where: { userId: user1?.id },
        include: { categoryCode: true },
      }),
      this.prisma.personaProfile.findMany({
        where: { userId: user2?.id },
        include: { categoryCode: true },
      }),
    ]);

    // 6. 최근 키워드, 기념일 등 추가 정보
    const keywords = channel.keywords ? JSON.parse(channel.keywords) : [];
    const anniversary = channel.anniversary
      ? channel.anniversary.toISOString().split('T')[0]
      : '미입력';

    // 7. 유저별 프로필/페르소나 요약 문자열 생성
    function personaSummary(personas: any[], userLabel: string) {
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

    const user1PersonaSummary = personaSummary.call(this, user1Personas, 'user1');
    const user2PersonaSummary = personaSummary.call(this, user2Personas, 'user2');

    const user1MbtiProfile = user1Personas.find(
      (p) => p.categoryCode.code === 'MBTI'
    );
    const user1Mbti = user1MbtiProfile?.content || '미입력';

    const user2MbtiProfile = user2Personas.find(
      (p) => p.categoryCode.code === 'MBTI'
    );
    const user2Mbti = user2MbtiProfile?.content || '미입력';

    const user1Profile = `
이름: ${user1Name}
성별: ${user1Gender}
생년월일: ${user1Birth}
MBTI: ${user1Mbti}
페르소나: ${user1PersonaSummary}
    `.trim();

    const user2Profile = `
이름: ${user2Name}
성별: ${user2Gender}
생년월일: ${user2Birth}
MBTI: ${user2Mbti}
페르소나: ${user2PersonaSummary}
    `.trim();

    // 8. AI 프롬프트 생성 (더 풍부하게)
    const prompt = `
아래는 커플의 상세 정보입니다.

[유저1]
${user1Profile}

[유저2]
${user2Profile}

[커플 정보]
- 기념일: ${anniversary}
- 최근 키워드: ${JSON.stringify(keywords)}

이 커플의 현재 상태를 한 문장으로 요약해주고, 조언을 한 문장으로 해주고,
각각의 페르소나(성향/특징)를 한 문장으로 분석해줘.
결과는 반드시 JSON 형식으로 아래와 같이 반환해줘:
{
  "summary": "...",
  "advice": "...",
  "persona1": "...",
  "persona2": "...",
  "keywords": [...]
}
    `.trim();

    this.logger.log(`createAnalysisByAI>> prompt ::\n${prompt}`);

    // 9. AI 호출
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

    // 10. DB에 LLM 원본 응답 저장
    return this.prisma.coupleAnalysis.create({
      data: {
        channelId,
        rawResult,
      },
    });
  }
}
