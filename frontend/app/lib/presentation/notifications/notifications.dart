import 'package:app/presentation/auth/store/auth_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../utils/locale/app_localization.dart';

class NotificationsScreen extends StatelessWidget {

  final AuthStore _authStore = getIt<AuthStore>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).translate('notification_box')),
        actions: [
          IconButton(
            icon: Icon(Icons.delete),
            onPressed: () {
              _authStore.clearAllPushMessages();
            },
            tooltip: AppLocalizations.of(context).translate('delete_all_notifications'),
          ),
        ],
      ),
      body: Observer(
        builder: (_) {
          if (_authStore.pushMessages.isEmpty) {
            return Center(child: Text(AppLocalizations.of(context).translate('no_notifications')));
          }
          return ListView.separated(
            itemCount: _authStore.pushMessages.length,
            separatorBuilder: (_, __) => Divider(height: 1),
            itemBuilder: (context, index) {
              final msg = _authStore.pushMessages[index];
              return ListTile(
                leading: Icon(Icons.notifications),
                title: Text(msg),
              );
            },
          );
        },
      ),
    );
  }
}
