import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppLocalizations {
  final Locale? locale;
  final Map<String, String>? _localizedStrings;

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  // constructor
  AppLocalizations(this.locale, this._localizedStrings);

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  Future<bool> load() async {
    String jsonString =
        await rootBundle.loadString('assets/lang/${locale?.languageCode}.json');
    Map<String, dynamic> jsonMap = json.decode(jsonString);

    _localizedStrings?.clear();
    _localizedStrings?.addAll(jsonMap.map((key, value) {
      return MapEntry(
          key, value.toString().replaceAll(r"\'", "'").replaceAll(r"\t", " "));
    }));

    return true;
  }

  String translate(String key) {
    try {
      final value = _localizedStrings != null ? _localizedStrings![key] : null;
      if (value == null) {
        debugPrint(
            '[AppLocalizations] MISSING key: "$key" (locale: ${locale?.languageCode ?? "unknown"})\n'
            'Stack: ${StackTrace.current}');
        return '[$key]';
      }
      return value;
    } catch (e, stack) {
      debugPrint(
          '[AppLocalizations] EXCEPTION for key: "$key" (locale: ${locale?.languageCode ?? "unknown"})\n'
          'Error: $e\nStack: $stack');
      return '[$key]';
    }
  }
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  final String TAG = "AppLocalizations";

  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'ko'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    AppLocalizations localizations = new AppLocalizations(locale, {});
    await localizations.load();
    return localizations;
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
