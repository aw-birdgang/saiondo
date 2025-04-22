import 'package:app/data/sharedpref/shared_preference_helper.dart';
import 'package:app/domain/core/failures.dart';
import 'package:app/domain/entities/user/user.dart';
import 'package:app/domain/repositories/user/user_repository.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dartz/dartz.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import 'package:firebase_storage/firebase_storage.dart';

import '../../../domain/usecases/user/login_usecase.dart';

class UserRepositoryImpl implements UserRepository {
  final firebase_auth.FirebaseAuth _auth;
  final FirebaseFirestore _firestore;
  final FirebaseStorage _storage;
  final SharedPreferenceHelper _sharedPreferenceHelper;

  static const String _userCollection = 'users';

  UserRepositoryImpl(
      this._firestore,
      this._auth,
      this._storage,
      this._sharedPreferenceHelper
      );

  // UserRepositoryImpl({
  //   required firebase_auth.FirebaseAuth auth,
  //   required FirebaseFirestore firestore,
  //   required FirebaseStorage storage,
  //   required SharedPreferenceHelper sharedPreferenceHelper,
  // }) : _auth = auth,
  //       _firestore = firestore,
  //       _storage = storage,
  //       _sharedPreferenceHelper = sharedPreferenceHelper;

  Future<User?> _mapFirebaseUser(firebase_auth.User firebaseUser) async {
    final userDoc = await _firestore.collection(_userCollection).doc(firebaseUser.uid).get();

    return User(
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? '',
      photoUrl: firebaseUser.photoURL,
    );
  }

  @override
  Future<bool> isLoggedIn() async {
    return await _sharedPreferenceHelper.isLoggedIn;
  }

  @override
  Future<void> saveLoginStatus(bool status) {
    return _sharedPreferenceHelper.saveIsLoggedIn(status);
  }

  @override
  Future<User?> login(LoginParams params) async {
    try {
      final userCredential = await _auth.signInWithEmailAndPassword(
        email: params.username,
        password: params.password,
      );

      if (userCredential.user == null) return null;

      // Firestore 업데이트
      await _firestore.collection(_userCollection).doc(userCredential.user!.uid).update({
        'lastLoginAt': FieldValue.serverTimestamp(),
      });

      return User(
        id: userCredential.user!.uid,
        email: userCredential.user!.email!,
        displayName: userCredential.user!.displayName,
        photoUrl: userCredential.user!.photoURL,
        lastLoginAt: DateTime.now(),
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<User?> signup(String email, String password, String name) async {
    try {
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (userCredential.user == null) return null;

      await userCredential.user!.updateDisplayName(name);

      await _firestore.collection(_userCollection).doc(userCredential.user!.uid).set({
        'email': email,
        'displayName': name,
        'createdAt': FieldValue.serverTimestamp(),
        'lastLoginAt': FieldValue.serverTimestamp(),
      });

      return User(
        id: userCredential.user!.uid,
        email: email,
        displayName: name,
        createdAt: DateTime.now(),
        lastLoginAt: DateTime.now(),
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> logout() async {
    await _auth.signOut();
    await saveLoginStatus(false);
  }

  @override
  Future<Either<Failure, User>> getCurrentUser() async {
    try {
      final currentUser = _auth.currentUser;
      if (currentUser == null) {
        return Left(UserFailure('사용자가 로그인되어 있지 않습니다.'));
      }

      final userDoc = await _firestore
          .collection('users')
          .doc(currentUser.uid)
          .get();

      if (!userDoc.exists) {
        return Left(UserFailure('사용자 정보를 찾을 수 없습니다.'));
      }

      return Right(User.fromJson(userDoc.data()!));
    } catch (e) {
      return Left(UserFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> updateProfile(User user) async {
    try {
      final currentUser = _auth.currentUser;
      if (currentUser == null) {
        return Left(UserFailure('사용자가 로그인되어 있지 않습니다.'));
      }

      await _firestore
          .collection('users')
          .doc(currentUser.uid)
          .update(user.toJson());

      return const Right(null);
    } catch (e) {
      return Left(UserFailure(e.toString()));
    }
  }


  @override
  Future<void> resetPassword(String email) async {
    await _auth.sendPasswordResetEmail(email: email);
  }

  @override
  Future<void> signOut() async {
    await _auth.signOut();
  }
}