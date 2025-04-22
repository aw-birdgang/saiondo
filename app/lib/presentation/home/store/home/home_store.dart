import 'package:app/core/stores/error/error_store.dart';
import 'package:flutter/material.dart';
import 'package:mobx/mobx.dart';

part 'home_store.g.dart';

class HomeStore = _HomeStore with _$HomeStore;

abstract class _HomeStore with Store {
  final String TAG = "_HomeStore";

  _HomeStore(
    this.errorStore,
  ) {
    _setupDisposers();
  }

  final ErrorStore errorStore;

  // disposers:-----------------------------------------------------------------
  late List<ReactionDisposer> _disposers;

  void _setupDisposers() {
    _disposers = [
      reaction((_) => success, (_) => success = false, delay: 200),
    ];
  }

  @observable
  bool success = false;

  @observable
  int currentIndex = 0;

  @observable
  String title = "홈";

  final List<String> tabTitles = ["홈", "캘린더", "챌린지", "설정"];

  @action
  void setCurrentIndex(int index) {
    currentIndex = index;
    title = tabTitles[index];
  }

  // dispose:-----------------------------------------------------------------
  void dispose() {
    for (final d in _disposers) {
      d();
    }
  }
}
