abstract class Failure {
  final String message;
  final String? code;

  const Failure({required this.message, this.code});
}

class FaqFailure extends Failure {
  const FaqFailure({required String message, String? code})
      : super(message: message, code: code);
}

class ChatFailure extends Failure {
  const ChatFailure({required String message, String? code})
      : super(message: message, code: code);
}