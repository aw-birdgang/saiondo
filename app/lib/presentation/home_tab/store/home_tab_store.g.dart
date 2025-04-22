// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'home_tab_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$HomeTabStore on _HomeTabStore, Store {
  late final _$isLoadingAtom =
      Atom(name: '_HomeTabStore.isLoading', context: context);

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

  late final _$recentLogsAtom =
      Atom(name: '_HomeTabStore.recentLogs', context: context);

  @override
  ObservableList<EmotionLog> get recentLogs {
    _$recentLogsAtom.reportRead();
    return super.recentLogs;
  }

  @override
  set recentLogs(ObservableList<EmotionLog> value) {
    _$recentLogsAtom.reportWrite(value, super.recentLogs, () {
      super.recentLogs = value;
    });
  }

  late final _$coupleProfileDataAtom =
      Atom(name: '_HomeTabStore.coupleProfileData', context: context);

  @override
  Map<String, dynamic>? get coupleProfileData {
    _$coupleProfileDataAtom.reportRead();
    return super.coupleProfileData;
  }

  @override
  set coupleProfileData(Map<String, dynamic>? value) {
    _$coupleProfileDataAtom.reportWrite(value, super.coupleProfileData, () {
      super.coupleProfileData = value;
    });
  }

  late final _$currentDailyTipAtom =
      Atom(name: '_HomeTabStore.currentDailyTip', context: context);

  @override
  DailyTip? get currentDailyTip {
    _$currentDailyTipAtom.reportRead();
    return super.currentDailyTip;
  }

  @override
  set currentDailyTip(DailyTip? value) {
    _$currentDailyTipAtom.reportWrite(value, super.currentDailyTip, () {
      super.currentDailyTip = value;
    });
  }

  late final _$fetchRecentEmotionLogsAsyncAction =
      AsyncAction('_HomeTabStore.fetchRecentEmotionLogs', context: context);

  @override
  Future<void> fetchRecentEmotionLogs() {
    return _$fetchRecentEmotionLogsAsyncAction
        .run(() => super.fetchRecentEmotionLogs());
  }

  late final _$fetchCoupleProfileAsyncAction =
      AsyncAction('_HomeTabStore.fetchCoupleProfile', context: context);

  @override
  Future<void> fetchCoupleProfile() {
    return _$fetchCoupleProfileAsyncAction
        .run(() => super.fetchCoupleProfile());
  }

  late final _$fetchDailyTipAsyncAction =
      AsyncAction('_HomeTabStore.fetchDailyTip', context: context);

  @override
  Future<void> fetchDailyTip() {
    return _$fetchDailyTipAsyncAction.run(() => super.fetchDailyTip());
  }

  late final _$updateDailyTipsWithEmotionAsyncAction =
      AsyncAction('_HomeTabStore.updateDailyTipsWithEmotion', context: context);

  @override
  Future<void> updateDailyTipsWithEmotion() {
    return _$updateDailyTipsWithEmotionAsyncAction
        .run(() => super.updateDailyTipsWithEmotion());
  }

  late final _$initAsyncAction =
      AsyncAction('_HomeTabStore.init', context: context);

  @override
  Future<void> init() {
    return _$initAsyncAction.run(() => super.init());
  }

  late final _$refleshAsyncAction =
      AsyncAction('_HomeTabStore.reflesh', context: context);

  @override
  Future<void> reflesh() {
    return _$refleshAsyncAction.run(() => super.reflesh());
  }

  @override
  String toString() {
    return '''
isLoading: ${isLoading},
recentLogs: ${recentLogs},
coupleProfileData: ${coupleProfileData},
currentDailyTip: ${currentDailyTip}
    ''';
  }
}
