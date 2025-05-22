import '../entry/advice.dart';

abstract class AdviceRepository {
  Future<List<Advice>> fetchAdvices(String channelId);
}