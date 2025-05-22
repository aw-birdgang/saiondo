import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/advice_response.dart';
import '../rest_client.dart';

class AdviceApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  AdviceApi(this._dioClient, this._restClient);

  Future<List<AdviceResponse>> fetchAdvices(String channelId) async {
    final response = await _dioClient.dio.get('${Endpoints.advices(channelId)}');
    return (response.data as List)
        .map((e) => AdviceResponse.fromJson(e))
        .toList();
  }
}

