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

  late final _$sliderDrawerKeyAtom =
      Atom(name: '_HomeStore.sliderDrawerKey', context: context);

  @override
  GlobalKey<SliderDrawerState> get sliderDrawerKey {
    _$sliderDrawerKeyAtom.reportRead();
    return super.sliderDrawerKey;
  }

  @override
  set sliderDrawerKey(GlobalKey<SliderDrawerState> value) {
    _$sliderDrawerKeyAtom.reportWrite(value, super.sliderDrawerKey, () {
      super.sliderDrawerKey = value;
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
  void onMenuItemClick(String newTitle) {
    final _$actionInfo = _$_HomeStoreActionController.startAction(
        name: '_HomeStore.onMenuItemClick');
    try {
      return super.onMenuItemClick(newTitle);
    } finally {
      _$_HomeStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
success: ${success},
sliderDrawerKey: ${sliderDrawerKey},
title: ${title}
    ''';
  }
}
