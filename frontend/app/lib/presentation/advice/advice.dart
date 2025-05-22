import 'package:app/presentation/advice/store/advice_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('조언 히스토리'),
        backgroundColor: Colors.blueAccent,
      ),
      body: Observer(
        builder: (_) {
          if (_store.isLoading) {
            return Center(child: CircularProgressIndicator());
          }
          if (_store.adviceList.isEmpty) {
            return Center(child: Text('아직 조언 히스토리가 없습니다.'));
          }
          return ListView.separated(
            itemCount: _store.adviceList.length,
            separatorBuilder: (_, __) => Divider(),
            itemBuilder: (context, idx) {
              final advice = _store.adviceList[idx];
              return ListTile(
                leading: Icon(Icons.tips_and_updates, color: Colors.pink),
                title: Text(advice.advice),
                subtitle: Text(
                  '${advice.createdAt.year}-${advice.createdAt.month.toString().padLeft(2, '0')}-${advice.createdAt.day.toString().padLeft(2, '0')}',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
