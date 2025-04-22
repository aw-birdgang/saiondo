import 'package:app/data/sharedpref/shared_preference_helper.dart';
import 'package:app/domain/repositories/setting/setting_repository.dart';

class SettingRepositoryImpl implements SettingRepository {
  // shared pref object
  final SharedPreferenceHelper _sharedPrefsHelper;

  // constructor
  SettingRepositoryImpl(this._sharedPrefsHelper);

  // Theme: --------------------------------------------------------------------
  @override
  Future<void> changeBrightnessToDark(bool value) =>
      _sharedPrefsHelper.changeBrightnessToDark(value);

  @override
  bool get isDarkMode => _sharedPrefsHelper.isDarkMode;

  // Language: -----------------------------------------------------------------
  @override
  Future<void> changeLanguage(String value) =>
      _sharedPrefsHelper.changeLanguage(value);

  @override
  String? get currentLanguage => _sharedPrefsHelper.currentLanguage;
}
