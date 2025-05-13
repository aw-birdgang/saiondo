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
  late TextEditingController _categoryController;
  late TextEditingController _contentController;
  late TextEditingController _confidenceController;

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
        categoryCodeId: _categoryController.text,
        content: _contentController.text,
        confidenceScore: double.tryParse(_confidenceController.text) ?? 0.9,
      );
      Navigator.pop(context, profile);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.profile != null;
    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? '프로필 수정' : '프로필 추가')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _categoryController,
                decoration: const InputDecoration(labelText: '카테고리 코드'),
                validator: (v) => v == null || v.isEmpty ? '카테고리 코드를 입력하세요' : null,
              ),
              TextFormField(
                controller: _contentController,
                decoration: const InputDecoration(labelText: '내용'),
                validator: (v) => v == null || v.isEmpty ? '내용을 입력하세요' : null,
              ),
              TextFormField(
                controller: _confidenceController,
                decoration: const InputDecoration(labelText: '신뢰도(0~1)'),
                keyboardType: TextInputType.number,
                validator: (v) {
                  final d = double.tryParse(v ?? '');
                  if (d == null || d < 0 || d > 1) return '0~1 사이의 값을 입력하세요';
                  return null;
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _onSave,
                child: Text(isEdit ? '수정' : '추가'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}