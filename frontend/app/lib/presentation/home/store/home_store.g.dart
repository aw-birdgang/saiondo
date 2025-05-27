// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'home_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$HomeStore on _HomeStore, Store {
  late final _$successAtom = Atom(name: '_HomeStore.success', context: context);

  @override
  bool get success {
    _$successAtom.reportRead();
    return super.success;
  }

  @override
  set success(bool value) {
    _$successAtom.reportWrite(value, super.success, () {
      super.success = value;
    });
  }

  late final _$titleAtom = Atom(name: '_HomeStore.title', context: context);

  @override
  String get title {
    _$titleAtom.reportRead();
    return super.title;
  }

  @override
  set title(String value) {
    _$titleAtom.reportWrite(value, super.title, () {
      super.title = value;
    });
  }

  late final _$currentScreenAtom =
      Atom(name: '_HomeStore.currentScreen', context: context);

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

  late final _$assistantsAtom =
      Atom(name: '_HomeStore.assistants', context: context);

  @override
  ObservableList<Assistant> get assistants {
    _$assistantsAtom.reportRead();
    return super.assistants;
  }

  @override
  set assistants(ObservableList<Assistant> value) {
    _$assistantsAtom.reportWrite(value, super.assistants, () {
      super.assistants = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_HomeStore.isLoading', context: context);

  @override
  bool get isLoading {
    _$isLoadingAtom.reportRead();
    return super.isLoading;
  }

  @override
  set isLoading(bool value) {
    _$isLoadingAtom.reportWrite(value, super.isLoading, () {
      super.isLoading = value;
    });
  }

  late final _$selectedAssistantIdAtom =
      Atom(name: '_HomeStore.selectedAssistantId', context: context);

  @override
  String? get selectedAssistantId {
    _$selectedAssistantIdAtom.reportRead();
    return super.selectedAssistantId;
  }

  @override
  set selectedAssistantId(String? value) {
    _$selectedAssistantIdAtom.reportWrite(value, super.selectedAssistantId, () {
      super.selectedAssistantId = value;
    });
  }

  late final _$loadAssistantsAsyncAction =
      AsyncAction('_HomeStore.loadAssistants', context: context);

  @override
  Future<void> loadAssistants(String userId) {
    return _$loadAssistantsAsyncAction.run(() => super.loadAssistants(userId));
  }

  late final _$_HomeStoreActionController =
      ActionController(name: '_HomeStore', context: context);

  @override
  void setTitle(String newTitle) {
    final _$actionInfo =
        _$_HomeStoreActionController.startAction(name: '_HomeStore.setTitle');
    try {
      return super.setTitle(newTitle);
    } finally {
      _$_HomeStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setCurrentScreen(Widget screen) {
    final _$actionInfo = _$_HomeStoreActionController.startAction(
        name: '_HomeStore.setCurrentScreen');
    try {
      return super.setCurrentScreen(screen);
    } finally {
      _$_HomeStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void selectAssistant(String assistantId) {
    final _$actionInfo = _$_HomeStoreActionController.startAction(
        name: '_HomeStore.selectAssistant');
    try {
      return super.selectAssistant(assistantId);
    } finally {
      _$_HomeStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
success: ${success},
title: ${title},
currentScreen: ${currentScreen},
assistants: ${assistants},
isLoading: ${isLoading},
selectedAssistantId: ${selectedAssistantId}
    ''';
  }
}
