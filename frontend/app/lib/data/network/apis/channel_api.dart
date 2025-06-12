import '../../../core/data/network/dio/dio_client.dart';
import '../../../domain/entry/channel.dart';
import '../../../domain/entry/channel.dart';
import '../../../domain/entry/channels.dart';
import '../constants/endpoints.dart';
import '../dto/channel_invitation_response.dart';
import '../dto/channel_response.dart';
import '../rest_client.dart';

class ChannelApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  ChannelApi(this._dioClient, this._restClient);

  Future<List<Channel>> fetchAllChannels() async {
    final response = await _dioClient.dio.get(Endpoints.channels);
    if (response.statusCode == 200) {
      return (response.data as List)
          .map((e) => Channel.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    throw Exception('채널 목록 조회 실패');
  }

  Future<Channel> fetchChannelById(String channelId) async {
    final response = await _dioClient.dio.get(Endpoints.channelById(channelId));
    if (response.statusCode == 200) {
      return Channel.fromJson(response.data);
    }
    throw Exception('채널 조회 실패');
  }

  Future<Channels> fetchChannelsByUserId(String userId) async {
    final response = await _dioClient.dio.get(Endpoints.channelByUserId(userId));
    print('[ChannelStore] response > fetchChannelByUserId > response.statusCode :: ${response.statusCode}');
    if (response.statusCode == 200) {
      Channels channels = Channels.fromJson(response.data);
      print('[ChannelStore] response > fetchChannelByUserId > channels :: ${channels.toString()}');
      return channels;
    }
    throw Exception('채널 조회 실패');
  }

  Future<Channel> createChannel(String userId) async {
    final response = await _dioClient.dio.post(
      Endpoints.channels,
      data: {'userId': userId},
    );
    if (response.statusCode == 201) {
      return Channel.fromJson(response.data);
    }
    throw Exception('채널 생성 실패');
  }

  Future<Channel> joinByInvite(String inviteCode, String userId) async {
    final response = await _dioClient.dio.post(
      Endpoints.joinByInvite,
      data: {'inviteCode': inviteCode, 'userId': userId},
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      return Channel.fromJson(response.data);
    }
    throw Exception('초대코드로 채널 가입 실패');
  }

  Future<void> leaveChannel(String userId) async {
    final response = await _dioClient.dio.post(
      Endpoints.leaveChannel,
      data: {'userId': userId},
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('채널 나가기 실패');
    }
  }

  Future<void> addMember(String channelId, String userId) async {
    final response = await _dioClient.dio.post(
      Endpoints.members(channelId),
      data: {'userId': userId},
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('멤버 추가 실패');
    }
  }

  Future<ChannelResponse> createInviteCode(String channelId, String userId) async {
    final response = await _dioClient.dio.post(
      Endpoints.inviteCode(channelId),
      data: {'channelId': channelId, 'userId': userId},
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      return ChannelResponse.fromJson(response.data);
    }
    throw Exception('초대 코드 생성 실패');
  }

  Future<void> acceptInvitation(String channelId, String userId) async {
    final response = await _dioClient.dio.post(
      Endpoints.accept(channelId),
      data: {'userId': userId},
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('초대 수락 실패');
    }
  }

  Future<void> rejectInvitation(String channelId, String userId) async {
    final response = await _dioClient.dio.post(
      Endpoints.reject(channelId),
      data: {'userId': userId},
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('초대 거절 실패');
    }
  }

  Future<void> deleteChannel(String channelId) async {
    final response = await _dioClient.dio.delete(Endpoints.deleteChannel(channelId));
    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('채널 삭제 실패');
    }
  }

  Future<bool> isMember(String channelId, String userId) async {
    final response = await _dioClient.dio.get(
      Endpoints.memberById(channelId, userId),
    );
    if (response.statusCode == 200) {
      return response.data['isMember'] as bool;
    }
    throw Exception('멤버십 확인 실패');
  }

  Future<void> cleanupEmptyChannels() async {
    final response = await _dioClient.dio.delete(Endpoints.cleanup);
    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('멤버 없는 채널 정리 실패');
    }
  }

  Future<ChannelInvitationResponse> createInvitation(
      String channelId, String inviterId, String inviteeId) async {
    final response = await _dioClient.dio.post(
      Endpoints.invite(channelId),
      data: {'channelId': channelId, 'inviterId': inviterId, 'inviteeId': inviteeId},
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      return ChannelInvitationResponse.fromJson(response.data);
    }
    throw Exception('초대장 생성 실패');
  }

  Future<bool> hasPendingInvitation(String channelId, String inviteeId) async {
    final response = await _dioClient.dio.get(
      Endpoints.hasPendingInvitation(channelId, inviteeId),
    );
    if (response.statusCode == 200) {
      return response.data['hasPending'] as bool;
    }
    throw Exception('초대장 상태 확인 실패');
  }

  Future<List<dynamic>> fetchInvitationsForUser(String userId) async {
    final response = await _dioClient.dio.get('/users/$userId/invitations');
    if (response.statusCode == 200) {
      return response.data as List;
    }
    throw Exception('초대장 목록 조회 실패');
  }

  Future<void> respondInvitation(String invitationId, String responseStr) async {
    final response = await _dioClient.dio.post('/invitations/$invitationId/respond', data: {
      'response': responseStr,
    });
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('초대장 응답 실패');
    }
  }

}