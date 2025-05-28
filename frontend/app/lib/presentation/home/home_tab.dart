import 'package:app/presentation/home/store/channel_store.dart';
import 'package:app/presentation/home/store/invite_code_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:mobx/mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/channel.dart';
import '../../domain/entry/user.dart';
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
          return Center(child: Text('채널 정보 오류: ${_channelStore.errorMessage}'));
        }
        final user = _userStore.selectedUser;
        final channel = _channelStore.channel;
        if (user == null) {
          return const Center(child: Text('유저 정보를 불러올 수 없습니다.'));
        }
        return HomeTabContent(
          user: user,
          channel: channel,
          inviteCodeStore: _inviteCodeStore,
          adviceStore: _adviceStore,
          userId: _userStore.userId,
          assistantId: _userStore.assistantId,
          channelId: _userStore.channelId,
          partnerName: _userStore.partnerUser?.name ?? "파트너",
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
    // 실제 데이터가 없으면 기본값 처리
    final userProfile = "https://randomuser.me/api/portraits/men/32.jpg"; // TODO: 실제 프로필 연동
    final partnerProfile = "https://randomuser.me/api/portraits/women/44.jpg"; // TODO: 실제 프로필 연동
    final dDay = channel != null ? "D+123" : "-"; // TODO: 실제 기념일 연동

    return Scaffold(
      backgroundColor: Colors.pink[50],
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: IntrinsicHeight(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // 커플 프로필/인사
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              backgroundImage: NetworkImage(userProfile),
                              radius: 36,
                            ),
                            const SizedBox(width: 16),
                            const Icon(Icons.favorite, color: Colors.pink, size: 36),
                            const SizedBox(width: 16),
                            CircleAvatar(
                              backgroundImage: NetworkImage(partnerProfile),
                              radius: 36,
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Center(
                          child: Text(
                            '${user.name} ❤️ $partnerName',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: Colors.pink[700],
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Center(
                          child: Chip(
                            label: Text('우리의 기념일 $dDay'),
                            backgroundColor: Colors.pink[100],
                            labelStyle: TextStyle(color: Colors.pink[800]),
                          ),
                        ),
                        const SizedBox(height: 32),
                        // 초대 코드/주요 액션 버튼
                        Card(
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          color: Colors.white,
                          elevation: 2,
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.vpn_key, color: Colors.pink),
                                    const SizedBox(width: 8),
                                    const Text('초대코드', style: TextStyle(fontWeight: FontWeight.bold)),
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
                                            inviteCodeStore.inviteCode ?? '코드 없음',
                                            style: TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.pink[700],
                                            ),
                                            textAlign: TextAlign.right,
                                          );
                                        },
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.copy, size: 20),
                                      onPressed: inviteCodeStore.inviteCode == null
                                          ? null
                                          : () {
                                              // Clipboard.setData(ClipboardData(text: inviteCodeStore.inviteCode!));
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                const SnackBar(content: Text('초대코드가 복사되었습니다!')),
                                              );
                                            },
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 20),
                                // 버튼 세로 배치
                                _ActionButton(
                                  icon: Icons.chat,
                                  label: '채팅 시작',
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
                                _ActionButton(
                                  icon: Icons.analytics,
                                  label: '성향분석',
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
                                _ActionButton(
                                  icon: Icons.history,
                                  label: '조언 히스토리',
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
                        ),
                        const SizedBox(height: 24),
                        Text(
                          '오늘의 조언',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.pink[700]),
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
                              adviceStore.latestAdvice?.advice ?? '아직 조언이 없습니다.',
                              style: const TextStyle(color: Colors.black87),
                            );
                          },
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

// 액션 버튼 위젯 추출로 중복 제거
class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onPressed;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      icon: Icon(icon),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        minimumSize: const Size(double.infinity, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      onPressed: onPressed,
    );
  }
}