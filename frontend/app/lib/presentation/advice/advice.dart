import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:intl/intl.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../../utils/locale/app_localization.dart';
import 'store/advice_store.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class AdviceHistoryScreen extends StatefulWidget {
  final String channelId;
  const AdviceHistoryScreen({super.key, required this.channelId});

  @override
  State<AdviceHistoryScreen> createState() => _AdviceHistoryScreenState();
}

class _AdviceHistoryScreenState extends State<AdviceHistoryScreen> {
  final AdviceStore _store = getIt<AdviceStore>();

  @override
  void initState() {
    super.initState();
    _store.loadAdviceHistory(widget.channelId);
  }

  String formatDate(DateTime date) {
    return DateFormat('yyyy년 MM월 dd일').format(date);
  }

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          local!.translate('advice_history'),
          style: AppTextStyles.sectionTitle.copyWith(color: AppColors.heartAccent),
        ),
        backgroundColor: AppColors.backgroundLight,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.heartAccent),
      ),
      body: Observer(
        builder: (_) {
          if (_store.isLoading) {
            return Center(
              child: LoadingAnimationWidget.staggeredDotsWave(
                color: AppColors.heartAccent,
                size: 40,
              ),
            );
          }
          if (_store.adviceList.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.tips_and_updates, size: 64, color: AppColors.heartLight),
                  const SizedBox(height: 16),
                  Text(
                    local.translate('no_advice_history'),
                    style: AppTextStyles.body.copyWith(color: AppColors.heartAccent, fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    local.translate('advice_history_guide'),
                    style: AppTextStyles.label.copyWith(color: AppColors.blueDark, fontSize: 14),
                  ),
                ],
              ),
            );
          }
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(0),
                    topRight: Radius.circular(0),
                    bottomLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20),
                  ),
                ),
                padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
                child: Row(
                  children: [
                    const Icon(Icons.favorite, color: AppColors.heartAccent),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        local.translate('advice_history_tip'),
                        style: AppTextStyles.body.copyWith(color: AppColors.heartAccent, fontSize: 15),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: _store.adviceList.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 14),
                  itemBuilder: (context, idx) {
                    final advice = _store.adviceList[idx];
                    return Card(
                      elevation: 3,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                      color: AppColors.white,
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 22),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.tips_and_updates, color: AppColors.heartAccent, size: 22),
                                const SizedBox(width: 8),
                                Text(
                                  formatDate(advice.createdAt),
                                  style: AppTextStyles.label.copyWith(
                                    fontSize: 13,
                                    color: AppColors.blueDark,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              advice.advice,
                              style: AppTextStyles.body.copyWith(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: AppColors.heartAccent,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
