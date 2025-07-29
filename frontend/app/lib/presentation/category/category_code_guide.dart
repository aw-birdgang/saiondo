import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import '../../di/service_locator.dart';
import 'store/category_code_store.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

class CategoryCodeGuideScreen extends StatelessWidget {
  CategoryCodeGuideScreen({super.key});

  final _store = getIt<CategoryCodeStore>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('카테고리 코드 안내')),
      body: Observer(
        builder: (_) {
          if (_store.isLoading) {
            return Center(
              child: LoadingAnimationWidget.staggeredDotsWave(
                color: Colors.blueAccent,
                size: 40,
              ),
            );
          }
          if (_store.error != null) {
            return Center(child: Text('에러: ${_store.error}'));
          }
          if (_store.codes.isEmpty) {
            return const Center(child: Text('카테고리 코드가 없습니다.'));
          }
          return ListView.separated(
            padding: const EdgeInsets.all(20),
            itemCount: _store.codes.length,
            separatorBuilder: (_, __) => const Divider(),
            itemBuilder: (context, idx) {
              final code = _store.codes[idx];
              return ListTile(
                leading: CircleAvatar(child: Text(code.code[0])),
                title: Text('${code.code}',
                    style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text(code.description ?? ''),
              );
            },
          );
        },
      ),
    );
  }
}
