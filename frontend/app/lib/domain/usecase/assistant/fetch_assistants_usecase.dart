import 'package:app/domain/entry/assistant/assistant.dart';

import '../../repository/assistant/assitant_repository.dart';

class FetchAssistantsUseCase {
  final AssistantRepository repository;
  FetchAssistantsUseCase(this.repository);

  Future<List<Assistant>> call(String userId) => repository.fetchAssistants(userId);
}