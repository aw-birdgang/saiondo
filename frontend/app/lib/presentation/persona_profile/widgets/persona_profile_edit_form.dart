import 'package:flutter/material.dart';
import '../../../domain/entry/persona_profile.dart';
import '../../category/store/category_code_store.dart';

class PersonaProfileEditForm extends StatefulWidget {
  final String userId;
  final PersonaProfile? profile;
  final CategoryCodeStore categoryCodeStore;
  final void Function(PersonaProfile profile) onSubmit;

  const PersonaProfileEditForm({
    super.key,
    required this.userId,
    required this.categoryCodeStore,
    this.profile,
    required this.onSubmit,
  });

  @override
  State<PersonaProfileEditForm> createState() => _PersonaProfileEditFormState();
}

class _PersonaProfileEditFormState extends State<PersonaProfileEditForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _contentController;
  late final TextEditingController _confidenceController;
  String? _selectedCategoryId;
  bool _isStatic = false;

  @override
  void initState() {
    super.initState();
    _selectedCategoryId = widget.profile?.categoryCodeId;
    _contentController = TextEditingController(text: widget.profile?.content ?? '');
    _confidenceController = TextEditingController(
      text: widget.profile?.confidenceScore.toString() ?? '0.9',
    );
    _isStatic = widget.profile?.isStatic ?? false;
  }

  @override
  void dispose() {
    _contentController.dispose();
    _confidenceController.dispose();
    super.dispose();
  }

  void _onSave() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final profile = PersonaProfile(
      userId: widget.userId,
      categoryCodeId: _selectedCategoryId!,
      content: _contentController.text.trim(),
      isStatic: _isStatic,
      source: 'USER_INPUT',
      confidenceScore: double.tryParse(_confidenceController.text.trim()) ?? 0.9,
    );
    widget.onSubmit(profile);
  }

  @override
  Widget build(BuildContext context) {
    final codes = widget.categoryCodeStore.codes;
    if (_selectedCategoryId == null ||
        !codes.any((c) => c.id == _selectedCategoryId)) {
      _selectedCategoryId = codes.isNotEmpty ? codes.first.id : null;
    }
    final isEdit = widget.profile != null;

    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            isEdit ? '성향 프로필 수정' : '성향 프로필 추가',
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blueAccent),
          ),
          const SizedBox(height: 28),
          DropdownButtonFormField<String>(
            value: _selectedCategoryId,
            items: codes
                .map((c) => DropdownMenuItem(
                      value: c.id,
                      child: Text('${c.code} (${c.description ?? ""})'),
                    ))
                .toList(),
            onChanged: (val) => setState(() => _selectedCategoryId = val),
            decoration: const InputDecoration(
              labelText: '카테고리',
              prefixIcon: Icon(Icons.category),
              border: OutlineInputBorder(),
            ),
            validator: (v) => v == null ? '카테고리를 선택하세요' : null,
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
          const SizedBox(height: 18),
          SwitchListTile(
            value: _isStatic,
            onChanged: (val) => setState(() => _isStatic = val),
            title: const Text('고정 프로필로 저장'),
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
    );
  }
}
