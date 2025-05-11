import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import 'constants/preferences.dart';

class SharedPreferenceHelper {
  // shared pref instance
  final SharedPreferences _sharedPreference;

  // constructor
  SharedPreferenceHelper(this._sharedPreference);

  // General Methods: ----------------------------------------------------------
  Future<bool> saveAccessToken(String authToken) async {
    return _sharedPreference.setString(Preferences.auth_token, authToken);
  }

  Future<bool> removeAccessToken() async {
    return _sharedPreference.remove(Preferences.auth_token);
  }

  Future<String?> getAccessToken() async{
    return _sharedPreference.getString(Preferences.auth_token);
  }

  // Login:---------------------------------------------------------------------
  Future<bool> get isLoggedIn async {
    return _sharedPreference.getBool(Preferences.is_logged_in) ?? false;
  }

  Future<bool> saveIsLoggedIn(bool value) async {
    return _sharedPreference.setBool(Preferences.is_logged_in, value);
  }

  // Theme:------------------------------------------------------
  bool get isDarkMode {
    return _sharedPreference.getBool(Preferences.is_dark_mode) ?? false;
  }

  Future<void> changeBrightnessToDark(bool value) {
    return _sharedPreference.setBool(Preferences.is_dark_mode, value);
  }

  // Language:---------------------------------------------------
  String? get currentLanguage {
    return _sharedPreference.getString(Preferences.current_language);
  }

  Future<void> changeLanguage(String language) {
    return _sharedPreference.setString(Preferences.current_language, language);
  }

  // user:---------------------------------------------------
  Future<void> saveUserInfo(String userJson) async {
    await _sharedPreference.setString(Preferences.user_info, jsonEncode(userJson));
  }
  Future<String?> getUserInfo() async{
    return _sharedPreference.getString(Preferences.user_info);
  }
  Future<bool> removeUserInfo() async {
    return _sharedPreference.remove(Preferences.user_info);
  }

  Future<void> saveUserId(String userId) async {
    await _sharedPreference.setString(Preferences.user_id, userId);
  }
  Future<String?> getUserId() async {
    return _sharedPreference.getString(Preferences.user_id);
  }
  Future<bool> removeUserId() async {
    return _sharedPreference.remove(Preferences.user_id);
  }

}