import 'package:app/presentation/category/store/category_code_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:collection/collection.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/persona_profile.dart';
import '../../utils/locale/app_localization.dart';
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

  Future<void> _deleteProfile(BuildContext context, PersonaProfile profile) async {
    final local = AppLocalizations.of(context);
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(local!.translate('delete_persona_profile')),
        content: Text(local!.translate('delete_persona_profile_confirm')),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text(local.translate('cancel')),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text(local.translate('delete'), style: const TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
    if (confirm == true) {
      await _personaProfileStore.deleteProfile(userId, profile.categoryCodeId);
      if (_personaProfileStore.error != null && context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${local!.translate('delete_failed')}: ${_personaProfileStore.error}')),
        );
      }
    }
  }

  Widget _buildEmptyView(BuildContext context) {
    final local = AppLocalizations.of(context);
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.person_outline, size: 72, color: Colors.blue[100]),
          const SizedBox(height: 18),
          Text(
            local!.translate('no_persona_profile'),
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.blueGrey[400]),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileCard(BuildContext context, PersonaProfile profile) {
    final local = AppLocalizations.of(context);
    final category = _categoryCodeStore.codes.firstWhereOrNull((c) => c.id == profile.categoryCodeId);
    final categoryDesc = category?.description ?? local!.translate('unknown');

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 2, horizontal: 2),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.pink[50]!, Colors.blue[50]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: Colors.pink.withOpacity(0.10),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 36),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          categoryDesc,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: Color(0xFFD81B60),
                            fontFamily: 'Nunito',
                          ),
                        ),
                        const SizedBox(height: 8),
                        if (categoryDesc.isNotEmpty)
                          Text(
                            profile.content,
                            style: TextStyle(fontSize: 12, color: Colors.blue[300]),
                            overflow: TextOverflow.ellipsis,
                          ),
                      ],
                    ),
                  ),
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.edit_rounded, color: Color(0xFF64B5F6)),
                          iconSize: 16,
                          constraints: const BoxConstraints(
                            minWidth: 18,
                            minHeight: 18,
                          ),
                          padding: EdgeInsets.zero,
                          tooltip: local!.translate('edit'),
                          onPressed: () => _editProfile(context, profile),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_rounded, color: Color(0xFFE57373)),
                          iconSize: 16,
                          constraints: const BoxConstraints(
                            minWidth: 18,
                            minHeight: 18,
                          ),
                          padding: EdgeInsets.zero,
                          tooltip: local!.translate('delete'),
                          onPressed: () => _deleteProfile(context, profile),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(local!.translate('persona_profile_list')),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            tooltip: local!.translate('category_code_guide'),
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
            return Center(
              child: LoadingAnimationWidget.staggeredDotsWave(
                color: Colors.blueAccent,
                size: 40,
              ),
            );
          }
          if (_personaProfileStore.profiles.isEmpty) {
            return _buildEmptyView(context);
          }
          return ListView.separated(
            padding: const EdgeInsets.all(18),
            itemCount: _personaProfileStore.profiles.length,
            separatorBuilder: (_, __) => const SizedBox(height: 14),
            itemBuilder: (context, idx) =>
                _buildProfileCard(context, _personaProfileStore.profiles[idx]),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _addProfile(context),
        icon: const Icon(Icons.favorite, color: Colors.pinkAccent),
        label: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
          child: Text(
            local!.translate('add'),
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: Color(0xFFD81B60),
              fontFamily: 'Nunito',
            ),
          ),
        ),
        backgroundColor: Colors.pink[50],
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: Color(0xFFD81B60), width: 1.2),
        ),
        splashColor: Colors.pink[100],
        highlightElevation: 12,
      ),
    );
  }
}