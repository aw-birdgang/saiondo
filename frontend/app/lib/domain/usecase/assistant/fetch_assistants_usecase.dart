import 'package:saiondo/domain/entry/assistant.dart';

import '../../repository/assitant_repository.dart';

class FetchAssistantsUseCase {
  final AssistantRepository repository;
  FetchAssistantsUseCase(this.repository);

  Future<List<Assistant>> call(String userId) => repository.fetchAssistants(userId);
}