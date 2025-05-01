import 'dart:async';

import 'package:dio/dio.dart';

import '../../../../core/data/network/dio/dio_client.dart';
import '../../../../domain/entry/chat/chat_list.dart';
import '../../constants/endpoints.dart';
import '../../model/chat_response.dart';
import '../../rest_client.dart';

class ChatApi {
  // dio instance
  final DioClient _dioClient;

  // rest-client instance
  final RestClient _restClient;

  // injecting dio instance
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

  Future<ChatResponse> sendMessage(String message) async {
    try {
      final Response response = await _dioClient.dio.post(
        '/chat',
        data: {'message': message},
      );
      if (response.data is Map<String, dynamic>) {
        return ChatResponse.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw Exception('Invalid response format');
      }
    } catch (e) {
      throw Exception('API Error: ${e.toString()}');
    }
  }

}