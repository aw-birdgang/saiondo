import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../../di/service_locator.dart';
import '../../../utils/locale/app_localization.dart';
import '../../auth/auth_guard.dart';
import '../../persona_profile/persona_profile_list.dart';
import '../../persona_profile/store/persona_profile_store.dart';
import '../../user/store/user_store.dart';
import '../../user/screens/my_page_content.dart';

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
          SnackBar(content: Text(AppLocalizations.of(context)!.translate('profile_load_fail'))),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthGuard(
      child: Observer(
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
                AppLocalizations.of(context)!.translate('no_login_info'),
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



