import 'package:mobx/mobx.dart';

import '../../../domain/entry/point_history.dart';
import '../../../domain/repository/point_repository.dart';

part 'point_history_store.g.dart';

class PointHistoryStore = _PointHistoryStore with _$PointHistoryStore;

abstract class _PointHistoryStore with Store {
  final PointRepository _pointRepository;

  _PointHistoryStore(this._pointRepository);

  @observable
  ObservableList<PointHistory> histories = ObservableList<PointHistory>();

  @observable
  bool isLoading = false;

  @action
  Future<void> loadPointHistory(String userId) async {
    isLoading = true;
    try {
      final result = await _pointRepository.getPointHistory(userId);
      histories = ObservableList.of(result);
    } finally {
      isLoading = false;
    }
  }
}
