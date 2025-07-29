import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { NotificationService } from '../notification/notification.service';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class ReportService {
  private readonly logger = createWinstonLogger(ReportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
    private readonly notificationService: NotificationService,
  ) {}

  // 커플 리포트 생성
  async generateComprehensiveReport(channelId: string) {
    try {
      // 1. 커플 정보 조회
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
        include: {
          members: {
            include: {
              user: {
                include: {
                  personaProfiles: {
                    include: { categoryCode: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!channel) throw new Error('채널을 찾을 수 없습니다.');

      // 2. 멤버 정보 및 페르소나 요약
      const members = channel.members.map(m => ({
        name: m.user.name,
        gender: m.user.gender,
        birthDate: m.user.birthDate,
        personas: m.user.personaProfiles.map(p => ({
          category: p.categoryCode.description ?? p.categoryCode.code,
          content: p.content,
          confidence: p.confidenceScore,
        })),
      }));

      // 3. LLM 프롬프트 생성
      const prompt = `
커플 리포트 생성 요청입니다.

[멤버1]
이름: ${members[0]?.name}
성별: ${members[0]?.gender}
생년월일: ${members[0]?.birthDate}
페르소나: ${JSON.stringify(members[0]?.personas)}

[멤버2]
이름: ${members[1]?.name}
성별: ${members[1]?.gender}
생년월일: ${members[1]?.birthDate}
페르소나: ${JSON.stringify(members[1]?.personas)}

이 커플의 관계를 분석하고, 강점, 개선점, 종합 조언을 JSON으로 반환해주세요.
      `.trim();

      // 4. LLM 호출
      const llmResult = await this.llmService.analyzeCouple(prompt);

      // 5. 리포트 DB 저장
      const report = await this.prisma.report.create({
        data: {
          channelId,
          content: llmResult,
        },
      });

      // 6. 알림 전송
      await this.notificationService.sendCoupleNotification(channelId, {
        title: '새 커플 리포트가 도착했어요!',
        body: 'AI가 분석한 커플 리포트를 확인해보세요.',
        type: 'REPORT',
        data: { reportId: report.id },
      });

      return report;
    } catch (error) {
      this.logger.error(`리포트 생성 실패: ${error.message}`);
      throw error;
    }
  }

  // 채널별 리포트 조회 메서드 추가
  async getReportsByChannel(channelId: string) {
    return this.prisma.report.findMany({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 특정 리포트 조회
  async getReportById(reportId: string) {
    return this.prisma.report.findUnique({
      where: { id: reportId },
    });
  }
}
