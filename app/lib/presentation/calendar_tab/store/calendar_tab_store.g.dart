// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'calendar_tab_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$CalendarTabStore on _CalendarTabStore, Store {
  late final _$isLoadingAtom =
      Atom(name: '_CalendarTabStore.isLoading', context: context);

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

  late final _$currentMonthAtom =
      Atom(name: '_CalendarTabStore.currentMonth', context: context);

  @override
  DateTime get currentMonth {
    _$currentMonthAtom.reportRead();
    return super.currentMonth;
  }

  @override
  set currentMonth(DateTime value) {
    _$currentMonthAtom.reportWrite(value, super.currentMonth, () {
      super.currentMonth = value;
    });
  }

  late final _$selectedDateAtom =
      Atom(name: '_CalendarTabStore.selectedDate', context: context);

  @override
  DateTime? get selectedDate {
    _$selectedDateAtom.reportRead();
    return super.selectedDate;
  }

  @override
  set selectedDate(DateTime? value) {
    _$selectedDateAtom.reportWrite(value, super.selectedDate, () {
      super.selectedDate = value;
    });
  }

  late final _$emotionLogsAtom =
      Atom(name: '_CalendarTabStore.emotionLogs', context: context);

  @override
  ObservableMap<String, EmotionLog> get emotionLogs {
    _$emotionLogsAtom.reportRead();
    return super.emotionLogs;
  }

  @override
  set emotionLogs(ObservableMap<String, EmotionLog> value) {
    _$emotionLogsAtom.reportWrite(value, super.emotionLogs, () {
      super.emotionLogs = value;
    });
  }

  late final _$fetchEmotionLogsAsyncAction =
      AsyncAction('_CalendarTabStore.fetchEmotionLogs', context: context);

  @override
  Future<void> fetchEmotionLogs() {
    return _$fetchEmotionLogsAsyncAction.run(() => super.fetchEmotionLogs());
  }

  late final _$saveEmotionLogAsyncAction =
      AsyncAction('_CalendarTabStore.saveEmotionLog', context: context);

  @override
  Future<bool> saveEmotionLog(
      {required String date,
      required String emoji,
      required int temperature,
      List<String>? tags,
      String? note,
      List<String>? events,
      String? docId}) {
    return _$saveEmotionLogAsyncAction.run(() => super.saveEmotionLog(
        date: date,
        emoji: emoji,
        temperature: temperature,
        tags: tags,
        note: note,
        events: events,
        docId: docId));
  }

  late final _$initAsyncAction =
      AsyncAction('_CalendarTabStore.init', context: context);

  @override
  Future<void> init() {
    return _$initAsyncAction.run(() => super.init());
  }

  late final _$refresAsyncAction =
      AsyncAction('_CalendarTabStore.refres', context: context);

  @override
  Future<void> refres() {
    return _$refresAsyncAction.run(() => super.refres());
  }

  late final _$_CalendarTabStoreActionController =
      ActionController(name: '_CalendarTabStore', context: context);

  @override
  void selectDate(DateTime date) {
    final _$actionInfo = _$_CalendarTabStoreActionController.startAction(
        name: '_CalendarTabStore.selectDate');
    try {
      return super.selectDate(date);
    } finally {
      _$_CalendarTabStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void changeMonth(int delta) {
    final _$actionInfo = _$_CalendarTabStoreActionController.startAction(
        name: '_CalendarTabStore.changeMonth');
    try {
      return super.changeMonth(delta);
    } finally {
      _$_CalendarTabStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
isLoading: ${isLoading},
currentMonth: ${currentMonth},
selectedDate: ${selectedDate},
emotionLogs: ${emotionLogs}
    ''';
  }
}
