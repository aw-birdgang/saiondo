
import '../../../../core/data/network/dio/dio_client.dart';
import '../../../domain/entry/chat/chat_history.dart';
import '../rest_client.dart';

class ChatHistoryApi {
  // dio instance
  final DioClient _dioClient;

  // rest-client instance
  final RestClient _restClient;

  // injecting dio instance
  ChatHistoryApi(this._dioClient, this._restClient);


  Future<List<ChatHistory>> fetchChatHistories(String roomId) async {
    final response = await _dioClient.dio.get('/chat-histories', queryParameters: {'roomId': roomId});
    return (response.data as List).map((e) => ChatHistory.fromJson(e)).toList();
  }

  Future<ChatHistory> sendMessage({
    required String userId,
    required String roomId,
    required String message,
  }) async {
    final response = await _dioClient.dio.post('/chat', data: {
      'userId': userId,
      'roomId': roomId,
      'message': message,
    });
    return ChatHistory.fromJson(response.data['userChat']);
  }


}