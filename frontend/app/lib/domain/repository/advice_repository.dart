import '../entry/advice.dart';

abstract class AdviceRepository {
  Future<List<Advice>> fetchAdviceHistory(String channelId);
}