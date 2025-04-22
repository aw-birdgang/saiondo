import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import '../../../domain/repositories/daily_tip/daily_tip_repository.dart';
import '../../../models/daily_tip.dart';

class DailyTipRepositoryImpl implements DailyTipRepository {
  final FirebaseFirestore _firestore;

  DailyTipRepositoryImpl(this._firestore);

  @override
  Future<DailyTip> getDailyTip({
    required String userId,
    required String partnerId,
    required List<String> recentEmotions,
    required double averageTemperature,
  }) async {
    try {
      String category = _determineTipCategory(
        recentEmotions,
        averageTemperature,
      );

      final querySnapshot = await _firestore
          .collection('daily_tips')
          .where('category', isEqualTo: category)
          .orderBy('createdAt', descending: true)
          .limit(1)
          .get();

      if (querySnapshot.docs.isEmpty) {
        // 기본 팁 반환
        return DailyTip(
          id: 'default',
          title: '오늘의 연애 팁',
          content: '서로를 이해하고 배려 하는 마음을 가지세요.',
          category: 'general',
          priority: 1,
          createdAt: Timestamp.now(),
        );
      }

      // 랜덤하게 하나의 팁 선택
      final randomIndex = DateTime.now().millisecondsSinceEpoch % querySnapshot.docs.length;
      final randomDoc = querySnapshot.docs[randomIndex];
      final data = randomDoc.data();

      // AI 조언 데이터 구조 확인
      final aiAdvice = data['aiAdvice'] ?? {};
      final content = aiAdvice['content'] ?? '';
      final contentLines = content.toString().split('\n');

      return DailyTip(
        id: randomDoc.id,
        title: contentLines.isNotEmpty ? contentLines.first.trim() : '오늘의 연애 팁',
        content: content,
        category: data['category'] ?? 'general',
        createdAt: data['createdAt'] is Timestamp
            ? data['createdAt']
            : Timestamp.now(),
        priority: 1,
      );
    } catch (e) {
      debugPrint('getDailyTip 에러: $e');
      rethrow;
    }
  }

  String _determineTipCategory(
      List<String> recentEmotions,
      double averageTemperature,
      ) {
    if (recentEmotions.isEmpty) return 'general';

    final latestEmotion = recentEmotions.first;

    if (averageTemperature < 30) {
      return 'mood_improvement';  // 기분 개선
    } else if (averageTemperature > 70) {
      return 'relationship_growth';  // 관계 성장
    } else if (latestEmotion.contains('😢') || latestEmotion.contains('😔')) {
      return 'emotional_support';  // 감정 지원
    } else if (latestEmotion.contains('😡') || latestEmotion.contains('😤')) {
      return 'conflict_resolution';  // 갈등 해결
    } else if (latestEmotion.contains('😊') || latestEmotion.contains('😄')) {
      return 'relationship_growth';  // 긍정적 감정 강화
    }
    return 'general';
  }
}