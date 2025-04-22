
import 'package:dartz/dartz.dart';

import '../../../core/error/exceptions.dart';
import '../../../core/error/failures.dart';
import '../../../domain/entities/firebase_function_response/function_response.dart';
import '../../../domain/repositories/function/firebase_function_repository.dart';
import '../../datasources/firebase_function/firebase_function_remote_data_source.dart';

class FirebaseFunctionRepositoryImpl implements FirebaseFunctionRepository {
  final FirebaseFunctionRemoteDataSource remoteDataSource;

  FirebaseFunctionRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, FirebaseFunctionResponse>> callFunction(
      String functionName,
      Map<String, dynamic> parameters,
      ) async {
    try {
      final response = await remoteDataSource.callFunction(functionName, parameters);
      return Right(response);
    } on FunctionException catch (e) {
      return Left(FunctionFailure(message: e.message, code: ''));
    } catch (e) {
      return const Left(FunctionFailure(message:'알 수 없는 오류가 발생 했습니다.', code: ''));
    }
  }
}