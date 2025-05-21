import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {PrismaService} from '@common/prisma/prisma.service';
import {LlmService} from '@modules/llm/llm.service';

@Injectable()
export class CoupleAnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  private readonly logger = new Logger(CoupleAnalysisService.name);

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
      include: {
        user1: true,
        user2: true,
      },
    });
    if (!channel) throw new NotFoundException('채널(커플)을 찾을 수 없습니다.');

    // 2. 최근 키워드, 기념일 등 추가 정보
    const keywords = channel.keywords ? JSON.parse(channel.keywords) : [];
    this.logger.log(`createAnalysisByAI>> keywords ::${keywords}`);
    const anniversary = channel.anniversary
      ? channel.anniversary.toISOString().split('T')[0]
      : '미입력';

    // 3. AI 프롬프트 생성
    const prompt = `
아래는 커플의 정보입니다.
- 유저1: ${channel.user1.name}, MBTI: ${channel.user1.mbti ?? '미입력'}
- 유저2: ${channel.user2.name}, MBTI: ${channel.user2.mbti ?? '미입력'}
- 기념일: ${anniversary}
- 최근 키워드: ${JSON.stringify(keywords)}

이 커플의 현재 상태를 한 문장으로 요약해주고, 조언을 한 문장으로 해주고,
각각의 페르소나(성향/특징)를 한 문장으로 분석해줘.
`;


    this.logger.log(`createAnalysisByAI>> prompt ::${prompt}`);
    // 4. AI 호출
    const aiResult = await this.llmService.analyzeCouple(prompt);

    // aiResult가 undefined/null이면 기본값 처리
    const rawResult = aiResult !== undefined && aiResult !== null
      ? (typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult))
      : '';

    if (!rawResult) {
      throw new Error('AI 분석 결과가 비어 있습니다.');
    }

    // 5. DB에 LLM 원본 응답 저장
    return this.prisma.coupleAnalysis.create({
      data: {
        channelId,
        rawResult,
      },
    });
  }
}
