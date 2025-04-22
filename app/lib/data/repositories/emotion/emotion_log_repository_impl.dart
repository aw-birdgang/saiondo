import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../domain/repositories/emotion/emotion_log_repository.dart';
import '../../../models/emotion_log.dart';

class EmotionLogRepositoryImpl implements EmotionLogRepository {
  final FirebaseFirestore _firestore;
  static const String collectionPath = 'emotion_logs';

  EmotionLogRepositoryImpl(this._firestore,);

  @override
  Future<List<EmotionLog>> getEmotionLogs(
      String userId, DateTime startDate, DateTime endDate) async {
    try {
      // 날짜 문자열로 변환 (yyyy-MM-dd 형식)
      String startDateStr = _formatDate(startDate);
      String endDateStr = _formatDate(endDate);

      // Firestore 쿼리 실행
      final querySnapshot = await _firestore
          .collection(collectionPath)
          .where('userId', isEqualTo: userId)
          .where('date', isGreaterThanOrEqualTo: startDateStr)
          .where('date', isLessThanOrEqualTo: endDateStr)
          .orderBy('date', descending: true)
          .get();

      // 결과를 EmotionLog 리스트로 변환
      return querySnapshot.docs
          .map((doc) => EmotionLog.fromFirestore(doc))
          .toList();
    } catch (e) {
      print('getEmotionLogs 에러: $e');
      return [];
    }
  }
  
  @override
  Future<List<EmotionLog>> getRecentEmotionLogs(String userId, int limit) async {
    debugPrint('\n=== Repository: getRecentEmotionLogs 시작 ===');
    debugPrint('조회 조건 - userId: $userId, limit: $limit');
    try {
      final querySnapshot = await _firestore
          .collection(collectionPath)
          .where('userId', isEqualTo: userId)
          .orderBy('createdAt', descending: true)
          .limit(limit)
          .get();
      debugPrint('Firestore 쿼리 결과: ${querySnapshot.docs.length}개의 문서');
      return querySnapshot.docs.map((doc) {
        try {
          final log = EmotionLog.fromFirestore(doc);
          debugPrint('감정 로그 변환 성공: ${log.toString()}');
          return log;
        } catch (e) {
          debugPrint('감정 로그 변환 실패 - 문서 ID: ${doc.id}');
          debugPrint('에러: $e');
          debugPrint('원본 데이터: ${doc.data()}');
          rethrow;
        }
      }).toList();
    } catch (e) {
      print('getRecentEmotionLogs 에러: $e');
      return [];
    }
  }
  
  @override
  Future<EmotionLog?> getEmotionLogByDate(String userId, DateTime date) async {
    try {
      final dateString = DateFormat('yyyy-MM-dd').format(date);
      
      final querySnapshot = await _firestore
          .collection(collectionPath)
          .where('userId', isEqualTo: userId)
          .where('date', isEqualTo: dateString)
          .limit(1)
          .get();
      
      if (querySnapshot.docs.isEmpty) {
        return null;
      }
      
      return EmotionLog.fromFirestore(querySnapshot.docs.first);
    } catch (e) {
      print('특정 날짜 감정 로그 조회 중 오류 발생: $e');
      return null;
    }
  }
  
  @override
  Future<bool> saveEmotionLog(EmotionLog log) async {
    try {
      // id가 지정되어 있으면 해당 ID로 저장, 없으면 자동 생성
      final docRef = log.id.isNotEmpty
          ? _firestore.collection(collectionPath).doc(log.id)
          : _firestore.collection(collectionPath).doc();

      await docRef.set(log.toFirestore());
      return true;
    } catch (e) {
      print('saveEmotionLog 에러: $e');
      return false;
    }
  }
  
  @override
  Future<bool> updateEmotionLog(EmotionLog log) async {
    try {
      if (log.id.isEmpty) {
        print('updateEmotionLog 실패: ID가 없음');
        return false;
      }

      await _firestore
          .collection(collectionPath)
          .doc(log.id)
          .update(log.toFirestore());
      return true;
    } catch (e) {
      print('updateEmotionLog 에러: $e');
      return false;
    }
  }
  
  @override
  Future<bool> deleteEmotionLog(String logId) async {
    try {
      await _firestore.collection(collectionPath).doc(logId).delete();
      return true;
    } catch (e) {
      print('deleteEmotionLog 에러: $e');
      return false;
    }
  }
  
  // 날짜를 yyyy-MM-dd 형식의 문자열로 변환하는 유틸리티 메서드
  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }
} 