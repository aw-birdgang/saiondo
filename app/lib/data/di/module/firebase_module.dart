import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:get_it/get_it.dart';

import '../../../di/service_locator.dart';
import '../../../domain/repositories/function/firebase_function_repository.dart';
import '../../../domain/usecases/firebase_function/firebase_call_function_usecase.dart';
import '../../datasources/firebase_function/firebase_function_remote_data_source.dart';
import '../../repositories/firebase_function/firebase_function_repository_impl.dart';

class FirebaseModule {
  static Future<void> configureFirebaseModuleInjection() async {

    // Auth:------------------------------------------------------------------
    if (!getIt.isRegistered<FirebaseAuth>()) {
      getIt.registerLazySingleton<FirebaseAuth>(
            () => FirebaseAuth.instance,
      );
    }


    // Firestore:------------------------------------------------------------------
    if (!getIt.isRegistered<FirebaseFirestore>()) {
      final firestoreInstance = FirebaseFirestore.instanceFor(
        app: Firebase.app(),
        databaseId: 'mcp-demo-database',
      );
      firestoreInstance.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
        host: 'asia-northeast3-firestore.googleapis.com',
        sslEnabled: true,
      );
      getIt.registerLazySingleton<FirebaseFirestore>(
            () => firestoreInstance,
      );
      try {
        final testRef = firestoreInstance.collection('_connection_test').doc('status');
        await testRef.set({
          'timestamp': FieldValue.serverTimestamp(),
          'status': 'connected'
        });
        print('Firestore 연결 테스트 성공');
      } catch (e) {
        print('Firestore 연결 테스트 실패: $e');
        print('에러 상세: ${e.toString()}');
        // 에러 발생 시 스택 트레이스도 출력
        print('Stack trace: ${StackTrace.current}');
      }
    }


    // Function:------------------------------------------------------------------
    if (!getIt.isRegistered<FirebaseFunctions>()) {
      final functionsInstance = FirebaseFunctions.instanceFor(
        app: Firebase.app(),
        region: 'asia-northeast3',
      );
      // if (kDebugMode) {
      //   functionsInstance.useFunctionsEmulator('localhost', 5001);
      // }
      getIt.registerLazySingleton<FirebaseFunctions>(
            () => functionsInstance,
      );
    }
    if (!getIt.isRegistered<FirebaseFunctionRemoteDataSource>()) {
      getIt.registerLazySingleton<FirebaseFunctionRemoteDataSource>(
            () => FirebaseFunctionRemoteDataSourceImpl(
          functions: getIt<FirebaseFunctions>(),
        ),
      );
    }
    if (!getIt.isRegistered<FirebaseFunctionRepository>()) {
      getIt.registerLazySingleton<FirebaseFunctionRepository>(
            () => FirebaseFunctionRepositoryImpl(
          remoteDataSource: getIt<FirebaseFunctionRemoteDataSource>(),
        ),
      );
    }
    if (!getIt.isRegistered<FirebaseCallFunctionUseCase>()) {
      getIt.registerLazySingleton(
            () => FirebaseCallFunctionUseCase(
          getIt<FirebaseFunctionRepository>(),
        ),
      );
    }


    // Storage:------------------------------------------------------------------
    if (!getIt.isRegistered<FirebaseStorage>()) {
      getIt.registerLazySingleton<FirebaseStorage>(
            () => FirebaseStorage.instance,
      );
    }
  }
  
}