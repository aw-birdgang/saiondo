import '../../../models/emotion_log.dart';

abstract class EmotionLogRepository {
  /// 특정 사용자의 감정 로그를 날짜 범위로 조회
  Future<List<EmotionLog>> getEmotionLogs(String userId, DateTime startDate, DateTime endDate);
  
  /// 특정 사용자의 최근 감정 로그를 조회
  Future<List<EmotionLog>> getRecentEmotionLogs(String userId, int limit);
  
  /// 감정 로그 저장
  Future<bool> saveEmotionLog(EmotionLog log);
  
  /// 감정 로그 수정
  Future<bool> updateEmotionLog(EmotionLog log);
  
  /// 감정 로그 삭제
  Future<bool> deleteEmotionLog(String logId);
} 