import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/channel_list_response.dart';
import '../dto/channel_response.dart';
import '../rest_client.dart';

class ChannelApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  ChannelApi(this._dioClient, this._restClient);

  Future<ChannelResponse> createInviteCode(String channelId) async {
    final response = await _dioClient.dio.post(
      Endpoints.channelInviteCode(channelId),
      data: {'channelId': channelId},
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      return ChannelResponse.fromJson(response.data);
    }
    throw Exception('초대 코드 생성 실패');
  }

  Future<ChannelResponse> fetchChannelById(String channelId) async {
    final response = await _dioClient.dio.get(Endpoints.channelById(channelId));
    if (response.statusCode == 200) {
      return ChannelResponse.fromJson(response.data);
    }
    throw Exception('채널 조회 실패');
  }

  Future<ChannelResponse> createChannel(String user1Id, String user2Id) async {
    final response = await _dioClient.dio.post(
      Endpoints.channels,
      data: {'user1Id': user1Id, 'user2Id': user2Id},
    );
    if (response.statusCode == 201) {
      return ChannelResponse.fromJson(response.data);
    }
    throw Exception('채널 생성 실패');
  }

  Future<bool> isMember(String channelId, String userId) async {
    final response = await _dioClient.dio.get(
      Endpoints.channelMemberById(channelId, userId),
    );
    if (response.statusCode == 200) {
      return response.data['isMember'] as bool;
    }
    throw Exception('멤버십 확인 실패');
  }

  Future<void> addMember(String channelId, String userId) async {
    final response = await _dioClient.dio.post(
      Endpoints.channelMembers(channelId),
      data: {'userId': userId},
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('멤버 추가 실패');
    }
  }

  Future<void> cleanupEmptyChannels() async {
    final response = await _dioClient.dio.delete(Endpoints.channelCleanup);
    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('멤버 없는 채널 정리 실패');
    }
  }

  Future<void> createInvitation(String channelId, String inviteeId) async {
    final response = await _dioClient.dio.post(
      Endpoints.channelInvitations,
      data: {'channelId': channelId, 'inviteeId': inviteeId},
    );
    if (response.statusCode != 201 && response.statusCode != 200) {
      throw Exception('초대장 생성 실패');
    }
  }

  Future<bool> hasPendingInvitation(String channelId, String inviteeId) async {
    final response = await _dioClient.dio.get(
      Endpoints.channelInvitations,
      queryParameters: {
        'channelId': channelId,
        'inviteeId': inviteeId,
        'status': 'pending',
      },
    );
    if (response.statusCode == 200) {
      return (response.data['hasPending'] ?? false) as bool;
    }
    throw Exception('초대장 중복 확인 실패');
  }

  Future<void> respondInvitation(String invitationId, String responseValue) async {
    final response = await _dioClient.dio.post(
      Endpoints.channelInvitationRespond(invitationId),
      data: {'response': responseValue},
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('초대장 응답 실패');
    }
  }

  Future<ChannelListResponse> fetchAllChannels() async {
    final response = await _dioClient.dio.get(Endpoints.channels);
    if (response.statusCode == 200) {
      return ChannelListResponse.fromJson(response.data as List);
    }
    throw Exception('채널 목록 조회 실패');
  }
}