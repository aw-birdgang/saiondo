import '../../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/chat_history_request.dart';
import '../dto/chat_history_response.dart';
import '../rest_client.dart';

class ChatHistoryApi {
  // dio instance
  final DioClient _dioClient;

  // rest-client instance
  final RestClient _restClient;

  // injecting dio instance
  ChatHistoryApi(this._dioClient, this._restClient);

  Future<ChatHistoryResponse> sendMessage(ChatHistoryRequest req) async {
    final response = await _dioClient.dio.post(Endpoints.chat, data: req.toJson());
    return ChatHistoryResponse.fromJson(response.data);
  }

  Future<List<ChatHistoryResponse>> fetchChatHistories(String assistantId) async {
    final response = await _dioClient.dio.get(
      Endpoints.chatHistories,
      queryParameters: {'assistantId': assistantId},
    );
    return (response.data as List)
        .map((e) => ChatHistoryResponse.fromJson(e))
        .toList();
  }
}