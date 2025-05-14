import 'package:app/presentation/category/store/category_code_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/user/persona_profile.dart';
import '../category/category_code_guide.dart';
import 'persona_profile_edit.dart';
import 'store/persona_profile_store.dart';

class PersonaProfileListScreen extends StatelessWidget {
  final String userId;

  final PersonaProfileStore _personaProfileStore = getIt<PersonaProfileStore>();
  final CategoryCodeStore _categoryCodeStore = getIt<CategoryCodeStore>();

  PersonaProfileListScreen({required this.userId, super.key});

  Future<void> _editProfile(BuildContext context, PersonaProfile profile) async {
    final updated = await Navigator.push<PersonaProfile>(
      context,
      MaterialPageRoute(
        builder: (_) => PersonaProfileEditScreen(
          userId: userId,
          profile: profile,
        ),
      ),
    );
    if (context.mounted && updated != null) {
      await _personaProfileStore.updateProfile(userId, updated);
    }
  }

  Future<void> _addProfile(BuildContext context) async {
    final newProfile = await Navigator.push<PersonaProfile>(
      context,
      MaterialPageRoute(
        builder: (_) => PersonaProfileEditScreen(userId: userId),
      ),
    );
    if (context.mounted && newProfile != null) {
      await _personaProfileStore.addProfile(userId, newProfile);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('성향 프로필 목록'),
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
      body: Observer(
        builder: (_) {
          if (_personaProfileStore.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (_personaProfileStore.profiles.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.person_outline, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  const Text(
                    '등록된 성향 프로필이 없습니다.\n오른쪽 아래 + 버튼을 눌러 추가해보세요!',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                ],
              ),
            );
          }
          // 카테고리 코드 맵을 미리 만들어둠 (id → code/desc)
          final categoryMap = {
            for (final c in _categoryCodeStore.codes) c.id: c
          };

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: _personaProfileStore.profiles.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, idx) {
              final profile = _personaProfileStore.profiles[idx];
              final category = categoryMap[profile.categoryCodeId];
              final categoryCode = category?.code ?? '알 수 없음';
              final categoryDesc = category?.description ?? '';

              return Card(
                elevation: 3,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                  leading: CircleAvatar(
                    backgroundColor: Colors.blue[100],
                    child: Icon(Icons.person, color: Colors.blue[700]),
                  ),
                  title: Text(
                    profile.content,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                  ),
                  subtitle: Padding(
                    padding: const EdgeInsets.only(top: 4.0),
                    child: Text(
                      '카테고리: $categoryCode'
                      '${categoryDesc.isNotEmpty ? " ($categoryDesc)" : ""}  •  신뢰도: ${(profile.confidenceScore * 100).toStringAsFixed(1)}%',
                      style: const TextStyle(fontSize: 13),
                    ),
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.edit, color: Colors.blueAccent),
                    tooltip: '수정',
                    onPressed: () => _editProfile(context, profile),
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _addProfile(context),
        icon: const Icon(Icons.add),
        label: const Text('추가'),
        backgroundColor: Colors.blueAccent,
      ),
    );
  }
}