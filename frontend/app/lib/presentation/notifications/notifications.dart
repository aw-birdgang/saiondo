import 'package:app/presentation/auth/store/auth_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../utils/locale/app_localization.dart';

class NotificationsScreen extends StatelessWidget {
  final AuthStore _authStore = getIt<AuthStore>();

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: Colors.pink[50],
      appBar: AppBar(
        backgroundColor: Colors.pink[100],
        elevation: 0,
        title: Row(
          children: [
            Icon(Icons.notifications_active_rounded, color: Colors.pink[400]),
            const SizedBox(width: 8),
            Text(
              local.translate('notification_box'),
              style: const TextStyle(
                color: Color(0xFFD81B60),
                fontWeight: FontWeight.bold,
                fontSize: 20,
                fontFamily: 'Nunito',
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.delete_forever_rounded, color: Colors.pink[300]),
            tooltip: local.translate('delete_all_notifications'),
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
                  Icon(Icons.notifications_off_rounded, size: 64, color: Colors.pink[100]),
                  const SizedBox(height: 16),
                  Text(
                    local.translate('no_notifications'),
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.pink[300],
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '💌',
                    style: TextStyle(fontSize: 32),
                  ),
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
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.pink.withOpacity(0.07),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.pink[100],
                    child: Icon(Icons.notifications_rounded, color: Colors.pink[400]),
                  ),
                  title: Text(
                    msg,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      fontFamily: 'Nunito',
                    ),
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
