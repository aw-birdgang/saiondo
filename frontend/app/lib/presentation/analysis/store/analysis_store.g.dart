// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$AnalysisStore on _AnalysisStore, Store {
  late final _$analysisAtom =
      Atom(name: '_AnalysisStore.analysis', context: context);

  @override
  AnalysisResponse? get analysis {
    _$analysisAtom.reportRead();
    return super.analysis;
  }

  @override
  set analysis(AnalysisResponse? value) {
    _$analysisAtom.reportWrite(value, super.analysis, () {
      super.analysis = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_AnalysisStore.isLoading', context: context);

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

  late final _$loadAnalysisAsyncAction =
      AsyncAction('_AnalysisStore.loadAnalysis', context: context);

  @override
  Future<void> loadAnalysis(String channelId) {
    return _$loadAnalysisAsyncAction.run(() => super.loadAnalysis(channelId));
  }

  @override
  String toString() {
    return '''
analysis: ${analysis},
isLoading: ${isLoading}
    ''';
  }
}
