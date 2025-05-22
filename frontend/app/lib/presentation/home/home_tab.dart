import 'package:app/presentation/home/store/invite_code_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/user/user.dart';
import '../advice/advice.dart';
import '../user/store/user_store.dart';

class HomeTabScreen extends StatefulWidget {
  const HomeTabScreen({super.key});

  @override
  State<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends State<HomeTabScreen> {
  final _userStore = getIt<UserStore>();

  @override
  void initState() {
    super.initState();
    _userStore.initUser?.call();
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (_userStore.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        final user = _userStore.selectedUser;
        if (user == null) {
          return const Center(child: Text('유저 정보를 불러올 수 없습니다.'));
        }
        return HomeTabContent(
          user: user,
          assistantId: _userStore.assistantId,
          channelId: _userStore.channelId,
          userId: _userStore.userId,
        );
      },
    );
  }
}

class HomeTabContent extends StatelessWidget {
  final User user;
  final String? assistantId;
  final String? channelId;
  final String? userId;

  final InviteCodeStore _inviteCodeStore = getIt<InviteCodeStore>();

  HomeTabContent({
    super.key,
    required this.user,
    required this.assistantId,
    required this.channelId,
    required this.userId,
  });

  @override
  Widget build(BuildContext context) {
    // 샘플 데이터
    final String partnerName = "지은";
    final String userProfile = "https://randomuser.me/api/portraits/men/32.jpg";
    final String partnerProfile = "https://randomuser.me/api/portraits/women/44.jpg";
    final String mbti1 = "INFP";
    final String mbti2 = "ESTJ";
    final int matchPercent = 72;
    final List<String> keywords = ["사랑", "신뢰", "여행"];
    final String todayAdvice = "오늘은 서로의 장점을 칭찬해 주세요!";
    final String dDay = "D+123";
    final String inviteCode = "ABCD-1234";

    return Scaffold(
      backgroundColor: Colors.pink[50],
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight,
                ),
                child: IntrinsicHeight(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // 1. 커플 프로필/인사
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              backgroundImage: NetworkImage(userProfile),
                              radius: 36,
                            ),
                            SizedBox(width: 16),
                            Icon(Icons.favorite, color: Colors.pink, size: 36),
                            SizedBox(width: 16),
                            CircleAvatar(
                              backgroundImage: NetworkImage(partnerProfile),
                              radius: 36,
                            ),
                          ],
                        ),
                        SizedBox(height: 16),
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
                        SizedBox(height: 8),
                        Center(
                          child: Chip(
                            label: Text('우리의 기념일 $dDay'),
                            backgroundColor: Colors.pink[100],
                            labelStyle: TextStyle(color: Colors.pink[800]),
                          ),
                        ),

                        // 초대 코드/주요 액션 버튼
                        SizedBox(height: 32),
                        Card(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16)),
                          color: Colors.white,
                          elevation: 2,
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.vpn_key, color: Colors.pink),
                                    SizedBox(width: 8),
                                    Text('초대코드', style: TextStyle(fontWeight: FontWeight.bold)),
                                    Spacer(),
                                    Flexible(
                                      child: SelectableText(
                                        inviteCode,
                                        style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.pink[700]),
                                        textAlign: TextAlign.right,
                                      ),
                                    ),
                                    IconButton(
                                      icon: Icon(Icons.copy, size: 20),
                                      onPressed: () {
                                        // Clipboard.setData(ClipboardData(text: inviteCode));
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('초대코드가 복사되었습니다!')),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                                SizedBox(height: 20),
                                // 버튼 세로 배치
                                ElevatedButton.icon(
                                  icon: Icon(Icons.chat),
                                  label: Text('채팅 시작'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.pinkAccent,
                                    minimumSize: Size(double.infinity, 48),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
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
                                SizedBox(height: 12),
                                ElevatedButton.icon(
                                  icon: Icon(Icons.analytics),
                                  label: Text('성향분석'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blueAccent,
                                    minimumSize: Size(double.infinity, 48),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
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
                                SizedBox(height: 12),
                                ElevatedButton.icon(
                                  icon: Icon(Icons.history),
                                  label: Text('조언 히스토리'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.green,
                                    minimumSize: Size(double.infinity, 48),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                  onPressed: () {
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

                        // 오늘의 조언
                        SizedBox(height: 24),
                        Card(
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16)),
                          color: Colors.blue[50],
                          elevation: 2,
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Row(
                              children: [
                                Icon(Icons.lightbulb, color: Colors.orange, size: 32),
                                SizedBox(width: 16),
                                Expanded(
                                  child: Text(
                                    todayAdvice,
                                    style: TextStyle(fontSize: 16),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        // 5. 여백
                        SizedBox(height: 32),
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