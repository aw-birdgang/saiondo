import 'package:mobx/mobx.dart';

import '../../../core/stores/error/error_store.dart';

part 'callenge_store.g.dart';

class CallengeStore = _CallengeStore with _$CallengeStore;

abstract class _CallengeStore with Store {
  final String TAG = "_CalendarStore";

  _CallengeStore(this.errorStore,) {
  }
  final ErrorStore errorStore;

  // disposers:-----------------------------------------------------------------
  late List<ReactionDisposer> _disposers;


}