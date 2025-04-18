import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// 현재 로그인된 유저
  static User? get currentUser => _auth.currentUser;

  /// 현재 유저의 UID
  static String? get currentUserId => currentUser?.uid;

  /// 이메일/비밀번호 회원가입
  static Future<void> register({
    required String name,
    required String email,
    required String password,
    required String mbti,
  }) async {
    // Firebase Auth 계정 생성
    final userCredential = await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    final uid = userCredential.user!.uid;

    // Firestore 유저 정보 저장
    await _firestore.collection('users').doc(uid).set({
      'uid': uid,
      'name': name,
      'email': email,
      'mbti': mbti,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  /// 로그인
  static Future<void> login({
    required String email,
    required String password,
  }) async {
    await _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  /// 로그아웃
  static Future<void> logout() async {
    await _auth.signOut();
  }

  /// 현재 로그인 상태 확인
  static bool get isLoggedIn => _auth.currentUser != null;

  /// 유저 정보 가져오기 (Firestore에서)
  static Future<Map<String, dynamic>?> getUserProfile() async {
    final uid = currentUserId;
    if (uid == null) return null;

    final doc = await _firestore.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  }
}