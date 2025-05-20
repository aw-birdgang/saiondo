import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../rest_client.dart';

class ChannelApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  ChannelApi(this._dioClient, this._restClient);

  Future<String> createInviteCode(String channelId) async {
    // user2Id는 null 또는 빈값으로 전달 (여자친구가 나중에 참여)
    final response = await _dioClient.dio.post(
      Endpoints.channelByInviteCode(channelId),
      data: {'channelId': channelId,},
    );
    // inviteCode는 서버 응답에 포함되어야 함
    return response.data['inviteCode'] as String;
  }
}
