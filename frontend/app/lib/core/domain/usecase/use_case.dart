import 'dart:async';
import 'package:either_dart/either.dart';
import '../error/failure.dart';

abstract class UseCase<T, P> {
  FutureOr<Either<Failure, T>> call({required P params});
}

class NoParams {
  const NoParams();
}
