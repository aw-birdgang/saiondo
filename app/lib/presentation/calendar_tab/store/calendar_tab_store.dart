import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' as auth;
import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import 'package:mobx/mobx.dart';

import '../../../domain/repositories/emotion/emotion_log_repository.dart';
import '../../../domain/usecases/emotion/get_emotion_logs_usecase.dart';
import '../../../domain/usecases/emotion/save_emotion_log_usecase.dart';
import '../../../models/emotion_log.dart';

part 'calendar_tab_store.g.dart';

class CalendarTabStore = _CalendarTabStore with _$CalendarTabStore;

abstract class _CalendarTabStore with Store {
  final GetEmotionLogsUseCase _getEmotionLogsUseCase;
  final SaveEmotionLogUseCase _saveEmotionLogUseCase;
  final auth.FirebaseAuth _auth;
  final FirebaseFirestore _firestore;

  _CalendarTabStore(
    this._getEmotionLogsUseCase,
    this._saveEmotionLogUseCase, {
    required FirebaseFirestore firestore,
    required auth.FirebaseAuth auth,
  }) : _auth = auth,
      _firestore = firestore;


  @observable
  bool isLoading = false;

  @observable
  DateTime currentMonth = DateTime.now();

  @observable
  DateTime? selectedDate;

  @observable
  ObservableMap<String, EmotionLog> emotionLogs = ObservableMap<String, EmotionLog>();

  @action
  void selectDate(DateTime date) {
    selectedDate = date;
  }

  @action
  void changeMonth(int delta) {
    currentMonth = DateTime(currentMonth.year, currentMonth.month + delta);
    fetchEmotionLogs();
  }

  @action
  Future<void> fetchEmotionLogs() async {
    try {
      isLoading = true;
      
      final currentUser = _auth.currentUser;
      if (currentUser == null) {
        isLoading = false;
        return;
      }

      // 현재 월의 시작일과 마지막일 계산
      final firstDay = DateTime(currentMonth.year, currentMonth.month, 1);
      final lastDay = DateTime(currentMonth.year, currentMonth.month + 1, 0);
      
      // UseCase를 사용하여 감정 로그 가져오기
      final logs = await _getEmotionLogsUseCase(
        userId: currentUser.uid,
        startDate: firstDay,
        endDate: lastDay,
      );
      
      // 결과를 ObservableMap으로 변환
      final Map<String, EmotionLog> logsMap = {};
      for (var log in logs) {
        logsMap[log.date] = log;
      }
      
      // 결과 업데이트
      emotionLogs.clear();
      emotionLogs.addAll(logsMap);
    } catch (e) {
      debugPrint('fetchEmotionLogs 에러: $e');
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<bool> saveEmotionLog({
    required String date,
    required String emoji,
    required int temperature,
    List<String>? tags,
    String? note,
    List<String>? events,
    String? docId,
  }) async {
    try {
      isLoading = true;
      
      final currentUser = _auth.currentUser;
      if (currentUser == null) {
        isLoading = false;
        return false;
      }

      // 새 감정 로그 생성
      final emotionLog = EmotionLog(
        id: docId ?? '',
        date: date,
        emoji: emoji,
        temperature: temperature,
        tags: tags ?? [],
        note: note ?? '',
        events: events,
        createdAt: Timestamp.now(),
        userId: currentUser.uid,
      );
      
      // UseCase를 사용하여 감정 로그 저장
      final success = await _saveEmotionLogUseCase(emotionLog);
      
      if (success) {
        // 성공하면 목록 다시 가져오기
        await fetchEmotionLogs();
      }
      
      return success;
    } catch (e) {
      debugPrint('saveEmotionLog 에러: $e');
      return false;
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> init() async {
    try {
      isLoading = true;
      await fetchEmotionLogs();
    } catch (e) {
    } finally {
      isLoading = false;
    }
  }

  String formatDate(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }

  bool isSameDate(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  void dispose() {
    // 필요한 경우 리소스 정리 로직
  }

  @action
  Future<void> refres() async {
    await init();
  }
} 