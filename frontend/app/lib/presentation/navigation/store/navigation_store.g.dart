// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'navigation_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$NavigationStore on _NavigationStore, Store {
  late final _$selectedIndexAtom =
      Atom(name: '_NavigationStore.selectedIndex', context: context);

  @override
  int get selectedIndex {
    _$selectedIndexAtom.reportRead();
    return super.selectedIndex;
  }

  @override
  set selectedIndex(int value) {
    _$selectedIndexAtom.reportWrite(value, super.selectedIndex, () {
      super.selectedIndex = value;
    });
  }

  late final _$currentScreenAtom =
      Atom(name: '_NavigationStore.currentScreen', context: context);

  @override
  Widget get currentScreen {
    _$currentScreenAtom.reportRead();
    return super.currentScreen;
  }

  @override
  set currentScreen(Widget value) {
    _$currentScreenAtom.reportWrite(value, super.currentScreen, () {
      super.currentScreen = value;
    });
  }

  late final _$_NavigationStoreActionController =
      ActionController(name: '_NavigationStore', context: context);

  @override
  void updateIndex(int index) {
    final _$actionInfo = _$_NavigationStoreActionController.startAction(
        name: '_NavigationStore.updateIndex');
    try {
      return super.updateIndex(index);
    } finally {
      _$_NavigationStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
selectedIndex: ${selectedIndex},
currentScreen: ${currentScreen}
    ''';
  }
}
