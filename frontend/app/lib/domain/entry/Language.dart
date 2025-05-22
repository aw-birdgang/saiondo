class Language {
  String code;
  String locale;
  String language;

  Map<String, String>? dictionary;

  Language({
    required this.code,
    required this.locale,
    required this.language,
    this.dictionary,
  });
}