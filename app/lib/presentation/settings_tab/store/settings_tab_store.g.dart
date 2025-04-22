// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'settings_tab_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$SettingsTabStore on _SettingsTabStore, Store {
  late final _$darkModeAtom =
      Atom(name: '_SettingsTabStore.darkMode', context: context);

  @override
  bool get darkMode {
    _$darkModeAtom.reportRead();
    return super.darkMode;
  }

  @override
  set darkMode(bool value) {
    _$darkModeAtom.reportWrite(value, super.darkMode, () {
      super.darkMode = value;
    });
  }

  late final _$notificationsAtom =
      Atom(name: '_SettingsTabStore.notifications', context: context);

  @override
  bool get notifications {
    _$notificationsAtom.reportRead();
    return super.notifications;
  }

  @override
  set notifications(bool value) {
    _$notificationsAtom.reportWrite(value, super.notifications, () {
      super.notifications = value;
    });
  }

  late final _$relationshipStatusAtom =
      Atom(name: '_SettingsTabStore.relationshipStatus', context: context);

  @override
  String get relationshipStatus {
    _$relationshipStatusAtom.reportRead();
    return super.relationshipStatus;
  }

  @override
  set relationshipStatus(String value) {
    _$relationshipStatusAtom.reportWrite(value, super.relationshipStatus, () {
      super.relationshipStatus = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_SettingsTabStore.isLoading', context: context);

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

  late final _$logoutAsyncAction =
      AsyncAction('_SettingsTabStore.logout', context: context);

  @override
  Future<bool> logout() {
    return _$logoutAsyncAction.run(() => super.logout());
  }

  late final _$initAsyncAction =
      AsyncAction('_SettingsTabStore.init', context: context);

  @override
  Future<void> init() {
    return _$initAsyncAction.run(() => super.init());
  }

  late final _$_SettingsTabStoreActionController =
      ActionController(name: '_SettingsTabStore', context: context);

  @override
  void toggleDarkMode() {
    final _$actionInfo = _$_SettingsTabStoreActionController.startAction(
        name: '_SettingsTabStore.toggleDarkMode');
    try {
      return super.toggleDarkMode();
    } finally {
      _$_SettingsTabStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void toggleNotifications() {
    final _$actionInfo = _$_SettingsTabStoreActionController.startAction(
        name: '_SettingsTabStore.toggleNotifications');
    try {
      return super.toggleNotifications();
    } finally {
      _$_SettingsTabStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setRelationshipStatus(String status) {
    final _$actionInfo = _$_SettingsTabStoreActionController.startAction(
        name: '_SettingsTabStore.setRelationshipStatus');
    try {
      return super.setRelationshipStatus(status);
    } finally {
      _$_SettingsTabStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
darkMode: ${darkMode},
notifications: ${notifications},
relationshipStatus: ${relationshipStatus},
isLoading: ${isLoading}
    ''';
  }
}
