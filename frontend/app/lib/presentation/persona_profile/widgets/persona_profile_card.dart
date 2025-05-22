import 'package:flutter/material.dart';
import '../../../domain/entry/persona_profile.dart';
import '../../category/store/category_code_store.dart';
import 'package:collection/collection.dart';

class PersonaProfileCard extends StatelessWidget {
  final PersonaProfile profile;
  final CategoryCodeStore categoryCodeStore;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  const PersonaProfileCard({
    super.key,
    required this.profile,
    required this.categoryCodeStore,
    this.onEdit,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final category = categoryCodeStore.codes
        .firstWhereOrNull((c) => c.id == profile.categoryCodeId);

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
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (onEdit != null)
              IconButton(
                icon: const Icon(Icons.edit, color: Colors.blueAccent),
                tooltip: '수정',
                onPressed: onEdit,
              ),
            if (onDelete != null)
              IconButton(
                icon: const Icon(Icons.delete, color: Colors.redAccent),
                tooltip: '삭제',
                onPressed: onDelete,
              ),
          ],
        ),
      ),
    );
  }
}
