import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../../di/service_locator.dart';
import '../../advice/store/advice_store.dart';
import '../../auth/auth_guard.dart';
import '../../channel/channel_content.dart';
import '../../channel/store/channel_store.dart';
import '../../invite/store/channel_invitation_store.dart';
import '../../user/store/user_store.dart';

class ChannelTabScreen extends StatefulWidget {
  const ChannelTabScreen({super.key});

  @override
  State<ChannelTabScreen> createState() => _ChannelTabScreenState();
}

class _ChannelTabScreenState extends State<ChannelTabScreen> {
  late final UserStore userStore = getIt<UserStore>();
  late final ChannelStore channelStore = getIt<ChannelStore>();
  late final ChannelInvitationStore invitationStore =
      getIt<ChannelInvitationStore>();
  late final AdviceStore adviceStore = getIt<AdviceStore>();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = userStore.selectedUser;
      print('[ChannelTabScreen] initState > user :: ${user}');
      if (user != null) {
        channelStore.fetchChannelsByUserId(user.id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AuthGuard(
      child: _buildChannelTabContent(context),
    );
  }

  Widget _buildChannelTabContent(BuildContext context) {
    final user = userStore.selectedUser;
    if (user == null) {
      return const Center(child: Text('로그인이 필요합니다.'));
    }

    return Observer(
      builder: (_) {
        if (channelStore.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (channelStore.currentChannel != null) {
          // 참여 중인 채널이 있으면 채널 기능 제공
          return Column(
            children: [
              Expanded(
                child: ChannelContent(
                  user: user,
                  channel: channelStore.currentChannel,
                  invitationStore: invitationStore,
                  adviceStore: adviceStore,
                  userId: user.id,
                  assistantId: userStore.selectedUser?.assistantId ?? '',
                  channelId: channelStore.currentChannel!.id,
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.exit_to_app),
                  label: const Text('채널 나가기'),
                  onPressed: () async {
                    await channelStore.leaveChannel(user.id);
                    await channelStore.fetchCurrentChannel(user.id);
                    await channelStore.fetchAvailableChannels();
                  },
                ),
              ),
            ],
          );
        }
        // 참여 중인 채널이 없으면 채널 목록
        return RefreshIndicator(
          onRefresh: () => channelStore.fetchAvailableChannels(),
          child: ListView(
            children: [
              const Padding(
                padding: EdgeInsets.all(16),
                child: Text('참여 가능한 채널 목록',
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
              ...channelStore.availableChannels.map((channel) => Card(
                    child: ListTile(
                      title: Text('채널 코드: ${channel.inviteCode ?? "없음"}'),
                      subtitle: Text('상태: ${channel.status}'),
                      trailing: ElevatedButton(
                        child: const Text('참여'),
                        onPressed: channel.inviteCode == null
                            ? null
                            : () async {
                                final success = await channelStore.joinByInvite(
                                    channel.inviteCode!, user.id);
                                if (success) {
                                  await channelStore
                                      .fetchCurrentChannel(user.id);
                                  await channelStore.fetchAvailableChannels();
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('채널 참여 실패')),
                                  );
                                }
                              },
                      ),
                    ),
                  )),
            ],
          ),
        );
      },
    );
  }
}
