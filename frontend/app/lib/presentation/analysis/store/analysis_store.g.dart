// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$AnalysisStore on _AnalysisStore, Store {
  late final _$analysesAtom =
      Atom(name: '_AnalysisStore.analyses', context: context);

  @override
  ObservableList<CoupleAnalysis> get analyses {
    _$analysesAtom.reportRead();
    return super.analyses;
  }

  @override
  set analyses(ObservableList<CoupleAnalysis> value) {
    _$analysesAtom.reportWrite(value, super.analyses, () {
      super.analyses = value;
    });
  }

  late final _$latestAnalysisAtom =
      Atom(name: '_AnalysisStore.latestAnalysis', context: context);

  @override
  CoupleAnalysis? get latestAnalysis {
    _$latestAnalysisAtom.reportRead();
    return super.latestAnalysis;
  }

  @override
  set latestAnalysis(CoupleAnalysis? value) {
    _$latestAnalysisAtom.reportWrite(value, super.latestAnalysis, () {
      super.latestAnalysis = value;
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

  late final _$isCreatingAtom =
      Atom(name: '_AnalysisStore.isCreating', context: context);

  @override
  bool get isCreating {
    _$isCreatingAtom.reportRead();
    return super.isCreating;
  }

  @override
  set isCreating(bool value) {
    _$isCreatingAtom.reportWrite(value, super.isCreating, () {
      super.isCreating = value;
    });
  }

  late final _$loadAnalysesAsyncAction =
      AsyncAction('_AnalysisStore.loadAnalyses', context: context);

  @override
  Future<void> loadAnalyses(String channelId) {
    return _$loadAnalysesAsyncAction.run(() => super.loadAnalyses(channelId));
  }

  late final _$createAnalysisAsyncAction =
      AsyncAction('_AnalysisStore.createAnalysis', context: context);

  @override
  Future<void> createAnalysis(String channelId) {
    return _$createAnalysisAsyncAction
        .run(() => super.createAnalysis(channelId));
  }

  @override
  String toString() {
    return '''
analyses: ${analyses},
latestAnalysis: ${latestAnalysis},
isLoading: ${isLoading},
isCreating: ${isCreating}
    ''';
  }
}
