class FunctionException implements Exception {
  final String message;
  FunctionException(this.message);
  @override
  String toString() => message;
}