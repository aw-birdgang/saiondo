import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/user/persona_profile.dart';
import '../category/category_code_guide.dart';
import '../category/store/category_code_store.dart';

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
  late final TextEditingController _contentController;
  late final TextEditingController _confidenceController;
  String? _selectedCategoryId;
  bool _isStatic = false;

  final _categoryCodeStore = getIt<CategoryCodeStore>();

  @override
  void initState() {
    super.initState();
    _categoryCodeStore.loadCodes();
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

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) Navigator.pop(context, profile);
    });
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.profile != null;
    return Scaffold(
      appBar: AppBar(
        title: Text(isEdit ? '프로필 수정' : '프로필 추가'),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            tooltip: '카테고리 코드 안내',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => CategoryCodeGuideScreen()),
              );
            },
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Card(
            elevation: 6,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 24),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Observer(
                builder: (_) {
                  final codes = _categoryCodeStore.codes;
                  if (_categoryCodeStore.isLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (_categoryCodeStore.error != null) {
                    return Center(child: Text('에러: ${_categoryCodeStore.error}'));
                  }
                  if (_selectedCategoryId == null ||
                      !codes.any((c) => c.id == _selectedCategoryId)) {
                    _selectedCategoryId = codes.isNotEmpty ? codes.first.id : null;
                  }
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
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}