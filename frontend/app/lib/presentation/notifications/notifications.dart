import 'package:app/presentation/auth/store/auth_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../utils/locale/app_localization.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class NotificationsScreen extends StatelessWidget {
  final AuthStore _authStore = getIt<AuthStore>();

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.backgroundLight,
        elevation: 0,
        title: Row(
          children: [
            Icon(Icons.notifications_active_rounded, color: AppColors.heartDark),
            const SizedBox(width: 8),
            Text(
              local!.translate('notification_box'),
              style: AppTextStyles.sectionTitle.copyWith(color: AppColors.heartAccent),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.delete_forever_rounded, color: AppColors.heartLight),
            tooltip: local!.translate('delete_all_notifications'),
            onPressed: () {
              _authStore.clearAllPushMessages();
            },
          ),
        ],
      ),
      body: Observer(
        builder: (_) {
          if (_authStore.pushMessages.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.notifications_off_rounded, size: 64, color: AppColors.backgroundLight),
                  const SizedBox(height: 16),
                  Text(
                    local.translate('no_notifications'),
                    style: AppTextStyles.body.copyWith(color: AppColors.heartLight, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 8),
                  Text('💌', style: AppTextStyles.title.copyWith(fontSize: 32)),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
            itemCount: _authStore.pushMessages.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final msg = _authStore.pushMessages[index];
              return Container(
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.heartDark.withOpacity(0.07),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: AppColors.backgroundLight,
                    child: Icon(Icons.notifications_rounded, color: AppColors.heartDark),
                  ),
                  title: Text(
                    msg,
                    style: AppTextStyles.body.copyWith(fontWeight: FontWeight.w500),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
