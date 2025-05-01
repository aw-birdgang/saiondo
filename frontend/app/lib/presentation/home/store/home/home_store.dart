import 'package:app/core/stores/error/error_store.dart';
import 'package:flutter/widgets.dart';
import 'package:mobx/mobx.dart';

import '../../../ticket/ticket.dart';

part 'home_store.g.dart';

class HomeStore = _HomeStore with _$HomeStore;

abstract class _HomeStore with Store {
  final String TAG = "_HomeStore";
  final ErrorStore errorStore;

  _HomeStore(this.errorStore) {
    _setupDisposers();
  }

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
  String title = "Home";

  @observable
  Widget currentScreen = AuthorList();

  @action
  void setTitle(String newTitle) {
    title = newTitle;
  }

  @action
  void setCurrentScreen(Widget screen) {
    currentScreen = screen;
  }

  // dispose method
  void dispose() {
    for (final d in _disposers) {
      d();
    }
  }
}