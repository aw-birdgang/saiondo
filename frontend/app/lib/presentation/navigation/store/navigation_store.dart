import 'package:app/domain/usecase/navigation/navigation_screen_usecase.dart';
import 'package:flutter/material.dart';
import 'package:mobx/mobx.dart';

import '../../ticket/ticket.dart';

part 'navigation_store.g.dart';

class NavigationStore = _NavigationStore with _$NavigationStore;

abstract class _NavigationStore with Store {

  _NavigationStore(
    this.navigationScreenUseCase,
    ) {
    currentScreen = navigationScreenUseCase.call(0);
  }

  final NavigationScreenUseCase navigationScreenUseCase;

  // 선택된 탭 인덱스 상태
  @observable
  int selectedIndex = 0;

  @observable
  Widget currentScreen = AuthorList();

  @action
  void updateIndex(int index) {
    selectedIndex = index;
    currentScreen = navigationScreenUseCase.call(index);
  }
}