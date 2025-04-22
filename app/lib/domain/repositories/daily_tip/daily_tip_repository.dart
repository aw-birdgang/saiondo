import '../../../models/daily_tip.dart';

abstract class DailyTipRepository {
  Future<DailyTip> getDailyTip({
    required String userId,
    required String partnerId,
    required List<String> recentEmotions,
    required double averageTemperature,
  });
}