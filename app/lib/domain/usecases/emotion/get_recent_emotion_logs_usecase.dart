import 'package:app/domain/repositories/emotion/emotion_log_repository.dart';
import 'package:flutter/material.dart';

import '../../../models/emotion_log.dart';

class GetRecentEmotionLogsUseCase {
  final EmotionLogRepository _repository;

  GetRecentEmotionLogsUseCase(this._repository);

  Future<List<EmotionLog>> call(String userId, int limit) async {
    debugPrint('\n=== GetRecentEmotionLogsUseCase 실행 ===');
    debugPrint('요청 파라미터 - userId: $userId, limit: $limit');

    try {
      final logs = await _repository.getRecentEmotionLogs(userId, limit);

      debugPrint('\n=== UseCase 결과 ===');
      debugPrint('${logs.length}개의 감정 로그 조회됨');

      for (var log in logs) {
        log.printDetails();
      }

      return logs;
    } catch (e, stackTrace) {
      debugPrint('''
\n=== UseCase 에러 ===
에러 타입: ${e.runtimeType}
에러 메시지: $e
스택 트레이스:
$stackTrace
=================
''');
      rethrow;
    }
  }

}