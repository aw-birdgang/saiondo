import 'package:flutter/material.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../auth/store/auth_store.dart';
import '../user/store/user_store.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  final AuthStore _authStore = getIt<AuthStore>();
  final UserStore _userStore = getIt<UserStore>();
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _checkAuthAndNavigate();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _checkAuthAndNavigate() async {
    await _authStore.loadAuthFromPrefs();
    // 로그인 상태면 UserStore도 동기화
    if (_authStore.isAuthenticated) {
      await _userStore.loadUserById(_authStore.userId!);
    }
    while (_userStore.isLoading) {
      await Future.delayed(const Duration(milliseconds: 50));
    }
    final isLoggedIn = _authStore.isAuthenticated && _userStore.selectedUser != null;
    print('[AuthGuard] isLoggedIn :: ${isLoggedIn} , _authStore.isAuthenticated :: ${_authStore.isAuthenticated} , _userStore.selectedUser : ${_userStore.selectedUser}');

    Future.delayed(const Duration(milliseconds: 300), () {
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
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 러블리한 하트 애니메이션 (두 하트가 가까워지는 효과)
            SizedBox(
              width: 180,
              height: 120,
              child: AnimatedBuilder(
                animation: _controller,
                builder: (context, child) {
                  final t = _controller.value;
                  final dx = 40 * (1 - t);
                  return Stack(
                    alignment: Alignment.center,
                    children: [
                      Transform.translate(
                        offset: Offset(-dx, 0),
                        child: Icon(Icons.favorite, color: AppColors.heartLight, size: 60),
                      ),
                      Transform.translate(
                        offset: Offset(dx, 0),
                        child: Icon(Icons.favorite, color: AppColors.heartDark, size: 60),
                      ),
                      // 두 하트가 겹칠 때 작은 하트가 튀어나오는 효과
                      if ((dx).abs() < 5)
                        Positioned(
                          bottom: 10,
                          child: Icon(Icons.favorite, color: AppColors.heartAccent, size: 32),
                        ),
                    ],
                  );
                },
              ),
            ),
            const SizedBox(height: 18),
            const Text(
              "사이온도",
              style: AppTextStyles.title,
            ),
            const SizedBox(height: 10),
            Text(
              "서로를 알아가며\n사이의 온도를 높여보세요",
              textAlign: TextAlign.center,
              style: AppTextStyles.subtitle,
            ),
            const SizedBox(height: 24),
            LoadingAnimationWidget.staggeredDotsWave(
              color: AppColors.loading,
              size: 40,
            ),
          ],
        ),
      ),
    );
  }
}
