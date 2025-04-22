// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'emotion_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$EmotionStore on _EmotionStore, Store {
  Computed<bool>? _$isSubmitDisabledComputed;

  @override
  bool get isSubmitDisabled => (_$isSubmitDisabledComputed ??= Computed<bool>(
          () => super.isSubmitDisabled,
          name: '_EmotionStore.isSubmitDisabled'))
      .value;

  late final _$aiAdviceAtom =
      Atom(name: '_EmotionStore.aiAdvice', context: context);

  @override
  String? get aiAdvice {
    _$aiAdviceAtom.reportRead();
    return super.aiAdvice;
  }

  @override
  set aiAdvice(String? value) {
    _$aiAdviceAtom.reportWrite(value, super.aiAdvice, () {
      super.aiAdvice = value;
    });
  }

  late final _$isLoadingAdviceAtom =
      Atom(name: '_EmotionStore.isLoadingAdvice', context: context);

  @override
  bool get isLoadingAdvice {
    _$isLoadingAdviceAtom.reportRead();
    return super.isLoadingAdvice;
  }

  @override
  set isLoadingAdvice(bool value) {
    _$isLoadingAdviceAtom.reportWrite(value, super.isLoadingAdvice, () {
      super.isLoadingAdvice = value;
    });
  }

  late final _$selectedEmojiAtom =
      Atom(name: '_EmotionStore.selectedEmoji', context: context);

  @override
  String? get selectedEmoji {
    _$selectedEmojiAtom.reportRead();
    return super.selectedEmoji;
  }

  @override
  set selectedEmoji(String? value) {
    _$selectedEmojiAtom.reportWrite(value, super.selectedEmoji, () {
      super.selectedEmoji = value;
    });
  }

  late final _$selectedTagsAtom =
      Atom(name: '_EmotionStore.selectedTags', context: context);

  @override
  ObservableList<String> get selectedTags {
    _$selectedTagsAtom.reportRead();
    return super.selectedTags;
  }

  @override
  set selectedTags(ObservableList<String> value) {
    _$selectedTagsAtom.reportWrite(value, super.selectedTags, () {
      super.selectedTags = value;
    });
  }

  late final _$emotionTextAtom =
      Atom(name: '_EmotionStore.emotionText', context: context);

  @override
  String get emotionText {
    _$emotionTextAtom.reportRead();
    return super.emotionText;
  }

  @override
  set emotionText(String value) {
    _$emotionTextAtom.reportWrite(value, super.emotionText, () {
      super.emotionText = value;
    });
  }

  late final _$temperatureAtom =
      Atom(name: '_EmotionStore.temperature', context: context);

  @override
  double get temperature {
    _$temperatureAtom.reportRead();
    return super.temperature;
  }

  @override
  set temperature(double value) {
    _$temperatureAtom.reportWrite(value, super.temperature, () {
      super.temperature = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_EmotionStore.isLoading', context: context);

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

  late final _$errorAtom = Atom(name: '_EmotionStore.error', context: context);

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

  late final _$saveEmotionAsyncAction =
      AsyncAction('_EmotionStore.saveEmotion', context: context);

  @override
  Future<bool> saveEmotion() {
    return _$saveEmotionAsyncAction.run(() => super.saveEmotion());
  }

  late final _$getEmotionAdviceAsyncAction =
      AsyncAction('_EmotionStore.getEmotionAdvice', context: context);

  @override
  Future<void> getEmotionAdvice(String partnerId) {
    return _$getEmotionAdviceAsyncAction
        .run(() => super.getEmotionAdvice(partnerId));
  }

  late final _$_EmotionStoreActionController =
      ActionController(name: '_EmotionStore', context: context);

  @override
  void setSelectedEmoji(String emoji) {
    final _$actionInfo = _$_EmotionStoreActionController.startAction(
        name: '_EmotionStore.setSelectedEmoji');
    try {
      return super.setSelectedEmoji(emoji);
    } finally {
      _$_EmotionStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void toggleTag(String tag) {
    final _$actionInfo = _$_EmotionStoreActionController.startAction(
        name: '_EmotionStore.toggleTag');
    try {
      return super.toggleTag(tag);
    } finally {
      _$_EmotionStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setTemperature(double value) {
    final _$actionInfo = _$_EmotionStoreActionController.startAction(
        name: '_EmotionStore.setTemperature');
    try {
      return super.setTemperature(value);
    } finally {
      _$_EmotionStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setEmotionText(String value) {
    final _$actionInfo = _$_EmotionStoreActionController.startAction(
        name: '_EmotionStore.setEmotionText');
    try {
      return super.setEmotionText(value);
    } finally {
      _$_EmotionStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void reset() {
    final _$actionInfo = _$_EmotionStoreActionController.startAction(
        name: '_EmotionStore.reset');
    try {
      return super.reset();
    } finally {
      _$_EmotionStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void clearAdvice() {
    final _$actionInfo = _$_EmotionStoreActionController.startAction(
        name: '_EmotionStore.clearAdvice');
    try {
      return super.clearAdvice();
    } finally {
      _$_EmotionStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
aiAdvice: ${aiAdvice},
isLoadingAdvice: ${isLoadingAdvice},
selectedEmoji: ${selectedEmoji},
selectedTags: ${selectedTags},
emotionText: ${emotionText},
temperature: ${temperature},
isLoading: ${isLoading},
error: ${error},
isSubmitDisabled: ${isSubmitDisabled}
    ''';
  }
}
