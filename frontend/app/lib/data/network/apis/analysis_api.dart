import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/analysis_response.dart';

class AnalysisApi {
  final DioClient _dioClient;

  AnalysisApi(this._dioClient);

  Future<List<AnalysisResponse>> fetchAnalysisByChannelId(
      String channelId) async {
    final response = await _dioClient.dio
        .get('${Endpoints.coupleAnalysisByChannelId(channelId)}');
    return (response.data as List)
        .map((e) => AnalysisResponse.fromJson(e))
        .toList();
  }

  Future<AnalysisResponse> fetchAnalysisByChannelIdLatest(
      String channelId) async {
    final response = await _dioClient.dio
        .get('${Endpoints.coupleAnalysisByChannelIdLatest(channelId)}');
    return AnalysisResponse.fromJson(response.data);
  }

  Future<AnalysisResponse> createAnalysis(String channelId) async {
    final response =
        await _dioClient.dio.post('${Endpoints.coupleAnalysisLlm(channelId)}');
    return AnalysisResponse.fromJson(response.data);
  }
}
