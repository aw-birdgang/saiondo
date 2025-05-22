import 'package:app/data/network/constants/endpoints.dart';

import '../../../core/data/network/dio/dio_client.dart';
import '../../../domain/entry/assistant.dart';
import '../dto/assistant_request.dart';
import '../rest_client.dart';

class AssistantApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  AssistantApi(this._dioClient, this._restClient);

  Future<List<Assistant>> fetchAssistants(String userId) async {
    final response = await _dioClient.dio.get(Endpoints.assistantsByUser(userId));
    return (response.data as List).map((e) => Assistant.fromJson(e)).toList();
  }

  Future<Assistant> fetchAssistantById(String assistantId) async {
    final response = await _dioClient.dio.get(Endpoints.assistantById(assistantId));
    return Assistant.fromJson(response.data);
  }

  Future<Assistant> createAssistant(AssistantCreateRequest request) async {
    final response = await _dioClient.dio.post(Endpoints.assistants, data: request.toJson());
    return Assistant.fromJson(response.data);
  }

  Future<Assistant> updateAssistant(String assistantId, AssistantUpdateRequest request) async {
    final response = await _dioClient.dio.put(Endpoints.assistantById(assistantId), data: request.toJson());
    return Assistant.fromJson(response.data);
  }

  Future<void> deleteAssistant(String assistantId) async {
    await _dioClient.dio.delete(Endpoints.assistantById(assistantId));
  }
}