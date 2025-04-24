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
      debugPrint('getDailyTip 시작 - 카테고리: $category');

      final querySnapshot = await _firestore
          .collection('daily_tips')
          .orderBy('createdAt', descending: true)
          .limit(1)
          .get();

      debugPrint('Firestore 쿼리 결과: ${querySnapshot.docs.length} 개의 문서');

      if (querySnapshot.docs.isEmpty) {
        debugPrint('daily_tips 컬렉션에 문서가 없음');
        return _getDefaultTip();
      }

      final doc = querySnapshot.docs.first;  // limit(1)이므로 첫 번째 문서만 사용
      final data = doc.data();

      debugPrint('문서 데이터: ${data.toString()}');

      try {
        final aiAdvice = data['aiAdvice'];
        if (aiAdvice == null) {
          debugPrint('aiAdvice 필드가 없음');
          return _getDefaultTip();
        }

        final content = aiAdvice['content'];
        if (content == null) {
          debugPrint('content 필드가 없음');
          return _getDefaultTip();
        }

        final contentLines = content.toString().split('\n');
        final createdAtData = data['createdAt'];

        debugPrint('데이터 파싱 시작');
        debugPrint('ID: ${doc.id}');
        debugPrint('Content 첫 줄: ${contentLines.first}');
        debugPrint('Category: ${data['category']}');
        debugPrint('CreatedAt 데이터: $createdAtData');

        final timestamp = _parseTimestamp(createdAtData);

        return DailyTip(
          id: doc.id,
          title: contentLines.isNotEmpty ? contentLines.first.trim() : '오늘의 연애 팁',
          content: content.toString(),
          category: data['category'] ?? 'general',
          createdAt: timestamp,
          priority: 1,
        );
      } catch (parseError) {
        debugPrint('데이터 파싱 중 에러: $parseError');
        debugPrint('원본 데이터: $data');
        return _getDefaultTip();
      }
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

  // Timestamp 파싱 헬퍼 메서드
  Timestamp _parseTimestamp(dynamic timestampData) {
    try {
      if (timestampData is Timestamp) {
        return timestampData;
      }

      if (timestampData is Map) {
        final seconds = timestampData['_seconds'];
        final nanoseconds = timestampData['_nanoseconds'];

        if (seconds != null && nanoseconds != null) {
          return Timestamp(seconds, nanoseconds);
        }
      }

      debugPrint('유효하지 않은 timestamp 데이터: $timestampData');
      return Timestamp.now();
    } catch (e) {
      debugPrint('Timestamp 파싱 에러: $e');
      return Timestamp.now();
    }
  }

  // 기본 팁 반환 메서드
  DailyTip _getDefaultTip() {
    return DailyTip(
      id: 'default',
      title: '오늘의 기본 연애 팁',
      content: '''
1. 감정 분석:
서로를 이해하고 배려하는 마음이 중요합니다.

2. 파트너의 관점:
상대방의 입장에서 생각해보는 것이 도움이 됩니다.

3. 실천 방안:
- 작은 것부터 서로를 배려하는 습관을 들여보세요
- 대화할 때는 경청하는 자세를 가져보세요
- 서로의 장점을 자주 이야기해주세요

4. 오늘의 실천 팁:
오늘 하루 파트너의 좋은 점을 하나 이야기해주세요.''',
      category: 'general',
      createdAt: Timestamp.now(),
      priority: 1,
    );
  }
}