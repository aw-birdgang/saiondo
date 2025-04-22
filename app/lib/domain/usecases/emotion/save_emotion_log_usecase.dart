import 'package:flutter/foundation.dart';

import '../../../domain/repositories/emotion/emotion_log_repository.dart';
import '../../../models/emotion_log.dart';

class SaveEmotionLogUseCase {
  final EmotionLogRepository _repository;

  SaveEmotionLogUseCase(this._repository);

  Future<bool> call(EmotionLog emotionLog) async {
    try {
      await _repository.saveEmotionLog(emotionLog);
      return true;
    } catch (e) {
      debugPrint('SaveEmotionLogUseCase 에러: $e');
      return false;
    }
  }
} 