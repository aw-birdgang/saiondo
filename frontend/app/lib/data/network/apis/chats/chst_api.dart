import 'dart:async';

import '../../../../core/data/network/dio/dio_client.dart';
import '../../../../domain/entry/chat/chat_list.dart';
import '../../constants/endpoints.dart';
import '../../dto/chat_history_request.dart';
import '../../dto/chat_history_response.dart';
import '../../rest_client.dart';

class ChatApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  ChatApi(this._dioClient, this._restClient);

  Future<ChatList> getChats() async {
    try {
      final res = await _dioClient.dio.get(Endpoints.getFaqs);
      return ChatList.fromJson(res.data);
    } catch (e) {
      print(e.toString());
      throw e;
    }
  }

  Future<ChatHistoryResponse> sendMessage(ChatHistoryRequest req) async {
    final response = await _dioClient.dio.post(Endpoints.chat, data: req.toJson());
    return ChatHistoryResponse.fromJson(response.data);
  }

  Future<List<ChatHistoryResponse>> fetchChatHistories(String roomId) async {
    final response = await _dioClient.dio.get(Endpoints.chatHistories, queryParameters: {'roomId': roomId});
    return (response.data as List)
        .map((e) => ChatHistoryResponse.fromJson(e))
        .toList();
  }

}