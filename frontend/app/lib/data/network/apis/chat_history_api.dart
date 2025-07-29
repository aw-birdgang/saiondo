import '../../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/chat_history_request.dart';
import '../dto/chat_history_response.dart';

class ChatHistoryApi {
  // dio instance
  final DioClient _dioClient;

  // injecting dio instance
  ChatHistoryApi(this._dioClient);

  Future<ChatHistoryResponse> sendMessage(ChatHistoryRequest req) async {
    final response =
        await _dioClient.dio.post(Endpoints.chat, data: req.toJson());
    return ChatHistoryResponse.fromJson(response.data);
  }

  Future<List<ChatHistoryResponse>> fetchChatHistories(
      String assistantId) async {
    final response = await _dioClient.dio.get(
      Endpoints.chatHistories(assistantId),
    );
    return (response.data as List)
        .map((e) => ChatHistoryResponse.fromJson(e))
        .toList();
  }
}
