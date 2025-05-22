import 'package:mobx/mobx.dart';

import '../../../domain/entry/advice.dart';
import '../../../domain/repository/advice_repository.dart';

part 'advice_store.g.dart';

class AdviceStore = _AdviceStore with _$AdviceStore;

abstract class _AdviceStore with Store {
  final AdviceRepository _repository;
  _AdviceStore(this._repository);

  @observable
  ObservableList<Advice> adviceList = ObservableList<Advice>();

  @observable
  bool isLoading = false;

  @action
  Future<void> loadAdviceHistory(String channelId) async {
    isLoading = true;
    try {
      final result = await _repository.fetchAdvices(channelId);
      adviceList = ObservableList.of(result);
    } finally {
      isLoading = false;
    }
  }
}