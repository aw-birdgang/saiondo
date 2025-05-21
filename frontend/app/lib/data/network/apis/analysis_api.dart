import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/analysis_response.dart';
import '../rest_client.dart';

class AnalysisApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  AnalysisApi(this._dioClient, this._restClient);

  Future<AnalysisResponse> fetchAnalysis(String channelId) async {
    final response = await _dioClient.dio.get('${Endpoints.channels}/$channelId/analysis');
    return AnalysisResponse.fromJson(response.data);
  }
}
