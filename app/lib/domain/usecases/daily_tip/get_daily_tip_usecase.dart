import 'package:flutter/material.dart';

import '../../../core/error/daily_tip_exception.dart';
import '../../../models/daily_tip.dart';
import '../../../models/emotion_log.dart';
import '../../repositories/daily_tip/daily_tip_repository.dart';

class GetDailyTipUseCase {
  final DailyTipRepository _repository;

  GetDailyTipUseCase(this._repository);

  Future<DailyTip> call({
    required String userId,
    required String partnerId,
    required List<EmotionLog> recentLogs,
  }) async {
    try {
      if (recentLogs.isEmpty) {
        throw const DailyTipException('최근 감정 기록이 없습니다.');
      }

      final recentEmotions = recentLogs
          .take(3)
          .map((log) => log.emoji)
          .toList();

      final averageTemperature = recentLogs
          .take(3)
          .map((log) => log.temperature)
          .reduce((a, b) => a + b) / 3.0;

      debugPrint('''
=== GetDailyTipUseCase 실행 ===
userId: $userId
partnerId: $partnerId
최근 감정: $recentEmotions
평균 온도: $averageTemperature
''');

      final dailyTip = await _repository.getDailyTip(
        userId: userId,
        partnerId: partnerId,
        recentEmotions: recentEmotions,
        averageTemperature: averageTemperature,
      );

      debugPrint('''
=== 데일리 팁 조회 결과 ===
제목: ${dailyTip.title}
카테고리: ${dailyTip.category}
''');

      return dailyTip;
    } catch (e) {
      debugPrint('GetDailyTipUseCase 에러: $e');
      rethrow;
    }
  }
}