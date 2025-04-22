import 'package:cloud_functions/cloud_functions.dart';

import '../../../core/error/exceptions.dart';

abstract class FirebaseFunctionRemoteDataSource {
  Future<dynamic> callFunction(
      String functionName,
      Map<String, dynamic> parameters,
      );
}

class FirebaseFunctionRemoteDataSourceImpl implements FirebaseFunctionRemoteDataSource {
  final FirebaseFunctions functions;

  FirebaseFunctionRemoteDataSourceImpl({required this.functions});

  @override
  Future<dynamic> callFunction(String functionName, Map<String, dynamic> parameters) async {
    try {
      // null 값 필터링
      final cleanData = Map<String, dynamic>.from(parameters)
        ..removeWhere((key, value) => value == null);

      final result = await functions
          .httpsCallable(
        functionName,
        options: HttpsCallableOptions(
          timeout: const Duration(seconds: 30),
        ),
      ).call(cleanData);
      return result.data;
      //     return FirebaseFunctionResponse(
      //       data: result.data,
      //       success: true,
      //       message: 'Success',
      //     );
    } on FirebaseFunctionsException catch (e) {
      throw FunctionException(e.message ?? '함수 호출 중 오류가 발생 했습니다.');
    } catch (e) {
      throw FunctionException('알 수 없는 오류가 발생 했습니다.');
    }
  }
}