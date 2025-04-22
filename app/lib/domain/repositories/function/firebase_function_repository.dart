import 'package:dartz/dartz.dart';

import '../../../core/error/failures.dart';
import '../../entities/firebase_function_response/function_response.dart';

abstract class FirebaseFunctionRepository {
  Future<Either<Failure, FirebaseFunctionResponse>> callFunction(
      String functionName,
      Map<String, dynamic> parameters,
      );
}