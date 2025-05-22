import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:intl/intl.dart';

import '../../di/service_locator.dart';
import 'store/advice_store.dart';

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
    return Scaffold(
      appBar: AppBar(
        title: const Text('조언 히스토리'),
        backgroundColor: Colors.blueAccent,
      ),
      body: Observer(
        builder: (_) {
          if (_store.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (_store.adviceList.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.tips_and_updates, size: 64, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  const Text(
                    '아직 조언 히스토리가 없습니다.',
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '관계 분석을 통해 LLM의 조언을 받아보세요!',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
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
                color: Colors.blue[50],
                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                child: const Text(
                  '이전 분석에서 받은 조언들을 모아볼 수 있어요.\n관계 발전에 도움이 되는 피드백을 확인해보세요!',
                  style: TextStyle(fontSize: 15, color: Colors.blueGrey),
                ),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: _store.adviceList.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, idx) {
                    final advice = _store.adviceList[idx];
                    return Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.tips_and_updates, color: Colors.pink[400]),
                                const SizedBox(width: 8),
                                Text(
                                  formatDate(advice.createdAt),
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              advice.advice,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.black87,
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
