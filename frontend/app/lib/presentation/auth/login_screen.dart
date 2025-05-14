import 'package:app/presentation/auth/store/auth_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../user/store/user_store.dart';

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
    setState(() {
      _emailController.text = "kim@example.com";
      _passwordController.text = "password123";
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _onLogin() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    try {
      final success = await _authStore.login(
        _emailController.text.trim(),
        _passwordController.text,
      );
      if (!mounted) return;
      setState(() => _isLoading = false);
      if (success) {
        _navigated = true;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (!mounted) return;
          Navigator.pushReplacementNamed(context, '/home');
        });
      } else {
        setState(() => _error = '로그인 실패');
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      // 에러 처리
    }
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
                  final error = _error;
                  final token = _authStore.accessToken;

                  if (token != null && !_isLoading && !_navigated) {
                    _navigated = true;
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      Navigator.pushReplacementNamed(context, '/home');
                    });
                  }

                  return Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '로그인',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.blueAccent,
                          ),
                        ),
                        SizedBox(height: 24),
                        TextFormField(
                          controller: _emailController,
                          decoration: InputDecoration(
                            labelText: '이메일',
                            prefixIcon: Icon(Icons.email),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) return '이메일을 입력하세요';
                            if (!value.contains('@')) return '이메일 형식이 올바르지 않습니다';
                            return null;
                          },
                        ),
                        SizedBox(height: 16),
                        TextFormField(
                          controller: _passwordController,
                          decoration: InputDecoration(
                            labelText: '비밀번호',
                            prefixIcon: Icon(Icons.lock),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          obscureText: true,
                          validator: (value) {
                            if (value == null || value.isEmpty) return '비밀번호를 입력하세요';
                            if (value.length < 6) return '비밀번호는 6자 이상이어야 합니다';
                            return null;
                          },
                        ),
                        if (error != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 12),
                            child: Text(
                              error,
                              style: TextStyle(color: Colors.red, fontSize: 14),
                            ),
                          ),
                        SizedBox(height: 24),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                icon: Icon(Icons.male, color: Colors.blue),
                                label: Text('남자 빠른 로그인', style: TextStyle(color: Colors.blue)),
                                onPressed: _isLoading ? null : () => _quickLogin(_maleTestEmail),
                                style: OutlinedButton.styleFrom(
                                  side: BorderSide(color: Colors.blue),
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                            ),
                            SizedBox(width: 12),
                            Expanded(
                              child: OutlinedButton.icon(
                                icon: Icon(Icons.female, color: Colors.pink),
                                label: Text('여자 빠른 로그인', style: TextStyle(color: Colors.pink)),
                                onPressed: _isLoading ? null : () => _quickLogin(_femaleTestEmail),
                                style: OutlinedButton.styleFrom(
                                  side: BorderSide(color: Colors.pink),
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                ),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        TextButton(
                          onPressed: _isLoading
                              ? null
                              : () {
                                  Navigator.pushReplacementNamed(context, '/register');
                                },
                          child: Text('회원가입', style: TextStyle(color: Colors.blueAccent)),
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
