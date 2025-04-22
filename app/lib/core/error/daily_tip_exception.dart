class DailyTipException implements Exception {
  final String message;
  const DailyTipException(this.message);

  @override
  String toString() => message;
}