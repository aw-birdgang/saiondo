import 'package:mobx/mobx.dart';

import '../../../data/network/dto/analysis_response.dart';
import '../../../domain/repository/analysis_repository.dart';

part 'analysis_store.g.dart';

class AnalysisStore = _AnalysisStore with _$AnalysisStore;

abstract class _AnalysisStore with Store {
  final AnalysisRepository _repository;
  _AnalysisStore(this._repository);

  @observable
  AnalysisResponse? analysis;

  @observable
  bool isLoading = false;

  @action
  Future<void> loadAnalysis(String channelId) async {
    isLoading = true;
    try {
      analysis = await _repository.fetchAnalysis(channelId);
    } finally {
      isLoading = false;
    }
  }
}
