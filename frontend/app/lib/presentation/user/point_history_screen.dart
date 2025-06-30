import 'package:saiondo/presentation/user/store/point_history_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:intl/intl.dart';

import '../../di/service_locator.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

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
        title: const Text('포인트 내역', style: AppTextStyles.sectionTitle),
        backgroundColor: AppColors.backgroundLight,
        elevation: 0,
      ),
      backgroundColor: AppColors.background,
      body: Observer(
        builder: (_) {
          if (store.isLoading) {
            return const Center(child: CircularProgressIndicator(color: AppColors.loading));
          }
          if (store.histories.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.sentiment_dissatisfied, color: AppColors.heartLight, size: 48),
                  const SizedBox(height: 12),
                  const Text(
                    '포인트 내역이 없습니다.',
                    style: AppTextStyles.body,
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
                  color: isEarn ? AppColors.backgroundLight : AppColors.blueLight,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.heartDark.withOpacity(0.08),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: isEarn ? AppColors.heartLight : AppColors.blueDark,
                    child: Icon(
                      isEarn ? Icons.favorite : Icons.shopping_bag,
                      color: AppColors.white,
                    ),
                  ),
                  title: Text(
                    getTypeLabel(h.type),
                    style: AppTextStyles.body.copyWith(
                      fontWeight: FontWeight.bold,
                      color: isEarn ? AppColors.heartAccent : AppColors.blueDark,
                    ),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (h.description != null && h.description!.isNotEmpty)
                        Text(
                          h.description!,
                          style: AppTextStyles.label,
                        ),
                      Text(
                        dateFormat.format(h.createdAt),
                        style: AppTextStyles.label.copyWith(fontSize: 12),
                      ),
                    ],
                  ),
                  trailing: Text(
                    '${isEarn ? '+' : ''}${h.amount}',
                    style: AppTextStyles.point.copyWith(
                      color: isEarn ? AppColors.textMain : AppColors.blue,
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
