// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'advice_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$AdviceStore on _AdviceStore, Store {
  Computed<Advice?>? _$latestAdviceComputed;

  @override
  Advice? get latestAdvice =>
      (_$latestAdviceComputed ??= Computed<Advice?>(() => super.latestAdvice,
              name: '_AdviceStore.latestAdvice'))
          .value;

  late final _$adviceListAtom =
      Atom(name: '_AdviceStore.adviceList', context: context);

  @override
  ObservableList<Advice> get adviceList {
    _$adviceListAtom.reportRead();
    return super.adviceList;
  }

  @override
  set adviceList(ObservableList<Advice> value) {
    _$adviceListAtom.reportWrite(value, super.adviceList, () {
      super.adviceList = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_AdviceStore.isLoading', context: context);

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

  late final _$loadAdviceHistoryAsyncAction =
      AsyncAction('_AdviceStore.loadAdviceHistory', context: context);

  @override
  Future<void> loadAdviceHistory(String channelId) {
    return _$loadAdviceHistoryAsyncAction
        .run(() => super.loadAdviceHistory(channelId));
  }

  @override
  String toString() {
    return '''
adviceList: ${adviceList},
isLoading: ${isLoading},
latestAdvice: ${latestAdvice}
    ''';
  }
}
