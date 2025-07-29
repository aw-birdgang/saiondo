import '../entry/couple_analysis.dart';

abstract class AnalysisRepository {
  Future<List<CoupleAnalysis>> fetchAnalyses(String channelId);
  Future<CoupleAnalysis> fetchAnalysisLatest(String channelId);
  Future<CoupleAnalysis> createAnalysis(String channelId);
}
