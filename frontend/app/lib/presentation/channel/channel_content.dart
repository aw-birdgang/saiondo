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
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

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
    final userProfile = "https://randomuser.me/api/portraits/men/32.jpg";
    final partnerProfile = "https://randomuser.me/api/portraits/women/44.jpg";
    final dDay = channel != null ? "D+123" : "-";
    final hasPartner = channel != null;

    return Scaffold(
      backgroundColor: AppColors.background,
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
                    colors: [AppColors.backgroundLight, AppColors.blueLight],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.heartDark.withOpacity(0.08),
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
                    Icon(Icons.favorite, color: AppColors.heartLight, size: 40),
                    const SizedBox(width: 16),
                    hasPartner
                        ? LovelyAvatar(imageUrl: partnerProfile)
                        : Icon(Icons.person_outline, size: 48, color: AppColors.grey),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              Center(
                child: Chip(
                  label: Text(
                    hasPartner
                        ? (local?.translate('our_anniversary') ?? 'Anniversary').replaceAll('{0}', dDay)
                        : (local?.translate('no_partner_yet') ?? 'No partner yet'),
                    style: AppTextStyles.chip,
                  ),
                  backgroundColor: AppColors.backgroundLight,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: AppColors.heartLight),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                ),
              ),
              const SizedBox(height: 18),
              _buildInviteCodeCard(context, local, hasPartner),
              const SizedBox(height: 28),
              _buildInvitationList(context, local),
              const SizedBox(height: 28),
              _buildTodayAdvice(context, local, hasPartner),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInviteCodeCard(BuildContext context, AppLocalizations? local, bool hasPartner) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.heartDark.withOpacity(0.06),
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
              Icon(Icons.vpn_key, color: AppColors.heartLight),
              const SizedBox(width: 8),
              Text(
                local?.translate('invite_code') ?? 'Invite Code',
                style: AppTextStyles.body.copyWith(fontWeight: FontWeight.bold),
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
                          color: AppColors.textMain,
                          size: 18,
                        ),
                      );
                    }
                    return SelectableText(
                      invitationStore.inviteCode ?? (local?.translate('no_code') ?? 'No code'),
                      style: AppTextStyles.body.copyWith(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.heartAccent,
                      ),
                      textAlign: TextAlign.right,
                    );
                  },
                ),
              ),
              IconButton(
                icon: const Icon(Icons.copy, size: 20, color: AppColors.heartAccent),
                onPressed: invitationStore.inviteCode == null
                    ? null
                    : () {
                        Clipboard.setData(ClipboardData(text: invitationStore.inviteCode!));
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(local?.translate('copy_success') ?? 'Copied!')),
                        );
                      },
              ),
              IconButton(
                icon: const Icon(Icons.refresh, size: 20, color: AppColors.blue),
                tooltip: local?.translate('generate_invite_code') ?? 'Generate',
                onPressed: userId == null
                    ? null
                    : () => invitationStore.generateInviteCode(channelId!, userId!),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildActionButtons(context, local, hasPartner),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context, AppLocalizations? local, bool hasPartner) {
    return Column(
      children: [
        LovelyActionButton(
          icon: Icons.chat_bubble_rounded,
          label: local?.translate('start_chat') ?? 'Start Chat',
          color: AppColors.shadow,
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
          label: local?.translate('analysis') ?? 'Analysis',
          color: AppColors.blue,
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
          label: local?.translate('advice_history') ?? 'Advice History',
          color: AppColors.green,
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
    );
  }

  Widget _buildInvitationList(BuildContext context, AppLocalizations? local) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              local?.translate('received_invitations') ?? 'Received Invitations',
              style: AppTextStyles.body.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.heartAccent,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.refresh, color: AppColors.heartDark),
              tooltip: local?.translate('refresh') ?? 'Refresh',
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
                  color: AppColors.textMain,
                  size: 24,
                ),
              );
            }
            if (invitationStore.invitations.isEmpty) {
              return Center(
                child: Text(local?.translate('no_invitations') ?? 'No invitations'),
              );
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ...invitationStore.invitations.map((inv) => Card(
                  child: ListTile(
                    title: Text('${inv.inviterId} → ${inv.inviteeId}'),
                    subtitle: Text('${local?.translate('status') ?? 'Status'}: ${inv.status.name}'),
                    trailing: inv.status == ChannelInvitationStatus.pending
                        ? Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.check, color: AppColors.green),
                                onPressed: () {
                                  if (userId != null) {
                                    invitationStore.respondToInvitation(inv.id, true, userId!);
                                  }
                                },
                              ),
                              IconButton(
                                icon: const Icon(Icons.close, color: AppColors.error),
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
      ],
    );
  }

  Widget _buildTodayAdvice(BuildContext context, AppLocalizations? local, bool hasPartner) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          local?.translate('today_advice') ?? 'Today\'s Advice',
          style: AppTextStyles.sectionTitle.copyWith(color: AppColors.heartAccent),
        ),
        const SizedBox(height: 12),
        Observer(
          builder: (_) {
            if (adviceStore.isLoading) {
              return Center(
                child: LoadingAnimationWidget.staggeredDotsWave(
                  color: AppColors.textMain,
                  size: 32,
                ),
              );
            }
            if (!hasPartner) {
              return Center(
                child: Text(
                  local?.translate('no_partner_advice') ?? 'Advice is available after you connect with your partner.',
                  style: AppTextStyles.body.copyWith(color: AppColors.black54),
                ),
              );
            }
            return Text(
              adviceStore.latestAdvice?.advice ?? (local?.translate('no_advice_yet') ?? 'No advice yet.'),
              style: AppTextStyles.body.copyWith(color: AppColors.black87),
            );
          },
        ),
      ],
    );
  }
}