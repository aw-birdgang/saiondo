import '../../domain/repository/analysis_repository.dart';
import '../network/apis/analysis_api.dart';
import '../network/dto/analysis_response.dart';

class AnalysisRepositoryImpl implements AnalysisRepository {
  final AnalysisApi _api;
  AnalysisRepositoryImpl(this._api);

  Future<AnalysisResponse> fetchAnalysis(String channelId) {
    return _api.fetchAnalysis(channelId);
  }
}
