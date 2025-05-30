// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'point_history_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$PointHistoryStore on _PointHistoryStore, Store {
  late final _$historiesAtom =
      Atom(name: '_PointHistoryStore.histories', context: context);

  @override
  ObservableList<PointHistory> get histories {
    _$historiesAtom.reportRead();
    return super.histories;
  }

  @override
  set histories(ObservableList<PointHistory> value) {
    _$historiesAtom.reportWrite(value, super.histories, () {
      super.histories = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_PointHistoryStore.isLoading', context: context);

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

  late final _$loadPointHistoryAsyncAction =
      AsyncAction('_PointHistoryStore.loadPointHistory', context: context);

  @override
  Future<void> loadPointHistory(String userId) {
    return _$loadPointHistoryAsyncAction
        .run(() => super.loadPointHistory(userId));
  }

  @override
  String toString() {
    return '''
histories: ${histories},
isLoading: ${isLoading}
    ''';
  }
}
