import 'package:mobx/mobx.dart';

import '../../../domain/entry/couple_analysis.dart';
import '../../../domain/repository/analysis_repository.dart';

part 'analysis_store.g.dart';

class AnalysisStore = _AnalysisStore with _$AnalysisStore;

abstract class _AnalysisStore with Store {
  final AnalysisRepository _repository;
  _AnalysisStore(this._repository);

  @observable
  ObservableList<CoupleAnalysis> analyses = ObservableList<CoupleAnalysis>();

  @observable
  CoupleAnalysis? latestAnalysis;

  @observable
  bool isLoading = false;

  @observable
  bool isCreating = false;

  @action
  Future<void> loadAnalyses(String channelId) async {
    try {
      print('[AnalysisStore] loadAnalyses called with channelId: $channelId');
      isLoading = true;
      final result = await _repository.fetchAnalyses(channelId);
      analyses = ObservableList.of(result);
      latestAnalysis = result.isNotEmpty ? result.first : null;
    } catch (e, stack) {
      print('[AnalysisStore] 분석 로딩 에러: $e\n$stack');
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> createAnalysis(String channelId) async {
    isCreating = true;
    try {
      final newAnalysis = await _repository.createAnalysis(channelId);
      analyses.insert(0, newAnalysis);
      latestAnalysis = newAnalysis;
    } finally {
      isCreating = false;
    }
  }
}
