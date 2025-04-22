abstract class Failure {
  final String message;

  const Failure(this.message);
}

class UserFailure extends Failure {
  const UserFailure(String message) : super(message);
}