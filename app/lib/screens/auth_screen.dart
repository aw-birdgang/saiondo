import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hive/hive.dart';

import '../models/user_profile.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final loginEmailCtrl = TextEditingController();
  final loginPasswordCtrl = TextEditingController();

  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final passwordCtrl = TextEditingController();

  bool isLoading = false;
  late Box<UserProfile> userBox;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    userBox = Hive.box<UserProfile>('userProfile');
  }

  void handleLogin() async {
    final email = loginEmailCtrl.text.trim();
    final password = loginPasswordCtrl.text.trim();

    if (email.isEmpty || password.isEmpty) {
      _showMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setState(() => isLoading = true);

    try {
      // ✅ 클라이언트에서 직접 FirebaseAuth 로그인
      final userCredential = await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = userCredential.user;

      if (user == null) {
        throw Exception("사용자를 찾을 수 없습니다.");
      }

      _showMessage("🎉 ${user.email}님 환영합니다!");
      Navigator.pushReplacementNamed(context, "/home");
    } on FirebaseAuthException catch (e) {
      _showMessage("❌ ${e.message}");
    } catch (e) {
      _showMessage("❌ 로그인 중 오류 발생");
      debugPrint("Login error: $e");
    } finally {
      setState(() => isLoading = false);
    }
  }

  void handleRegister() async {
    final name = nameCtrl.text.trim();
    final email = emailCtrl.text.trim();
    final password = passwordCtrl.text.trim();
    final mbti = "ENFP"; // UI 입력 필드 추가 가능

    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      _showMessage("모든 항목을 입력해주세요.");
      return;
    }

    setState(() => isLoading = true);

    try {
      // ✅ Cloud Function으로 Firebase Auth 계정 생성 + Firestore 저장
      final callable = FirebaseFunctions.instanceFor(region: 'asia-northeast3').httpsCallable('register');
      final response = await callable.call({
        "name": name,
        "email": email,
        "password": password,
        "mbti": mbti,
      });

      // ✅ 클라이언트에서 다시 로그인
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      _showMessage("🎉 회원가입 완료! 환영합니다.");
      Navigator.pushReplacementNamed(context, "/onboarding");
    } on FirebaseFunctionsException catch (e) {
      _showMessage("❌ ${e.message}");
    } on FirebaseAuthException catch (e) {
      _showMessage("❌ 로그인 실패: ${e.message}");
    } catch (e) {
      _showMessage("❌ 회원가입 중 오류 발생");
      debugPrint("Register error: $e");
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _showMessage(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF8E1EC), Color(0xFFFFFFFF)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              children: [
                Text(
                  "사이온도",
                  style: GoogleFonts.inter(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.pinkAccent,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  "커플의 감정 온도를 기록하고 소통하세요",
                  style: TextStyle(color: Colors.grey[600]),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                TabBar(
                  controller: _tabController,
                  indicatorColor: Colors.pinkAccent,
                  labelColor: Colors.pinkAccent,
                  unselectedLabelColor: Colors.grey,
                  tabs: const [
                    Tab(text: "로그인"),
                    Tab(text: "회원가입"),
                  ],
                ),
                const SizedBox(height: 24),
                SizedBox(
                  height: 360,
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildLoginTab(),
                      _buildRegisterTab(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoginTab() {
    return Column(
      children: [
        TextField(
          controller: loginEmailCtrl,
          decoration: const InputDecoration(
            labelText: "이메일",
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: loginPasswordCtrl,
          obscureText: true,
          decoration: const InputDecoration(
            labelText: "비밀번호",
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: isLoading ? null : handleLogin,
          style: ElevatedButton.styleFrom(
            minimumSize: const Size.fromHeight(48),
            backgroundColor: Colors.pinkAccent,
          ),
          child: Text(isLoading ? "로그인 중..." : "로그인"),
        ),
      ],
    );
  }

  Widget _buildRegisterTab() {
    return Column(
      children: [
        TextField(
          controller: nameCtrl,
          decoration: const InputDecoration(labelText: "이름", border: OutlineInputBorder()),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: emailCtrl,
          decoration: const InputDecoration(labelText: "이메일", border: OutlineInputBorder()),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: passwordCtrl,
          obscureText: true,
          decoration: const InputDecoration(labelText: "비밀번호", border: OutlineInputBorder()),
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: isLoading ? null : handleRegister,
          style: ElevatedButton.styleFrom(
            minimumSize: const Size.fromHeight(48),
            backgroundColor: Colors.pinkAccent,
          ),
          child: Text(isLoading ? "가입 중..." : "가입하기"),
        ),
      ],
    );
  }
}
