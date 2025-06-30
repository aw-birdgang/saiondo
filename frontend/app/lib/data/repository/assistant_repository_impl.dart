import 'package:saiondo/domain/entry/assistant.dart';

import '../../data/network/apis/assistant_api.dart';
import '../../domain/repository/assitant_repository.dart';

class AssistantRepositoryImpl implements AssistantRepository {
  final AssistantApi api;
  AssistantRepositoryImpl(this.api);

  @override
  Future<List<Assistant>> fetchAssistants(String userId) => api.fetchAssistants(userId);

  @override
  Future<Assistant> fetchAssistantById(String assistantId) => api.fetchAssistantById(assistantId);
}