import '../../domain/entry/couple_analysis.dart';
import '../../domain/repository/analysis_repository.dart';
import '../adapter/couple_analysis_adapter.dart';
import '../network/apis/analysis_api.dart';

class AnalysisRepositoryImpl implements AnalysisRepository {
  final AnalysisApi _api;
  AnalysisRepositoryImpl(this._api);

  Future<List<CoupleAnalysis>> fetchAnalyses(String channelId) async {
    final responseList = await _api.fetchAnalysisByChannelId(channelId);
    return responseList
        .map((res) => CoupleAnalysisAdapter.fromResponse(res))
        .toList();
  }

  Future<CoupleAnalysis> fetchAnalysisLatest(String channelId) async {
    final res = await _api.fetchAnalysisByChannelIdLatest(channelId);
    return CoupleAnalysisAdapter.fromResponse(res);
  }

  Future<CoupleAnalysis> createAnalysis(String channelId) async {
    final res = await _api.createAnalysis(channelId);
    return CoupleAnalysisAdapter.fromResponse(res);
  }
}
