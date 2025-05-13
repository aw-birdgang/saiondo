import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/user/persona_profile.dart';
import 'persona_profile_edit.dart';
import 'store/persona_profile_store.dart';

class PersonaProfileListScreen extends StatelessWidget {
  final String userId;

  PersonaProfileListScreen({required this.userId, super.key});

  final PersonaProfileStore store = getIt<PersonaProfileStore>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('성향 프로필 목록')),
      body: Observer(
        builder: (_) {
          if (store.isLoading) return const Center(child: CircularProgressIndicator());
          if (store.profiles.isEmpty) return const Center(child: Text('등록된 성향 프로필이 없습니다.'));
          return ListView.builder(
            itemCount: store.profiles.length,
            itemBuilder: (context, idx) {
              final profile = store.profiles[idx];
              return ListTile(
                title: Text(profile.content),
                subtitle: Text('카테고리: ${profile.categoryCodeId} / 신뢰도: ${(profile.confidenceScore * 100).toStringAsFixed(1)}%'),
                trailing: IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () async {
                    final updated = await Navigator.push<PersonaProfile>(
                      context,
                      MaterialPageRoute(
                        builder: (_) => PersonaProfileEditScreen(
                          userId: userId,
                          profile: profile,
                        ),
                      ),
                    );
                    if (updated != null) {
                      await store.updateProfile(userId, updated);
                    }
                  },
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final newProfile = await Navigator.push<PersonaProfile>(
            context,
            MaterialPageRoute(
              builder: (_) => PersonaProfileEditScreen(userId: userId),
            ),
          );
          if (newProfile != null) {
            await store.addProfile(userId, newProfile);
          }
        },
        child: const Icon(Icons.add),
        tooltip: '프로필 추가',
      ),
    );
  }
}