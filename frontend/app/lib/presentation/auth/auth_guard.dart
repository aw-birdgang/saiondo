import 'package:app/di/service_locator.dart';
import 'package:app/presentation/user/store/user_store.dart';
import 'package:flutter/material.dart';
import 'package:app/presentation/auth/store/auth_store.dart';

class AuthGuard extends StatelessWidget {
  final Widget child;

  const AuthGuard({required this.child, super.key});

  @override
  Widget build(BuildContext context) {
    final authStore = getIt<AuthStore>();
    final userStore = getIt<UserStore>();
    final routeName = ModalRoute.of(context)?.settings.name;
    const publicRoutes = ['/login', '/register', '/splash'];
    final isLoggedIn = userStore.userId != null && userStore.selectedUser != null;
    print('[AuthGuard] isLoggedIn :: ${isLoggedIn} , _userStore.userId :: ${userStore.userId} , _userStore.selectedUser : ${userStore.selectedUser} , routeName :: ${routeName}');
    if (!authStore.isAuthenticated || userStore.selectedUser == null) {
      if (publicRoutes.contains(routeName)) {
        // 로그인/회원가입/스플래시에서는 AuthGuard가 아무것도 하지 않음
        print('[AuthGuard] publicRoutes.contains(routeName) >>  routeName:: ${routeName}');
        return child;
      }
      print('[AuthGuard] go to login >>  routeName:: ${routeName}');
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (ModalRoute.of(context)?.settings.name != '/login') {
          Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
        }
      });
      return const SizedBox.shrink();
    }
    return child;
  }
}
