import 'package:flutter/material.dart';

class EmptyEmotionState extends StatelessWidget {
  const EmptyEmotionState({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: 24),
        child: Text("아직 감정 기록이 없습니다."),
      ),
    );
  }
}