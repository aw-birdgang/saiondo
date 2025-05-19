import 'package:app/domain/entry/assistant/assistant.dart';

import '../../data/network/apis/assistant_api.dart';
import '../../domain/repository/assistant/assitant_repository.dart';

class AssistantRepositoryImpl implements AssistantRepository {
  final AssistantApi api;
  AssistantRepositoryImpl(this.api);

  @override
  Future<List<Assistant>> fetchAssistants(String userId) => api.fetchAssistants(userId);

  @override
  Future<Assistant> fetchAssistantById(String assistantId) => api.fetchAssistantById(assistantId);
}