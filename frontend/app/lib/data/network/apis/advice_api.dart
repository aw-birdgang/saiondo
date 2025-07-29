import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/advice_response.dart';

class AdviceApi {
  final DioClient _dioClient;

  AdviceApi(this._dioClient);

  Future<List<AdviceResponse>> fetchAdviceHistory(String channelId) async {
    final response =
        await _dioClient.dio.get('${Endpoints.adviceHistories(channelId)}');
    return (response.data as List)
        .map((e) => AdviceResponse.fromJson(e))
        .toList();
  }
}
