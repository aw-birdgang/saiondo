import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/user.dart';
import '../../utils/locale/app_localization.dart';
import '../persona_profile/persona_profile_list.dart';
import '../persona_profile/store/persona_profile_store.dart';
import '../user/store/user_store.dart';

class MyPageScreen extends StatelessWidget {
  MyPageScreen({super.key});

  final userStore = getIt<UserStore>();
  final personaProfileStore = getIt<PersonaProfileStore>();

  void _goToLogin(BuildContext context) {
    if (ModalRoute.of(context)?.settings.name != '/login') {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  Future<void> _openPersonaProfile(BuildContext context, String userId) async {
    try {
      await personaProfileStore.loadProfiles(userId);
      if (context.mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PersonaProfileListScreen(userId: userId),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(AppLocalizations.of(context).translate('profile_load_fail'))),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Observer(
        builder: (_) {
          if (userStore.isLoading) {
            return Center(
              child: LoadingAnimationWidget.staggeredDotsWave(
                color: Colors.pink,
                size: 40,
              ),
            );
          }
          final user = userStore.selectedUser ?? (userStore.users.isNotEmpty ? userStore.users.first : null);
          final userId = user?.id;

          if (user == null || userId == null || userId.isEmpty) {
            Future.microtask(() => _goToLogin(context));
            return Center(
              child: Text(
                AppLocalizations.of(context).translate('no_login_info'),
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            );
          }

          return MyPageContent(
            user: user,
            onPersonaProfileTap: () => _openPersonaProfile(context, userId),
          );
        },
      ),
    );
  }
}

class MyPageContent extends StatelessWidget {
  final User user;
  final VoidCallback onPersonaProfileTap;

  const MyPageContent({
    super.key,
    required this.user,
    required this.onPersonaProfileTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          // 프로필 카드
          Card(
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 32,
                    child: Icon(Icons.account_circle, size: 48, color: Colors.white),
                    backgroundColor: Colors.blueAccent,
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user.name,
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          user.email,
                          style: const TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
          // 섹션: 프로필 관리
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              AppLocalizations.of(context).translate('my_info_manage'),
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blueGrey[700]),
            ),
          ),
          const SizedBox(height: 12),
          ListTile(
            leading: const Icon(Icons.person_search, color: Colors.blueAccent),
            title: Text(
              AppLocalizations.of(context).translate('my_persona_manage'),
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
            subtitle: Text(
              AppLocalizations.of(context).translate('my_persona_manage_desc'),
            ),
            trailing: const Icon(Icons.arrow_forward_ios, size: 18, color: Colors.blueAccent),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            onTap: onPersonaProfileTap,
            tileColor: Colors.blue[50],
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          ),
          const Spacer(),
        ],
      ),
    );
  }
}