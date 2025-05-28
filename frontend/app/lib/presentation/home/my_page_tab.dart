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
      backgroundColor: Colors.pink[50],
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
                style: const TextStyle(fontSize: 16, color: Colors.grey),
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
    final local = AppLocalizations.of(context);
    final userProfile = "https://randomuser.me/api/portraits/men/32.jpg";
    final partnerProfile = "https://randomuser.me/api/portraits/women/44.jpg";
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 러블리 프로필 카드
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.pink[100]!, Colors.blue[50]!],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.pink.withOpacity(0.08),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 14),
              child: Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [Colors.pinkAccent, Colors.blueAccent],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: CircleAvatar(
                      backgroundImage: NetworkImage(userProfile),
                      radius: 26,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFD81B60),
                            fontFamily: 'Nunito',
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          user.email,
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.blueGrey[400],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 36),
            // 섹션: 프로필 관리
            Row(
              children: [
                Icon(Icons.favorite, color: Colors.pink[200], size: 22),
                const SizedBox(width: 8),
                Text(
                  local.translate('my_info_manage'),
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blueGrey[700],
                    fontFamily: 'Nunito',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: onPersonaProfileTap,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.pink[50],
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.pinkAccent.withOpacity(0.2)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.pink.withOpacity(0.06),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
                child: Row(
                  children: [
                    Icon(Icons.person_search, color: Colors.blueAccent, size: 28),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            local.translate('my_persona_manage'),
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                              color: Color(0xFF1976D2),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            local.translate('my_persona_manage_desc'),
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.blueGrey[400],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.arrow_forward_ios, size: 18, color: Colors.blueAccent),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}