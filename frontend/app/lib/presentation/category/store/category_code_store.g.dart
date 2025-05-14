// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_code_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$CategoryCodeStore on _CategoryCodeStore, Store {
  late final _$codesAtom =
      Atom(name: '_CategoryCodeStore.codes', context: context);

  @override
  ObservableList<CategoryCode> get codes {
    _$codesAtom.reportRead();
    return super.codes;
  }

  @override
  set codes(ObservableList<CategoryCode> value) {
    _$codesAtom.reportWrite(value, super.codes, () {
      super.codes = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_CategoryCodeStore.isLoading', context: context);

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

  late final _$errorAtom =
      Atom(name: '_CategoryCodeStore.error', context: context);

  @override
  String? get error {
    _$errorAtom.reportRead();
    return super.error;
  }

  @override
  set error(String? value) {
    _$errorAtom.reportWrite(value, super.error, () {
      super.error = value;
    });
  }

  late final _$loadCodesAsyncAction =
      AsyncAction('_CategoryCodeStore.loadCodes', context: context);

  @override
  Future<void> loadCodes() {
    return _$loadCodesAsyncAction.run(() => super.loadCodes());
  }

  @override
  String toString() {
    return '''
codes: ${codes},
isLoading: ${isLoading},
error: ${error}
    ''';
  }
}
