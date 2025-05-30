import 'package:app/presentation/user/store/point_history_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:intl/intl.dart';

import '../../di/service_locator.dart';

class PointHistoryScreen extends StatefulWidget {
  final String userId;
  const PointHistoryScreen({super.key, required this.userId});

  @override
  State<PointHistoryScreen> createState() => _PointHistoryScreenState();
}

class _PointHistoryScreenState extends State<PointHistoryScreen> {
  final store = getIt<PointHistoryStore>();
  late final DateFormat dateFormat;

  @override
  void initState() {
    super.initState();
    dateFormat = DateFormat('yyyy.MM.dd HH:mm');
    store.loadPointHistory(widget.userId);
  }

  String getTypeLabel(String type) {
    switch (type) {
      case 'MISSION_REWARD':
        return '미션 보상';
      case 'PROFILE_UPDATE':
        return '프로필 업데이트';
      case 'CHAT_USE':
        return 'AI 대화 사용';
      case 'ADMIN_ADJUST':
        return '관리자 조정';
      default:
        return type;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('포인트 내역'),
        backgroundColor: Colors.pink[100],
        elevation: 0,
      ),
      backgroundColor: Colors.pink[50],
      body: Observer(
        builder: (_) {
          if (store.isLoading) {
            return const Center(child: CircularProgressIndicator(color: Colors.pink));
          }
          if (store.histories.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.sentiment_dissatisfied, color: Colors.pink[200], size: 48),
                  const SizedBox(height: 12),
                  const Text(
                    '포인트 내역이 없습니다.',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: store.histories.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, idx) {
              final h = store.histories[idx];
              final isEarn = h.amount > 0;
              return Container(
                decoration: BoxDecoration(
                  color: isEarn ? Colors.pink[100] : Colors.blue[50],
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.pink.withOpacity(0.08),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: isEarn ? Colors.pink[200] : Colors.blue[200],
                    child: Icon(
                      isEarn ? Icons.favorite : Icons.shopping_bag,
                      color: Colors.white,
                    ),
                  ),
                  title: Text(
                    getTypeLabel(h.type),
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: isEarn ? Colors.pink[700] : Colors.blue[700],
                    ),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (h.description != null && h.description!.isNotEmpty)
                        Text(
                          h.description!,
                          style: const TextStyle(fontSize: 13),
                        ),
                      Text(
                        dateFormat.format(h.createdAt),
                        style: const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                  trailing: Text(
                    '${isEarn ? '+' : ''}${h.amount}',
                    style: TextStyle(
                      color: isEarn ? Colors.pink : Colors.blue,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
