import 'package:app/presentation/auth/store/auth_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';

class NotificationsScreen extends StatelessWidget {

  final AuthStore _authStore = getIt<AuthStore>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('알림함'),
        actions: [
          IconButton(
            icon: Icon(Icons.delete),
            onPressed: () {
              _authStore.clearAllPushMessages();
            },
            tooltip: '모든 알림 삭제',
          ),
        ],
      ),
      body: Observer(
        builder: (_) {
          if (_authStore.pushMessages.isEmpty) {
            return Center(child: Text('알림이 없습니다.'));
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
