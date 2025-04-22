import 'package:flutter/foundation.dart';

import '../../../domain/repositories/emotion/emotion_log_repository.dart';
import '../../../models/emotion_log.dart';

class GetEmotionLogsUseCase {
  final EmotionLogRepository _repository;

  GetEmotionLogsUseCase(this._repository);

  Future<List<EmotionLog>> call({
    required String userId,
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      return await _repository.getEmotionLogs(userId, startDate, endDate);
    } catch (e) {
      debugPrint('GetEmotionLogsUseCase 에러: $e');
      return [];
    }
  }
} 