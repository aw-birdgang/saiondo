import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:mobx/mobx.dart';

import '../../../di/service_locator.dart';
import '../../../utils/locale/app_localization.dart';
import '../../advice/store/advice_store.dart';
import '../../channel/store/channel_store.dart';
import '../../invite/store/channel_invitation_store.dart';
import '../../user/store/user_store.dart';
import 'home_tab_content.dart';

class HomeTabScreen extends StatefulWidget {
  const HomeTabScreen({super.key});
  @override
  State<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends State<HomeTabScreen> {
  final _userStore = getIt<UserStore>();
  final _adviceStore = getIt<AdviceStore>();
  final _channelStore = getIt<ChannelStore>();
  final _invitationStore = getIt<ChannelInvitationStore>();
  ReactionDisposer? _channelReactionDisposer;
  ReactionDisposer? _invitationReactionDisposer;

  @override
  void initState() {
    super.initState();
    _userStore.initUser();

    _channelReactionDisposer = reaction<String?>(
          (_) => _userStore.channelId,
          (channelId) {
        if (channelId != null) {
          _adviceStore.loadAdviceHistory(channelId);
          if (_userStore.userId != null) {
            _invitationStore.generateInviteCode(channelId, _userStore.userId!);
          }
          _channelStore.fetchChannel(channelId);

          // 파트너 정보도 채널 변경 시마다 자동 로드
          final user = _userStore.selectedUser;
          final channel = _channelStore.channel;
          if (user != null && channel != null) {
            String? partnerUserId;
            if (channel.user1Id == user.id) {
              partnerUserId = channel.user2Id;
            } else if (channel.user2Id == user.id) {
              partnerUserId = channel.user1Id;
            }
            if (partnerUserId != null) {
              _userStore.loadPartnerUser(partnerUserId);
            }
          }
        }
      },
    );

    // 로그인 유저의 초대장 목록 불러오기
    _invitationReactionDisposer = reaction<String?>(
          (_) => _userStore.userId,
          (userId) {
        if (userId != null) {
          _invitationStore.fetchInvitations(userId);
        }
      },
      fireImmediately: true,
    );
  }

  @override
  void dispose() {
    _channelReactionDisposer?.call();
    _invitationReactionDisposer?.call();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (_userStore.isLoading || _channelStore.isLoading) {
          return Center(
            child: LoadingAnimationWidget.staggeredDotsWave(
              color: Colors.pink,
              size: 40,
            ),
          );
        }
        if (_channelStore.errorMessage != null) {
          return Center(
            child: Text(
              AppLocalizations.of(context)
                  .translate('channel_info_error')
                  .replaceAll('{0}', _channelStore.errorMessage ?? ''),
            ),
          );
        }
        final user = _userStore.selectedUser;
        final channel = _channelStore.channel;
        if (user == null) {
          return Center(
            child: Text(AppLocalizations.of(context).translate('no_user')),
          );
        }
        return HomeTabContent(
          user: user,
          channel: channel,
          invitationStore: _invitationStore,
          adviceStore: _adviceStore,
          userId: _userStore.userId,
          assistantId: _userStore.assistantId,
          channelId: _userStore.channelId,
          partnerName: _userStore.partnerUser?.name ??
              AppLocalizations.of(context).translate('partner'),
        );
      },
    );
  }
}