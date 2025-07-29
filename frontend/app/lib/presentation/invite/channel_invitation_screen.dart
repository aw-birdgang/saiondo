import 'package:saiondo/presentation/invite/store/channel_invitation_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/channel_invitation.dart';
import '../user/store/user_store.dart';

class ChannelInvitationScreen extends StatefulWidget {
  @override
  State<ChannelInvitationScreen> createState() =>
      _ChannelInvitationScreenState();
}

class _ChannelInvitationScreenState extends State<ChannelInvitationScreen> {
  final ChannelInvitationStore _invitationStore =
      getIt<ChannelInvitationStore>();
  final userStore = getIt<UserStore>();

  @override
  void initState() {
    super.initState();
    // 로그인 유저의 id로 초대장 목록을 불러옴
    if (userStore.userId != null) {
      _invitationStore.fetchInvitations(userStore.userId!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('채널 초대장')),
      body: Observer(
        builder: (_) {
          if (_invitationStore.isLoading) {
            return Center(child: CircularProgressIndicator());
          }
          if (_invitationStore.invitations.isEmpty) {
            return Center(child: Text('받은 초대장이 없습니다.'));
          }
          return ListView.builder(
            itemCount: _invitationStore.invitations.length,
            itemBuilder: (context, idx) {
              final inv = _invitationStore.invitations[idx];
              return Card(
                child: ListTile(
                  title: Text('초대: ${inv.inviterId} → ${inv.inviteeId}'),
                  subtitle: Text('상태: ${inv.status.name}'),
                  trailing: inv.status == ChannelInvitationStatus.pending
                      ? Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: Icon(Icons.check, color: Colors.green),
                              onPressed: () {
                                if (userStore.userId != null) {
                                  _invitationStore.respondToInvitation(
                                      inv.id, true, userStore.userId!);
                                }
                              },
                            ),
                            IconButton(
                              icon: Icon(Icons.close, color: Colors.red),
                              onPressed: () {
                                if (userStore.userId != null) {
                                  _invitationStore.respondToInvitation(
                                      inv.id, false, userStore.userId!);
                                }
                              },
                            ),
                          ],
                        )
                      : null,
                ),
              );
            },
          );
        },
      ),
    );
  }
}
