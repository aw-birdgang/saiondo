import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../../core/widgets/lovely_avatar.dart';
import '../../../core/widgets/lovely_avatar_button.dart';
import '../../../domain/entry/channel.dart';
import '../../../domain/entry/channel_invitation.dart';
import '../../../domain/entry/user.dart';
import '../../../utils/locale/app_localization.dart';
import '../advice/advice.dart';
import '../advice/store/advice_store.dart';
import '../invite/store/channel_invitation_store.dart';

class ChannelContent extends StatelessWidget {
  final User user;
  final Channel? channel;
  final ChannelInvitationStore invitationStore;
  final AdviceStore adviceStore;
  final String? userId;
  final String? assistantId;
  final String? channelId;

  const ChannelContent({
    super.key,
    required this.user,
    required this.channel,
    required this.invitationStore,
    required this.adviceStore,
    required this.userId,
    required this.assistantId,
    required this.channelId,
  });

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);
    final userProfile = "https://randomuser.me/api/portraits/men/32.jpg"; // TODO: 실제 프로필 연동
    final partnerProfile = "https://randomuser.me/api/portraits/women/44.jpg"; // TODO: 실제 프로필 연동
    final dDay = channel != null ? "D+123" : "-"; // TODO: 실제 기념일 연동
    final hasPartner = channel != null;

    return Scaffold(
      backgroundColor: Colors.pink[50],
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 커플 프로필/인사
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
                padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 18),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    LovelyAvatar(imageUrl: userProfile),
                    const SizedBox(width: 16),
                    Icon(Icons.favorite, color: Colors.pink[300], size: 36),
                    const SizedBox(width: 16),
                    hasPartner
                      ? LovelyAvatar(imageUrl: partnerProfile)
                      : Icon(Icons.person_outline, size: 48, color: Colors.grey[400]),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Chip(
                  label: Text(
                    hasPartner
                      ? local.translate('our_anniversary').replaceAll('{0}', dDay)
                      : local.translate('no_partner_yet'),
                    style: TextStyle(
                      color: Colors.pink[800],
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Nunito',
                    ),
                  ),
                  backgroundColor: Colors.pink[100],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: Colors.pink[200]!),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                ),
              ),
              const SizedBox(height: 16),
              // 초대 코드/주요 액션 버튼
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.pink.withOpacity(0.06),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.vpn_key, color: Colors.pink[300]),
                        const SizedBox(width: 8),
                        Text(
                          local.translate('invite_code'),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Nunito'),
                        ),
                        const Spacer(),
                        Flexible(
                          child: Observer(
                            builder: (_) {
                              if (invitationStore.isLoadingInviteCode) {
                                return SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: LoadingAnimationWidget.staggeredDotsWave(
                                    color: Colors.pink,
                                    size: 18,
                                  ),
                                );
                              }
                              return SelectableText(
                                invitationStore.inviteCode ?? local.translate('no_code'),
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.pink[700],
                                  fontFamily: 'Nunito',
                                ),
                                textAlign: TextAlign.right,
                              );
                            },
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy, size: 20, color: Color(0xFFD81B60)),
                          onPressed: invitationStore.inviteCode == null
                              ? null
                              : () {
                            Clipboard.setData(ClipboardData(text: invitationStore.inviteCode!));
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(local.translate('copy_success'))),
                            );
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.refresh, size: 20, color: Colors.blue),
                          tooltip: local.translate('generate_invite_code'),
                          onPressed: userId == null
                              ? null
                              : () => invitationStore.generateInviteCode(channelId!, userId!),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    LovelyActionButton(
                      icon: Icons.chat_bubble_rounded,
                      label: local.translate('start_chat'),
                      color: Colors.pinkAccent,
                      onPressed: hasPartner && userId != null && assistantId != null && channelId != null
                          ? () {
                              Navigator.pushNamed(
                                context,
                                '/chat',
                                arguments: {
                                  'userId': userId,
                                  'assistantId': assistantId,
                                  'channelId': channelId,
                                },
                              );
                            }
                          : null,
                    ),
                    const SizedBox(height: 12),
                    LovelyActionButton(
                      icon: Icons.analytics_rounded,
                      label: local.translate('analysis'),
                      color: Colors.blueAccent,
                      onPressed: hasPartner
                          ? () {
                              Navigator.pushNamed(
                                context,
                                '/analysis',
                                arguments: {
                                  'channelId': channelId,
                                  'userId': userId,
                                },
                              );
                            }
                          : null,
                    ),
                    const SizedBox(height: 12),
                    LovelyActionButton(
                      icon: Icons.history_edu_rounded,
                      label: local.translate('advice_history'),
                      color: Colors.green,
                      onPressed: hasPartner && channelId != null
                          ? () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => AdviceHistoryScreen(channelId: channelId!),
                                ),
                              );
                            }
                          : null,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              // 받은 초대장 목록 + 새로고침 버튼
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    local.translate('received_invitations'),
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: Colors.pink[700],
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.refresh, color: Colors.pink[400]),
                    tooltip: local.translate('refresh'),
                    onPressed: userId == null
                        ? null
                        : () => invitationStore.fetchInvitations(userId!),
                  ),
                ],
              ),
              Observer(
                builder: (_) {
                  if (invitationStore.isLoading) {
                    return Center(
                      child: LoadingAnimationWidget.staggeredDotsWave(
                        color: Colors.pink,
                        size: 24,
                      ),
                    );
                  }
                  if (invitationStore.invitations.isEmpty) {
                    return Center(
                      child: Text(local.translate('no_invitations')),
                    );
                  }
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      ...invitationStore.invitations.map((inv) => Card(
                        child: ListTile(
                          title: Text('${inv.inviterId} → ${inv.inviteeId}'),
                          subtitle: Text('${local.translate('status')}: ${inv.status.name}'),
                          trailing: inv.status == ChannelInvitationStatus.pending
                              ? Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: Icon(Icons.check, color: Colors.green),
                                onPressed: () {
                                  if (userId != null) {
                                    invitationStore.respondToInvitation(inv.id, true, userId!);
                                  }
                                },
                              ),
                              IconButton(
                                icon: Icon(Icons.close, color: Colors.red),
                                onPressed: () {
                                  if (userId != null) {
                                    invitationStore.respondToInvitation(inv.id, false, userId!);
                                  }
                                },
                              ),
                            ],
                          )
                              : null,
                        ),
                      )),
                    ],
                  );
                },
              ),
              const SizedBox(height: 28),
              Text(
                local.translate('today_advice'),
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFD81B60),
                  fontFamily: 'Nunito',
                ),
              ),
              const SizedBox(height: 12),
              Observer(
                builder: (_) {
                  if (adviceStore.isLoading) {
                    return Center(
                      child: LoadingAnimationWidget.staggeredDotsWave(
                        color: Colors.pink,
                        size: 32,
                      ),
                    );
                  }
                  if (!hasPartner) {
                    return Center(
                      child: Text(
                        local.translate('no_partner_advice'),
                        style: const TextStyle(color: Colors.black54, fontSize: 16),
                      ),
                    );
                  }
                  return Text(
                    adviceStore.latestAdvice?.advice ?? local.translate('no_advice_yet'),
                    style: const TextStyle(color: Colors.black87, fontSize: 16),
                  );
                },
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}