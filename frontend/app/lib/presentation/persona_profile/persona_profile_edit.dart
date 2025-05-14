import 'package:flutter/material.dart';
import '../../di/service_locator.dart';
import '../../domain/entry/user/persona_profile.dart';
import 'store/persona_profile_store.dart';

class PersonaProfileEditScreen extends StatefulWidget {
  final String userId;
  final PersonaProfile? profile;

  const PersonaProfileEditScreen({
    required this.userId,
    this.profile,
    super.key,
  });

  @override
  State<PersonaProfileEditScreen> createState() => _PersonaProfileEditScreenState();
}

class _PersonaProfileEditScreenState extends State<PersonaProfileEditScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _categoryController;
  late final TextEditingController _contentController;
  late final TextEditingController _confidenceController;

  final PersonaProfileStore _store = getIt<PersonaProfileStore>();

  @override
  void initState() {
    super.initState();
    _categoryController = TextEditingController(text: widget.profile?.categoryCodeId ?? '');
    _contentController = TextEditingController(text: widget.profile?.content ?? '');
    _confidenceController = TextEditingController(
      text: widget.profile?.confidenceScore.toString() ?? '0.9',
    );
  }

  @override
  void dispose() {
    _categoryController.dispose();
    _contentController.dispose();
    _confidenceController.dispose();
    super.dispose();
  }

  void _onSave() {
    if (_formKey.currentState?.validate() ?? false) {
      final profile = PersonaProfile(
        categoryCodeId: _categoryController.text.trim(),
        content: _contentController.text.trim(),
        confidenceScore: double.tryParse(_confidenceController.text.trim()) ?? 0.9,
      );
      Navigator.pop(context, profile);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.profile != null;
    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? '프로필 수정' : '프로필 추가')),
      body: Center(
        child: SingleChildScrollView(
          child: Card(
            elevation: 6,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 24),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      isEdit ? '성향 프로필 수정' : '성향 프로필 추가',
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueAccent),
                    ),
                    const SizedBox(height: 28),
                    TextFormField(
                      controller: _categoryController,
                      decoration: const InputDecoration(
                        labelText: '카테고리 코드',
                        hintText: '예: PERSONALITY',
                        prefixIcon: Icon(Icons.category),
                        border: OutlineInputBorder(),
                      ),
                      textInputAction: TextInputAction.next,
                      validator: (v) => v == null || v.trim().isEmpty ? '카테고리 코드를 입력하세요' : null,
                    ),
                    const SizedBox(height: 18),
                    TextFormField(
                      controller: _contentController,
                      decoration: const InputDecoration(
                        labelText: '내용',
                        hintText: '성향 내용을 입력하세요',
                        prefixIcon: Icon(Icons.text_snippet),
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 2,
                      textInputAction: TextInputAction.next,
                      validator: (v) => v == null || v.trim().isEmpty ? '내용을 입력하세요' : null,
                    ),
                    const SizedBox(height: 18),
                    TextFormField(
                      controller: _confidenceController,
                      decoration: const InputDecoration(
                        labelText: '신뢰도 (0~1)',
                        hintText: '예: 0.9',
                        prefixIcon: Icon(Icons.percent),
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      textInputAction: TextInputAction.done,
                      validator: (v) {
                        final d = double.tryParse(v?.trim() ?? '');
                        if (d == null || d < 0 || d > 1) return '0~1 사이의 값을 입력하세요';
                        return null;
                      },
                    ),
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        icon: Icon(isEdit ? Icons.save : Icons.add),
                        label: Text(isEdit ? '수정' : '추가', style: const TextStyle(fontSize: 18)),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: _onSave,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}