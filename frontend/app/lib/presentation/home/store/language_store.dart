import 'package:mobx/mobx.dart';

import '../../../core/stores/error/error_store.dart';
import '../../../domain/entry/Language.dart';
import '../../../domain/repository/setting_repository.dart';

part 'language_store.g.dart';

class LanguageStore = _LanguageStore with _$LanguageStore;

abstract class _LanguageStore with Store {
  static const String TAG = "LanguageStore";

  // repository instance
  final SettingRepository _repository;

  // store for handling errors
  final ErrorStore errorStore;

  // supported languages
  List<Language> supportedLanguages = [
    Language(code: 'US', locale: 'en', language: 'English'),
    Language(code: 'KR', locale: 'ko', language: 'Korean'),
  ];

  // constructor:---------------------------------------------------------------
  _LanguageStore(this._repository, this.errorStore) {
    init();
  }

  // store variables:-----------------------------------------------------------
  @observable
  String _locale = "en";

  @computed
  String get locale => _locale;

  // actions:-------------------------------------------------------------------
  @action
  void changeLanguage(String value) {
    _locale = value;
    _repository.changeLanguage(value).then((_) {
      // write additional logic here
    });
  }

  @action
  String getCode() {
    var code;

    if (_locale == 'en') {
      code = "US";
    } else if (_locale == 'ko') {
      code = "KO";
    }

    return code;
  }

  @action
  String? getLanguage() {
    return supportedLanguages[supportedLanguages
        .indexWhere((language) => language.locale == _locale)]
        .language;
  }

  // general:-------------------------------------------------------------------
  void init() async {
    // getting current language from shared preference
    if (_repository.currentLanguage != null) {
      _locale = _repository.currentLanguage!;
    }
  }

  // dispose:-------------------------------------------------------------------
  @override
  dispose() {}
}
