import 'package:app/presentation/home/store/channel_store.dart';
import 'package:app/presentation/home/store/invite_code_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:mobx/mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/channel.dart';
import '../../domain/entry/user.dart';
import '../../utils/locale/app_localization.dart';
import '../advice/advice.dart';
import '../advice/store/advice_store.dart';
import '../user/store/user_store.dart';

class HomeTabScreen extends StatefulWidget {
  const HomeTabScreen({super.key});

  @override
  State<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends State<HomeTabScreen> {
  final _userStore = getIt<UserStore>();
  final _adviceStore = getIt<AdviceStore>();
  final _inviteCodeStore = getIt<InviteCodeStore>();
  final _channelStore = getIt<ChannelStore>();
  ReactionDisposer? _channelReactionDisposer;

  @override
  void initState() {
    super.initState();
    _userStore.initUser();

    _channelReactionDisposer = reaction<String?>(
      (_) => _userStore.channelId,
      (channelId) {
        if (channelId != null) {
          _adviceStore.loadAdviceHistory(channelId);
          _inviteCodeStore.generateInviteCode(channelId);
          _channelStore.fetchChannel(channelId);
        }
      },
    );
  }

  @override
  void dispose() {
    _channelReactionDisposer?.call();
    super.dispose();
  }

  @override
  void didUpdateWidget(covariant HomeTabScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    _loadPartnerIfNeeded();
  }

  void _loadPartnerIfNeeded() {
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
          return Center(child: Text(
            AppLocalizations.of(context)
              .translate('channel_info_error')
              .replaceAll('{0}', _channelStore.errorMessage ?? ''),
          ));
        }
        final user = _userStore.selectedUser;
        final channel = _channelStore.channel;
        if (user == null) {
          return Center(child: Text(AppLocalizations.of(context).translate('no_user'),));
        }
        return HomeTabContent(
          user: user,
          channel: channel,
          inviteCodeStore: _inviteCodeStore,
          adviceStore: _adviceStore,
          userId: _userStore.userId,
          assistantId: _userStore.assistantId,
          channelId: _userStore.channelId,
          partnerName: _userStore.partnerUser?.name ?? AppLocalizations.of(context).translate('partner'),
        );
      },
    );
  }
}

class HomeTabContent extends StatelessWidget {
  final User user;
  final Channel? channel;
  final InviteCodeStore inviteCodeStore;
  final AdviceStore adviceStore;
  final String? userId;
  final String? assistantId;
  final String? channelId;
  final String partnerName;

  const HomeTabContent({
    super.key,
    required this.user,
    required this.channel,
    required this.inviteCodeStore,
    required this.adviceStore,
    required this.userId,
    required this.assistantId,
    required this.channelId,
    required this.partnerName,
  });

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);
    final userProfile = "https://randomuser.me/api/portraits/men/32.jpg"; // TODO: 실제 프로필 연동
    final partnerProfile = "https://randomuser.me/api/portraits/women/44.jpg"; // TODO: 실제 프로필 연동
    final dDay = channel != null ? "D+123" : "-"; // TODO: 실제 기념일 연동

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
                    _LovelyAvatar(imageUrl: userProfile),
                    const SizedBox(width: 16),
                    Icon(Icons.favorite, color: Colors.pink[300], size: 36),
                    const SizedBox(width: 16),
                    _LovelyAvatar(imageUrl: partnerProfile),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Chip(
                  label: Text(
                    local.translate('our_anniversary').replaceAll('{0}', dDay),
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
                              if (inviteCodeStore.isLoading) {
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
                                inviteCodeStore.inviteCode ?? local.translate('no_code'),
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
                          onPressed: inviteCodeStore.inviteCode == null
                              ? null
                              : () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text(local.translate('copy_success'))),
                                  );
                                },
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    _LovelyActionButton(
                      icon: Icons.chat_bubble_rounded,
                      label: local.translate('start_chat'),
                      color: Colors.pinkAccent,
                      onPressed: (userId == null || assistantId == null || channelId == null)
                          ? null
                          : () {
                              Navigator.pushNamed(
                                context,
                                '/chat',
                                arguments: {
                                  'userId': userId,
                                  'assistantId': assistantId,
                                  'channelId': channelId,
                                },
                              );
                            },
                    ),
                    const SizedBox(height: 12),
                    _LovelyActionButton(
                      icon: Icons.analytics_rounded,
                      label: local.translate('analysis'),
                      color: Colors.blueAccent,
                      onPressed: () {
                        Navigator.pushNamed(
                          context,
                          '/analysis',
                          arguments: {
                            'channelId': channelId,
                            'userId': userId,
                          },
                        );
                      },
                    ),
                    const SizedBox(height: 12),
                    _LovelyActionButton(
                      icon: Icons.history_edu_rounded,
                      label: local.translate('advice_history'),
                      color: Colors.green,
                      onPressed: channelId == null
                          ? null
                          : () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => AdviceHistoryScreen(channelId: channelId!),
                                ),
                              );
                            },
                    ),
                  ],
                ),
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

// 러블리한 아바타 위젯
class _LovelyAvatar extends StatelessWidget {
  final String imageUrl;
  const _LovelyAvatar({required this.imageUrl});
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [Colors.pinkAccent, Colors.blueAccent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: CircleAvatar(
        backgroundImage: NetworkImage(imageUrl),
        backgroundColor: Colors.transparent,
        radius: 36,
      ),
    );
  }
}

// 러블리한 액션 버튼
class _LovelyActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onPressed;

  const _LovelyActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      icon: Icon(icon, size: 22, color: Colors.white),
      label: Padding(
        padding: const EdgeInsets.symmetric(vertical: 2.0),
        child: Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            fontFamily: 'Nunito',
            color: Colors.white,
          ),
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        minimumSize: const Size(double.infinity, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 4,
        shadowColor: color.withOpacity(0.2),
      ),
      onPressed: onPressed,
    );
  }
}