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

  late final _$roomsAtom = Atom(name: '_HomeStore.rooms', context: context);

  @override
  ObservableList<Room> get rooms {
    _$roomsAtom.reportRead();
    return super.rooms;
  }

  @override
  set rooms(ObservableList<Room> value) {
    _$roomsAtom.reportWrite(value, super.rooms, () {
      super.rooms = value;
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

  late final _$selectedRoomIdAtom =
      Atom(name: '_HomeStore.selectedRoomId', context: context);

  @override
  String? get selectedRoomId {
    _$selectedRoomIdAtom.reportRead();
    return super.selectedRoomId;
  }

  @override
  set selectedRoomId(String? value) {
    _$selectedRoomIdAtom.reportWrite(value, super.selectedRoomId, () {
      super.selectedRoomId = value;
    });
  }

  late final _$loadRoomsAsyncAction =
      AsyncAction('_HomeStore.loadRooms', context: context);

  @override
  Future<void> loadRooms(String userId) {
    return _$loadRoomsAsyncAction.run(() => super.loadRooms(userId));
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
  void selectRoom(String roomId) {
    final _$actionInfo =
        _$_HomeStoreActionController.startAction(name: '_HomeStore.selectRoom');
    try {
      return super.selectRoom(roomId);
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
rooms: ${rooms},
isLoading: ${isLoading},
selectedRoomId: ${selectedRoomId}
    ''';
  }
}
