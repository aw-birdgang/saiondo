import '../../data/network/dto/analysis_response.dart';

abstract class AnalysisRepository {
  Future<AnalysisResponse> fetchAnalysis(String channelId);
}