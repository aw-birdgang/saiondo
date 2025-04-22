import 'package:dartz/dartz.dart';

import '../../../core/error/failures.dart';
import '../../entities/firebase_function_response/function_response.dart';
import '../../repositories/function/firebase_function_repository.dart';

class FirebaseCallFunctionUseCase {
  final FirebaseFunctionRepository repository;

  FirebaseCallFunctionUseCase(this.repository);

  Future<Either<Failure, FirebaseFunctionResponse>> call(
      String functionName,
      Map<String, dynamic> parameters,
      ) async {
    return await repository.callFunction(functionName, parameters);
  }
}