import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import 'store/auth_store.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final AuthStore _authStore = getIt<AuthStore>();

  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  String? _selectedGender;

  static const _mainColor = Colors.blueAccent;
  static const _femaleColor = Colors.pinkAccent;
  static const _maleColor = Colors.blue;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  Widget _buildTitle() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.cake, color: _mainColor, size: 30),
        const SizedBox(width: 8),
        Text(
          '회원가입',
          style: const TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: _mainColor,
            letterSpacing: 1.2,
          ),
        ),
        const SizedBox(width: 8),
        Icon(Icons.celebration, color: _femaleColor, size: 30),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required String? Function(String?) validator,
    bool obscure = false,
    TextInputType? keyboardType,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: _mainColor),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
      obscureText: obscure,
      keyboardType: keyboardType,
      validator: validator,
    );
  }

  Widget _buildGenderSelector() {
    return DropdownButtonFormField<String>(
      value: _selectedGender,
      decoration: InputDecoration(
        labelText: '성별',
        prefixIcon: Icon(Icons.wc, color: _mainColor),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      ),
      items: const [
        DropdownMenuItem(value: 'MALE', child: Text('남성')),
        DropdownMenuItem(value: 'FEMALE', child: Text('여성')),
        DropdownMenuItem(value: 'OTHER', child: Text('기타')),
      ],
      onChanged: (value) => setState(() => _selectedGender = value),
      validator: (value) => value == null ? '성별을 선택해주세요' : null,
    );
  }

  Widget _buildErrorText() {
    if (_authStore.error == null) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 18),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              _authStore.error!,
              style: const TextStyle(color: Colors.red, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _onRegister() async {
    if (!_formKey.currentState!.validate()) return;
    await _authStore.register(
      _emailController.text.trim(),
      _passwordController.text,
      _nameController.text,
      _selectedGender!,
    );
    if (_authStore.user != null && mounted) {
      Navigator.pushReplacementNamed(context, '/home');
    }
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
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(28.0),
              child: Observer(
                builder: (_) => Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildTitle(),
                      const SizedBox(height: 28),
                      _buildTextField(
                        controller: _emailController,
                        label: '이메일',
                        icon: Icons.email,
                        keyboardType: TextInputType.emailAddress,
                        validator: (value) {
                          if (value == null || value.isEmpty)
                            return '이메일을 입력해주세요';
                          if (!value.contains('@')) return '이메일 형식이 올바르지 않습니다';
                          return null;
                        },
                      ),
                      const SizedBox(height: 18),
                      _buildTextField(
                        controller: _passwordController,
                        label: '비밀번호',
                        icon: Icons.lock,
                        obscure: true,
                        validator: (value) {
                          if (value == null || value.isEmpty)
                            return '비밀번호를 입력해주세요';
                          if (value.length < 6) return '비밀번호는 6자 이상이어야 합니다';
                          return null;
                        },
                      ),
                      const SizedBox(height: 18),
                      _buildTextField(
                        controller: _nameController,
                        label: '이름',
                        icon: Icons.person,
                        validator: (value) {
                          if (value == null || value.isEmpty)
                            return '이름을 입력해주세요';
                          return null;
                        },
                      ),
                      const SizedBox(height: 18),
                      _buildGenderSelector(),
                      _buildErrorText(),
                      const SizedBox(height: 26),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          icon: const Icon(Icons.favorite, color: Colors.white),
                          label: const Text('회원가입',
                              style: TextStyle(fontSize: 18)),
                          onPressed: _onRegister,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: _mainColor,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextButton.icon(
                        icon: const Icon(Icons.login, color: _mainColor),
                        label: const Text('로그인',
                            style: TextStyle(color: _mainColor)),
                        onPressed: () {
                          Navigator.pushReplacementNamed(context, '/login');
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
