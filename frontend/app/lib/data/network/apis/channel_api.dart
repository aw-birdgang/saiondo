import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../rest_client.dart';

class ChannelApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  ChannelApi(this._dioClient, this._restClient);

  Future<String> createInviteCode(String channelId) async {
    final response = await _dioClient.dio.post(
      Endpoints.channelByInviteCode(channelId),
      data: {'channelId': channelId,},
    );
    return response.data['inviteCode'] as String;
  }
}
