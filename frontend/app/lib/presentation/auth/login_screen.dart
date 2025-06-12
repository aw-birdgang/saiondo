import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../../utils/locale/app_localization.dart';
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

  static const _mainColor = Colors.blueAccent;
  static const _femaleColor = Colors.pinkAccent;
  static const _maleColor = Colors.blue;

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
        setState(() => _error = AppLocalizations.of(context)!.translate('login_error'));
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

  Widget _buildTitle(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.favorite, color: _mainColor, size: 32),
        const SizedBox(width: 8),
        Text(
          AppLocalizations.of(context)!.translate('login'),
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: _mainColor,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(width: 8),
        Icon(Icons.favorite, color: _femaleColor, size: 32),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required String? Function(String?) validator,
    bool obscure = false,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: _mainColor),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
      obscureText: obscure,
      validator: validator,
    );
  }

  Widget _buildErrorText() {
    if (_error == null) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 18),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              _error!,
              style: const TextStyle(color: Colors.red, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickLoginButtons(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton.icon(
            icon: const Icon(Icons.male, color: _maleColor),
            label: Text(
              AppLocalizations.of(context)!.translate('quick_login_male'),
              style: const TextStyle(color: _maleColor),
            ),
            onPressed: _isLoading ? null : () => _quickLogin(_maleTestEmail),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: _maleColor),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: OutlinedButton.icon(
            icon: const Icon(Icons.female, color: _femaleColor),
            label: Text(
              AppLocalizations.of(context)!.translate('quick_login_female'),
              style: const TextStyle(color: _femaleColor),
            ),
            onPressed: _isLoading ? null : () => _quickLogin(_femaleTestEmail),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: _femaleColor),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRegisterButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: TextButton.icon(
        icon: const Icon(Icons.person_add_alt_1, color: _mainColor),
        label: Text(
          AppLocalizations.of(context)!.translate('register'),
          style: const TextStyle(color: _mainColor, fontWeight: FontWeight.w600),
        ),
        onPressed: _isLoading
            ? null
            : () => Navigator.pushReplacementNamed(context, '/register'),
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    if (!_isLoading) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: LoadingAnimationWidget.staggeredDotsWave(
        color: _mainColor,
        size: 36,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
          child: Card(
            elevation: 10,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(28.0),
              child: Observer(
                builder: (_) {
                  return Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildTitle(context),
                        const SizedBox(height: 28),
                        _buildTextField(
                          controller: _emailController,
                          label: AppLocalizations.of(context)!.translate('email'),
                          icon: Icons.email,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppLocalizations.of(context)!.translate('enter_email');
                            }
                            if (!value.contains('@')) {
                              return AppLocalizations.of(context)!.translate('invalid_email_format');
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 18),
                        _buildTextField(
                          controller: _passwordController,
                          label: AppLocalizations.of(context)!.translate('password'),
                          icon: Icons.lock,
                          obscure: true,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppLocalizations.of(context)!.translate('enter_password');
                            }
                            if (value.length < 6) {
                              return AppLocalizations.of(context)!.translate('password_min_length');
                            }
                            return null;
                          },
                        ),
                        _buildErrorText(),
                        const SizedBox(height: 26),
                        _buildQuickLoginButtons(context),
                        const SizedBox(height: 10),
                        _buildRegisterButton(context),
                        _buildLoadingIndicator(),
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
