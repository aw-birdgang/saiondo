import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../category/category_code_guide.dart';
import '../category/store/category_code_store.dart';
import 'widgets/persona_profile_edit_form.dart';

class PersonaProfileEditScreen extends StatelessWidget {
  final String userId;
  final dynamic profile; // PersonaProfile? 타입

  const PersonaProfileEditScreen({
    required this.userId,
    this.profile,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final _categoryCodeStore = getIt<CategoryCodeStore>();

    return Scaffold(
      appBar: AppBar(
        title: Text(profile != null ? '프로필 수정' : '프로필 추가'),
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
                  if (_categoryCodeStore.isLoading) {
                    return Center(
                      child: LoadingAnimationWidget.staggeredDotsWave(
                        color: Colors.blueAccent,
                        size: 32,
                      ),
                    );
                  }
                  if (_categoryCodeStore.error != null) {
                    return Center(child: Text('에러: ${_categoryCodeStore.error}'));
                  }
                  return PersonaProfileEditForm(
                    userId: userId,
                    profile: profile,
                    categoryCodeStore: _categoryCodeStore,
                    onSubmit: (profile) {
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        if (context.mounted) Navigator.pop(context, profile);
                      });
                    },
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