import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../user/store/user_store.dart';
import 'store/auth_store.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final AuthStore _authStore = getIt<AuthStore>();
  final UserStore userStore = getIt<UserStore>();
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;
  bool _navigated = false;
  String? _error;

  // 테스트용 계정 정보
  static const _maleTestEmail = "kim@example.com";
  static const _femaleTestEmail = "lee@example.com";
  static const _testPassword = "password123";

  @override
  void initState() {
    super.initState();
    _emailController.text = _maleTestEmail;
    _passwordController.text = _testPassword;
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _onLogin() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final success = await _authStore.login(
        _emailController.text.trim(),
        _passwordController.text,
      );
      if (!mounted) return;
      setState(() => _isLoading = false);
      if (success) {
        _navigateToHome();
      } else {
        setState(() => _error = '로그인 실패');
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _error = '로그인 중 오류가 발생했습니다';
      });
    }
  }

  void _navigateToHome() {
    if (_navigated) return;
    _navigated = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/home');
    });
  }

  // 테스트용 빠른 로그인
  Future<void> _quickLogin(String email) async {
    _emailController.text = email;
    _passwordController.text = _testPassword;
    await _onLogin();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
          child: Card(
            elevation: 8,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Observer(
                builder: (_) {
                  final token = _authStore.accessToken;

                  // 이미 로그인된 경우 홈으로 이동
                  if (token != null && !_navigated) {
                    _navigateToHome();
                  }

                  return Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          '로그인',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.blueAccent,
                          ),
                        ),
                        const SizedBox(height: 24),
                        TextFormField(
                          controller: _emailController,
                          decoration: InputDecoration(
                            labelText: '이메일',
                            prefixIcon: const Icon(Icons.email),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) return '이메일을 입력하세요';
                            if (!value.contains('@')) return '이메일 형식이 올바르지 않습니다';
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _passwordController,
                          decoration: InputDecoration(
                            labelText: '비밀번호',
                            prefixIcon: const Icon(Icons.lock),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          obscureText: true,
                          validator: (value) {
                            if (value == null || value.isEmpty) return '비밀번호를 입력하세요';
                            if (value.length < 6) return '비밀번호는 6자 이상이어야 합니다';
                            return null;
                          },
                        ),
                        if (_error != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 12),
                            child: Text(
                              _error!,
                              style: const TextStyle(color: Colors.red, fontSize: 14),
                            ),
                          ),
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                icon: const Icon(Icons.male, color: Colors.blue),
                                label: const Text('남자 빠른 로그인', style: TextStyle(color: Colors.blue)),
                                onPressed: _isLoading ? null : () => _quickLogin(_maleTestEmail),
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: Colors.blue),
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: OutlinedButton.icon(
                                icon: const Icon(Icons.female, color: Colors.pink),
                                label: const Text('여자 빠른 로그인', style: TextStyle(color: Colors.pink)),
                                onPressed: _isLoading ? null : () => _quickLogin(_femaleTestEmail),
                                style: OutlinedButton.styleFrom(
                                  side: const BorderSide(color: Colors.pink),
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          width: double.infinity,
                          child: TextButton(
                            onPressed: _isLoading
                                ? null
                                : () {
                                    Navigator.pushReplacementNamed(context, '/register');
                                  },
                            child: const Text('회원가입', style: TextStyle(color: Colors.blueAccent)),
                          ),
                        ),
                        if (_isLoading)
                          Padding(
                            padding: const EdgeInsets.only(top: 16),
                            child: LoadingAnimationWidget.staggeredDotsWave(
                              color: Colors.blueAccent,
                              size: 32,
                            ),
                          ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
