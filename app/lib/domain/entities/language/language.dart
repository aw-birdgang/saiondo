class Language {
  final String code;
  final String locale;
  final String language;

  Language({
    required this.code,
    required this.locale,
    required this.language,
  });

  factory Language.fromJson(Map<String, dynamic> json) {
    return Language(
      code: json['code'] as String,
      locale: json['locale'] as String,
      language: json['language'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'locale': locale,
      'language': language,
    };
  }
}