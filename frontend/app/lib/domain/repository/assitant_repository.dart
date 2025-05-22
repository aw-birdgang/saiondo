import 'package:app/domain/entry/assistant.dart';

abstract class AssistantRepository {
  Future<List<Assistant>> fetchAssistants(String userId);
  Future<Assistant> fetchAssistantById(String assistantId);
}