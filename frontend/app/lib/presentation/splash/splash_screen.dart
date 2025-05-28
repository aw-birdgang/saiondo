import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import '../../di/service_locator.dart';
import '../auth/store/auth_store.dart'; // 실제 AuthStore 경로에 맞게 수정

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final AuthStore _authStore = getIt<AuthStore>();

  @override
  void initState() {
    super.initState();
    _checkAuthAndNavigate();
  }

  Future<void> _checkAuthAndNavigate() async {
    // 예시: AuthStore에서 토큰을 불러오거나, SharedPreferences에서 직접 확인
    await _authStore.loadAuthFromPrefs(); // 비동기 로딩
    final isLoggedIn = _authStore.accessToken != null;

    Future.delayed(const Duration(seconds: 1), () {
      if (!mounted) return;
      if (isLoggedIn) {
        Navigator.of(context).pushReplacementNamed('/home');
      } else {
        Navigator.of(context).pushReplacementNamed('/login');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.pink[50],
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 앱 로고/이름
            Image.asset(
              'assets/images/login_logo.png', // 실제 로고 경로로 교체
              width: 120,
              height: 120,
            ),
            const SizedBox(height: 24),
            const Text(
              "SAIONDO",
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.pink,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 16),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
